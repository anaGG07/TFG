// C:\Users\Ana\Desktop\Curso\Proyecto\EYRA\eyra-frontend\src\hooks\useDashboardData.ts
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../utils/httpClient";
import { API_ROUTES } from "../config/apiRoutes";
import { notificationService } from "../services/notificationService";

// CORREGIDO: Interfaces que coinciden con la respuesta real del backend
export interface CyclePhase {
  phase: string;
  startDate: string;
  endDate?: string;
  cycleId: string;
  notes?: string;
}

export interface CurrentCycleData {
  cycleId: string;
  phases: {
    [key: string]: CyclePhase; // menstrual, folicular, ovulacion, lutea
  };
  currentPhase: CyclePhase | null;
}

export interface TodayData {
  id: number;
  date: string;
  dayNumber: number;
  symptoms: any[];
  notes: any[];
  mood: any[];
  flowIntensity: number | null;
  hormoneLevels: any[];
  // NOTA: cyclePhase no viene en la respuesta actual del backend
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
  cyclesByMonth: Array<{
    year: number;
    month: number;
    count: number;
  }>;
}

export interface NotificationData {
  all: any[];
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
  currentCycle: CurrentCycleData | null;
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
    notifications: { all: [], total: 0, unread: 0, highPriority: 0 },
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
      // Ejecutar llamadas con interfaces corregidas
      const [
        currentCycleResponse,
        todayResponse,
        statisticsResponse,
        insightsResponse,
        notificationsResponse,
      ] = await Promise.allSettled([
        apiFetch<CurrentCycleData>(API_ROUTES.CYCLES.CURRENT),
        apiFetch<TodayData>(API_ROUTES.CYCLES.TODAY),
        apiFetch<CycleStatistics>(API_ROUTES.CYCLES.STATISTICS + "?months=6"),
        apiFetch<InsightsSummary>(
          API_ROUTES.CYCLES.RECOMMENDATIONS + "?limit=3"
        ),
        notificationService.getNotifications(),
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

      // Procesar notificaciones del backend real
      let notificationsData: NotificationData = { all: [], total: 0, unread: 0, highPriority: 0 };
      
      if (notificationsResponse.status === "fulfilled") {
        const notifications = notificationsResponse.value;
        const unreadCount = notifications.filter((n: any) => !n.read).length;
        const highPriorityCount = notifications.filter((n: any) => n.priority === 'high' && !n.read).length;
        
        notificationsData = {
          all: notifications,
          total: notifications.length,
          unread: unreadCount,
          highPriority: highPriorityCount,
        };
      } else {
        console.warn("Failed to load notifications:", notificationsResponse.reason);
      }

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
