import { API_URL } from "../config/apiRoutes";

interface FetchOptions extends RequestInit {
  body?: any;
  defaultValue?: any;
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
    console.log('httpClient: Evento onUnauthorized, redireccionando a login');
    
    // Comprobar si ya está en login para evitar bucles
    if (window.location.pathname === '/login') {
      console.log('httpClient: Ya estamos en login, evitando bucle');
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
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  
  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...options.headers,
    },
    credentials: "include",
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  try {
    console.log(`httpClient: Iniciando petición a ${url}`, {
      method: fetchOptions.method || 'GET',
      headers: fetchOptions.headers,
      credentials: fetchOptions.credentials
    });

    const response = await fetch(url, fetchOptions);

    console.log(`httpClient: Respuesta de ${url}`, {
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      if (response.status === 401) {
        if (!silent) {
          console.error(`Error 401 en petición a ${url}`, {
            headers: Object.fromEntries(response.headers.entries()),
            cookies: document.cookie
          });
        }
        
        // Intentar obtener más información del error
        try {
          const errorData = await response.json();
          console.error('Detalles del error 401:', errorData);
        } catch (e) {
          console.error('No se pudo obtener detalles del error 401');
        }
        
        // Si la ruta es /api/profile, no redirigir al login inmediatamente
        if (!path.includes('/api/profile')) {
          console.log('httpClient: Redirigiendo a login por 401 en ruta:', path);
          authEvents.onUnauthorized();
        } else {
          console.log('httpClient: Ignorando 401 en verificación de perfil');
        }
      }
      throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en petición API:", error);
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
    console.error("Error en peticiones paralelas:", error);
    throw error;
  }
}
