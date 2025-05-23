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

  public async login(credentials: LoginRequest): Promise<User> {
    try {
      const response = await apiFetch<{ user: User }>(API_ROUTES.AUTH.LOGIN, {
        method: "POST",
        body: credentials,
      });

      if (!response.user) {
        throw new Error("Invalid response from server");
      }

      // Actualizar el estado de autenticación
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
      await apiFetch(API_ROUTES.AUTH.LOGOUT, { method: "POST" });
    } finally {
      this.clearAuthState();
    }
  }

  public async verifySession(silent = false, retries = 3, delay = 100): Promise<boolean> {
    for (let i = 0; i < retries; i++) {
      try {
        const userData = await apiFetch<{ user: User }>(API_ROUTES.AUTH.PROFILE, {}, silent);
        
        const user = userData.user || userData;
        
        if (!silent) {
          console.log('AuthService: Datos de usuario recibidos:', {
            id: user.id,
            email: user.email,
            onboardingCompleted: user.onboardingCompleted,
            onboarding: user.onboarding
          });
        }
        
        this.authState = {
          ...this.authState,
          user,
          isAuthenticated: true,
          lastVerified: Date.now()
        };
        this.persistAuthState();
        return true;
      } catch (error: any) {
        if (i < retries - 1 && error.message?.includes("401")) {
          await new Promise(res => setTimeout(res, delay));
          continue;
        }
        this.clearAuthState();
        if (!silent) {
          console.error('AuthService: Error verificando sesión:', error);
        }
        return false;
      }
    }
    return false;
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
      
      console.log('AuthService: Respuesta completa del onboarding:', response);

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
        lastVerified: Date.now()
      };
      this.persistAuthState();

      console.log('AuthService: Estado final tras onboarding:', {
        onboardingCompleted: this.authState.user?.onboardingCompleted,
        onboarding: this.authState.user?.onboarding
      });

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
