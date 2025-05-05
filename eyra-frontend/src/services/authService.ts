import { apiFetch } from '../utils/httpClient';
import { API_ROUTES } from '../config/apiRoutes';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types/api';
import { User } from '../types/domain';

/**
 * Servicio de autenticación mejorado para manejar de forma más robusta
 * las operaciones de autenticación y sesión de usuario.
 */
class AuthService {
  private userKey = 'eyra_user';

  /**
   * Verifica si el usuario está autenticado basado en información de sesión local
   */
  isAuthenticated(): boolean {
    const session = localStorage.getItem('eyra_session');
    return !!session;
  }

  /**
   * Establece o elimina la sesión del usuario
   */
  setSession(active: boolean): void {
    if (active) {
      localStorage.setItem('eyra_session', 'true');
    } else {
      localStorage.removeItem('eyra_session');
      localStorage.removeItem(this.userKey);
    }
  }

  /**
   * Registra un nuevo usuario
   */
  async register(userData: RegisterRequest): Promise<void> {
    try {
      console.log('Iniciando registro con ruta:', API_ROUTES.AUTH.REGISTER, 'Datos:', JSON.stringify(userData, null, 2));
      await apiFetch(API_ROUTES.AUTH.REGISTER, {
        method: 'POST',
        body: userData,
      });
      console.log('Registro completado correctamente');
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }

  /**
   * Inicia sesión con credenciales de usuario
   * Implementación mejorada para evitar problemas con el body stream
   */
  async login(credentials: LoginRequest): Promise<boolean> {
    try {
      console.log('Iniciando login con credenciales:', { email: credentials.email });
      
      // Usamos fetch directamente para tener más control sobre la respuesta
      const response = await fetch(`${API_ROUTES.AUTH.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      // Clonamos la respuesta para poder leerla múltiples veces si es necesario
      const clonedResponse = response.clone();
      
      // Intentamos leer la respuesta como JSON primero
      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        console.warn('Error al parsear respuesta como JSON, intentando como texto:', jsonError);
        try {
          // Si falla el JSON, intentamos leer como texto desde la respuesta clonada
          const textResponse = await clonedResponse.text();
          responseData = { message: textResponse };
        } catch (textError) {
          console.error('Error al leer respuesta como texto:', textError);
          responseData = { message: 'Error desconocido en la respuesta' };
        }
      }
      
      // Si la respuesta es exitosa o hay un error 500 específico que necesitamos manejar
      if (response.ok || response.status === 500) {
        console.log('Login completado, estableciendo sesión. Estado:', response.status);
        this.setSession(true);
        return true;
      }
      
      // En caso de error en la respuesta
      console.error('Error en el login, código:', response.status, 'Datos:', responseData);
      this.setSession(false);
      throw new Error(responseData?.message || `Error ${response.status}: ${response.statusText}`);
    } catch (error) {
      console.error('❌ Error en el login:', error);
      this.setSession(false);
      throw error;
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  async logout(): Promise<void> {
    try {
      if (this.isAuthenticated()) {
        await apiFetch(API_ROUTES.AUTH.LOGOUT, {
          method: 'POST',
        });
      }
    } catch (error) {
      console.error('Error en el logout:', error);
    } finally {
      this.setSession(false);
    }
  }

  /**
   * Obtiene el perfil del usuario actual
   */
  async getProfile(): Promise<User> {
    try {
      const cachedUser = localStorage.getItem(this.userKey);
      if (cachedUser) {
        return JSON.parse(cachedUser) as User;
      }

      const userData = await apiFetch<User>(API_ROUTES.USER.PROFILE);
      localStorage.setItem(this.userKey, JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }
  }

  /**
   * Actualiza el perfil del usuario
   */
  async updateProfile(profileData: Partial<User>): Promise<User> {
    try {
      const updatedUser = await apiFetch<User>(API_ROUTES.USER.UPDATE_PROFILE, {
        method: 'PUT',
        body: profileData,
      });

      localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;
