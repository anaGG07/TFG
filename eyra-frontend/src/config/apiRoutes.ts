// Obtenemos la URL base sin /api para evitar duplicaciones
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://eyraclub.es/api';

export const API_ROUTES = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/register`,
    LOGIN: `${API_BASE_URL}/login`,
    LOGOUT: `${API_BASE_URL}/logout`,
  },

  USER: {
    PROFILE: `${API_BASE_URL}/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/profile`,
  },

  CYCLES: {
    ALL: `${API_BASE_URL}/cycles`,
    CURRENT: `${API_BASE_URL}/cycles/current`,
    CREATE: `${API_BASE_URL}/cycles`,
    UPDATE: (id: string) => `${API_BASE_URL}/cycles/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/cycles/${id}`,
  },

  SYMPTOMS: {
    ALL: `${API_BASE_URL}/symptoms`,
    CREATE: `${API_BASE_URL}/symptoms`,
    UPDATE: (id: string) => `${API_BASE_URL}/symptoms/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/symptoms/${id}`,
  },

  INSIGHTS: {
    SUMMARY: `${API_BASE_URL}/insights/summary`,
    PREDICTIONS: `${API_BASE_URL}/insights/predictions`,
    PATTERNS: `${API_BASE_URL}/insights/patterns`,
  },
};