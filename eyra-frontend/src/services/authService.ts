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
    lastVerified: 0,
  };

  // ✅ FIX: Control más estricto de concurrencia
  private verificationPromise: Promise<boolean> | null = null;
  private lastVerificationAttempt: number = 0;
  private readonly VERIFICATION_COOLDOWN = 5000; // ✅ Aumentado a 5 segundos

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
      lastVerified: 0,
    };
    localStorage.removeItem(AUTH_STATE_KEY);
  }

  public getAuthState(): AuthState {
    return { ...this.authState };
  }

  public async login(credentials: LoginRequest): Promise<User> {
    try {
      console.log("AuthService: Ejecutando login...");
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
        lastVerified: Date.now(),
      };
      this.persistAuthState();

      console.log("AuthService: Login exitoso para:", response.user.email);
      return response.user;
    } catch (error) {
      console.error("AuthService: Error en login:", error);
      this.clearAuthState();
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      console.log("AuthService: Ejecutando logout...");
      await apiFetch(API_ROUTES.AUTH.LOGOUT, { method: "POST" });
      console.log("AuthService: Logout exitoso en servidor");
    } catch (error) {
      console.error("AuthService: Error en logout del servidor:", error);
    } finally {
      console.log("AuthService: Limpiando estado local...");
      this.clearAuthState();
    }
  }

  // ✅ FIX: Verificación de sesión con control de frecuencia mejorado
  public async verifySession(silent = false): Promise<boolean> {
    const now = Date.now();

    // ✅ Control de frecuencia más estricto
    if (now - this.lastVerificationAttempt < this.VERIFICATION_COOLDOWN) {
      if (!silent) {
        console.log(
          `AuthService: Verificación en cooldown (${Math.round(
            (this.VERIFICATION_COOLDOWN -
              (now - this.lastVerificationAttempt)) /
              1000
          )}s restantes)`
        );
      }
      return this.authState.isAuthenticated;
    }

    // ✅ Si ya hay una verificación en curso, esperar resultado
    if (this.verificationPromise) {
      if (!silent) {
        console.log("AuthService: Esperando verificación en curso...");
      }
      return await this.verificationPromise;
    }

    // ✅ Marcar tiempo de verificación ANTES de crear la promesa
    this.lastVerificationAttempt = now;
    this.verificationPromise = this.performVerification(silent);

    try {
      return await this.verificationPromise;
    } finally {
      // ✅ Limpiar promesa después de completar
      this.verificationPromise = null;
    }
  }

  private async performVerification(silent: boolean): Promise<boolean> {
    try {
      if (!silent) {
        console.log("AuthService: Verificando sesión en servidor...");
      }

      const userData = await apiFetch<{ user: User }>(
        API_ROUTES.AUTH.PROFILE,
        {},
        silent
      );
      const user = userData.user || userData;

      if (!silent) {
        console.log("AuthService: Sesión válida para:", user.email);
      }

      this.authState = {
        user,
        isAuthenticated: true,
        lastVerified: Date.now(),
      };
      this.persistAuthState();
      return true;
    } catch (error: any) {
      if (!silent) {
        console.log("AuthService: Sesión no válida");
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
      const response = await apiFetch<{ user: User; onboarding: any }>(
        API_ROUTES.AUTH.ONBOARDING,
        {
          method: "POST",
          body: onboardingData,
        }
      );

      const user = response.user || response;

      const updatedUser = {
        ...user,
        onboardingCompleted: true,
        onboarding: response.onboarding
          ? {
              ...response.onboarding,
              completed: true,
            }
          : user.onboarding,
      };

      this.authState = {
        ...this.authState,
        user: updatedUser,
        isAuthenticated: true,
        lastVerified: Date.now(),
      };
      this.persistAuthState();

      return updatedUser;
    } catch (error) {
      console.error("AuthService: Error completando onboarding:", error);
      this.clearAuthState();
      throw error;
    }
  }

  public updateUserData(userData: Partial<User>): void {
    if (this.authState.user) {
      this.authState = {
        ...this.authState,
        user: { ...this.authState.user, ...userData },
      };
      this.persistAuthState();
    }
  }
}

export const authService = AuthService.getInstance();
