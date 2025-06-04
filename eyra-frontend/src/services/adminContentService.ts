import { Content, ContentType } from "../types/domain";
import { API_ROUTES } from "../config/apiRoutes";
import { apiFetch } from "../utils/httpClient";

export const adminContentService = {
  // Listar todo el contenido
  listContent: async (): Promise<Content[]> => {
    return apiFetch(API_ROUTES.ADMIN.CONTENT.LIST);
  },

  // Obtener un contenido específico
  getContent: async (id: string): Promise<Content> => {
    return apiFetch(API_ROUTES.ADMIN.CONTENT.GET(id));
  },

  // Crear nuevo contenido
  createContent: async (content: Omit<Content, "id">): Promise<Content> => {
    return apiFetch(API_ROUTES.ADMIN.CONTENT.CREATE, {
      method: "POST",
      body: content,
    });
  },

  // Actualizar contenido existente
  updateContent: async (
    id: string,
    content: Partial<Content>
  ): Promise<Content> => {
    return apiFetch(API_ROUTES.ADMIN.CONTENT.UPDATE(id), {
      method: "PUT",
      body: content,
    });
  },

  // Eliminar contenido (soft delete)
  deleteContent: async (id: string): Promise<void> => {
    return apiFetch(API_ROUTES.ADMIN.CONTENT.DELETE(id), {
      method: "DELETE",
    });
  },

  // Activar/desactivar contenido
  toggleContentState: async (id: string, state: boolean): Promise<Content> => {
    return apiFetch(API_ROUTES.ADMIN.CONTENT.UPDATE(id), {
      method: "PATCH",
      body: { state },
    });
  },
};
