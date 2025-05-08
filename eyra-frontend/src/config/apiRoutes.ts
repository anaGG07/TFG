import { API_URL } from './setupApiUrl';

// Log para verificar API URL
console.log('API_ROUTES utilizando URL base:', API_URL);

// Función auxiliar para crear URLs completas
const createApiUrl = (path: string): string => {
  // Asegurar formato correcto
  const basePath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${basePath}`;
};

// Rutas de API con prefijo /api donde sea necesario
export const API_ROUTES = {
  AUTH: {
    REGISTER: createApiUrl('api/register'),
    LOGIN: createApiUrl('api/login_check'),
    LOGOUT: createApiUrl('api/logout'),
    PROFILE: createApiUrl('api/profile'), // Para obtener y actualizar perfil
  },

  USER: {
    PROFILE: createApiUrl('api/profile'),
    UPDATE_PROFILE: createApiUrl('api/profile'),
  },

  CYCLES: {
    ALL: createApiUrl('api/cycles'),
    CURRENT: createApiUrl('api/cycles/current'),
    CREATE: createApiUrl('api/cycles'),
    UPDATE: (id: string) => createApiUrl(`api/cycles/${id}`),
    DELETE: (id: string) => createApiUrl(`api/cycles/${id}`),
  },

  SYMPTOMS: {
    ALL: createApiUrl('api/symptoms'),
    CREATE: createApiUrl('api/symptoms'),
    UPDATE: (id: string) => createApiUrl(`api/symptoms/${id}`),
    DELETE: (id: string) => createApiUrl(`api/symptoms/${id}`),
  },

  INSIGHTS: {
    SUMMARY: createApiUrl('api/insights/summary'),
    PREDICTIONS: createApiUrl('api/insights/predictions'),
    PATTERNS: createApiUrl('api/insights/patterns'),
  },
};