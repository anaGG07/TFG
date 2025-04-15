import { authService } from '../services/authService';

// En caso de que no uses react-router directamente aquí
const redirectToLogin = () => {
  window.location.href = '/login';
};


interface RequestOptions extends RequestInit {
  body?: any;
  headers?: HeadersInit;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  console.log(`Making API request to: ${path}`);
  
  // Log de la configuración (sin exponer datos sensibles)
  const debugOptions = { 
    method: options.method, 
    headers: options.headers,
    credentials: 'include',
    bodyIncluded: options.body ? true : false
  };
  console.log('Request options:', debugOptions);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const fetchOptions: RequestInit = {
    method: options.method || 'GET',
    headers,
    credentials: 'include', // Siempre incluir cookies httpOnly
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  try {
    console.log(`Fetching from: ${path}`);
    const response = await fetch(`${path}`, fetchOptions);
    console.log(`Response received from ${path}:`, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries([...response.headers]),
      type: response.type,
      url: response.url,
    });


  if (!response.ok) {
    // 🔒 Manejo global de errores 401
    if (response.status === 401) {
      console.warn('Sesión no autorizada. Cerrando sesión y redirigiendo al login...');
      try {
        await authService.logout();
      } catch (logoutError) {
        console.error('Error al cerrar sesión automáticamente:', logoutError);
      } finally {
        redirectToLogin();
        return Promise.reject(new Error('Sesión expirada o inválida.'));
      }
    }

    // Intentar obtener un mensaje de error estructurado
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || `Error ${response.status}`;
    } catch {
      // Si no se puede parsear como JSON, usar el texto
      errorMessage = await response.text() || `Error ${response.status}`;
    }

    console.error(`API Error (${response.status}):`, errorMessage);
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
  } catch (networkError) {
    console.error('Network error:', networkError);
    throw new Error(`Error de conexión: ${networkError.message}. Por favor, verifica tu conexión a Internet y que el servidor esté disponible.`);
  }
}
