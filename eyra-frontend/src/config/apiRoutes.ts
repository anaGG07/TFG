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
    REGISTER: createApiUrl('/register'),
    LOGIN: createApiUrl('/login_check'),
    LOGOUT: createApiUrl('/logout'),
    PROFILE: createApiUrl('/profile'), // Endpoint para gestionar perfil
    ONBOARDING: createApiUrl('/onboarding'), // Endpoint específico para onboarding
    REFRESH_TOKEN: createApiUrl('/refresh-token') // Endpoint para renovar token JWT
  },

  USER: {
    PROFILE: createApiUrl('/profile'),
    UPDATE_PROFILE: createApiUrl('/profile'),
  },

  CYCLES: {
    ALL: createApiUrl('/cycles'),
    CURRENT: createApiUrl('/cycles/current'),
    CREATE: createApiUrl('/cycles'),
    UPDATE: (id: string) => createApiUrl(`/cycles/${id}`),
    DELETE: (id: string) => createApiUrl(`/cycles/${id}`),
  },

  SYMPTOMS: {
    ALL: createApiUrl('/symptoms'),
    CREATE: createApiUrl('/symptoms'),
    UPDATE: (id: string) => createApiUrl(`/symptoms/${id}`),
    DELETE: (id: string) => createApiUrl(`/symptoms/${id}`),
  },

  INSIGHTS: {
    SUMMARY: createApiUrl('/insights/summary'),
    PREDICTIONS: createApiUrl('/insights/predictions'),
    PATTERNS: createApiUrl('/insights/patterns'),
  },
};