const API_URL = import.meta.env.VITE_API_URL || "https://eyraclub.es";

// Función auxiliar para crear URLs completas
const createApiUrl = (path: string): string => {
  // Las rutas en el backend ya tienen el prefijo /api definido en el controlador
  // Añadimos /api solo una vez
  if (!path.startsWith("/api")) {
    path = `/api${path.startsWith("/") ? path : `/${path}`}`;
  }
  return `${API_URL}${path}`;
};

// Rutas de API con prefijo /api donde sea necesario
export const API_ROUTES = {
  AUTH: {
    REGISTER: createApiUrl("/register"),
    LOGIN: createApiUrl("/login_check"),
    LOGOUT: createApiUrl("/logout"),
    PROFILE: createApiUrl("/profile"),
    ONBOARDING: createApiUrl("/onboarding"),
    REFRESH_TOKEN: createApiUrl("/refresh-token"),
    PASSWORD_RESET: createApiUrl("/password-reset"),
    PASSWORD_RESET_CONFIRM: createApiUrl("/password-reset/confirm"),
    PASSWORD_CHANGE: createApiUrl("/password-change"),
  },

  USER: {
    PROFILE: createApiUrl("/profile"),
    UPDATE_PROFILE: createApiUrl("/profile"),
    ACTIVE_SESSIONS: createApiUrl("/active-sessions"),
    PREFERENCES: createApiUrl("/preferences"),
  },

  CYCLES: {
    ALL: createApiUrl("/cycles"),
    CURRENT: createApiUrl("/cycles/current"),
    CREATE: createApiUrl("/cycles"),
    UPDATE: (id: string) => createApiUrl(`/cycles/${id}`),
    DELETE: (id: string) => createApiUrl(`/cycles/${id}`),
    TODAY: createApiUrl("/cycles/today"),
    RECOMMENDATIONS: createApiUrl("/cycles/recommendations"),
    CALENDAR: createApiUrl("/cycles/calendar"),
    PREDICT: createApiUrl("/cycles/predict"),
    PREDICTION_DETAILS: createApiUrl("/cycles/prediction-details"),
    STATISTICS: createApiUrl("/cycles/statistics"),
    START_CYCLE: createApiUrl("/cycles/start-cycle"),
    END_CYCLE: (id: string) => createApiUrl(`/cycles/end-cycle/${id}`),
    SYNC_ALGORITHM: createApiUrl("/cycles/sync-algorithm"),
  },

  SYMPTOMS: {
    ALL: createApiUrl("/symptoms"),
    HISTORY: createApiUrl("/symptoms/history"),
    PATTERNS: createApiUrl("/symptoms/patterns"),
    CREATE: createApiUrl("/symptoms"),
    UPDATE: (id: string) => createApiUrl(`/symptoms/${id}`),
    DELETE: (id: string) => createApiUrl(`/symptoms/${id}`),
    LOGS: createApiUrl("/symptoms/logs"),
  },

  INSIGHTS: {
    SUMMARY: createApiUrl("/insights/summary"),
    PREDICTIONS: createApiUrl("/insights/predictions"),
    PATTERNS: createApiUrl("/insights/patterns"),
  },

  MEDIA: {
    PLACEHOLDER: (width: number, height: number) =>
      createApiUrl(`/placeholder/${width}/${height}`),
  },

  CONDITIONS: {
    ALL: createApiUrl("/conditions"),
    GET: (id: string) => createApiUrl(`/conditions/${id}`),
    USER: {
      ALL: createApiUrl("/conditions/user"),
      ADD: createApiUrl("/conditions/user/add"),
      UPDATE: (id: string) => createApiUrl(`/conditions/user/${id}`),
      DELETE: (id: string) => createApiUrl(`/conditions/user/${id}`),
      ACTIVE: createApiUrl("/conditions/user/active"),
    },
    CONTENT: (id: string) => createApiUrl(`/conditions/content/${id}`),
  },

  NOTIFICATIONS: {
    ALL: createApiUrl("/user/notifications"),
    UNREAD: createApiUrl("/user/notifications/unread"),
    COUNT: createApiUrl("/user/notifications/count"),
    READ: (id: string) => createApiUrl(`/user/notifications/read/${id}`),
    READ_ALL: createApiUrl("/user/notifications/read-all"),
    DELETE: (id: string) => createApiUrl(`/user/notifications/delete/${id}`),
    HIGH_PRIORITY: createApiUrl("/user/notifications/high-priority"),
    BY_RELATED: (entityType: string, entityId: string) =>
      createApiUrl(`/user/notifications/by-related/${entityType}/${entityId}`),
    DISMISS: (id: string) => createApiUrl(`/user/notifications/dismiss/${id}`),
  },

  USER_SEARCH: {
    BY_EMAIL: createApiUrl("/users/search/email"),
    BY_USERNAME: createApiUrl("/users/search/username"),
    INVITE_USER: createApiUrl("/users/search/invite"),
  },

  TRACKING: {
    COMPANIONS: createApiUrl("/guests/companions"),
    FOLLOWING: createApiUrl("/guests/following"),
    INVITATIONS: createApiUrl("/invitation-codes"),
    CREATE_INVITATION: createApiUrl("/invitation-codes/generate"),
    CREATE_INVITATION_AND_SEND: createApiUrl(
      "/invitation-codes/generate-and-send"
    ),
    VERIFY_CODE: (code: string) =>
      createApiUrl(`/invitation-codes/verify/${code}`),
    REDEEM_CODE: (code: string) =>
      createApiUrl(`/invitation-codes/redeem/${code}`),
    REVOKE_INVITATION: (id: string) => createApiUrl(`/invitation-codes/${id}`),
    REVOKE_COMPANION: (id: string) => createApiUrl(`/guests/${id}`),
    UPDATE_COMPANION_PERMISSIONS: (id: string) =>
      createApiUrl(`/guests/${id}/permissions`),
    UPDATE_MY_PREFERENCES: (id: string) =>
      createApiUrl(`/guests/${id}/preferences`),
    AVAILABLE_PERMISSIONS: createApiUrl("/guests/available-permissions"),
  },

  ADMIN: {
    USERS: {
      LIST: createApiUrl("/admin/users"),
      GET: (id: string) => createApiUrl(`/admin/users/${id}`),
      UPDATE: (id: string) => createApiUrl(`/admin/users/${id}`),
      DELETE: (id: string) => createApiUrl(`/admin/users/${id}`),
    },
    CONDITIONS: {
      LIST: createApiUrl("/conditions"),
      GET: (id: string) => createApiUrl(`/conditions/${id}`),
      CREATE: createApiUrl("/conditions"),
      UPDATE: (id: string) => createApiUrl(`/conditions/${id}`),
      DELETE: (id: string) => createApiUrl(`/conditions/${id}`),
      SEARCH: createApiUrl("/conditions/search"),
    },
    CONTENT: {
      LIST: createApiUrl("/admin/content"),
      GET: (id: string) => createApiUrl(`/admin/content/${id}`),
      CREATE: createApiUrl("/admin/content"),
      UPDATE: (id: string) => createApiUrl(`/admin/content/${id}`),
      DELETE: (id: string) => createApiUrl(`/admin/content/${id}`),
    },
  },
};

export { API_URL };
