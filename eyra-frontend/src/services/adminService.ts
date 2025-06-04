// ! 31/05/2025 - Servicio de administración para CRUD de usuarios

import { User } from "../types/user";
import { API_ROUTES } from "../config/apiRoutes";
import { apiFetch } from "../utils/httpClient";

export interface AdminUserListParams {
  limit?: number;
  page?: number;
  role?: string;
  profileType?: string;
  search?: string;
}

export interface AdminUserListResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminUserUpdateData {
  email?: string;
  username?: string;
  name?: string;
  lastName?: string;
  profileType?: string;
  birthDate?: string;
  roles?: string[];
  state?: boolean;
  onboardingCompleted?: boolean;
  password?: string;
  avatar?: any;
}

export const adminService = {
  /**
   * Listar usuarios con filtros y paginación
   */
  async listUsers(
    params: AdminUserListParams = {}
  ): Promise<AdminUserListResponse> {
    const searchParams = new URLSearchParams();

    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.role) searchParams.append("role", params.role);
    if (params.profileType)
      searchParams.append("profileType", params.profileType);
    if (params.search) searchParams.append("search", params.search);

    const url = `${API_ROUTES.ADMIN.USERS.LIST}?${searchParams.toString()}`;
    return apiFetch(url);
  },

  /**
   * Obtener usuario específico por ID
   */
  async getUserById(id: string): Promise<User> {
    return apiFetch(API_ROUTES.ADMIN.USERS.GET(id));
  },

  /**
   * Actualizar usuario
   */
  async updateUser(id: string, data: AdminUserUpdateData): Promise<User> {
    const body = {
      ...data,
      avatar:
        data.avatar && typeof data.avatar === "object"
          ? JSON.stringify(data.avatar)
          : data.avatar,
    };

    return apiFetch(API_ROUTES.ADMIN.USERS.UPDATE(id), {
      method: "PUT",
      body,
    });
  },

  /**
   * Desactivar usuario (soft delete)
   */
  async deleteUser(id: string): Promise<{ message: string }> {
    return apiFetch(API_ROUTES.ADMIN.USERS.DELETE(id), {
      method: "DELETE",
    });
  },
};
