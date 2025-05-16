import { API_ROUTES, API_URL } from "../config/apiRoutes";

/**
 * Servicio para manejar tokens JWT
 * Encapsula la lógica de renovación y verificación de tokens
 */
class TokenService {
  private refreshPromise: Promise<boolean> | null = null;
  private refreshing = false;
  private lastRefreshTime = 0;
  private readonly MIN_REFRESH_INTERVAL = 30000; // 30 segundos mínimo entre refrescos
  private isTokenValid = false;

  /**
   * Comprueba si la ruta actual es login o registro
   */
  private isLoginOrRegister(): boolean {
    return typeof window !== "undefined" && 
           (window.location.pathname === '/login' || 
            window.location.pathname === '/register');
  }

  /**
   * Verifica y renueva el token si es necesario
   */
  async checkAndRefreshToken(): Promise<boolean> {
    // Si estamos en login/registro, no intentamos renovar
    if (this.isLoginOrRegister()) {
      console.log("TokenService: En página de login/registro, omitiendo renovación");
      return false;
    }

    // Si ya hay una renovación en curso, esperamos por ella
    if (this.refreshPromise) {
      console.log("TokenService: Esperando renovación en curso...");
      try {
        return await this.refreshPromise;
      } catch (error) {
        console.error("TokenService: Error esperando renovación:", error);
        return false;
      }
    }

    // Evitar renovaciones muy frecuentes
    const now = Date.now();
    if (now - this.lastRefreshTime < this.MIN_REFRESH_INTERVAL && this.isTokenValid) {
      console.log("TokenService: Renovación muy reciente y token válido, omitiendo");
      return true;
    }

    console.log("TokenService: Iniciando renovación de token...");
    this.refreshing = true;
    this.refreshPromise = this.refreshToken();

    try {
      const result = await this.refreshPromise;
      if (result) {
        this.lastRefreshTime = Date.now();
        this.isTokenValid = true;
      } else {
        this.isTokenValid = false;
      }
      return result;
    } catch (error) {
      console.error("TokenService: Error en renovación:", error);
      this.isTokenValid = false;
      return false;
    } finally {
      this.refreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Realiza la petición al servidor para renovar el token
   */
  private async refreshToken(): Promise<boolean> {
    try {
      console.log("TokenService: Enviando petición de renovación...");
      
      const res = await fetch(`${API_URL}${API_ROUTES.AUTH.REFRESH_TOKEN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: "include",
      });

      if (!res.ok) {
        console.error("TokenService: Error en respuesta:", {
          status: res.status,
          statusText: res.statusText
        });
        
        if (res.status === 401) {
          console.warn("TokenService: Token expirado o inválido");
          this.isTokenValid = false;
          window.location.href = '/login';
        }
        
        return false;
      }

      const data = await res.json();
      console.log("TokenService: Token renovado exitosamente");
      this.isTokenValid = true;
      return true;
    } catch (error) {
      console.error("TokenService: Error en petición de renovación:", error);
      this.isTokenValid = false;
      return false;
    }
  }

  /**
   * Marca el token como inválido (usado al cerrar sesión)
   */
  invalidateToken(): void {
    this.isTokenValid = false;
    this.lastRefreshTime = 0;
  }

  /**
   * Configura el sistema de renovación automática de tokens
   */
  setupTokenRefresher(): () => void {
    console.log("TokenService: Configurando renovación automática");
    
    const checkInterval = 60000; // Verificar cada minuto
    const intervalId = setInterval(() => {
      if (!this.refreshing && !this.isLoginOrRegister()) {
        this.checkAndRefreshToken().catch(console.error);
      }
    }, checkInterval);

    return () => {
      console.log("TokenService: Limpiando renovación automática");
      clearInterval(intervalId);
    };
  }
}

export const tokenService = new TokenService();
export default tokenService;
