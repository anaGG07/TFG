// No necesitamos una URL base, solo definimos rutas relativas
console.log('Configurando rutas de API relativas');

// Función auxiliar para normalizar las rutas
const normalizePath = (path: string): string => {
  // Si la ruta ya empieza con /, la dejamos tal cual; si no, le añadimos /
  return path.startsWith('/') ? path : `/${path}`;
};

export const API_ROUTES = {
  AUTH: {
    REGISTER: normalizePath('register'),
    LOGIN: normalizePath('login'),
    LOGOUT: normalizePath('logout'),
  },

  USER: {
    PROFILE: normalizePath('profile'),
    UPDATE_PROFILE: normalizePath('profile'),
  },

  CYCLES: {
    ALL: normalizePath('cycles'),
    CURRENT: normalizePath('cycles/current'),
    CREATE: normalizePath('cycles'),
    UPDATE: (id: string) => normalizePath(`cycles/${id}`),
    DELETE: (id: string) => normalizePath(`cycles/${id}`),
  },

  SYMPTOMS: {
    ALL: normalizePath('symptoms'),
    CREATE: normalizePath('symptoms'),
    UPDATE: (id: string) => normalizePath(`symptoms/${id}`),
    DELETE: (id: string) => normalizePath(`symptoms/${id}`),
  },

  INSIGHTS: {
    SUMMARY: normalizePath('insights/summary'),
    PREDICTIONS: normalizePath('insights/predictions'),
    PATTERNS: normalizePath('insights/patterns'),
  },
};