import { API_ROUTES } from '../config/apiRoutes';
import { apiFetch } from '../utils/httpClient';


/**
 * Servicio para manejar tokens JWT
 * Encapsula la lógica de renovación y verificación de tokens
 */
class TokenService {
  private refreshPromise: Promise<any> | null = null;
  private refreshing = false;
  private lastRefreshTime = 0;
  private readonly MIN_REFRESH_INTERVAL = 30000; // 30 segundos mínimo entre refrescos
  
  /**
   * Configura el servicio de tokens e inicializa la renovación automática
   * cuando sea necesario
   */
  public setupTokenRefresher() {
    // Configurar renovación automática de token
    this.setupAutoRefresh();
    
    console.log('Token refresher configurado correctamente');
    
    // Devolver una función para limpiar
    return () => {
      this.cleanupAutoRefresh();
    };
  }
  
  /**
   * Configura la renovación automática del token JWT
   * Utiliza un intervalo para verificar periódicamente la necesidad de renovar
   */
  private setupAutoRefresh() {
    // Verificar cada 60 segundos (para producción podría ser más)
    const intervalId = setInterval(() => {
      this.checkAndRefreshToken();
    }, 60000);
    
    // Guardar el ID del intervalo en window para poder limpiarlo posteriormente
    if (typeof window !== 'undefined') {
      (window as any).__tokenRefreshIntervalId = intervalId;
    }
  }
  
  /**
   * Limpia el intervalo de renovación automática
   */
  private cleanupAutoRefresh() {
    if (typeof window !== 'undefined' && (window as any).__tokenRefreshIntervalId) {
      clearInterval((window as any).__tokenRefreshIntervalId);
      (window as any).__tokenRefreshIntervalId = null;
    }
  }
  
  /**
   * Verifica si es necesario renovar el token y lo hace si corresponde
   */
  public async checkAndRefreshToken() {
    try {
      // Evitar renovaciones demasiado frecuentes
      const now = Date.now();
      if (this.refreshing || now - this.lastRefreshTime < this.MIN_REFRESH_INTERVAL) {
        return false;
      }
      
      // Para evitar múltiples renovaciones simultáneas, usamos una promesa compartida
      if (!this.refreshPromise) {
        this.refreshing = true;
        this.refreshPromise = this.refreshToken();
      }
      
      await this.refreshPromise;
      return true;
    } catch (error) {
      console.error('Error al renovar token:', error);
      return false;
    } finally {
      this.refreshing = false;
      this.refreshPromise = null;
    }
  }
  
  /**
   * Realiza la petición al servidor para renovar el token JWT
   * @returns Promesa con la respuesta del servidor
   */
  private async refreshToken() {
    try {
      this.lastRefreshTime = Date.now();
      
      console.log('Renovando token JWT...');
      const response = await apiFetch(API_ROUTES.AUTH.REFRESH_TOKEN, {
        method: 'POST',
        skipRedirectCheck: true, // Evitar redirecciones automáticas
      });
      
      console.log('Token renovado con éxito:', response);
      return response;
    } catch (error) {
      console.error('Error al renovar token JWT:', error);
      throw error;
    }
  }
}

export const tokenService = new TokenService();
export default tokenService;
