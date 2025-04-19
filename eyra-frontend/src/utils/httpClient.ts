import { authService } from '../services/authService';

// En caso de que no uses react-router directamente aquí
const redirectToLogin = () => {
  window.location.href = '/login';
};

interface RequestOptions extends RequestInit {
  body?: any;
  headers?: HeadersInit;
}

// Base de la API, configurable desde .env
const BASE_API_URL = import.meta.env.VITE_API_URL || 'https://eyraclub.es/api';
console.log('httpClient usando BASE_API_URL:', BASE_API_URL);

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  // Determinar si el path es una URL completa o una ruta relativa
  const isFullUrl = path.startsWith('http://') || path.startsWith('https://');
  
  // Si ya es una URL completa, usarla directamente; si no, combinarla con BASE_API_URL
  const url = isFullUrl ? path : `${BASE_API_URL}${path.startsWith('/') ? '' : '/'}${path}`;

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

      // Extraer mensaje de error
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || `Error ${response.status}`;
      } catch {
        errorMessage = await response.text() || `Error ${response.status}`;
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
