import { API_ROUTES } from "../config/apiRoutes";
import { apiFetch } from "../utils/httpClient";

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  priority: "high" | "normal" | "low";
  createdAt: string;
  readAt?: string;
  scheduledFor?: string;
  context?: string;
  targetUserType?: string;
  relatedEntityType?: string;
  relatedEntityId?: number;
  actionUrl?: string;
  actionText?: string;
  metadata?: any[];
  dismissed?: boolean;
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
      method: "POST",
    });
  },

  // Marcar todas como leídas
  async markAllAsRead(): Promise<void> {
    return apiFetch(API_ROUTES.NOTIFICATIONS.READ_ALL, {
      method: "POST",
    });
  },
};
