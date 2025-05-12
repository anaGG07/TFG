import { API_ROUTES } from "../config/apiRoutes";
import { apiFetch } from "../utils/httpClient";

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
   * Comprueba si la ruta actual es login o registro
   */
  private isLoginOrRegister(): boolean {
    return typeof window !== "undefined" && 
           (window.location.pathname === '/login' || 
            window.location.pathname === '/register');
  }

  /**
   * Configura el servicio de tokens e inicializa la renovación automática
   */
  public setupTokenRefresher() {
    // SOLUCIÓN: No activar renovación automática en páginas de login/registro
    if (this.isLoginOrRegister()) {
      console.log("En login/registro: sin configurar renovación automática");
      return () => {}; // Función vacía de limpieza
    }
    
    this.setupAutoRefresh();
    console.log("✅ Token refresher configurado correctamente");
    return () => {
      this.cleanupAutoRefresh();
    };
  }

  /**
   * Verifica cada 60 segundos si es necesario renovar el token
   */
  private setupAutoRefresh() {
    const intervalId = setInterval(() => {
      // Verificar que no estamos en login/registro antes de intentar renovar
      if (!this.isLoginOrRegister()) {
        this.checkAndRefreshToken();
      } else {
        console.log("Saltando renovación automática en página de login/registro");
      }
    }, 60000); // 1 minuto

    if (typeof window !== "undefined") {
      (window as any).__tokenRefreshIntervalId = intervalId;
    }
  }

  /**
   * Limpia el intervalo de renovación automática
   */
  private cleanupAutoRefresh() {
    if (
      typeof window !== "undefined" &&
      (window as any).__tokenRefreshIntervalId
    ) {
      clearInterval((window as any).__tokenRefreshIntervalId);
      (window as any).__tokenRefreshIntervalId = null;
    }
  }

  /**
   * Verifica si se necesita renovar el token y lo hace si es posible
   */
  public async checkAndRefreshToken(): Promise<boolean> {
    // SOLUCIÓN: No intentar renovar el token en páginas de login/registro
    if (this.isLoginOrRegister()) {
      console.log("En login/registro: evitando renovación automática de token");
      return false;
    }
    
    const now = Date.now();

    // Demasiado pronto desde el último intento
    if (
      this.refreshing ||
      now - this.lastRefreshTime < this.MIN_REFRESH_INTERVAL
    ) {
      return false;
    }

    if (!this.refreshPromise) {
      this.refreshing = true;
      this.refreshPromise = this.refreshToken();
    }

    try {
      await this.refreshPromise;
      return true;
    } catch (error) {
      console.error("🚫 Fallo al renovar el token:", error);
      this.clearAuthCookies();
      return false;
    } finally {
      this.refreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Realiza la petición al servidor para renovar el token
   */
  private async refreshToken(): Promise<any> {
    // SOLUCIÓN: Verificar nuevamente aquí para tener seguridad adicional
    if (this.isLoginOrRegister()) {
      console.log("En login/registro: cancelando intento de renovación de token");
      throw new Error("Renovación de token cancelada en página de login/registro");
    }
    
    this.lastRefreshTime = Date.now();

    console.log("🔁 Intentando renovar token JWT...");

    try {
      const response = await apiFetch(API_ROUTES.AUTH.REFRESH_TOKEN, {
        method: "POST",
        credentials: "include",
        skipRedirectCheck: true,
      });

      console.log("✅ Token renovado:", response);
      return response;
    } catch (error: any) {
      if (error?.response?.status === 401) {
        console.warn(
          "🔒 Refresh token inválido o expirado. Se limpiarán las cookies."
        );
        this.clearAuthCookies();
      } else {
        console.error("💥 Error inesperado en renovación de token:", error);
      }

      throw error;
    }
  }

  /**
   * Elimina cookies de autenticación del navegador
   */
  private clearAuthCookies() {
    document.cookie = "jwt_token=; Max-Age=0; path=/";
    document.cookie = "refresh_token=; Max-Age=0; path=/";
  }
}

export const tokenService = new TokenService();
export default tokenService;
