import { User } from './domain';

// Respuestas genéricas de la API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
}

// Autenticación
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  expiresAt?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  name: string;
  lastName: string;
  genderIdentity?: string;
  birthDate?: string;
  profileType?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
}

// Ciclo menstrual
export interface CreateCycleRequest {
  startDate: string;
}

export interface PredictionResponse {
  success: boolean;
  message?: string;
  expectedStartDate?: string;
  expectedEndDate?: string;
  cycleLength?: number;
  periodDuration?: number;
  confidence?: number;
  basedOnCycles?: number;
}

// Recomendaciones
export interface RecommendationsResponse {
  success: boolean;
  currentPhase?: string;
  cycleDay?: number;
  recommendations: any[];
  message?: string;
}

// Invitaciones
export interface CreateGuestAccessRequest {
  email: string;
  accessType: 'partner' | 'parental';
  permissions: string[];
  expiresAt?: string;
}
