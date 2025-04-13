import { API_ROUTES } from '../config/apiRoutes';
import { apiFetch } from '../utils/httpClient';

// Tipos de datos
export interface Cycle {
  id: string;
  startDate: string;
  endDate?: string;
  duration?: number;
  symptoms: Symptom[];
  notes?: string;
  userId: string;
}

export interface Symptom {
  id: string;
  date: string;
  type: string;
  intensity: number;
  notes?: string;
  cycleId: string;
}

// Servicios para ciclos menstruales
export const fetchAllCycles = async (): Promise<Cycle[]> => {
  return apiFetch(API_ROUTES.CYCLES.ALL);
};

export const fetchCurrentCycle = async (): Promise<Cycle> => {
  return apiFetch(API_ROUTES.CYCLES.CURRENT);
};

export const createCycle = async (cycleData: Omit<Cycle, 'id' | 'userId'>): Promise<Cycle> => {
  return apiFetch(API_ROUTES.CYCLES.CREATE, {
    method: 'POST',
    body: cycleData,
  });
};

export const updateCycle = async (id: string, cycleData: Partial<Cycle>): Promise<Cycle> => {
  return apiFetch(API_ROUTES.CYCLES.UPDATE(id), {
    method: 'PUT',
    body: cycleData,
  });
};

export const deleteCycle = async (id: string): Promise<void> => {
  return apiFetch(API_ROUTES.CYCLES.DELETE(id), {
    method: 'DELETE',
  });
};

// Servicios para síntomas
export const fetchAllSymptoms = async (): Promise<Symptom[]> => {
  return apiFetch(API_ROUTES.SYMPTOMS.ALL);
};

export const createSymptom = async (symptomData: Omit<Symptom, 'id'>): Promise<Symptom> => {
  return apiFetch(API_ROUTES.SYMPTOMS.CREATE, {
    method: 'POST',
    body: symptomData,
  });
};

export const updateSymptom = async (id: string, symptomData: Partial<Symptom>): Promise<Symptom> => {
  return apiFetch(API_ROUTES.SYMPTOMS.UPDATE(id), {
    method: 'PUT',
    body: symptomData,
  });
};

export const deleteSymptom = async (id: string): Promise<void> => {
  return apiFetch(API_ROUTES.SYMPTOMS.DELETE(id), {
    method: 'DELETE',
  });
};
