import { API_ROUTES } from "../config/apiRoutes";
import { apiFetch } from "../utils/httpClient";

export interface Companion {
  id: string;
  name: string;
  username: string;
  avatar?: any; // Configuración del avatar del usuario
  role: "partner" | "parental" | "friend" | "healthcare_provider";
  status: "active" | "pending" | "inactive";
  lastActivity: string;
  permissions: string[];
  expiresAt?: string;
  guestPreferences?: string[];
}

export interface Following {
  id: string;
  ownerName: string;
  ownerUsername: string;
  avatar?: any; // Configuración del avatar del propietario
  role: "partner" | "parental" | "friend" | "healthcare_provider";
  lastActivity: string;
  permissions: string[];
  guestPreferences?: string[];
}

export interface Invitation {
  id: string;
  code: string;
  type: "partner" | "parental" | "friend" | "healthcare_provider";
  createdAt: string;
  expiresAt: string;
  status: "active" | "used" | "expired" | "revoked";
  accessPermissions: string[];
}

export interface InvitationCreateRequest {
  guestType: "partner" | "parental" | "friend" | "healthcare_provider";
  accessPermissions: string[];
  expirationHours?: number;
}

export const trackingService = {
  // Obtener acompañantes (personas que me siguen)
  async getCompanions(): Promise<Companion[]> {
    try {
      const companions = await apiFetch(API_ROUTES.TRACKING.COMPANIONS, {
        method: "GET",
      }) as any[];

      // Los datos ya vienen en el formato correcto del backend
      return companions.map((companion: any) => ({
        id: companion.id.toString(),
        name: companion.name,
        username: companion.username,
        avatar: companion.avatar, // Incluir avatar del companion
        role: companion.role,
        status: companion.status,
        lastActivity: companion.lastActivity,
        permissions: companion.permissions || [],
        expiresAt: companion.expiresAt,
        guestPreferences: companion.guestPreferences || [],
      }));
    } catch (error) {
      console.warn("Error obteniendo companions:", error);
      return [];
    }
  },

  // Obtener personas que sigo
  async getFollowing(): Promise<Following[]> {
    try {
      const following = await apiFetch(API_ROUTES.TRACKING.FOLLOWING, {
        method: "GET",
      }) as any[];

      // Los datos ya vienen en el formato correcto del backend
      return following.map((person: any) => ({
        id: person.id.toString(),
        ownerName: person.ownerName,
        ownerUsername: person.ownerUsername,
        avatar: person.avatar, // Incluir avatar del propietario
        role: person.role,
        lastActivity: person.lastActivity,
        permissions: person.permissions || [],
        guestPreferences: person.guestPreferences || [],
      }));
    } catch (error) {
      console.warn("Error obteniendo following:", error);
      return [];
    }
  },

  // Obtener invitaciones activas
  async getInvitations(): Promise<Invitation[]> {
    try {
      const response = await apiFetch(API_ROUTES.TRACKING.INVITATIONS, {
        method: "GET",
      }) as { codes: Invitation[] };
      return response.codes || [];
    } catch (error) {
      console.error("Error obteniendo invitations:", error);
      return [];
    }
  },

  // Crear nueva invitación
  async createInvitation(data: InvitationCreateRequest): Promise<Invitation> {
    try {
      const response = await apiFetch(API_ROUTES.TRACKING.CREATE_INVITATION, {
        method: "POST",
        body: data,
      }) as Invitation;

      return response;
    } catch (error) {
      console.error("Error creando invitación:", error);
      throw error; // Re-lanzar el error para que el componente pueda manejarlo
    }
  },

  // Crear invitación y enviar emails
  async createInvitationAndSend(data: InvitationCreateRequest & { invitedEmail: string }): Promise<{
    invitation: Invitation;
    emails: { inviterNotified: boolean; invitedNotified: boolean };
  }> {
    try {
      console.log("trackingService: Enviando petición createInvitationAndSend con datos:", data);
      
      const response = await apiFetch(API_ROUTES.TRACKING.CREATE_INVITATION_AND_SEND, {
        method: "POST",
        body: data,
      }) as {
        success: boolean;
        invitation: any;
        emails: { inviterNotified: boolean; invitedNotified: boolean };
      };
      
      console.log("trackingService: Respuesta del servidor:", response);
      
      // Mapear la respuesta al formato esperado
      const invitation: Invitation = {
        id: response.invitation.id.toString(),
        code: response.invitation.code,
        type: response.invitation.type,
        createdAt: response.invitation.createdAt,
        expiresAt: response.invitation.expiresAt,
        status: response.invitation.status,
        accessPermissions: response.invitation.accessPermissions,
      };

      return {
        invitation,
        emails: response.emails
      };
    } catch (error: any) {
      console.error("trackingService: Error detallado creando invitación con emails:", {
        error: error,
        message: error?.message,
        url: API_ROUTES.TRACKING.CREATE_INVITATION_AND_SEND,
        data: data
      });
      throw error;
    }
  },

  // Verificar código de invitación
  async verifyInvitationCode(code: string): Promise<any> {
    return apiFetch(API_ROUTES.TRACKING.VERIFY_CODE(code), {
      method: "GET",
    });
  },
  // Canjear código de invitación
  async redeemInvitationCode(code: string): Promise<any> {
    try {
      const response = await apiFetch(API_ROUTES.TRACKING.REDEEM_CODE(code), {
        method: "POST",
      });
      return response;
    } catch (error) {
      console.error("Error canjeando código:", error);
      throw error;
    }
  },

  // Revocar invitación
  async revokeInvitation(id: string): Promise<void> {
    return apiFetch(API_ROUTES.TRACKING.REVOKE_INVITATION(id), {
      method: "DELETE",
    });
  },

  // Revocar acceso de acompañante
  async revokeCompanion(id: string): Promise<void> {
    return apiFetch(API_ROUTES.TRACKING.REVOKE_COMPANION(id), {
      method: "DELETE",
    });
  },

  // Actualizar permisos de acompañante
  async updateCompanionPermissions(
    id: string,
    permissions: string[]
  ): Promise<void> {
    return apiFetch(API_ROUTES.TRACKING.UPDATE_COMPANION_PERMISSIONS(id), {
      method: "PUT",
      body: { accessTo: permissions },
    });
  },

  // Actualizar mis preferencias como invitado
  async updateMyPreferences(id: string, preferences: string[]): Promise<void> {
    return apiFetch(API_ROUTES.TRACKING.UPDATE_MY_PREFERENCES(id), {
      method: "PUT",
      body: { guestPreferences: preferences },
    });
  },

  // Obtener permisos disponibles
  async getAvailablePermissions(): Promise<string[]> {
    try {
      const response = await apiFetch(
        API_ROUTES.TRACKING.AVAILABLE_PERMISSIONS,
        {
          method: "GET",
        }
      ) as { permissions: string[] };
      return response.permissions || [];
    } catch (error) {
      console.error("Error obteniendo permisos disponibles:", error);
      // Permisos por defecto en caso de error
      return [
        "phase_menstrual",
        "phase_follicular",
        "phase_ovulation",
        "phase_luteal",
        "basic_info",
        "symptoms",
        "notes",
        "flow_details",
        "pain_levels",
        "mood_tracking",
        "predictions",
        "recommendations",
        "statistics",
      ];
    }
  },
};
