import { API_ROUTES } from "../config/apiRoutes";
import { apiFetch } from "../utils/httpClient";

export interface UserSearchResult {
  found: boolean;
  exists?: boolean; // Para búsquedas por email
  canInvite?: boolean;
  displayName?: string;
  username?: string;
  message?: string;
  isAlreadyConnected?: boolean;
}

export const userSearchService = {
  // Búsqueda por email - Solo verifica existencia y disponibilidad
  async searchByEmail(email: string): Promise<UserSearchResult> {
    try {
      console.log("Buscando usuario por email:", email);
      
      const response = await apiFetch(API_ROUTES.USER_SEARCH.BY_EMAIL, {
        method: "POST",
        body: { email },
      }) as {
        exists: boolean;
        canInvite: boolean;
        message?: string;
        isAlreadyConnected?: boolean;
      };

      return {
        found: response.exists,
        exists: response.exists,
        canInvite: response.canInvite,
        message: response.message,
        isAlreadyConnected: response.isAlreadyConnected,
      };
    } catch (error) {
      console.error("Error buscando por email:", error);
      throw new Error("Error al buscar usuario por email");
    }
  },

  // Búsqueda por username - Respeta configuración de privacidad
  async searchByUsername(username: string): Promise<UserSearchResult> {
    try {
      console.log("Buscando usuario por username:", username);
      
      // Limpiar @ si el usuario lo incluye
      const cleanUsername = username.replace(/^@/, "");
      
      const response = await apiFetch(API_ROUTES.USER_SEARCH.BY_USERNAME, {
        method: "POST",
        body: { username: cleanUsername },
      }) as {
        found: boolean;
        canInvite: boolean;
        displayName?: string;
        username?: string;
        message?: string;
        isAlreadyConnected?: boolean;
      };

      return {
        found: response.found,
        canInvite: response.canInvite,
        displayName: response.displayName,
        username: response.username,
        message: response.message,
        isAlreadyConnected: response.isAlreadyConnected,
      };
    } catch (error) {
      console.error("Error buscando por username:", error);
      throw new Error("Error al buscar usuario por nombre de usuario");
    }
  },

  // Invitar usuario encontrado (por ID interno)
  async inviteFoundUser(data: {
    searchType: "email" | "username";
    searchQuery: string;
    guestType: string;
    accessPermissions: string[];
    expirationHours: number;
  }): Promise<{
    success: boolean;
    invitation?: any;
    message?: string;
  }> {
    try {
      console.log("Invitando usuario encontrado:", data);
      
      const response = await apiFetch(API_ROUTES.USER_SEARCH.INVITE_USER, {
        method: "POST",
        body: data,
      }) as {
        success: boolean;
        invitation?: any;
        message?: string;
      };

      return response;
    } catch (error) {
      console.error("Error invitando usuario encontrado:", error);
      throw new Error("Error al enviar invitación al usuario");
    }
  },
};
