import { useEffect, useState } from 'react';
import { CycleSummary, Prediction, SymptomPattern, fetchSummary, fetchPredictions, fetchPatterns } from '../services/insightService';

interface UseInsightsResult {
  summary: CycleSummary | null;
  predictions: Prediction | null;
  patterns: SymptomPattern[];
  isLoading: boolean;
  error: string | null;
}

export const useInsights = (): UseInsightsResult => {
  const [summary, setSummary] = useState<CycleSummary | null>(null);
  const [predictions, setPredictions] = useState<Prediction | null>(null);
  const [patterns, setPatterns] = useState<SymptomPattern[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [summaryData, predictionData, patternData] = await Promise.all([
          fetchSummary(),
          fetchPredictions(),
          fetchPatterns()
        ]);

        setSummary(summaryData);
        setPredictions(predictionData);
        setPatterns(patternData);
      } catch (err: any) {
        console.error('Error al cargar insights:', err);
        setError(err.message || 'Error desconocido al cargar insights');
      } finally {
        setIsLoading(false);
      }
    };

    loadInsights();
  }, []);

  return {
    summary,
    predictions,
    patterns,
    isLoading,
    error
  };
};
