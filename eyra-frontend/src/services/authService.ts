import { apiFetch, configureAuthHandlers } from '../utils/httpClient';
import { API_ROUTES } from '../config/apiRoutes';
import { LoginRequest, RegisterRequest } from '../types/api';
import { User } from '../types/domain';

/**
 * Servicio de autenticación con manejo mejorado para evitar dependencias circulares
 * y problemas de bloqueo en la inicialización
 */
class AuthService {
  private userKey = 'eyra_user';
  private sessionKey = 'eyra_session';
  private initialized = false;

  constructor() {
    // Configurar los manejadores de eventos para el httpClient
    // Esto rompe la dependencia circular
    configureAuthHandlers({
      onUnauthorized: () => this.handleUnauthorized(),
      onLogout: () => this.logout()
    });
    
    this.initialized = true;
    console.log('AuthService inicializado correctamente');
  }

  /**
   * Verifica si el servicio está correctamente inicializado
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('AuthService no está inicializado correctamente');
    }
  }

  /**
   * Manejador para redirecciones cuando el usuario no está autorizado
   */
  private handleUnauthorized(): void {
    this.setSession(false);
    window.location.href = '/login';
  }

  /**
   * Verifica si el usuario está autenticado basado en información de sesión local
   */
  isAuthenticated(): boolean {
    const session = localStorage.getItem(this.sessionKey);
    return session === 'true';
  }

  /**
   * Establece o elimina la sesión del usuario
   */
  setSession(active: boolean): void {
    if (active) {
      localStorage.setItem(this.sessionKey, 'true');
    } else {
      localStorage.removeItem(this.sessionKey);
      localStorage.removeItem(this.userKey);
    }
  }

  /**
   * Registra un nuevo usuario
   */
  async register(userData: RegisterRequest): Promise<void> {
    this.ensureInitialized();
    
    try {
      console.log('Iniciando registro');
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
    this.ensureInitialized();
    
    try {
      console.log('Iniciando login con credenciales:', { email: credentials.email });
      
      // Usamos fetch directamente para evitar bucles con apiFetch
      const response = await fetch(API_ROUTES.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      // Simplificamos la lógica de manejo de respuesta
      if (response.ok) {
        console.log('Login completado, estableciendo sesión');
        this.setSession(true);
        
        // Guardar datos de usuario básicos
        const mockUser: User = {
          id: 1,
          email: credentials.email,
          username: 'usuario',
          name: 'Usuario',
          lastName: 'Demo',
          roles: ['ROLE_USER'],
          profileType: 'WOMEN',
        };
        localStorage.setItem(this.userKey, JSON.stringify(mockUser));
        
        return true;
      } else {
        console.error('Error en login, status:', response.status);
        this.setSession(false);
        
        // Intentamos obtener el mensaje de error, pero no bloqueamos si falla
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error de autenticación');
        } catch (e) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }
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
    this.ensureInitialized();
    
    try {
      // Solo intentamos hacer logout en el backend si hay sesión
      if (this.isAuthenticated()) {
        try {
          await apiFetch(API_ROUTES.AUTH.LOGOUT, {
            method: 'POST',
          });
        } catch (e) {
          console.warn('Error al hacer logout en el servidor, continuando localmente');
        }
      }
    } finally {
      // Siempre limpiamos la sesión local
      this.setSession(false);
    }
  }

  /**
   * Obtiene el perfil del usuario actual, con fallback a datos locales
   */
  async getProfile(): Promise<User> {
    this.ensureInitialized();
    
    try {
      // Primero intentamos obtener del almacenamiento local
      const cachedUser = localStorage.getItem(this.userKey);
      if (cachedUser) {
        const userData = JSON.parse(cachedUser) as User;
        
        // Intentamos actualizar en segundo plano, pero no bloqueamos
        this.refreshUserDataInBackground().catch(e => {
          console.warn('No se pudo actualizar el perfil en segundo plano:', e);
        });
        
        return userData;
      }

      // Si no hay datos en local, intentamos obtener del servidor
      const userData = await apiFetch<User>(API_ROUTES.USER.PROFILE);
      localStorage.setItem(this.userKey, JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      
      // Si hay error, intentamos devolver datos locales como fallback
      const cachedUser = localStorage.getItem(this.userKey);
      if (cachedUser) {
        return JSON.parse(cachedUser) as User;
      }
      
      throw error;
    }
  }
  
  /**
   * Actualiza los datos del usuario en segundo plano
   */
  private async refreshUserDataInBackground(): Promise<void> {
    try {
      const userData = await apiFetch<User>(API_ROUTES.USER.PROFILE);
      localStorage.setItem(this.userKey, JSON.stringify(userData));
    } catch (e) {
      console.warn('No se pudo actualizar el perfil en segundo plano');
      throw e;
    }
  }

  /**
   * Actualiza el perfil del usuario
   */
  async updateProfile(profileData: Partial<User>): Promise<User> {
    this.ensureInitialized();
    
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

// Exportamos una singleton del servicio
export const authService = new AuthService();
export default authService;
