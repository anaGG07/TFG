import { User } from "../types/domain";
import { LoginRequest, RegisterRequest } from "../types/api";
import { apiFetch } from "../utils/httpClient";
import { API_ROUTES } from "../config/apiRoutes";

const AUTH_STATE_KEY = "auth_state";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  lastVerified: number;
}

class AuthService {
  private static instance: AuthService;
  private authState: AuthState = {
    user: null,
    isAuthenticated: false,
    lastVerified: 0
  };
  
  // Control de verificaciones concurrentes
  private verificationPromise: Promise<boolean> | null = null;
  private lastVerificationAttempt: number = 0;
  private readonly VERIFICATION_COOLDOWN = 1000; // 1 segundo entre verificaciones

  private constructor() {
    this.initializeFromStorage();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private initializeFromStorage() {
    const storedState = localStorage.getItem(AUTH_STATE_KEY);
    if (storedState) {
      try {
        this.authState = JSON.parse(storedState);
      } catch {
        this.clearAuthState();
      }
    }
  }

  private persistAuthState() {
    localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(this.authState));
  }

  private clearAuthState() {
    this.authState = {
      user: null,
      isAuthenticated: false,
      lastVerified: 0
    };
    localStorage.removeItem(AUTH_STATE_KEY);
  }

  public getAuthState(): AuthState {
    return { ...this.authState };
  }

  // Verificar desde localStorage primero
  public isLikelyAuthenticated(): boolean {
    const now = Date.now();
    const timeSinceLastVerification = now - this.authState.lastVerified;
    
    // Si fue verificado recientemente (< 30 segundos) y tenemos usuario, probablemente sigue autenticado
    return this.authState.isAuthenticated && 
           this.authState.user !== null && 
           timeSinceLastVerification < 30000;
  }

  public async login(credentials: LoginRequest): Promise<User> {
    try {
      const response = await apiFetch<{ user: User }>(API_ROUTES.AUTH.LOGIN, {
        method: "POST",
        body: credentials,
      });

      if (!response.user) {
        throw new Error("Invalid response from server");
      }

      this.authState = {
        user: response.user,
        isAuthenticated: true,
        lastVerified: Date.now()
      };
      this.persistAuthState();

      return response.user;
    } catch (error) {
      this.clearAuthState();
      throw error;
    }
  }

  public async logout(): Promise<void> {
  try {
    console.log('AuthService: Iniciando logout...');
    await apiFetch(API_ROUTES.AUTH.LOGOUT, { method: "POST" });
    console.log('AuthService: Logout exitoso en servidor');
  } catch (error) {
    console.error('AuthService: Error en logout del servidor:', error);
    // Continuar con limpieza local incluso si falla el servidor
  } finally {
    console.log('AuthService: Limpiando estado local...');
    this.clearAuthState();
    console.log('AuthService: Estado local limpiado');
  }
}


  // Verificación de sesión optimizada con control de concurrencia
  public async verifySession(silent = false): Promise<boolean> {
    const now = Date.now();
    
    // Evitar verificaciones demasiado frecuentes
    if (now - this.lastVerificationAttempt < this.VERIFICATION_COOLDOWN) {
      if (!silent) {
        console.log('AuthService: Verificación en cooldown, usando estado local');
      }
      return this.authState.isAuthenticated;
    }

    // Si ya hay una verificación en curso, esperar a que termine
    if (this.verificationPromise) {
      if (!silent) {
        console.log('AuthService: Esperando verificación en curso...');
      }
      return await this.verificationPromise;
    }

    // Crear nueva promesa de verificación
    this.lastVerificationAttempt = now;
    this.verificationPromise = this.performVerification(silent);

    try {
      return await this.verificationPromise;
    } finally {
      // Limpiar la promesa después de completar
      this.verificationPromise = null;
    }
  }

  // Método privado para realizar la verificación real
  private async performVerification(silent: boolean): Promise<boolean> {
    try {
      const userData = await apiFetch<{ user: User }>(API_ROUTES.AUTH.PROFILE, {}, silent);
      
      const user = userData.user || userData;
      
      if (!silent) {
        console.log('AuthService: Verificación exitosa para usuario:', user.email);
      }
      
      this.authState = {
        user,
        isAuthenticated: true,
        lastVerified: Date.now()
      };
      this.persistAuthState();
      return true;
    } catch (error: any) {
      if (!silent) {
        console.log('AuthService: Sesión no válida');
      }
      this.clearAuthState();
      return false;
    }
  }

  public async register(userData: RegisterRequest): Promise<void> {
    await apiFetch(API_ROUTES.AUTH.REGISTER, {
      method: "POST",
      body: userData,
    });
  }

  public async completeOnboarding(onboardingData: any): Promise<User> {
    try {
      const response = await apiFetch<{ user: User; onboarding: any }>(API_ROUTES.AUTH.ONBOARDING, {
        method: "POST",
        body: onboardingData,
      });
      
      const user = response.user || response;
      
      const updatedUser = {
        ...user,
        onboardingCompleted: true,
        onboarding: response.onboarding ? {
          ...response.onboarding,
          completed: true
        } : user.onboarding
      };

      this.authState = {
        ...this.authState,
        user: updatedUser,
        isAuthenticated: true,
        lastVerified: Date.now()
      };
      this.persistAuthState();

      return updatedUser;
    } catch (error) {
      console.error('AuthService: Error completando onboarding:', error);
      this.clearAuthState();
      throw error;
    }
  }

  public updateUserData(userData: Partial<User>): void {
    if (this.authState.user) {
      this.authState = {
        ...this.authState,
        user: { ...this.authState.user, ...userData }
      };
      this.persistAuthState();
    }
  }
}

export const authService = AuthService.getInstance();
