import { LoginRequest } from "../types/api";
import { RegisterRequest } from "../types/api";
import { User } from "../types/domain";
import { tokenService } from "./tokenService";
import { apiFetch } from "../utils/httpClient";

/**
 * Servicio de autenticación simplificado
 * Maneja el login/logout y obtención del perfil del usuario
 */
class AuthService {
  private initialized = false;

  constructor() {
    this.initialized = true;
    console.log("AuthService inicializado correctamente");
  }

  private ensureInitialized() {
    if (!this.initialized) {
      throw new Error("AuthService no está inicializado");
    }
  }


  async login(credentials: LoginRequest): Promise<User> {
    this.ensureInitialized();

    if (!credentials.email || !credentials.password) {
      throw new Error("Por favor completa todos los campos");
    }

    try {
      console.log('AuthService: Iniciando login...');
      const data = await apiFetch<{ user: User }>("/api/login_check", {
        method: "POST",
        body: credentials
      });

      if (!data || !data.user) {
        throw new Error("Respuesta inválida del servidor");
      }

      console.log('AuthService: Login exitoso, usuario:', data.user);
      return data.user;
    } catch (error: unknown) {
      console.error("AuthService: Error en login:", error);
      throw new Error((error as Error)?.message || "Error al iniciar sesión");
    }
  }

  async logout(): Promise<void> {
    this.ensureInitialized();

    try {
      await apiFetch("/api/logout", {
        method: "POST"
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      tokenService.invalidateToken();
      window.location.href = "/";
    }
  }

  async getProfile(): Promise<User> {
    this.ensureInitialized();

    try {
      return await apiFetch<User>("/api/profile", {
        method: "GET"
      });
    } catch (error) {
      console.error("AuthService: Error al obtener perfil:", error);
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<void> {
    this.ensureInitialized();
    try {
      await apiFetch("/api/register", {
        method: "POST",
        body: userData
      });
    } catch (error) {
      console.error("Error durante el registro:", error);
      throw error;
    }
  }

  async completeOnboarding(onboardingData: any): Promise<User> {
    this.ensureInitialized();
    try {
      const completeData = { ...onboardingData };
      const user = await apiFetch<User>("/api/onboarding", {
        method: "POST",
        body: completeData,
      });
      return user;
    } catch (error) {
      console.error("AuthService: Error al completar onboarding:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;
