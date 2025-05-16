import { API_URL } from "../config/apiRoutes";
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
      window.location.href = "/login";
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

    const completeData = {
      ...onboardingData,
      onboardingCompleted: true,
    };

    try {
      console.log('AuthService: Iniciando petición onboarding');
      
      // Verificar que tenemos un token válido antes de hacer la petición
      const hasValidToken = await tokenService.checkToken();
      if (!hasValidToken) {
        console.error('AuthService: No hay token válido para la petición');
        throw new Error("No hay usuario autenticado");
      }
      
      const response = await fetch(`${API_URL}/api/onboarding`, {
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
    } catch (error: any) {
      console.error("AuthService: Error al completar onboarding:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;
