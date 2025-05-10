/**
 * Servicio para manejar cookies de autenticación
 * Proporciona métodos para verificar, extraer y manejar cookies de forma segura
 */

/**
 * Verifica si una cookie específica existe
 * @param name Nombre de la cookie a verificar
 * @returns true si la cookie existe, false si no
 */
export const hasCookie = (name: string): boolean => {
  return document.cookie
    .split(';')
    .some(c => c.trim().startsWith(`${name}=`));
};

/**
 * Obtiene el valor de una cookie específica
 * @param name Nombre de la cookie a obtener
 * @returns El valor de la cookie o null si no existe
 */
export const getCookieValue = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};

/**
 * Verifica si el usuario tiene una cookie de JWT válida
 * @returns true si existe la cookie jwt_token
 */
export const hasValidAuthCookie = (): boolean => {
  return hasCookie('jwt_token');
};

/**
 * Verifica si el usuario tiene un token de refresco válido
 * @returns true si existe la cookie refresh_token
 */
export const hasValidRefreshCookie = (): boolean => {
  return hasCookie('refresh_token');
};

/**
 * Verifica el estado general de la autenticación basado en cookies
 * @returns Objeto con estado de las cookies de autenticación
 */
export const getAuthCookiesStatus = (): { 
  hasJwt: boolean; 
  hasRefresh: boolean;
  isAuthenticated: boolean;
} => {
  const hasJwt = hasValidAuthCookie();
  const hasRefresh = hasValidRefreshCookie();
  
  return {
    hasJwt,
    hasRefresh,
    isAuthenticated: hasJwt // Consideramos autenticado si tiene JWT
  };
};

const cookieService = {
  hasCookie,
  getCookieValue,
  hasValidAuthCookie,
  hasValidRefreshCookie,
  getAuthCookiesStatus
};

export default cookieService;
