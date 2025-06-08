import { API_URL } from "../config/apiRoutes";

export interface FetchOptions extends RequestInit {
  body?: any;
  defaultValue?: any;
  params?: Record<string, string | number | boolean>;
}

interface ApiFetchOptions {
  path: string;
  defaultValue: any;
}

/**
 * Eventos de autenticación simplificados
 */
export const authEvents = {
  onUnauthorized: () => {
    // Comprobar si ya está en login para evitar bucles
    if (window.location.pathname === '/login') {
      return;
    }
    
    // Redirigir al login en lugar de la raíz
    window.location.href = "/login";
  }
};

/**
 * Función para realizar peticiones a la API con manejo de errores básico
 */
export async function apiFetch<T>(path: string, options: FetchOptions = {}, silent = false): Promise<T> {
  const { params, ...fetchOptions } = options;
  let url = path.startsWith("http") ? path : `${API_URL}${path}`;
  
  // Añadir parámetros de consulta si existen
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  const fetchOptionsInit: RequestInit = {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...fetchOptions.headers,
    },
    credentials: "include",
  };

  if (options.body) {
    fetchOptionsInit.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, fetchOptionsInit);

    if (!response.ok) {
      if (response.status === 401) {
        // Si la ruta es /api/profile, no redirigir al login inmediatamente
        if (!path.includes('/api/profile')) {
          authEvents.onUnauthorized();
        }
      }
      throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (!silent) console.error("Error en petición API:", error);
    throw error;
  }
}

/**
 * Realiza múltiples peticiones en paralelo
 */
export async function apiFetchParallel<T>(requests: ApiFetchOptions[]): Promise<T[]> {
  try {
    const promises = requests.map(({ path, defaultValue }) =>
      apiFetch<T>(path).catch(() => defaultValue as T)
    );
    return await Promise.all(promises);
  } catch (error) {
    throw error;
  }
}

export const createApiUrl = (path: string) => {
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
  return `${baseUrl}${path}`;
};
