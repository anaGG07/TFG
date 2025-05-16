import { API_URL } from "../config/apiRoutes";

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

    try {
      // Intenta hacer una petición al endpoint de perfil para verificar el token
      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });

      this.isTokenValid = response.ok;
      return this.isTokenValid;
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
