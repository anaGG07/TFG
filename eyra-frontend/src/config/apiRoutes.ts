// Obtenemos la URL base para evitar duplicaciones
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://eyraclub.es/api';

// Función auxiliar para normalizar la concatenación de rutas
const joinPaths = (base: string, path: string): string => {
  // Asegurarnos que base no termina con / y path no empieza con /
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${normalizedBase}/${normalizedPath}`;
};

export const API_ROUTES = {
  AUTH: {
    REGISTER: joinPaths(API_BASE_URL, 'register'),
    LOGIN: joinPaths(API_BASE_URL, 'login'),
    LOGOUT: joinPaths(API_BASE_URL, 'logout'),
  },

  USER: {
    PROFILE: joinPaths(API_BASE_URL, 'profile'),
    UPDATE_PROFILE: joinPaths(API_BASE_URL, 'profile'),
  },

  CYCLES: {
    ALL: joinPaths(API_BASE_URL, 'cycles'),
    CURRENT: joinPaths(API_BASE_URL, 'cycles/current'),
    CREATE: joinPaths(API_BASE_URL, 'cycles'),
    UPDATE: (id: string) => joinPaths(API_BASE_URL, `cycles/${id}`),
    DELETE: (id: string) => joinPaths(API_BASE_URL, `cycles/${id}`),
  },

  SYMPTOMS: {
    ALL: joinPaths(API_BASE_URL, 'symptoms'),
    CREATE: joinPaths(API_BASE_URL, 'symptoms'),
    UPDATE: (id: string) => joinPaths(API_BASE_URL, `symptoms/${id}`),
    DELETE: (id: string) => joinPaths(API_BASE_URL, `symptoms/${id}`),
  },

  INSIGHTS: {
    SUMMARY: joinPaths(API_BASE_URL, 'insights/summary'),
    PREDICTIONS: joinPaths(API_BASE_URL, 'insights/predictions'),
    PATTERNS: joinPaths(API_BASE_URL, 'insights/patterns'),
  },
};