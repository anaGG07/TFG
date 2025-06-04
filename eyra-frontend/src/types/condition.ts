
export interface Condition {
  id: number;
  name: string;
  description: string;
  isChronic: boolean;
  state: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface ConditionCreateData {
  name: string;
  description: string;
  isChronic?: boolean;
  state?: boolean;
}

export interface ConditionUpdateData {
  name?: string;
  description?: string;
  isChronic?: boolean;
  state?: boolean;
}

export interface UserCondition {
  id: number;
  user: string; // IRI
  condition: Condition;
  startDate: string;
  endDate?: string | null;
  notes?: string | null;
  state: boolean;
  createdAt: string;
  updatedAt: string | null;
}

// ! 01/06/2025 - Tipos para respuestas de la API
export interface ConditionListResponse {
  conditions: Condition[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ConditionSearchResponse {
  conditions: Condition[];
}
