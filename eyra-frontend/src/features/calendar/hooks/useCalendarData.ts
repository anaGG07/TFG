import { useState, useEffect, useCallback } from "react";
import { useCycle } from "../../../context/CycleContext";
import { CycleDay } from "../../../types/domain";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
} from "date-fns";
import { apiFetch } from "../../../utils/httpClient";
import { API_ROUTES } from "../../../config/apiRoutes";
/* ! 04/06/2025 - Importar función simple para calendario */
import { fetchCalendarWithPredictions } from "../../../services/simpleFetchCalendar";

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
  viewType: "month" | "week" // ! 02/06/2025 - Eliminada vista "day"
): UseCalendarDataResult => {
  const [data, setData] = useState<CalendarData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { calendarDays: cycleDays } = useCycle();

  // Calcular rango de fechas basado en la vista - Solo mes y semana
  const getDateRange = useCallback((date: Date, view: "month" | "week") => {
    switch (view) {
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
  }, []);

  /* ! 04/06/2025 - Función mejorada para obtener datos reales Y predicciones del backend */
  const fetchCalendarData = useCallback(
    async (startDate: Date, endDate: Date) => {
      setIsLoading(true);
      setError(null);

      try {
        const startStr = format(startDate, "yyyy-MM-dd");
        const endStr = format(endDate, "yyyy-MM-dd");

        console.log('=== FETCH CALENDAR DATA ===');
        console.log('Buscando datos para:', startStr, 'a', endStr);

        // ! 04/06/2025 - Usar el servicio que incluye predicciones
        const calendarData = await fetchCalendarWithPredictions(
          startStr,
          endStr
        );

        console.log('=== DATOS RECIBIDOS DEL BACKEND ===');
        console.log('Número de ciclos recibidos:', calendarData?.length || 0);
        console.log('Datos completos:', calendarData);

        // Procesar datos para el formato esperado
        const processedData: CalendarData = {
          userCycles: calendarData,
          hostCycles: [], // Por ahora no incluimos calendario compartido
          calendarDays: extractCalendarDays({
            userCycles: calendarData,
            hostCycles: [],
          }),
        };

        console.log('=== DATOS PROCESADOS ===');
        console.log('Días del calendario:', processedData.calendarDays.length);
        processedData.calendarDays.forEach(day => {
          console.log(`Día ${day.date}: fase=${day.phase}, flujo=${day.flowIntensity}, predicción=${day.isPrediction}`);
        });

        setData(processedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");

        // Fallback a datos locales si están disponibles
        if (cycleDays && cycleDays.length > 0) {
          setData({
            userCycles: [],
            hostCycles: [],
            calendarDays: cycleDays,
          });
        } else {
          setData({
            userCycles: [],
            hostCycles: [],
            calendarDays: [],
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [cycleDays]
  );

  /* ! 08/06/2025 - Función CORREGIDA para evitar días duplicados usando Map */
  const extractCalendarDays = (result: any): CycleDay[] => {
    const daysMap = new Map<string, CycleDay>(); // Usar Map para evitar duplicados por fecha

    // Extraer días de los ciclos del usuario (datos reales + predicciones)
    if (result.userCycles) {
      result.userCycles.forEach((cycle: any, index: number) => {
        const isPrediction = cycle.isPrediction || false;
        const confidence = cycle.confidence || 0;

        // SOLO generar días si hay rango de fechas válido
        if (cycle.startDate && cycle.endDate && cycle.phase) {
          let current = new Date(cycle.startDate);
          const end = new Date(cycle.endDate);
          let dayNumber = 1;
          
          while (current <= end) {
            const dateStr = format(current, "yyyy-MM-dd");
            const existingDay = daysMap.get(dateStr);
            
            if (!existingDay) {
              // No existe día para esta fecha, crear nuevo
              daysMap.set(dateStr, {
                id: `${cycle.id}_${cycle.phase}_${dateStr}`,
                date: dateStr,
                dayNumber,
                phase: cycle.phase,
                flowIntensity: cycle.phase === "menstrual" ? 2 : undefined,
                symptoms: [],
                mood: [],
                notes: [],
                isPrediction,
                confidence,
              });
            } else if (!existingDay.isPrediction && isPrediction) {
              // Día real existe, no reemplazar con predicción
              // Mantener el día real
            } else if (existingDay.isPrediction && !isPrediction) {
              // Reemplazar predicción con día real
              daysMap.set(dateStr, {
                id: `${cycle.id}_${cycle.phase}_${dateStr}`,
                date: dateStr,
                dayNumber,
                phase: cycle.phase,
                flowIntensity: cycle.phase === "menstrual" ? 2 : undefined,
                symptoms: [],
                mood: [],
                notes: [],
                isPrediction,
                confidence,
              });
            } else if (existingDay.isPrediction && isPrediction) {
              // Ambos son predicciones, mantener el de mayor confianza
              if (confidence > (existingDay.confidence || 0)) {
                daysMap.set(dateStr, {
                  id: `${cycle.id}_${cycle.phase}_${dateStr}`,
                  date: dateStr,
                  dayNumber,
                  phase: cycle.phase,
                  flowIntensity: cycle.phase === "menstrual" ? 2 : undefined,
                  symptoms: [],
                  mood: [],
                  notes: [],
                  isPrediction,
                  confidence,
                });
              }
            }

            current = addDays(current, 1);
            dayNumber++;
          }
        }

        // PROCESAR filteredCycleDays si existen (datos registrados por el usuario)
        if (cycle.filteredCycleDays && Array.isArray(cycle.filteredCycleDays)) {
          cycle.filteredCycleDays.forEach((day: any) => {
            const dateStr = day.date.slice(0, 10);
            const existingDay = daysMap.get(dateStr);

            if (existingDay) {
              // Actualizar el día existente con datos registrados (datos reales tienen prioridad)
              daysMap.set(dateStr, {
                ...existingDay,
                flowIntensity: day.flowIntensity || existingDay.flowIntensity,
                symptoms: day.symptoms || existingDay.symptoms,
                mood: day.mood || existingDay.mood,
                notes: day.notes || existingDay.notes,
                isPrediction: false, // Datos registrados no son predicciones
              });
            }
          });
        }
      });
    }

    // MERGEAR con datos del contexto local (cycleDays) - estos tienen prioridad máxima
    if (cycleDays && Array.isArray(cycleDays)) {
      cycleDays.forEach((localDay: CycleDay) => {
        const localDateStr = localDay.date.slice(0, 10);
        const existingDay = daysMap.get(localDateStr);

        if (existingDay) {
          // Actualizar día existente con datos locales más recientes
          daysMap.set(localDateStr, {
            ...existingDay,
            flowIntensity: localDay.flowIntensity || existingDay.flowIntensity,
            symptoms: localDay.symptoms || existingDay.symptoms,
            mood: localDay.mood || existingDay.mood,
            notes: localDay.notes || existingDay.notes,
            isPrediction: false, // Datos locales no son predicciones
          });
        } else {
          // Añadir nuevo día desde datos locales
          daysMap.set(localDateStr, {
            ...localDay,
            isPrediction: false,
          });
        }
      });
    }

    // Convertir Map a Array
    return Array.from(daysMap.values());
  };

  // Refetch con parámetros específicos y invalidación forzada
  const refetch = useCallback(
    async (startDate: Date, endDate: Date) => {
      console.log('=== REFETCH INICIADO ===');
      console.log('Rango solicitado:', format(startDate, 'yyyy-MM-dd'), 'a', format(endDate, 'yyyy-MM-dd'));
      
      // Limpiar datos anteriores
      setData(null);
      
      await fetchCalendarData(startDate, endDate);
    },
    [fetchCalendarData]
  );

  // ! 04/06/2025 - Efecto mejorado para cargar datos con predicciones sincronizadas
  useEffect(() => {
    const { start, end } = getDateRange(currentDate, viewType);

    // Agregar un pequeño delay para asegurar que las predicciones base se carguen primero
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchCalendarData(start, end);
      } catch (error) {
        console.error("Error in useEffect calendar data loading:", error);
      }
    };

    loadData();
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
        const response = await apiFetch(API_ROUTES.CYCLES.PREDICTION_DETAILS);
        if (response) {
          setPredictions(response);
        }
      } catch (error) {
        console.error("Error al obtener predicciones:", error);
      }
    };

    generatePredictions();
  }, [data]);

  return predictions;
};
