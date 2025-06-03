import { API_ROUTES } from '../config/apiRoutes';
import { apiFetch } from '../utils/httpClient';

export interface SymptomLog {
  id: string;
  date: string;
  symptom: string;
  intensity: number;
  notes?: string;
  entity: 'menstrual_cycle' | 'pregnancy' | 'menopause' | 'hormone_therapy' | 'other';
}

export interface SymptomPattern {
  symptomType: string;
  dayInCycle: number;
  frequency: number;
  averageIntensity: number;
}

export const getSymptomHistory = async (userId: string, startDate: string, endDate: string): Promise<SymptomLog[]> => {
  try {
    const response = await apiFetch<SymptomLog[]>(API_ROUTES.SYMPTOMS.HISTORY, {
      method: 'GET',
      params: { userId, startDate, endDate },
    });
    return response;
  } catch (error) {
    console.error('Error al obtener historial de síntomas:', error);
    throw error;
  }
};

export const getSymptomPatterns = async (userId: string): Promise<SymptomPattern[]> => {
  try {
    const response = await apiFetch<SymptomPattern[]>(API_ROUTES.SYMPTOMS.PATTERNS, {
      method: 'GET',
      params: { userId },
    });
    return response;
  } catch (error) {
    console.error('Error al obtener patrones de síntomas:', error);
    throw error;
  }
};

export const createSymptomLog = async (symptomData: Omit<SymptomLog, 'id'>): Promise<SymptomLog> => {
  try {
    const response = await apiFetch<SymptomLog>(API_ROUTES.SYMPTOMS.CREATE, {
      method: 'POST',
      body: symptomData,
    });
    return response;
  } catch (error) {
    console.error('Error al crear registro de síntoma:', error);
    throw error;
  }
};

export const updateSymptomIntensity = async (symptomId: string, intensity: number): Promise<SymptomLog> => {
  try {
    const response = await apiFetch<SymptomLog>(`${API_ROUTES.SYMPTOMS.UPDATE}/${symptomId}`, {
      method: 'PATCH',
      body: { intensity },
    });
    return response;
  } catch (error) {
    console.error('Error al actualizar intensidad del síntoma:', error);
    throw error;
  }
}; 