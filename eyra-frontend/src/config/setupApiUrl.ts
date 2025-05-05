/**
 * Este archivo se encarga de configurar la URL de la API de forma centralizada
 * para evitar problemas de URL hardcodeadas o configuraciones inconsistentes.
 */

// URL de API por defecto para producción
const DEFAULT_PROD_API_URL = 'https://eyraclub.es/api';
const DEFAULT_IP_API_URL = 'http://54.227.159.169/api';

// Detector de URLs con localhost:8000 que mostrará advertencias en consola
const detectAndFixLocalhostUrls = () => {
  if (typeof window === 'undefined') return;
  
  // Monitorear peticiones fetch para detectar y corregir localhost:8000
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    if (typeof input === 'string' && input.includes('localhost:8000')) {
      console.warn('⚠️ Se detectó una petición a localhost:8000:', input);
      console.trace('Origen de la petición:');
      
      // Si estamos accediendo desde la IP, reemplazar por la IP en lugar del dominio
      if (window.location.hostname === '54.227.159.169') {
        input = input.replace('localhost:8000', '54.227.159.169');
      } else {
        input = input.replace('localhost:8000', 'eyraclub.es');
      }
      
      console.log('✅ URL corregida a:', input);
    }
    return originalFetch(input, init);
  };

  // Buscar y reemplazar recursivamente en el objeto global window
  const checkObject = (obj, path = 'window') => {
    if (!obj || typeof obj !== 'object') return;
    Object.keys(obj).forEach(key => {
      try {
        const value = obj[key];
        if (typeof value === 'string' && value.includes('localhost:8000')) {
          console.warn(`⚠️ Se detectó URL con localhost:8000 en ${path}.${key}:`, value);
          
          // Si estamos accediendo desde la IP, reemplazar por la IP en lugar del dominio
          if (window.location.hostname === '54.227.159.169') {
            obj[key] = value.replace('localhost:8000', '54.227.159.169');
          } else {
            obj[key] = value.replace('localhost:8000', 'eyraclub.es');
          }
          
          console.log(`✅ Valor corregido en ${path}.${key}:`, obj[key]);
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
          checkObject(value, `${path}.${key}`);
        }
      } catch (e) {
        // Ignorar errores de acceso a propiedades
      }
    });
  };

  // Ejecutar verificación
  setTimeout(() => {
    try {
      checkObject(window);
    } catch (e) {
      console.error('Error al verificar referencias a localhost:', e);
    }
  }, 1000);
};

// Determinar la URL de la API basándose en múltiples fuentes en orden de prioridad
export const getApiUrl = (): string => {
  // 1. Variable global definida en index.html (máxima prioridad)
  if (typeof window !== 'undefined' && window.API_URL) {
    console.log('📡 API URL from window.API_URL:', window.API_URL);
    return window.API_URL;
  }

  // 2. Variable de entorno de Vite
  if (import.meta.env.VITE_API_URL) {
    console.log('📡 API URL from import.meta.env.VITE_API_URL:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  
  // 3. Determinar basado en la URL actual
  if (typeof window !== 'undefined') {
    // Si estamos accediendo a través de la IP, usar la URL de la API con IP
    if (window.location.hostname === '54.227.159.169') {
      console.log('📡 API URL using IP address:', DEFAULT_IP_API_URL);
      return DEFAULT_IP_API_URL;
    }
  }

  // 4. URL por defecto como último recurso
  console.log('📡 API URL using default domain:', DEFAULT_PROD_API_URL);
  return DEFAULT_PROD_API_URL;
};

// Exportamos la URL de la API
export const API_URL = getApiUrl();

// Esta función puede usarse para forzar una actualización de la URL de la API
export const forceApiUrl = (url: string): void => {
  if (typeof window !== 'undefined') {
    window.API_URL = url;
    console.log('📡 API URL forced to:', url);
  }
};

// Activar detector de localhost:8000
if (typeof window !== 'undefined') {
  detectAndFixLocalhostUrls();
}

// Debug info
console.log('🔧 API URL configurada:', API_URL);
