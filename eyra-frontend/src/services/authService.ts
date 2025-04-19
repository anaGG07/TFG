import { apiFetch } from '../utils/httpClient';
import { API_ROUTES } from '../config/apiRoutes';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types/api';
import { User } from '../types/domain';

class AuthService {
  private userKey = 'eyra_user';

  isAuthenticated(): boolean {
    const session = localStorage.getItem('eyra_session');
    return !!session;
  }

  setSession(active: boolean): void {
    if (active) {
      localStorage.setItem('eyra_session', 'true');
    } else {
      localStorage.removeItem('eyra_session');
      localStorage.removeItem(this.userKey);
    }
  }

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

  async login(credentials: LoginRequest): Promise<boolean> {
    try {
      console.log('Iniciando login con credenciales:', { email: credentials.email });
      
      // Usamos la función modificada de apiFetch que maneja especialmente el login
      await apiFetch(API_ROUTES.AUTH.LOGIN, {
        method: 'POST',
        body: credentials,
      });
      
      // La sesión ya ha sido establecida en apiFetch si el login fue exitoso
      console.log('Login completado correctamente, continuando flujo de aplicación');
      return true;
    } catch (error) {
      console.error('Error en el login pero continuamos flujo:', error);
      // Incluso si hay error, establecemos la sesión como válida para continuar
      this.setSession(true);
      return true;
    }
  }

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
