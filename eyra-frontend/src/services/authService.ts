import { User } from "../types/domain";
import { LoginRequest, RegisterRequest } from "../types/api";
import { apiFetch } from "../utils/httpClient";
import Cookies from "js-cookie";

const TOKEN_KEY = "token";
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
    Cookies.remove(TOKEN_KEY);
  }

  public getAuthState(): AuthState {
    return { ...this.authState };
  }

  public async login(credentials: LoginRequest): Promise<User> {
    try {
      const response = await apiFetch<{ user: User; token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      if (!response.token || !response.user) {
        throw new Error("Invalid response from server");
      }

      // Establecer el token en las cookies
      Cookies.set(TOKEN_KEY, response.token, {
        expires: 7, // 7 días
        secure: true,
        sameSite: "strict"
      });

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
      await apiFetch("/auth/logout", { method: "POST" });
    } finally {
      this.clearAuthState();
    }
  }

  public async verifySession(): Promise<boolean> {
    const token = Cookies.get(TOKEN_KEY);
    if (!token) {
      this.clearAuthState();
      return false;
    }

    // Verificar si la última verificación fue hace menos de 5 minutos
    if (Date.now() - this.authState.lastVerified < 5 * 60 * 1000) {
      return this.authState.isAuthenticated;
    }

    try {
      const user = await apiFetch<User>("/auth/me");
      this.authState = {
        user,
        isAuthenticated: true,
        lastVerified: Date.now()
      };
      this.persistAuthState();
      return true;
    } catch (error) {
      this.clearAuthState();
      return false;
    }
  }

  public async register(userData: RegisterRequest): Promise<void> {
    await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  public async completeOnboarding(onboardingData: any): Promise<User> {
    const user = await apiFetch<User>("/auth/complete-onboarding", {
      method: "POST",
      body: JSON.stringify(onboardingData),
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
