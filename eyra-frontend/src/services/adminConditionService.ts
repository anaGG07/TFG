// ! 01/06/2025 - Servicio de administración para CRUD de condiciones médicas
// ! 01/06/2025 - Eliminada función getConditionCategories() (endpoint no implementado en backend)

import {
  Condition,
  ConditionCreateData,
  ConditionUpdateData,
  ConditionSearchResponse,
} from "../types/condition";
import { API_ROUTES } from "../config/apiRoutes";
import { apiFetch } from "../utils/httpClient";

export interface AdminConditionListParams {
  limit?: number;
  page?: number;
  search?: string;
  state?: boolean;
}

export interface AdminConditionListResponse {
  conditions: Condition[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const adminConditionService = {
  /**
   * Listar todas las condiciones (activas e inactivas)
   */
  async listConditions(): Promise<Condition[]> {
    return apiFetch(API_ROUTES.ADMIN.CONDITIONS.LIST, {
      method: "GET",
    }) as Promise<Condition[]>;
  },

  /**
   * Obtener condiciones activas solamente
   */
  async getActiveConditions(): Promise<Condition[]> {
    return apiFetch(API_ROUTES.CONDITIONS.USER.ACTIVE, {
      method: "GET",
    }) as Promise<Condition[]>;
  },

  /**
   * Obtener condición específica por ID
   */
  async getConditionById(id: string): Promise<Condition> {
    return apiFetch(API_ROUTES.ADMIN.CONDITIONS.GET(id), {
      method: "GET",
    }) as Promise<Condition>;
  },

  /**
   * Crear nueva condición médica
   */
  async createCondition(data: ConditionCreateData): Promise<Condition> {
    return apiFetch(API_ROUTES.ADMIN.CONDITIONS.CREATE, {
      method: "POST",
      body: data,
    }) as Promise<Condition>;
  },

  /**
   * Actualizar condición existente
   */
  async updateCondition(
    id: string,
    data: ConditionUpdateData
  ): Promise<Condition> {
    return apiFetch(API_ROUTES.ADMIN.CONDITIONS.UPDATE(id), {
      method: "PUT",
      body: data,
    }) as Promise<Condition>;
  },

  /**
   * Eliminar condición (puede ser soft o hard delete dependiendo del backend)
   */
  async deleteCondition(
    id: string
  ): Promise<{ message: string; activeUsers?: number }> {
    return apiFetch(API_ROUTES.ADMIN.CONDITIONS.DELETE(id), {
      method: "DELETE",
    }) as Promise<{ message: string; activeUsers?: number }>;
  },

  /**
   * Buscar condiciones por nombre o descripción
   */
  async searchConditions(query: string): Promise<Condition[]> {
    const searchParams = new URLSearchParams({ query });
    const url = `${
      API_ROUTES.ADMIN.CONDITIONS.SEARCH
    }?${searchParams.toString()}`;
    return apiFetch(url, {
      method: "GET",
    }) as Promise<Condition[]>;
  },

  /**
   * Alternar el estado (activo/inactivo) de una condición
   */
  async toggleConditionState(
    id: string,
    newState: boolean
  ): Promise<Condition> {
    return apiFetch(API_ROUTES.ADMIN.CONDITIONS.UPDATE(id), {
      method: "PUT",
      body: { state: newState },
    }) as Promise<Condition>;
  },
};
