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
      console.log('TokenService: Verificando token...');
      
      // Intenta hacer una petición al endpoint de perfil para verificar el token
      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });

      // Examinar la respuesta
      console.log('TokenService: Respuesta de verificación:', {
        status: response.status,
        ok: response.ok
      });

      this.isTokenValid = response.ok;
      
      // Si la sesión está activa, añadir un tiempo de gracia para evitar multiples solicitudes
      if (this.isTokenValid) {
        console.log('TokenService: Token válido');
      } else {
        console.log('TokenService: Token inválido, código:', response.status);
      }
      
      return this.isTokenValid;
    } catch (error) {
      console.error('TokenService: Error al verificar token:', error);
      
      // En caso de error de red, asumimos que el token podría ser válido
      // para evitar cerrar sesiones por problemas temporales
      console.log('TokenService: Asumiendo token válido durante error de red');
      return true;
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
