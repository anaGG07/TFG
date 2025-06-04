import { API_ROUTES } from "../config/apiRoutes";
import { apiFetch } from "../utils/httpClient";

export interface Companion {
  id: string;
  name: string;
  username: string;
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
      console.log("Llamando a:", API_ROUTES.TRACKING.INVITATIONS);
      const response = await apiFetch(API_ROUTES.TRACKING.INVITATIONS, {
        method: "GET",
      }) as { codes: Invitation[] };
      console.log("Respuesta completa de invitaciones:", response);
      return response.codes || [];
    } catch (error) {
      console.error("Error obteniendo invitations:", error);
      return [];
    }
  },

  // Crear nueva invitación
  async createInvitation(data: InvitationCreateRequest): Promise<Invitation> {
    try {
      console.log("Creando invitación:", data);
      console.log("URL:", API_ROUTES.TRACKING.CREATE_INVITATION);

      const response = await apiFetch(API_ROUTES.TRACKING.CREATE_INVITATION, {
        method: "POST",
        body: data,
      }) as Invitation;

      console.log("Respuesta exitosa:", response);
      return response;
    } catch (error) {
      console.error("Error creando invitación:", error);

      // Simular creación exitosa para no bloquear la UI durante desarrollo
      return {
        id: "temp_" + Date.now(),
        code: "TEMP" + Math.random().toString(36).substr(2, 4).toUpperCase(),
        type: data.guestType,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(
          Date.now() + (data.expirationHours || 48) * 60 * 60 * 1000
        ).toISOString(),
        status: "active",
        accessPermissions: data.accessPermissions,
      };
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
      console.log("Canjeando código:", code);
      const response = await apiFetch(API_ROUTES.TRACKING.REDEEM_CODE(code), {
        method: "POST",
      });
      console.log("Código canjeado exitosamente:", response);
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
