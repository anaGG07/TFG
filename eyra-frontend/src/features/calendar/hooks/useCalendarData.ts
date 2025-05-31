import { useState, useEffect, useCallback } from "react";
import { useCycle } from "../../../context/CycleContext";
import { CycleDay } from "../../../types/domain";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";

interface CalendarData {
  userCycles: any[];
  hostCycles: any[];
  calendarDays: CycleDay[];
}

interface UseCalendarDataResult {
  data: CalendarData | null;
  isLoading: boolean;
  error: string | null;
  refetch: (startDate: Date, endDate: Date) => Promise<void>;
}

export const useCalendarData = (
  currentDate: Date,
  viewType: "month" | "week" | "day"
): UseCalendarDataResult => {
  const [data, setData] = useState<CalendarData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { calendarDays: cycleDays } = useCycle();

  // Calcular rango de fechas basado en la vista
  const getDateRange = useCallback(
    (date: Date, view: "month" | "week" | "day") => {
      switch (view) {
        case "day":
          return { start: date, end: date };
        case "week":
          return {
            start: startOfWeek(date, { weekStartsOn: 1 }),
            end: endOfWeek(date, { weekStartsOn: 1 }),
          };
        case "month":
        default:
          const monthStart = startOfMonth(date);
          const monthEnd = endOfMonth(date);
          return {
            start: startOfWeek(monthStart, { weekStartsOn: 1 }),
            end: endOfWeek(monthEnd, { weekStartsOn: 1 }),
          };
      }
    },
    []
  );

  // Función para obtener datos del calendario desde el backend
  const fetchCalendarData = useCallback(
    async (startDate: Date, endDate: Date) => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token de autenticación no encontrado");
        }

        const startStr = format(startDate, "yyyy-MM-dd");
        const endStr = format(endDate, "yyyy-MM-dd");

        const response = await fetch(
          `/api/cycles/calendar?start=${startStr}&end=${endStr}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status}`);
        }

        const result = await response.json();

        // Procesar datos para el formato esperado
        const processedData: CalendarData = {
          userCycles: result.userCycles || [],
          hostCycles: result.hostCycles || [],
          calendarDays: extractCalendarDays(result),
        };

        setData(processedData);
      } catch (err) {
        console.error("Error al obtener datos del calendario:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");

        // Fallback a datos locales si están disponibles
        if (cycleDays && cycleDays.length > 0) {
          setData({
            userCycles: [],
            hostCycles: [],
            calendarDays: cycleDays,
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [cycleDays]
  );

  // Función auxiliar para extraer días del calendario de la respuesta
  const extractCalendarDays = (result: any): CycleDay[] => {
    const days: CycleDay[] = [];

    // Extraer días de los ciclos del usuario
    if (result.userCycles) {
      result.userCycles.forEach((cycle: any) => {
        if (cycle.filteredCycleDays) {
          days.push(...cycle.filteredCycleDays);
        }
      });
    }

    // Extraer días de los ciclos de anfitriones (calendario compartido)
    if (result.hostCycles) {
      result.hostCycles.forEach((hostData: any) => {
        if (hostData.cycles) {
          hostData.cycles.forEach((cycle: any) => {
            if (cycle.filteredCycleDays) {
              // Marcar días de anfitriones para distinguirlos
              const hostDays = cycle.filteredCycleDays.map((day: CycleDay) => ({
                ...day,
                isHost: true,
                hostName: hostData.hostName,
                hostId: hostData.hostId,
              }));
              days.push(...hostDays);
            }
          });
        }
      });
    }

    // Eliminar duplicados por fecha
    const uniqueDays = days.reduce((acc: CycleDay[], current: CycleDay) => {
      const existing = acc.find((day) => day.date === current.date);
      if (!existing) {
        acc.push(current);
      } else if ((current as any).isHost && !(existing as any).isHost) {
        // Preferir datos del usuario sobre datos de anfitriones
        return acc;
      } else if (!(current as any).isHost && (existing as any).isHost) {
        // Reemplazar datos de anfitrión con datos del usuario
        const index = acc.findIndex((day) => day.date === current.date);
        acc[index] = current;
      }
      return acc;
    }, []);

    return uniqueDays;
  };

  // Refetch con parámetros específicos
  const refetch = useCallback(
    async (startDate: Date, endDate: Date) => {
      await fetchCalendarData(startDate, endDate);
    },
    [fetchCalendarData]
  );

  // Efecto para cargar datos cuando cambia la fecha o vista
  useEffect(() => {
    const { start, end } = getDateRange(currentDate, viewType);
    fetchCalendarData(start, end);
  }, [currentDate, viewType, fetchCalendarData, getDateRange]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

// Hook adicional para estadísticas del calendario
export const useCalendarStatistics = (data: CalendarData | null) => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!data || !data.calendarDays.length) {
      setStats(null);
      return;
    }

    const calculateStats = () => {
      const days = data.calendarDays;
      const today = new Date();

      // Contar días por fase
      const phaseCount = days.reduce((acc, day) => {
        if (day.phase) {
          acc[day.phase] = (acc[day.phase] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      // Contar síntomas más frecuentes
      const symptomCount = days.reduce((acc, day) => {
        if (day.symptoms) {
          day.symptoms.forEach((symptom) => {
            acc[symptom] = (acc[symptom] || 0) + 1;
          });
        }
        return acc;
      }, {} as Record<string, number>);

      // Intensidad promedio del flujo
      const flowDays = days.filter(
        (day) => day.flowIntensity && day.flowIntensity > 0
      );
      const avgFlowIntensity =
        flowDays.length > 0
          ? flowDays.reduce((sum, day) => sum + (day.flowIntensity || 0), 0) /
            flowDays.length
          : 0;

      // Días con síntomas
      const symptomsRate =
        days.filter((day) => day.symptoms && day.symptoms.length > 0).length /
        days.length;

      // Días pasados vs futuros (aquí SÍ usamos today)
      const todayStr = format(today, "yyyy-MM-dd");
      const pastDays = days.filter((day) => day.date < todayStr).length;
      const futureDays = days.filter((day) => day.date > todayStr).length;
      const currentDay = days.find((day) => day.date === todayStr);

      return {
        totalDays: days.length,
        pastDays,
        futureDays,
        hasCurrentDay: !!currentDay,
        phaseDistribution: phaseCount,
        topSymptoms: Object.entries(symptomCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([symptom, count]) => ({ symptom, count })),
        averageFlowIntensity: Math.round(avgFlowIntensity * 10) / 10,
        symptomsPercentage: Math.round(symptomsRate * 100),
        flowDaysCount: flowDays.length,
      };
    };

    setStats(calculateStats());
  }, [data]);

  return stats;
};

// Hook para predicciones basadas en datos del calendario
export const useCalendarPredictions = (data: CalendarData | null) => {
  const [predictions, setPredictions] = useState<any>(null);

  useEffect(() => {
    if (!data || !data.calendarDays.length) {
      setPredictions(null);
      return;
    }

    const generatePredictions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("/api/cycles/prediction-details", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          setPredictions(result);
        }
      } catch (error) {
        console.error("Error al obtener predicciones:", error);
      }
    };

    generatePredictions();
  }, [data]);

  return predictions;
};
