import { apiFetch } from "../utils/httpClient";

/**
 * Servicio simplificado para manejar tokens JWT
 * Solo verifica si hay un token válido a través de las cookies
 */
class TokenService {
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
   * Verifica si hay un token JWT válido
   */
  async checkToken(): Promise<boolean> {
    // Si estamos en login o registro, no es necesario verificar
    if (this.isLoginOrRegister()) {
      return false;
    }
    
    // Prevenir bucles de verificación
    const lastCheckTime = localStorage.getItem('lastTokenCheck');
    const now = Date.now();
    const MIN_CHECK_INTERVAL = 3000; // 3 segundos de intervalo entre verificaciones
    
    // Si verificamos recientemente, devolver el último resultado conocido
    if (lastCheckTime && (now - parseInt(lastCheckTime)) < MIN_CHECK_INTERVAL) {
      console.log('TokenService: Usando resultado de verificación reciente, evitando bucle');
      return this.isTokenValid;
    }
    
    // Registrar esta verificación
    localStorage.setItem('lastTokenCheck', now.toString());

    try {
      console.log('TokenService: Verificando token...');
      await apiFetch("/api/profile", {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      this.isTokenValid = true;
      console.log('TokenService: Token válido');
      return true;
    } catch (error) {
      console.error('TokenService: Error al verificar token:', error);
      this.isTokenValid = false;
      return false;
    }
  }

  /**
   * Invalida el token actual
   */
  invalidateToken(): void {
    this.isTokenValid = false;
  }
}

export const tokenService = new TokenService();
export default tokenService;
