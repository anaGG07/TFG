/**
 * Configuración optimizada de URL de API
 * Elimina operaciones costosas y mejora el rendimiento
 */

// URL de API por defecto para producción
const DEFAULT_PROD_API_URL = 'https://eyraclub.es/api';
const DEFAULT_IP_API_URL = 'http://54.227.159.169/api';

// Función optimizada para detectar y corregir URLs de localhost
const setupFetchInterceptor = () => {
  if (typeof window === 'undefined') return;
  
  // Solo sobreescribimos fetch una vez
  if ((window as any).__fetchInterceptorInstalled) return;
  (window as any).__fetchInterceptorInstalled = true;
  
  // Monitorear peticiones fetch para detectar y corregir localhost:8000
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    // Solo procesamos strings, no Request objects
    if (typeof input === 'string' && input.includes('localhost:8000')) {
      console.warn('⚠️ Se detectó una petición a localhost:8000:', input);
      
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
};

// Determinar la URL de la API basándose en múltiples fuentes en orden de prioridad
export const getApiUrl = (): string => {
  // Detectar errores en entorno server-side
  if (typeof window === 'undefined') {
    return DEFAULT_PROD_API_URL;
  }
  
  // 1. Variable global definida en index.html (máxima prioridad)
  if (window.API_URL) {
    console.log('📡 API URL from window.API_URL:', window.API_URL);
    return window.API_URL;
  }

  // 2. Variable de entorno de Vite
  if (import.meta.env.VITE_API_URL) {
    console.log('📡 API URL from import.meta.env.VITE_API_URL:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL as string;
  }
  
  // 3. Determinar basado en la URL actual
  // Si estamos accediendo a través de la IP, usar la URL de la API con IP
  if (window.location.hostname === '54.227.159.169') {
    console.log('📡 API URL using IP address:', DEFAULT_IP_API_URL);
    return DEFAULT_IP_API_URL;
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

// Activar el interceptor de fetch para localhost:8000
setupFetchInterceptor();

// Debug info
console.log('🔧 API URL configurada:', API_URL);
