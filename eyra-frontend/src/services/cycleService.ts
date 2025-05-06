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

// Mock data para situaciones donde la API falla
const MOCK_CYCLES: Cycle[] = [
  {
    id: 'mock-1',
    startDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 6,
    symptoms: [],
    userId: '1',
    notes: 'Ciclo simulado para modo fallback'
  },
  {
    id: 'mock-2',
    startDate: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 6,
    symptoms: [],
    userId: '1'
  }
];

const MOCK_CURRENT_CYCLE: Cycle = {
  id: 'current-mock',
  startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  symptoms: [],
  userId: '1',
  notes: 'Ciclo actual simulado para modo fallback'
};

// Variable para almacenar en caché los ciclos
let cyclesCache: Cycle[] | null = null;
let currentCycleCache: Cycle | null = null;

// Servicios para ciclos menstruales con manejo de errores mejorado
export const fetchAllCycles = async (): Promise<Cycle[]> => {
  try {
    // Si hay cache y no ha pasado mucho tiempo, usarla
    if (cyclesCache) {
      return cyclesCache;
    }
    
    const cycles = await apiFetch<Cycle[]>(API_ROUTES.CYCLES.ALL);
    
    // Guardar en caché
    cyclesCache = cycles;
    return cycles;
  } catch (error) {
    console.error('Error al obtener ciclos, usando datos simulados:', error);
    return MOCK_CYCLES;
  }
};

export const fetchCurrentCycle = async (): Promise<Cycle> => {
  try {
    // Si hay cache, usarla
    if (currentCycleCache) {
      return currentCycleCache;
    }
    
    const cycle = await apiFetch<Cycle>(API_ROUTES.CYCLES.CURRENT);
    
    // Guardar en caché
    currentCycleCache = cycle;
    return cycle;
  } catch (error) {
    console.error('Error al obtener ciclo actual, usando datos simulados:', error);
    return MOCK_CURRENT_CYCLE;
  }
};

export const createCycle = async (cycleData: Omit<Cycle, 'id' | 'userId'>): Promise<Cycle> => {
  try {
    const newCycle = await apiFetch<Cycle>(API_ROUTES.CYCLES.CREATE, {
      method: 'POST',
      body: cycleData,
    });
    
    // Invalidar cache
    cyclesCache = null;
    currentCycleCache = null;
    
    return newCycle;
  } catch (error) {
    console.error('Error al crear ciclo:', error);
    throw error;
  }
};

export const updateCycle = async (id: string, cycleData: Partial<Cycle>): Promise<Cycle> => {
  try {
    const updatedCycle = await apiFetch<Cycle>(API_ROUTES.CYCLES.UPDATE(id), {
      method: 'PUT',
      body: cycleData,
    });
    
    // Invalidar cache
    cyclesCache = null;
    currentCycleCache = null;
    
    return updatedCycle;
  } catch (error) {
    console.error('Error al actualizar ciclo:', error);
    throw error;
  }
};

export const deleteCycle = async (id: string): Promise<void> => {
  try {
    await apiFetch<void>(API_ROUTES.CYCLES.DELETE(id), {
      method: 'DELETE',
    });
    
    // Invalidar cache
    cyclesCache = null;
    currentCycleCache = null;
  } catch (error) {
    console.error('Error al eliminar ciclo:', error);
    throw error;
  }
};

// Servicios para síntomas con manejo de errores mejorado
export const fetchAllSymptoms = async (): Promise<Symptom[]> => {
  try {
    return await apiFetch<Symptom[]>(API_ROUTES.SYMPTOMS.ALL);
  } catch (error) {
    console.error('Error al obtener síntomas:', error);
    return [];
  }
};

export const createSymptom = async (symptomData: Omit<Symptom, 'id'>): Promise<Symptom> => {
  try {
    const newSymptom = await apiFetch<Symptom>(API_ROUTES.SYMPTOMS.CREATE, {
      method: 'POST',
      body: symptomData,
    });
    
    // Invalidar cache ya que los síntomas afectan a los ciclos
    cyclesCache = null;
    currentCycleCache = null;
    
    return newSymptom;
  } catch (error) {
    console.error('Error al crear síntoma:', error);
    throw error;
  }
};

export const updateSymptom = async (id: string, symptomData: Partial<Symptom>): Promise<Symptom> => {
  try {
    const updatedSymptom = await apiFetch<Symptom>(API_ROUTES.SYMPTOMS.UPDATE(id), {
      method: 'PUT',
      body: symptomData,
    });
    
    // Invalidar cache ya que los síntomas afectan a los ciclos
    cyclesCache = null;
    currentCycleCache = null;
    
    return updatedSymptom;
  } catch (error) {
    console.error('Error al actualizar síntoma:', error);
    throw error;
  }
};

export const deleteSymptom = async (id: string): Promise<void> => {
  try {
    await apiFetch<void>(API_ROUTES.SYMPTOMS.DELETE(id), {
      method: 'DELETE',
    });
    
    // Invalidar cache ya que los síntomas afectan a los ciclos
    cyclesCache = null;
    currentCycleCache = null;
  } catch (error) {
    console.error('Error al eliminar síntoma:', error);
    throw error;
  }
};
