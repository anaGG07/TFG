import { useState, useEffect } from "react";
import {
  trackingService,
  Companion,
  Following,
  Invitation,
} from "../services/trackingService";
import { notificationService } from "../services/notificationService";

export const useTracking = () => {
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [following, setFollowing] = useState<Following[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTrackingData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        companionsData,
        followingData,
        invitationsData,
        notificationCount,
      ] = await Promise.all([
        trackingService.getCompanions().catch((err) => {
          console.warn("Error cargando companions:", err);
          return [];
        }),
        trackingService.getFollowing().catch((err) => {
          console.warn("Error cargando following:", err);
          return [];
        }),
        trackingService.getInvitations().catch((err) => {
          console.warn("Error cargando invitations:", err);
          return [];
        }),
        notificationService.getUnreadCount().catch((err) => {
          console.warn("Error cargando notifications:", err);
          return 0;
        }),
      ]);

      setCompanions(companionsData);
      setFollowing(followingData);
      setInvitations(invitationsData);
      setUnreadNotifications(notificationCount);
    } catch (err) {
      setError("Error al cargar datos de tracking");
      console.error("Error en useTracking:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrackingData();
  }, []);
  const createInvitation = async (data: {
    guestType: "partner" | "parental" | "friend" | "healthcare_provider";
    accessPermissions: string[];
    expirationHours?: number;
  }) => {
    try {
      const newInvitation = await trackingService.createInvitation(data);
      // Recargar toda la lista para asegurar consistencia
      await loadTrackingData();
      return newInvitation;
    } catch (err) {
      setError("Error al crear invitación");
      throw err;
    }
  };

  const createInvitationAndSend = async (data: {
    guestType: "partner" | "parental" | "friend" | "healthcare_provider";
    accessPermissions: string[];
    expirationHours?: number;
    invitedEmail: string;
  }) => {
    try {
      const result = await trackingService.createInvitationAndSend(data);
      // Recargar toda la lista para asegurar consistencia
      await loadTrackingData();
      return result;
    } catch (err) {
      setError("Error al crear y enviar invitación");
      throw err;
    }
  };

  const revokeInvitation = async (id: string) => {
    try {
      await trackingService.revokeInvitation(id);
      setInvitations((prev) => prev.filter((inv) => inv.id !== id));
    } catch (err) {
      setError("Error al revocar invitación");
      throw err;
    }
  };

  const redeemInvitationCode = async (code: string) => {
    try {
      setError(null);
      const result = await trackingService.redeemInvitationCode(code);
      // Recargar datos para mostrar la nueva conexión
      await loadTrackingData();
      return result;
    } catch (err) {
      setError("Error al canjear código de invitación");
      console.error("Error canjeando código:", err);
      throw err;
    }
  };

  const revokeCompanion = async (id: string) => {
    try {
      await trackingService.revokeCompanion(id);
      setCompanions((prev) => prev.filter((comp) => comp.id !== id));
    } catch (err) {
      setError("Error al revocar acompañante");
      throw err;
    }
  };

  return {
    companions,
    following,
    invitations,
    unreadNotifications,
    loading,
    error,
    refresh: loadTrackingData,
    createInvitation,
    createInvitationAndSend,
    revokeInvitation,
    revokeCompanion,
    redeemInvitationCode,
  };
};
