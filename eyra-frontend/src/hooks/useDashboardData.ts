// C:\Users\Ana\Desktop\Curso\Proyecto\EYRA\eyra-frontend\src\hooks\useDashboardData.ts
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../utils/httpClient";
import { API_ROUTES } from "../config/apiRoutes";

// Interfaces para los datos del dashboard
export interface CycleData {
  id: number;
  phase: string;
  cycleId: string;
  startDate: string;
  endDate?: string;
  estimatedNextStart: string;
  averageCycleLength: number;
  averageDuration: number;
  cycleDays?: Array<{
    id: number;
    date: string;
    dayNumber: number;
  }>;
}

export interface TodayData {
  id: number;
  date: string;
  dayNumber: number;
  cyclePhase: {
    id: number;
    phase: string;
  };
  symptoms: any[];
  notes: any[];
  mood: any[];
  flowIntensity: string | null;
}

export interface CycleStatistics {
  cyclesAnalyzed: number;
  averageCycleLength: number;
  averagePeriodLength: number;
  longestCycle: {
    id: number;
    startDate: string;
    length: number;
  };
  shortestCycle: {
    id: number;
    startDate: string;
    length: number;
  };
  regularity: number;
  cycleLengthVariation: number;
  monthsAnalyzed: number;
}

export interface NotificationData {
  total: number;
  unread: number;
  highPriority: number;
}

export interface InsightsSummary {
  success: boolean;
  currentPhase: string;
  cycleDay: number;
  recommendations: string[];
}

export interface DashboardData {
  currentCycle: CycleData | null;
  todayData: TodayData | null;
  statistics: CycleStatistics | null;
  notifications: NotificationData;
  insights: InsightsSummary | null;
  isLoading: boolean;
  error: string | null;
}

export const useDashboardData = () => {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<DashboardData>({
    currentCycle: null,
    todayData: null,
    statistics: null,
    notifications: { total: 0, unread: 0, highPriority: 0 },
    insights: null,
    isLoading: true,
    error: null,
  });

  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setData((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    setData((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // SOLO ejecutar las llamadas que funcionan correctamente
      const [
        currentCycleResponse,
        todayResponse,
        statisticsResponse,
        insightsResponse,
      ] = await Promise.allSettled([
        apiFetch<CycleData>(API_ROUTES.CYCLES.CURRENT),
        apiFetch<TodayData>(API_ROUTES.CYCLES.TODAY),
        apiFetch<CycleStatistics>(API_ROUTES.CYCLES.STATISTICS + "?months=6"),
        apiFetch<InsightsSummary>(
          API_ROUTES.CYCLES.RECOMMENDATIONS + "?limit=3"
        ),
      ]);

      // Procesar respuestas de manera segura
      const currentCycle =
        currentCycleResponse.status === "fulfilled"
          ? currentCycleResponse.value
          : null;

      const todayData =
        todayResponse.status === "fulfilled" ? todayResponse.value : null;

      const statistics =
        statisticsResponse.status === "fulfilled"
          ? statisticsResponse.value
          : null;

      const insights =
        insightsResponse.status === "fulfilled" ? insightsResponse.value : null;

      // TEMPORAL: Simular datos de notificaciones hasta que el endpoint funcione
      const notificationsData = {
        total: 0,
        unread: 0,
        highPriority: 0,
      };

      setData({
        currentCycle,
        todayData,
        statistics,
        notifications: notificationsData,
        insights,
        isLoading: false,
        error: null,
      });

      console.log("Dashboard data loaded successfully:", {
        currentCycle: !!currentCycle,
        todayData: !!todayData,
        statistics: !!statistics,
        insights: !!insights,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: "Error al cargar los datos del dashboard",
      }));
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Función para refrescar los datos
  const refreshData = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    ...data,
    refreshData,
  };
};
