import { apiFetch, configureAuthHandlers } from "../utils/httpClient";
import { API_ROUTES, API_URL } from "../config/apiRoutes";
import { LoginRequest, LoginResponse } from "../types/api";
import { RegisterRequest } from "../types/api";
import { User } from "../types/domain";
import { tokenService } from "./tokenService";

/**
 * Servicio de autenticación mejorado con manejo de errores y
 * soluciones para problemas de conectividad
 */
class AuthService {
  private initialized = false;

  constructor() {
    configureAuthHandlers({
      onUnauthorized: () => this.handleUnauthorized(),
      onLogout: () => this.logout(),
    });

    this.initialized = true;
    console.log("AuthService inicializado correctamente");
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error("AuthService no está inicializado correctamente");
    }
  }

  private handleUnauthorized(): void {
    window.location.href = "/login";
  }

  async register(userData: RegisterRequest): Promise<void> {
    this.ensureInitialized();

    try {
      const emailExists = await this.checkEmailExists(userData.email);
      if (emailExists) throw new Error("Email en uso");

      const registerUrl = this.getRegisterUrl();
      await apiFetch<{ message: string }>(registerUrl, {
        method: "POST",
        body: userData,
      });
    } catch (err) {
      console.error("Error durante el registro:", err);
      throw err;
    }
  }

  async login(credentials: LoginRequest): Promise<User> {
    this.ensureInitialized();

    if (!credentials.email || !credentials.password) {
      throw new Error("Por favor completa todos los campos");
    }

    try {
      const response = await apiFetch<LoginResponse>(API_ROUTES.AUTH.LOGIN, {
        method: "POST",
        body: credentials,
      });

      if (!response || !response.user) {
        throw new Error("Credenciales incorrectas o respuesta inválida");
      }

      return response.user;
    } catch (error: unknown) {
      console.error("Error en login:", error);
      throw new Error((error as Error)?.message || "Error al iniciar sesión");
    }
  }

  async logout(): Promise<void> {
    this.ensureInitialized();

    try {
      await apiFetch(API_ROUTES.AUTH.LOGOUT, { method: "POST" });
    } catch (e) {
      console.warn("Error al hacer logout en el servidor");
    }
  }

  async getProfile(
    options: { skipRedirectCheck?: boolean } = {}
  ): Promise<User> {
    this.ensureInitialized();

    try {
      return await apiFetch<User>(API_ROUTES.AUTH.PROFILE, {
        method: "GET",
        skipRedirectCheck: options.skipRedirectCheck,
      });
    } catch (error) {
      console.error("Error al obtener perfil:", error);
      throw error;
    }
  }

  async updateProfile(profileData: Partial<User>): Promise<User> {
    this.ensureInitialized();

    try {
      const response: { user: User } = await apiFetch<{ user: User }>(
        API_ROUTES.AUTH.PROFILE,
        {
          method: "PUT",
          body: profileData,
        }
      );
      return response.user;
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      throw error;
    }
  }

  async completeOnboarding(onboardingData: any): Promise<User> {
    this.ensureInitialized();

    const completeData = {
      ...onboardingData,
      onboardingCompleted: true,
    };

    try {
      console.log('AuthService: Iniciando petición onboarding');
      console.log('AuthService: URL:', API_ROUTES.AUTH.ONBOARDING);
      console.log('AuthService: Datos:', JSON.stringify(completeData, null, 2));
      
      // Verificar que tenemos un token válido antes de hacer la petición
      const hasValidToken = await tokenService.checkAndRefreshToken();
      if (!hasValidToken) {
        console.error('AuthService: No hay token válido para la petición');
        throw new Error("No hay usuario autenticado");
      }
      
      const response = await fetch(`${API_URL}${API_ROUTES.AUTH.ONBOARDING}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(completeData)
      });

      if (!response.ok) {
        console.error('AuthService: Error en respuesta:', {
          status: response.status,
          statusText: response.statusText
        });
        
        if (response.status === 401) {
          tokenService.invalidateToken();
          throw new Error("No hay usuario autenticado");
        }
        
        throw new Error(`Error al completar el onboarding: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('AuthService: Respuesta del servidor:', data);

      if (!data || !data.user) {
        console.error('AuthService: Respuesta inválida del servidor');
        throw new Error("No se pudo completar el onboarding correctamente");
      }

      return data.user;
    } catch (error) {
      console.error("AuthService: Error al completar onboarding:", error);
      if (error instanceof Error) {
        console.log('AuthService: Tipo de error:', error.name);
        console.log('AuthService: Mensaje:', error.message);
        console.log('AuthService: Stack:', error.stack);
      }
      throw error;
    }
  }

  private getRegisterUrl(): string {
    const configuredUrl = API_ROUTES.AUTH.REGISTER;
    if (!configuredUrl || configuredUrl.includes("undefined")) {
      const baseUrl = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
      return `${baseUrl}/register`;
    }
    return configuredUrl;
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const existing = ["test@example.com", "admin@eyra.com"];
    return existing.includes(email.toLowerCase());
  }

}

export const authService = new AuthService();
export default authService;
