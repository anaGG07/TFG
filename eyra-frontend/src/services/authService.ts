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

    // Asegurar que los campos requeridos estén presentes
    const requiredFields = ['genderIdentity', 'stageOfLife', 'profileType'];
    for (const field of requiredFields) {
      if (!onboardingData[field] || (typeof onboardingData[field] === 'string' && !onboardingData[field].trim())) {
        console.error(`AuthService: Campo requerido faltante: ${field}`);
        throw new Error(`El campo ${field} es obligatorio`);
      }
    }

    const completeData = {
      ...onboardingData,
    };

    try {
      console.log('AuthService: Iniciando petición onboarding');
      console.log('AuthService: Datos completos enviados:', JSON.stringify(completeData, null, 2));
      
      // Verificar campos requeridos
      const missingRequiredFields = [];
      if (!completeData.profileType) missingRequiredFields.push('profileType');
      if (!completeData.genderIdentity) missingRequiredFields.push('genderIdentity');
      if (!completeData.stageOfLife) missingRequiredFields.push('stageOfLife');
      
      if (missingRequiredFields.length > 0) {
        console.error('AuthService: Faltan campos requeridos:', missingRequiredFields);
      }
      
      // Verificar que tenemos un token válido antes de hacer la petición
      const hasValidToken = await tokenService.checkToken();
      if (!hasValidToken) {
        console.error('AuthService: No hay token válido para la petición');
        throw new Error("No hay usuario autenticado");
      }
      
      console.log('AuthService: URL completa para onboarding:', `${API_URL}/api/onboarding`);
      console.log('AuthService: Datos enviados:', JSON.stringify(completeData, null, 2));
      
      const response = await fetch(`${API_URL}/api/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(completeData)
      });

      console.log('AuthService: Respuesta HTTP recibida:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        console.error('AuthService: Error en respuesta:', {
          status: response.status,
          statusText: response.statusText
        });
        
        let errorContent = 'No se pudo obtener contenido de error';
        try {
          // Intentar obtener el cuerpo completo de la respuesta para más detalles
          const errorText = await response.text();
          console.error('AuthService: Contenido completo del error:', errorText);
          try {
            // Intentar parsearlo como JSON
            const errorJson = JSON.parse(errorText);
            console.error('AuthService: Detalles JSON del error:', errorJson);
            errorContent = JSON.stringify(errorJson);
          } catch (e) {
            // Si no es JSON, usar el texto como está
            errorContent = errorText;
          }
        } catch (e) {
          console.error('AuthService: No se pudo leer el contenido del error');
        }
        
        // Si es error de autenticación, tratarlo especialmente
        if (response.status === 401) {
          tokenService.invalidateToken();
          throw new Error("No hay usuario autenticado");
        }
        
        throw new Error(`Error al completar el onboarding: ${response.statusText}\nDetalle: ${errorContent}`);
      }

      // Intentar parsear la respuesta como JSON
      try {
        const data = await response.json();
        console.log('AuthService: Respuesta del servidor:', data);

        if (!data || !data.user) {
          console.error('AuthService: Respuesta inválida del servidor');
          throw new Error("No se pudo completar el onboarding correctamente");
        }

        return data.user;
      } catch (jsonError) {
        console.error('AuthService: Error al parsear la respuesta JSON:', jsonError);
        // Intentar capturar el texto de la respuesta si no es JSON válido
        try {
          const textResponse = await response.text();
          console.error('AuthService: Respuesta de texto:', textResponse);
          throw new Error('Error al procesar la respuesta del servidor: ' + textResponse);
        } catch (e) {
          throw new Error('Error al procesar la respuesta del servidor');
        }
      }
    } catch (error: any) {
      console.error("AuthService: Error al completar onboarding:", error);
      
      // Corregir el manejo de errores para verificar si es un error de autenticación
      if (error.message === "No hay usuario autenticado") {
        throw error; // Rethrow el error original
      }
      
      throw error; // Propagar cualquier otro error
    }
  }
}

export const authService = new AuthService();
export default authService;
