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
    
    // Validar que la respuesta sea un array
    if (!Array.isArray(response)) {
      console.warn('getSymptomHistory: Response is not an array:', response);
      return [];
    }
    
    return response;
  } catch (error: any) {
    console.error('Error al obtener historial de síntomas:', error);
    
    // Si es un error 404, devolver array vacío (endpoint no implementado)
    if (error?.message?.includes('404')) {
      console.info('Symptoms history endpoint not yet implemented, returning empty array');
      return [];
    }
    
    throw error;
  }
};

export const getSymptomPatterns = async (userId: string): Promise<SymptomPattern[]> => {
  try {
    const response = await apiFetch<SymptomPattern[]>(API_ROUTES.SYMPTOMS.PATTERNS, {
      method: 'GET',
      params: { userId },
    });
    
    // Validar que la respuesta sea un array
    if (!Array.isArray(response)) {
      console.warn('getSymptomPatterns: Response is not an array:', response);
      return [];
    }
    
    return response;
  } catch (error: any) {
    console.error('Error al obtener patrones de síntomas:', error);
    
    // Si es un error 404, devolver array vacío (endpoint no implementado)
    if (error?.message?.includes('404')) {
      console.info('Symptoms patterns endpoint not yet implemented, returning empty array');
      return [];
    }
    
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
    const response = await apiFetch<SymptomLog>(API_ROUTES.SYMPTOMS.UPDATE(symptomId), {
      method: 'PATCH',
      body: { intensity },
    });
    return response;
  } catch (error) {
    console.error('Error al actualizar intensidad del síntoma:', error);
    throw error;
  }
};
