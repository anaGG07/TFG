import { API_URL } from '../config/setupApiUrl';

/**
 * Comprueba si la API está disponible
 * @returns Un objeto con el estado de la API y un mensaje opcional
 */
export const checkApiHealth = async (): Promise<{ available: boolean; message?: string }> => {
  try {
    // Intentamos hacer una petición OPTIONS a la API para verificar disponibilidad
    const response = await fetch(`${API_URL}/status`, {
      method: 'OPTIONS',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    // Si la respuesta es 2xx o 4xx (no 5xx), consideramos que la API está disponible
    if (response.status < 500) {
      console.log('✅ API disponible:', `${API_URL}`);
      return { available: true };
    } else {
      console.error('❌ API no disponible (error 5xx):', response.status);
      return { 
        available: false, 
        message: `Error del servidor: ${response.status} ${response.statusText}` 
      };
    }
  } catch (error) {
    console.error('❌ No se pudo conectar con la API:', error);
    
    // Intentar proporcionar mensajes útiles según el tipo de error
    let message = 'No se pudo conectar con el servidor';
    if (error instanceof TypeError && error.message.includes('fetch')) {
      message = `No se pudo conectar con ${API_URL}. Verifique su conexión a internet y que el servidor esté disponible.`;
    }
    
    return { available: false, message };
  }
};

/**
 * Comprueba si una ruta específica de la API está disponible
 * @param path Ruta a comprobar (sin la URL base de la API)
 * @returns Un objeto con el estado de la ruta y un mensaje opcional
 */
export const checkApiRoute = async (path: string): Promise<{ available: boolean; message?: string }> => {
  try {
    const url = path.startsWith('/') ? `${API_URL}${path}` : `${API_URL}/${path}`;
    
    // Intentamos hacer una petición OPTIONS a la ruta específica
    const response = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    // Si obtenemos un 200-299 o un 400-499, la ruta existe
    if (response.status < 500) {
      console.log(`✅ Ruta API disponible: ${url}`);
      return { available: true };
    } else {
      console.error(`❌ Ruta API no disponible (error 5xx): ${url}`, response.status);
      return { 
        available: false, 
        message: `Error del servidor: ${response.status} ${response.statusText}` 
      };
    }
  } catch (error) {
    console.error(`❌ No se pudo conectar con la ruta API: ${path}`, error);
    return { 
      available: false, 
      message: `No se pudo conectar con la ruta ${path}. Verifique que el servidor esté disponible.` 
    };
  }
};

// Exportamos una función que comprueba la disponibilidad de todas las rutas comunes
export const checkApiRoutes = async (): Promise<Record<string, boolean>> => {
  const routesToCheck = [
    '/register',
    '/login',
    '/profile',
    '/logout'
  ];
  
  const results: Record<string, boolean> = {};
  
  for (const route of routesToCheck) {
    const result = await checkApiRoute(route);
    results[route] = result.available;
  }
  
  return results;
};
