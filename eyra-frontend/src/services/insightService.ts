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

// Servicios para insights y estadísticas
export const fetchSummary = async (): Promise<CycleSummary> => {
  return apiFetch(API_ROUTES.INSIGHTS.SUMMARY);
};

export const fetchPredictions = async (): Promise<Prediction> => {
  return apiFetch(API_ROUTES.INSIGHTS.PREDICTIONS);
};

export const fetchPatterns = async (): Promise<SymptomPattern[]> => {
  return apiFetch(API_ROUTES.INSIGHTS.PATTERNS);
};
