import { API_URL } from '../config/setupApiUrl';

// Módulo de eventos para evitar dependencia circular
export const authEvents = {
  onUnauthorized: () => {
    // Será configurado por el módulo de autenticación
    console.warn('Handler onUnauthorized no configurado');
    window.location.href = '/login';
  },
  onLogout: async () => {
    // Será configurado por el módulo de autenticación
    console.warn('Handler onLogout no configurado');
    return Promise.resolve();
  }
};

// Función para configurar los handlers de eventos
export const configureAuthHandlers = (handlers: {
  onUnauthorized: () => void;
  onLogout: () => Promise<void>;
}) => {
  authEvents.onUnauthorized = handlers.onUnauthorized;
  authEvents.onLogout = handlers.onLogout;
};

interface RequestOptions extends RequestInit {
  body?: any;
  headers?: HeadersInit;
  skipErrorHandling?: boolean;
}

// Log inicial
console.log('httpClient inicializado, API_URL base:', API_URL);

/**
 * Función mejorada para realizar peticiones a la API
 * con mejor manejo de respuestas y errores
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  // Validación de entrada
  if (!path) {
    console.error('Se ha intentado realizar una petición sin especificar la ruta');
    throw new Error('Ruta de API no especificada');
  }

  // Normalización de la URL
  const url = path.startsWith('http') ? path : `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;

  // Configuración de cabeceras por defecto
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  // Opciones de fetch
  const fetchOptions: RequestInit = {
    method: options.method || 'GET',
    headers,
    credentials: 'include', // Para cookies httpOnly
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  // Detectar si es una petición de login para manejo especial
  const isLoginRequest = url.includes('/login') && options.method === 'POST';
  
  try {
    console.log(`📡 Fetching: ${url}`);
    // Realizar la petición con timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos máximo
    
    fetchOptions.signal = controller.signal;
    
    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);
    
    console.log(`Respuesta de ${url}:`, {
      status: response.status,
      statusText: response.statusText,
    });

    // Manejo especial para peticiones de login
    if (isLoginRequest) {
      console.log('⚠️ Detectada petición de login - Usando manejo especial');
      
      // Clonar la respuesta para poder leerla múltiples veces
      const responseClone = response.clone();
      
      try {
        // Intentar leer como JSON
        const data = await response.json();
        
        // Si la respuesta es exitosa o hay un error 500 específico que necesitamos manejar
        if (response.ok) {
          return data as T;
        }
        
        // Si hay error, lanzarlo con información detallada
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      } catch (jsonError) {
        console.warn('Error al parsear respuesta JSON del login:', jsonError);
        
        try {
          // Intentar leer como texto
          const text = await responseClone.text();
          
          // Si la respuesta es exitosa a pesar del error de parsing
          if (response.ok) {
            return { message: 'Login exitoso' } as T;
          }
          
          throw new Error(text || `Error ${response.status}: ${response.statusText}`);
        } catch (textError) {
          console.error('Error al leer respuesta como texto:', textError);
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }
    }
    
    // Manejo de respuestas para peticiones normales (no login)
    if (!response.ok) {
      // 401: sesión expirada o inválida
      if (response.status === 401 && !options.skipErrorHandling) {
        console.warn('🔒 Sesión no autorizada. Cerrando y redirigiendo...');
        await authEvents.onLogout();
        authEvents.onUnauthorized();
        throw new Error('Sesión expirada o inválida.');
      }

      // Clonar respuesta para intentar leer el mensaje de error
      const responseClone = response.clone();
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      
      try {
        // Intentar leer el mensaje de error como JSON
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (jsonError) {
        try {
          // Si falla como JSON, intentar como texto
          const errorText = await responseClone.text();
          if (errorText) {
            errorMessage = errorText;
          }
        } catch (textError) {
          // Ignorar error de lectura como texto
        }
      }
      
      console.error(`API Error (${response.status}):`, errorMessage);
      throw new Error(errorMessage);
    }

    // Para respuestas exitosas, intentar parsear el JSON
    try {
      return await response.json() as T;
    } catch (jsonError) {
      console.warn('Error al parsear respuesta JSON:', jsonError);
      
      // Clonar la respuesta para leer como texto
      const responseClone = response.clone();
      
      try {
        // Intentar leer como texto
        const text = await responseClone.text();
        if (text) {
          return text as unknown as T;
        }
      } catch (textError) {
        // Ignorar error de lectura como texto
      }
      
      // Si no se puede parsear, devolver objeto vacío
      return {} as T;
    }
  } catch (networkError) {
    if (networkError.name === 'AbortError') {
      console.error('🕒 Timeout: La petición ha excedido el tiempo máximo de espera');
      throw new Error('La petición ha excedido el tiempo máximo de espera');
    }
    
    console.error('🌐 Error de red:', networkError);

    let errorMessage = 'Error de conexión desconocido.';
    if (networkError instanceof Error) {
      errorMessage = `Error de conexión: ${networkError.message}`;
    }

    throw new Error(errorMessage);
  }
}

/**
 * Realiza múltiples peticiones en paralelo, con manejo de error mejorado
 * para evitar que un fallo en una petición afecte a las demás
 */
export async function apiFetchParallel<T>(
  requests: Array<{
    path: string;
    options?: RequestOptions;
    defaultValue: T;
  }>
): Promise<T[]> {
  const results = await Promise.allSettled(
    requests.map(req => 
      apiFetch<T>(req.path, {...req.options, skipErrorHandling: true})
        .catch(() => req.defaultValue)
    )
  );
  
  return results.map(result => 
    result.status === 'fulfilled' ? result.value : null
  ) as T[];
}
