/**
 * Configuración optimizada de URL de API
 */

// Declaración de la propiedad global para TypeScript
declare global {
  interface Window {
    API_URL?: string;
    appReadyEvent?: Event;
    __fetchInterceptorInstalled?: boolean;
  }
}

// URL de API para diferentes entornos
const DEFAULT_PROD_API_URL = 'https://eyraclub.es/api/v1';
const DEFAULT_IP_API_URL = 'http://54.227.159.169:9000/api/v1';
const DEFAULT_LOCAL_API_URL = 'http://localhost:9000/api/v1';

// Función optimizada para detectar y corregir URLs
const setupFetchInterceptor = () => {
  if (typeof window === 'undefined') return;
  
  // Solo sobreescribimos fetch una vez
  if (window.__fetchInterceptorInstalled) return;
  window.__fetchInterceptorInstalled = true;
  
  // Monitorear peticiones fetch para detectar y corregir URLs
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    // Solo procesamos strings, no Request objects
    if (typeof input === 'string') {
      // Corregir URL si usa localhost:9000
      if (input.includes('localhost:9000')) {
        console.warn('⚠️ Se detectó una petición a localhost:9000:', input);
        
        // Mantener localhost:9000 si estamos en entorno local
        if (window.location.hostname === 'localhost') {
          console.log('✅ Manteniendo URL local para desarrollo:', input);
        }
        // Si estamos accediendo desde la IP, reemplazar por la IP
        else if (window.location.hostname === '54.227.159.169') {
          input = input.replace('localhost:9000', '54.227.159.169:9000');
          console.log('✅ URL corregida a:', input);
        } 
        // En cualquier otro caso (producción), usar el dominio
        else {
          input = input.replace('http://localhost:9000', 'https://eyraclub.es');
          console.log('✅ URL corregida a:', input);
        }
      }
      // Corregir URL si usa 54.227.159.169:9000 en producción
      else if (input.includes('54.227.159.169:9000') && window.location.hostname !== 'localhost' && window.location.hostname !== '54.227.159.169') {
        input = input.replace('http://54.227.159.169:9000', 'https://eyraclub.es');
        console.log('✅ URL corregida de IP a dominio:', input);
      }
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
  
  // Si estamos en desarrollo local, usar la URL local
  if (window.location.hostname === 'localhost') {
    console.log('📡 API URL using localhost:', DEFAULT_LOCAL_API_URL);
    return DEFAULT_LOCAL_API_URL;
  }

  // 4. URL por defecto como último recurso (producción)
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

// Activar el interceptor de fetch
setupFetchInterceptor();

// Debug info
console.log('🔧 API URL configurada:', API_URL);
