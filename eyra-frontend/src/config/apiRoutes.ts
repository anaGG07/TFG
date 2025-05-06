import { API_URL } from './setupApiUrl';

// Log para debugging
console.log('API_ROUTES utilizando URL base:', API_URL);
// Log para verificar ruta de registro
const registerRoute = `${API_URL}/register`;
console.log('Ruta de registro configurada como:', registerRoute);

// Función auxiliar para crear URLs completas
const createApiUrl = (path: string): string => {
  const basePath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${basePath}`;
};

export const API_ROUTES = {
  AUTH: {
    REGISTER: createApiUrl('register'),
    LOGIN: createApiUrl('login'),
    LOGOUT: createApiUrl('logout'),
  },

  USER: {
    PROFILE: createApiUrl('profile'),
    UPDATE_PROFILE: createApiUrl('profile'),
  },

  CYCLES: {
    ALL: createApiUrl('cycles'),
    CURRENT: createApiUrl('cycles/current'),
    CREATE: createApiUrl('cycles'),
    UPDATE: (id: string) => createApiUrl(`cycles/${id}`),
    DELETE: (id: string) => createApiUrl(`cycles/${id}`),
  },

  SYMPTOMS: {
    ALL: createApiUrl('symptoms'),
    CREATE: createApiUrl('symptoms'),
    UPDATE: (id: string) => createApiUrl(`symptoms/${id}`),
    DELETE: (id: string) => createApiUrl(`symptoms/${id}`),
  },

  INSIGHTS: {
    SUMMARY: createApiUrl('insights/summary'),
    PREDICTIONS: createApiUrl('insights/predictions'),
    PATTERNS: createApiUrl('insights/patterns'),
  },
};