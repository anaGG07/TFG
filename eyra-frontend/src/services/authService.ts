import { User } from "../types/domain";
import { LoginRequest, RegisterRequest } from "../types/api";
import { apiFetch } from "../utils/httpClient";
import { API_ROUTES } from "../config/apiRoutes";
import { ensureValidAvatarConfig } from "../types/avatar";

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

  // Controles de concurrencia simplificados
  private verificationPromise: Promise<boolean> | null = null;
  private lastVerificationAttempt: number = 0;
  private readonly VERIFICATION_COOLDOWN = 3000; // 3 segundos

  private constructor() {
    this.initializeFromStorage();
  }

  /**
   * Procesa los datos del usuario asegurando que el avatar esté en formato correcto
   */
  private processUserData(userData: any): User {
    if (!userData) {
      throw new Error("Datos de usuario inválidos");
    }

    // Procesar el campo avatar si existe
    if (userData.avatar) {
      // Si es string, parsearlo a objeto
      if (typeof userData.avatar === "string") {
        try {
          userData.avatar = JSON.parse(userData.avatar);
        } catch (error) {
          console.warn(
            "AuthService: Error parseando avatar string, usando por defecto:",
            error
          );
          userData.avatar = null;
        }
      }

      // Asegurar que el avatar tenga estructura válida
      if (userData.avatar && typeof userData.avatar === "object") {
        userData.avatar = ensureValidAvatarConfig(userData.avatar);
      } else {
        userData.avatar = ensureValidAvatarConfig(null);
      }
    } else {
      // Si no hay avatar, usar configuración por defecto
      userData.avatar = ensureValidAvatarConfig(null);
    }

    return userData as User;
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private initializeFromStorage() {
    try {
      const storedState = localStorage.getItem(AUTH_STATE_KEY);
      if (storedState) {
        const parsedState = JSON.parse(storedState);

        // Procesar usuario si existe
        if (parsedState.user) {
          parsedState.user = this.processUserData(parsedState.user);
        }

        this.authState = parsedState;
        console.log("AuthService: Estado cargado desde localStorage:", {
          isAuthenticated: this.authState.isAuthenticated,
          hasUser: !!this.authState.user,
        });
      }
    } catch (error) {
      console.error("AuthService: Error cargando desde localStorage:", error);
      this.clearAuthState();
    }
  }

  private persistAuthState() {
    try {
      localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(this.authState));
    } catch (error) {
      console.error("AuthService: Error guardando en localStorage:", error);
    }
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
      console.log("AuthService: Enviando solicitud de login...");
      const response = await apiFetch<{ user: User }>(API_ROUTES.AUTH.LOGIN, {
        method: "POST",
        body: credentials,
      });

      if (!response.user) {
        throw new Error("Respuesta inválida del servidor");
      }

      const processedUser = this.processUserData(response.user);
      this.authState = {
        user: processedUser,
        isAuthenticated: true,
        lastVerified: Date.now(),
      };
      // Notificar a otras pestañas
      localStorage.setItem("auth_event", Date.now().toString());

      console.log("AuthService: Login exitoso para:", response.user.email);
      return response.user;
    } catch (error) {
      console.error("AuthService: Error en login:", error);
      this.authState = {
        user: null,
        isAuthenticated: false,
        lastVerified: 0,
      };
      // Notificar a otras pestañas
      localStorage.setItem("auth_event", Date.now().toString());
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      console.log("AuthService: Enviando solicitud de logout...");
      await apiFetch(API_ROUTES.AUTH.LOGOUT, { method: "POST" });
      console.log("AuthService: Logout exitoso en servidor");
    } catch (error) {
      console.error("AuthService: Error en logout del servidor:", error);
    } finally {
      this.authState = {
        user: null,
        isAuthenticated: false,
        lastVerified: 0,
      };
      // Notificar a otras pestañas
      localStorage.setItem("auth_event", Date.now().toString());
      console.log("AuthService: Estado local limpiado");
    }
  }

  // Verificación simplificada sin bucles
  public async verifySession(silent = false): Promise<boolean> {
    const now = Date.now();

    // Control básico de frecuencia
    if (now - this.lastVerificationAttempt < this.VERIFICATION_COOLDOWN) {
      if (!silent) {
        console.log("AuthService: Verificación en cooldown");
      }
      return this.authState.isAuthenticated;
    }

    // Si hay verificación en curso, esperar
    if (this.verificationPromise) {
      if (!silent) {
        console.log("AuthService: Esperando verificación en curso...");
      }
      return await this.verificationPromise;
    }

    this.lastVerificationAttempt = now;
    this.verificationPromise = this.performVerification(silent);

    try {
      return await this.verificationPromise;
    } finally {
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

      const processedUser = this.processUserData(user);
      this.authState = {
        user: processedUser,
        isAuthenticated: true,
        lastVerified: Date.now(),
      };
      this.persistAuthState();

      if (!silent) {
        console.log("AuthService: Sesión válida para:", user.email);
      }
      return true;
    } catch (error: any) {
      if (!silent) {
        console.log("AuthService: Sesión no válida o expirada");
      }
      this.clearAuthState();
      return false;
    }
  }

  public async register(userData: RegisterRequest): Promise<void> {
    console.log("AuthService: Enviando solicitud de registro...");
    await apiFetch(API_ROUTES.AUTH.REGISTER, {
      method: "POST",
      body: userData,
    });
    console.log("AuthService: Registro exitoso");
  }

  public async completeOnboarding(onboardingData: any): Promise<User> {
    try {
      console.log("AuthService: Enviando datos de onboarding...");
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

      const processedUser = this.processUserData(updatedUser);
      this.authState = {
        ...this.authState,
        user: processedUser,
        isAuthenticated: true,
        lastVerified: Date.now(),
      };
      this.persistAuthState();

      console.log(
        "AuthService: Onboarding completado para:",
        updatedUser.email
      );
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
