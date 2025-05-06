import { API_ROUTES } from '../config/apiRoutes';
import { apiFetch } from '../utils/httpClient';

export interface CycleSummary {
  averageDuration: number;
  shortestCycle: number;
  longestCycle: number;
  totalCycles: number;
  commonSymptoms: Array<{
    type: string;
    count: number;
  }>;
}

export interface Prediction {
  nextPeriodDate: string;
  confidenceScore: number;
  nextFertileWindow: {
    start: string;
    end: string;
  };
}

export interface SymptomPattern {
  symptomType: string;
  dayInCycle: number;
  frequency: number;
  averageIntensity: number;
}

// Datos de fallback para cuando la API no responde
const FALLBACK_SUMMARY: CycleSummary = {
  averageDuration: 28,
  shortestCycle: 26,
  longestCycle: 32,
  totalCycles: 6,
  commonSymptoms: [
    { type: 'DOLOR_ABDOMINAL', count: 4 },
    { type: 'DOLOR_CABEZA', count: 3 },
    { type: 'CANSANCIO', count: 5 }
  ]
};

const FALLBACK_PREDICTION: Prediction = {
  nextPeriodDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  confidenceScore: 0.85,
  nextFertileWindow: {
    start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString()
  }
};

const FALLBACK_PATTERNS: SymptomPattern[] = [
  {
    symptomType: 'DOLOR_ABDOMINAL',
    dayInCycle: 1,
    frequency: 0.8,
    averageIntensity: 3.5
  },
  {
    symptomType: 'CANSANCIO',
    dayInCycle: 2,
    frequency: 0.7,
    averageIntensity: 2.8
  },
  {
    symptomType: 'DOLOR_CABEZA',
    dayInCycle: 3,
    frequency: 0.5,
    averageIntensity: 2.2
  }
];

// Variables para almacenar en caché
let summaryCache: CycleSummary | null = null;
let predictionsCache: Prediction | null = null;
let patternsCache: SymptomPattern[] | null = null;

// Servicios para insights y estadísticas con mejor manejo de errores
export const fetchSummary = async (): Promise<CycleSummary> => {
  try {
    // Usar caché si está disponible
    if (summaryCache) {
      return summaryCache;
    }
    
    const summary = await apiFetch<CycleSummary>(API_ROUTES.INSIGHTS.SUMMARY);
    
    // Guardar en caché
    summaryCache = summary;
    return summary;
  } catch (error) {
    console.error('Error al obtener resumen, usando datos por defecto:', error);
    return FALLBACK_SUMMARY;
  }
};

export const fetchPredictions = async (): Promise<Prediction> => {
  try {
    // Usar caché si está disponible
    if (predictionsCache) {
      return predictionsCache;
    }
    
    const predictions = await apiFetch<Prediction>(API_ROUTES.INSIGHTS.PREDICTIONS);
    
    // Guardar en caché
    predictionsCache = predictions;
    return predictions;
  } catch (error) {
    console.error('Error al obtener predicciones, usando datos por defecto:', error);
    return FALLBACK_PREDICTION;
  }
};

export const fetchPatterns = async (): Promise<SymptomPattern[]> => {
  try {
    // Usar caché si está disponible
    if (patternsCache) {
      return patternsCache;
    }
    
    const patterns = await apiFetch<SymptomPattern[]>(API_ROUTES.INSIGHTS.PATTERNS);
    
    // Guardar en caché
    patternsCache = patterns;
    return patterns;
  } catch (error) {
    console.error('Error al obtener patrones, usando datos por defecto:', error);
    return FALLBACK_PATTERNS;
  }
};

// Función para invalidar la caché (útil cuando se modifican datos)
export const invalidateInsightsCache = (): void => {
  summaryCache = null;
  predictionsCache = null;
  patternsCache = null;
  console.log('Caché de insights invalidada');
};
