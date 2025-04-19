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

      // Clonar la respuesta para poder leerla múltiples veces si es necesario
      const responseClone = response.clone();
      
      // Extraer mensaje de error
      let errorMessage;
      try {
        const errorData = await responseClone.json();
        errorMessage = errorData.message || errorData.error || `Error ${response.status}`;
      } catch {
        try {
          errorMessage = await response.text() || `Error ${response.status}`;
        } catch {
          errorMessage = `Error ${response.status} ${response.statusText}`;
        }
      }

      console.error(`API Error (${response.status}):`, errorMessage);
      throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
  } catch (networkError) {
  console.error('🌐 Error de red:', networkError);

  let errorMessage = 'Error de conexión desconocido.';
  if (networkError instanceof Error) {
    errorMessage = `Error de conexión: ${networkError.message}. Verifica tu conexión o que el backend esté activo.`;
  }

  throw new Error(errorMessage);
}

}
