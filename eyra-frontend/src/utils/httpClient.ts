import { authService } from '../services/authService';
import { API_URL } from '../config/setupApiUrl';

// En caso de que no uses react-router directamente aquí
const redirectToLogin = () => {
  window.location.href = '/login';
};

interface RequestOptions extends RequestInit {
  body?: any;
  headers?: HeadersInit;
}

// No necesitamos una URL base local aquí pues las rutas de API_ROUTES ya vienen con la URL completa
console.log('httpClient inicializado, API_URL base:', API_URL);

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  // La ruta puede ser una URL completa (si viene de API_ROUTES)
  // o una ruta relativa (si se llama directamente)
  const url = path.startsWith('http') ? path : `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;

  console.log(`📡 Fetching: ${url}`);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const fetchOptions: RequestInit = {
    method: options.method || 'GET',
    headers,
    credentials: 'include', // útil si se usan cookies httpOnly
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  // CASO ESPECIAL PARA LOGIN: Manejo robusto
  const isLoginRequest = url.includes('/login') && options.method === 'POST';
  if (isLoginRequest) {
    console.log('⚠️ Detectada petición de login - Usando manejo especial');
    const response = await fetch(url, fetchOptions);
    let responseData: any = {};
    try {
      responseData = await response.json();
    } catch {
      try {
        const text = await response.text();
        responseData = { message: text };
      } catch {
        responseData = {};
      }
    }
    if (response.ok || response.status === 500) {
      authService.setSession(true);
      return responseData as T;
    }
    // Para errores como 401, lanzamos un error explícito
    throw new Error(responseData.message || 'Login inválido');
  }
  
  // FLUJO NORMAL PARA OTRAS PETICIONES
  try {
    const response = await fetch(url, fetchOptions);

    console.log(`Respuesta de ${url}:`, {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    });

    // Manejo de errores del backend
    if (!response.ok) {
      // 401: sesión expirada o inválida
      if (response.status === 401) {
        console.warn('🔒 Sesión no autorizada. Cerrando y redirigiendo...');
        try {
          await authService.logout();
        } catch (logoutError) {
          console.error('Error cerrando sesión automáticamente:', logoutError);
        } finally {
          redirectToLogin();
          return Promise.reject(new Error('Sesión expirada o inválida.'));
        }
      }

      // Manejo simplificado de errores - No intentamos leer el cuerpo
      console.error(`API Error (${response.status}): ${response.statusText}`);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Intentamos parsear el JSON con manejo de errores
    try {
      return await response.json() as T;
    } catch (jsonError) {
      console.warn('Error al parsear respuesta JSON:', jsonError);
      // Devolver un objeto vacío si no se puede parsear JSON
      return {} as T;
    }
  } catch (networkError) {
    console.error('🌐 Error de red:', networkError);

    let errorMessage = 'Error de conexión desconocido.';
    if (networkError instanceof Error) {
      errorMessage = `Error de conexión: ${networkError.message}`;
    }

    throw new Error(errorMessage);
  }
}
