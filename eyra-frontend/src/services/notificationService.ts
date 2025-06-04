import { API_ROUTES } from "../config/apiRoutes";
import { apiFetch } from "../utils/httpClient";

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  priority: "high" | "normal" | "low";
  createdAt: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
}

export const notificationService = {
  // Obtener todas las notificaciones
  async getNotifications(): Promise<Notification[]> {
    return apiFetch(API_ROUTES.NOTIFICATIONS.ALL, {
      method: "GET",
    });
  },

  // Obtener notificaciones no leídas
  async getUnreadNotifications(): Promise<Notification[]> {
    return apiFetch(API_ROUTES.NOTIFICATIONS.UNREAD, {
      method: "GET",
    });
  },

  // Obtener contador de notificaciones no leídas
  async getUnreadCount(): Promise<number> {
    const response = await apiFetch(API_ROUTES.NOTIFICATIONS.COUNT, {
      method: "GET",
    }) as { count: number };
    return response.count || 0;
  },
  // Marcar notificación como leída
  async markAsRead(id: string): Promise<void> {
    return apiFetch(API_ROUTES.NOTIFICATIONS.READ(id), {
      method: "PUT",
    });
  },

  // Marcar todas como leídas
  async markAllAsRead(): Promise<void> {
    return apiFetch(API_ROUTES.NOTIFICATIONS.READ_ALL, {
      method: "PUT",
    });
  },
};
