/**
 * Configuración optimizada de URL de API con soporte mejorado para entornos de producción y desarrollo
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
const PROD_API_URL = 'https://eyraclub.es';
const IP_API_URL = 'http://54.227.159.169:9000';
const LOCAL_API_URL = 'http://localhost:9000';

// Función optimizada para detectar y corregir URLs durante la ejecución
const setupFetchInterceptor = () => {
  if (typeof window === 'undefined') return;
  
  // Solo sobreescribimos fetch una vez
  if (window.__fetchInterceptorInstalled) return;
  window.__fetchInterceptorInstalled = true;
  
  console.log('Interceptor de fetch instalado para redireccionar URLs automáticamente');
  
  // Monitorear peticiones fetch para detectar y corregir URLs
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    // Solo procesamos strings, no Request objects
    if (typeof input === 'string') {
      // Registrar todas las peticiones fetch para depuración
      console.log(`Fetch a: ${input}`);
      
      // Corregir URL si necesario según el entorno
      if (window.location.hostname === 'localhost') {
        // En desarrollo local: mantener URL local
      }
      else if (window.location.hostname === '54.227.159.169') {
        // Acceso a través de IP: reemplazar 'localhost' por la IP
        if (input.includes('localhost')) {
          input = input.replace('localhost:9000', '54.227.159.169:9000');
          console.log('URL corregida para entorno IP:', input);
        }
      } 
      else {
        // En producción: reemplazar localhost o IP por dominio
        if (input.includes('localhost:9000')) {
          input = input.replace('http://localhost:9000', 'https://eyraclub.es');
          console.log('URL corregida para producción:', input);
        }
        else if (input.includes('54.227.159.169:9000')) {
          input = input.replace('http://54.227.159.169:9000', 'https://eyraclub.es');
          console.log('URL corregida para producción:', input);
        }
      }
    }
    return originalFetch(input, init);
  };
};

// Determinar la URL de la API basándose en el entorno
export const getApiUrl = (): string => {
  // Detectar errores en entorno server-side
  if (typeof window === 'undefined') {
    return PROD_API_URL;
  }
  
  // 1. Variable global definida en index.html (máxima prioridad)
  if (window.API_URL) {
    console.log('API URL desde window.API_URL:', window.API_URL);
    return window.API_URL;
  }

  // 2. Variable de entorno de Vite
  if (import.meta.env.VITE_API_URL) {
    console.log('API URL desde variables de entorno:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL as string;
  }
  
  // 3. Determinar basado en la URL actual
  if (window.location.hostname === 'localhost') {
    console.log('Entorno de desarrollo local detectado. API URL:', LOCAL_API_URL);
    return LOCAL_API_URL;
  }
  
  if (window.location.hostname === '54.227.159.169') {
    console.log('Entorno de IP detectado. API URL:', IP_API_URL);
    return IP_API_URL;
  }

  // 4. URL para producción (dominio real)
  console.log('Entorno de producción detectado. API URL:', PROD_API_URL);
  return PROD_API_URL;
};

// Exportamos la URL de la API
export const API_URL = getApiUrl();

// Esta función puede usarse para forzar una actualización de la URL de la API
export const forceApiUrl = (url: string): void => {
  if (typeof window !== 'undefined') {
    window.API_URL = url;
    console.log('API URL forzada a:', url);
  }
};

// Activar el interceptor de fetch
setupFetchInterceptor();

// Imprimir información de depuración
console.log('API URL configurada:', API_URL);
console.log('Entorno:', process.env.NODE_ENV);
console.log('Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'no disponible');
