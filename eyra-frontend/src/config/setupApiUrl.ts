/**
 * Este archivo se encarga de configurar la URL de la API de forma centralizada
 * para evitar problemas de URL hardcodeadas o configuraciones inconsistentes.
 */

// URL de API por defecto para producción
const DEFAULT_PROD_API_URL = 'https://eyraclub.es/api';

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

  // 3. URL por defecto como último recurso
  console.log('📡 API URL using default:', DEFAULT_PROD_API_URL);
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

// Debug info
console.log('🔧 API URL configurada:', API_URL);
