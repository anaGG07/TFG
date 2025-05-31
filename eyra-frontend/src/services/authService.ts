import { User } from "../types/domain";
import { LoginRequest, RegisterRequest } from "../types/api";
import { apiFetch } from "../utils/httpClient";
import { API_ROUTES } from "../config/apiRoutes";
import { isValidAvatarConfig } from "../types/avatar";

class AuthService {
  private static instance: AuthService;
  private authState: User | null = null;

  // Controles de concurrencia simplificados
  private verificationPromise: Promise<boolean> | null = null;
  private lastVerificationAttempt: number = 0;
  private readonly VERIFICATION_COOLDOWN = 3000; // 3 segundos

  private constructor() {
    // Elimina toda la lógica de localStorage y persistencia
  }

  /**
   * Procesa los datos del usuario RESPETANDO el avatar exacto de la base de datos
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
          console.warn("AuthService: Error parseando avatar string:", error);
          userData.avatar = null;
        }
      }

      // Solo validar estructura, NO aplicar valores por defecto
      if (userData.avatar && typeof userData.avatar === "object") {
        // Verificar que tenga la estructura básica, pero mantener valores exactos de BD
        if (isValidAvatarConfig(userData.avatar)) {
          // Avatar válido, mantener exactamente como viene de BD
          // No aplicar ensureValidAvatarConfig que sobreescribe valores
        } else {
          console.warn(
            "AuthService: Avatar inválido en BD, estableciendo como null"
          );
          userData.avatar = null;
        }
      } else {
        userData.avatar = null;
      }
    }
    // Si no hay avatar, mantenerlo como null (no forzar avatar por defecto)

    return userData as User;
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public getAuthState(): User | null {
    return this.authState;
  }

  public async login(credentials: LoginRequest): Promise<User> {
    try {
      console.log("AuthService: Enviando solicitud de login...");
      // 1. Login: obtener token (no usuario)
      await apiFetch(API_ROUTES.AUTH.LOGIN, {
        method: "POST",
        body: credentials,
      });

      // 2. Obtener perfil completo
      const profileResponse = await apiFetch<{ user: User }>(API_ROUTES.AUTH.PROFILE, {
        method: "GET"
      });

      console.log("=== DEBUG PROFILE RESPONSE AVATAR ===");
      console.log("Avatar recibido en profile:", profileResponse.user.avatar);
      console.log("====================================");

      if (!profileResponse.user) {
        throw new Error("No se pudo obtener el perfil del usuario tras login");
      }

      const processedUser = this.processUserData(profileResponse.user);
      this.authState = processedUser;
      // Notificar a otras pestañas
      localStorage.setItem("auth_event", Date.now().toString());

      console.log("AuthService: Login exitoso para:", profileResponse.user.email);
      return processedUser;
    } catch (error) {
      console.error("AuthService: Error en login:", error);
      this.authState = null;
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
      this.authState = null;
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
      return !!this.authState;
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
      this.authState = processedUser;

      if (!silent) {
        console.log("AuthService: Sesión válida para:", user.email);
      }
      return true;
    } catch (error: any) {
      if (!silent) {
        console.log("AuthService: Sesión no válida o expirada");
      }
      this.authState = null;
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
      this.authState = processedUser;

      console.log(
        "AuthService: Onboarding completado para:",
        updatedUser.email
      );
      return updatedUser;
    } catch (error) {
      console.error("AuthService: Error completando onboarding:", error);
      this.authState = null;
      throw error;
    }
  }

  public updateUserData(userData: Partial<User>): void {
    if (this.authState) {
      this.authState = { ...this.authState, ...userData };
    }
  }
}

export const authService = AuthService.getInstance();
