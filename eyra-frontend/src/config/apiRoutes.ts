// API_URL es definido directamente desde la variable de entorno VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL || 'https://eyraclub.es';

// Log para verificar API URL
console.log('API_ROUTES utilizando URL base:', API_URL);

// Función auxiliar para crear URLs completas
const createApiUrl = (path: string): string => {
  // Las rutas en el backend ya tienen el prefijo /api definido en el controlador
  // Añadimos /api solo una vez
  if (!path.startsWith('/api')) {
    path = `/api${path.startsWith('/') ? path : `/${path}`}`;
  }
  return `${API_URL}${path}`;
};

// Rutas de API con prefijo /api donde sea necesario
export const API_ROUTES = {
  AUTH: {
    REGISTER: createApiUrl('/register'),
    LOGIN: createApiUrl('/login_check'),
    LOGOUT: createApiUrl('/logout'),
    PROFILE: createApiUrl('/profile'), // Endpoint para gestionar perfil
    ONBOARDING: createApiUrl('/onboarding'), // Endpoint específico para onboarding
    REFRESH_TOKEN: createApiUrl('/refresh-token'), // Endpoint para renovar token JWT
    PASSWORD_RESET: createApiUrl('/password-reset'),
    PASSWORD_CHANGE: createApiUrl('/password-change'),
  },

  USER: {
    PROFILE: createApiUrl('/profile'),
    UPDATE_PROFILE: createApiUrl('/profile'),
    ACTIVE_SESSIONS: createApiUrl('/active-sessions'),
  },

  CYCLES: {
    ALL: createApiUrl('/cycles'),
    CURRENT: createApiUrl('/cycles/current'),
    CREATE: createApiUrl('/cycles'),
    UPDATE: (id: string) => createApiUrl(`/cycles/${id}`),
    DELETE: (id: string) => createApiUrl(`/cycles/${id}`),
    TODAY: createApiUrl('/cycles/today'),
    RECOMMENDATIONS: createApiUrl('/cycles/recommendations'),
    CALENDAR: createApiUrl('/cycles/calendar'),
    PREDICT: createApiUrl('/cycles/predict'),
    START_CYCLE: createApiUrl('/cycles/start-cycle'),
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

  MEDIA: {
    PLACEHOLDER: (width: number, height: number) => createApiUrl(`/placeholder/${width}/${height}`),
  },

  CONDITIONS: {
    ALL: createApiUrl('/conditions'),
    GET: (id: string) => createApiUrl(`/conditions/${id}`),
    USER: {
      ALL: createApiUrl('/conditions/user'),
      ADD: createApiUrl('/conditions/user/add'),
      UPDATE: (id: string) => createApiUrl(`/conditions/user/${id}`),
      DELETE: (id: string) => createApiUrl(`/conditions/user/${id}`),
      ACTIVE: createApiUrl('/conditions/user/active'),
    },
    CONTENT: (id: string) => createApiUrl(`/conditions/content/${id}`),
  },

  NOTIFICATIONS: {
    ALL: createApiUrl('/notifications'),
    UNREAD: createApiUrl('/notifications/unread'),
    READ: (id: string) => createApiUrl(`/notifications/read/${id}`),
    READ_ALL: createApiUrl('/notifications/read-all'),
    DELETE: (id: string) => createApiUrl(`/notifications/${id}`),
  },
};

// También exportamos la URL base para su uso en otros archivos
export { API_URL };
