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

  public async verifySession(silent = false): Promise<boolean> {
    try {
      const user = await apiFetch<User>(API_ROUTES.AUTH.PROFILE, {}, silent);
      this.authState = {
        ...this.authState,
        user,
        isAuthenticated: true,
        lastVerified: Date.now()
      };
      this.persistAuthState();
      return true;
    } catch (error) {
      this.clearAuthState();
      if (!silent) {
        console.error(error);
      }
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
    const user = await apiFetch<User>(API_ROUTES.AUTH.ONBOARDING, {
      method: "POST",
      body: onboardingData,
    });
    
    this.authState = {
      ...this.authState,
      user
    };
    this.persistAuthState();
    
    return user;
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
