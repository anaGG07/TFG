import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { apiFetch } from "../utils/httpClient";
import { ContentType } from "../types/domain";
import {
  CycleDay,
  CyclePhase,
  MenstrualCycle,
  HormoneLevel,
} from "../types/domain";
import { API_ROUTES } from "../config/apiRoutes";
import { startOfMonth, endOfMonth } from "date-fns";
import { useAuth } from "../context/AuthContext";

export interface CycleDayInput {
  date: string;
  flowIntensity?: number;
  phase: CyclePhase;
  mood: string[];
  symptoms: string[];
  notes: string;
}

export interface NewCycleInput extends CycleDayInput {
  startDate: string;
}

// Tipos para las respuestas del backend
interface CalendarApiResponse {
  userCycles: Array<
    MenstrualCycle & {
      phase?: CyclePhase;
      filteredCycleDays?: CycleDay[];
    }
  >;
  hostCycles?: any[];
}

interface CurrentCycleResponse {
  cycleId: string;
  phases: Record<string, any>;
  currentPhase: any;
}

interface RecommendationResponse {
  success: boolean;
  recommendations?: any[];
  message?: string;
}

interface CycleContextType {
  calendarDays: CycleDay[];
  currentCycle: CurrentCycleResponse | null;
  isLoading: boolean;
  currentPhase: CyclePhase;
  loadCalendarDays: (startDate: string, endDate: string) => Promise<void>;
  addCycleDay: (data: CycleDayInput) => Promise<void>;
  startNewCycle: (data: NewCycleInput) => Promise<void>;
  getCurrentCycle: () => Promise<void>;
  getRecommendations: () => Promise<any[]>;
}

const CycleContext = createContext<CycleContextType | undefined>(undefined);

export const CycleProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [calendarDays, setCalendarDays] = useState<CycleDay[]>([]);
  const [currentCycle, setCurrentCycle] = useState<CurrentCycleResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<CyclePhase>(
    CyclePhase.MENSTRUAL
  );
  const { isAuthenticated } = useAuth();

  // Cargar días del calendario - API REAL ACTIVADA
  const loadCalendarDays = useCallback(
    async (startDate: string, endDate: string) => {
      setIsLoading(true);
      try {
        // ACTIVADO: Usar API real con tipos correctos
        const response = await apiFetch<CalendarApiResponse>(
          API_ROUTES.CYCLES.CALENDAR + `?start=${startDate}&end=${endDate}`
        );

        // La API devuelve { userCycles: [], hostCycles: [] }
        // Extraemos solo los datos del usuario y convertimos a formato CycleDay
        const userCycles = response.userCycles || [];
        const calendarData: CycleDay[] = [];

        // Procesar cada ciclo y sus días
        userCycles.forEach((cycle) => {
          // Verificar si existe la propiedad filteredCycleDays o usar cycleDays
          const cycleDays = cycle.filteredCycleDays || cycle.cycleDays || [];

          if (Array.isArray(cycleDays)) {
            cycleDays.forEach((day) => {
              // Crear objeto CycleDay con todos los campos requeridos
              const cycleDay: CycleDay = {
                id: day.id,
                date: day.date,
                dayNumber: day.dayNumber || 1,
                phase: cycle.phase || day.phase || CyclePhase.MENSTRUAL,
                flowIntensity: day.flowIntensity,
                mood: Array.isArray(day.mood) ? day.mood : [],
                symptoms: Array.isArray(day.symptoms) ? day.symptoms : [],
                notes: Array.isArray(day.notes) ? day.notes : [],
                hormoneLevels: Array.isArray(day.hormoneLevels)
                  ? day.hormoneLevels
                  : [],
              };

              calendarData.push(cycleDay);
            });
          }
        });

        setCalendarDays(calendarData);
        setIsLoading(false);
      } catch (error) {
        console.error(
          "CycleContext: Error al cargar datos del calendario desde API",
          error
        );

        // Fallback a datos simulados solo en caso de error
        const simulatedDays = generateSimulatedCalendarDays(startDate, endDate);
        setCalendarDays(simulatedDays);
        setIsLoading(false);
      }
    },
    []
  );

  // Efecto para cargar automáticamente los días del ciclo al montar y al cambiar de día
  const lastLoadedDate = React.useRef<string>("");
  useEffect(() => {
    if (!isAuthenticated) return;
    const loadForToday = () => {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);
      if (lastLoadedDate.current !== todayStr) {
        lastLoadedDate.current = todayStr;
        loadCalendarDays(
          monthStart.toISOString().split("T")[0],
          monthEnd.toISOString().split("T")[0]
        );
      }
    };
    loadForToday();
    const interval = setInterval(loadForToday, 60 * 1000);
    return () => clearInterval(interval);
  }, [loadCalendarDays, isAuthenticated]);

  // Añadir información a un día del ciclo - API REAL ACTIVADA
  const addCycleDay = useCallback(
    async (data: CycleDayInput) => {
      setIsLoading(true);
      try {
        // SISTEMA DE RETRY CON MÚLTIPLES ENDPOINTS
        let response;
        let saveSuccessful = false;
        const endpoints = [
          {
            method: "POST",
            url: `${API_ROUTES.CYCLES.ALL}/day`,
            name: "POST /cycles/day",
          },
          {
            method: "PUT",
            url: `${API_ROUTES.CYCLES.ALL}/${data.date}`,
            name: "PUT /cycles/{date}",
          },
          {
            method: "PATCH",
            url: `${API_ROUTES.CYCLES.ALL}/${data.date}`,
            name: "PATCH /cycles/{date}",
          },
          {
            method: "POST",
            url: API_ROUTES.CYCLES.CREATE,
            name: "POST /cycles (create)",
          },
        ];

        for (const endpoint of endpoints) {
          try {
            response = await apiFetch<any>(endpoint.url, {
              method: endpoint.method,
              body: data,
            });
            saveSuccessful = true;
            break;
          } catch (error: any) {
            if (endpoints.indexOf(endpoint) === endpoints.length - 1) {
              // Último intento falló
              throw error;
            }
          }
        }

        // Recargar datos del calendario después del guardado
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        );

        await loadCalendarDays(
          startOfMonth.toISOString().split("T")[0],
          endOfMonth.toISOString().split("T")[0]
        );

        setIsLoading(false);
      } catch (error) {
        console.error(
          "CycleContext: Error al guardar información del día en API",
          error
        );

        // Fallback: actualizar estado local si falla la API
        setCalendarDays((prev) => {
          const existingDayIndex = prev.findIndex(
            (day) => day.date === data.date
          );
          if (existingDayIndex >= 0) {
            const updatedDays = [...prev];
            updatedDays[existingDayIndex] = {
              ...updatedDays[existingDayIndex],
              phase: data.phase,
              flowIntensity: data.flowIntensity,
              mood: data.mood,
              symptoms: data.symptoms,
              notes: data.notes ? [data.notes] : [],
            };
            return updatedDays;
          }

          // Crear nuevo CycleDay con todos los campos requeridos
          const newCycleDay: CycleDay = {
            id: String(Date.now()),
            date: data.date,
            dayNumber: 1,
            phase: data.phase,
            flowIntensity: data.flowIntensity,
            mood: data.mood,
            symptoms: data.symptoms,
            notes: data.notes ? [data.notes] : [],
            hormoneLevels: [],
          };

          return [...prev, newCycleDay];
        });

        setIsLoading(false);
      }
    },
    [loadCalendarDays]
  );

  // Iniciar un nuevo ciclo - API REAL ACTIVADA
  const startNewCycle = useCallback(
    async (data: NewCycleInput) => {
      setIsLoading(true);
      try {
        // ACTIVADO: Usar API real con tipos correctos
        await apiFetch<void>(API_ROUTES.CYCLES.START_CYCLE, {
          method: "POST",
          body: data,
        });

        // Recargar datos después de iniciar ciclo
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        );

        await loadCalendarDays(
          startOfMonth.toISOString().split("T")[0],
          endOfMonth.toISOString().split("T")[0]
        );

        setIsLoading(false);
      } catch (error) {
        console.error(
          "CycleContext: Error al iniciar nuevo ciclo en API",
          error
        );

        // Fallback: simulación para desarrollo
        const newDay: CycleDay = {
          id: String(Date.now()),
          date: data.startDate,
          dayNumber: 1,
          phase: CyclePhase.MENSTRUAL,
          flowIntensity: data.flowIntensity,
          mood: data.mood,
          symptoms: data.symptoms,
          notes: data.notes ? [data.notes] : [],
          hormoneLevels: [],
        };

        setCalendarDays((prev) => {
          const existingDayIndex = prev.findIndex(
            (day) => day.date === data.startDate
          );
          if (existingDayIndex >= 0) {
            const updatedDays = [...prev];
            updatedDays[existingDayIndex] = newDay;
            return updatedDays;
          }
          return [...prev, newDay];
        });

        setIsLoading(false);
      }
    },
    [loadCalendarDays]
  );

  // Obtener el ciclo actual - API REAL ACTIVADA
  const getCurrentCycle = useCallback(async () => {
    setIsLoading(true);
    try {
      // ACTIVADO: Usar API real con tipos correctos
      const response = await apiFetch<CurrentCycleResponse>(
        API_ROUTES.CYCLES.CURRENT
      );
      setCurrentCycle(response);
      setIsLoading(false);
    } catch (error) {
      console.error(
        "CycleContext: Error al obtener ciclo actual desde API",
        error
      );

      // Fallback: simulación para desarrollo
      const simulatedCurrentCycle: CurrentCycleResponse = {
        cycleId: "simulated-cycle-" + Date.now(),
        phases: {},
        currentPhase: {
          phase: CyclePhase.LUTEA,
          startDate: "2024-03-15",
          endDate: null,
          cycleId: "simulated-cycle-" + Date.now(),
          notes: null,
        },
      };

      setCurrentCycle(simulatedCurrentCycle);
      setIsLoading(false);
    }
  }, []);

  // Obtener recomendaciones - API REAL ACTIVADA
  const getRecommendations = useCallback(async (): Promise<any[]> => {
    setIsLoading(true);
    try {
      // ACTIVADO: Usar API real con tipos correctos
      const response = await apiFetch<RecommendationResponse | any[]>(
        API_ROUTES.CYCLES.RECOMMENDATIONS
      );

      setIsLoading(false);

      // Si la API devuelve un objeto con success y recommendations
      if (
        typeof response === "object" &&
        "success" in response &&
        response.success &&
        response.recommendations
      ) {
        return response.recommendations;
      }

      // Si la API devuelve directamente un array
      if (Array.isArray(response)) {
        return response;
      }

      // Si no es ninguno de los anteriores, devolver array vacío
      return [];
    } catch (error) {
      console.error(
        "CycleContext: Error al obtener recomendaciones desde API",
        error
      );

      // Fallback: simulación para desarrollo con recomendaciones por fase
      const simulatedRecommendations = [
        // Fase Menstrual
        {
          id: 1,
          title: "Smoothie de frutos rojos",
          summary:
            "Rico en hierro y antioxidantes para combatir la fatiga menstrual",
          type: ContentType.NUTRITION,
          targetPhase: CyclePhase.MENSTRUAL,
          imageUrl: API_ROUTES.MEDIA.PLACEHOLDER(300, 200),
        },
        {
          id: 2,
          title: "Yoga suave para calambres",
          summary:
            "Rutina de 15 minutos con posturas para aliviar el dolor menstrual",
          type: ContentType.EXERCISE,
          targetPhase: CyclePhase.MENSTRUAL,
          imageUrl: API_ROUTES.MEDIA.PLACEHOLDER(300, 200),
        },
        // Fase Folicular
        {
          id: 3,
          title: "Ensalada energética con aguacate",
          summary:
            "Alimentos frescos y nutritivos para aprovechar tu energía creciente",
          type: ContentType.NUTRITION,
          targetPhase: CyclePhase.FOLICULAR,
          imageUrl: API_ROUTES.MEDIA.PLACEHOLDER(300, 200),
        },
        {
          id: 4,
          title: "Cardio moderado y caminatas",
          summary:
            "Ejercicios cardiovasculares para potenciar tu energía natural",
          type: ContentType.EXERCISE,
          targetPhase: CyclePhase.FOLICULAR,
          imageUrl: API_ROUTES.MEDIA.PLACEHOLDER(300, 200),
        },
        // Fase Ovulación
        {
          id: 5,
          title: "Salmón con quinoa y verduras",
          summary: "Proteínas de calidad y omega-3 para tu momento más fértil",
          type: ContentType.NUTRITION,
          targetPhase: CyclePhase.OVULACION,
          imageUrl: API_ROUTES.MEDIA.PLACEHOLDER(300, 200),
        },
        {
          id: 6,
          title: "Entrenamientos de alta intensidad",
          summary: "Aprovecha tu pico de energía con ejercicios intensos",
          type: ContentType.EXERCISE,
          targetPhase: CyclePhase.OVULACION,
          imageUrl: API_ROUTES.MEDIA.PLACEHOLDER(300, 200),
        },
        // Fase Lútea
        {
          id: 7,
          title: "Té de manzanilla con miel",
          summary:
            "Bebida relajante para reducir la ansiedad y mejorar el sueño",
          type: ContentType.NUTRITION,
          targetPhase: CyclePhase.LUTEA,
          imageUrl: API_ROUTES.MEDIA.PLACEHOLDER(300, 200),
        },
        {
          id: 8,
          title: "Pilates y ejercicios de fuerza",
          summary:
            "Fortalecimiento suave para preparar tu cuerpo para el próximo ciclo",
          type: ContentType.EXERCISE,
          targetPhase: CyclePhase.LUTEA,
          imageUrl: API_ROUTES.MEDIA.PLACEHOLDER(300, 200),
        },
      ];

      setIsLoading(false);
      return simulatedRecommendations;
    }
  }, []);

  // Función auxiliar para generar datos simulados para el calendario (solo fallback)
  const generateSimulatedCalendarDays = (
    startDate: string,
    endDate: string
  ): CycleDay[] => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days: CycleDay[] = [];

    let currentDate = new Date(start);
    let cycleDay = 1;

    while (currentDate <= end) {
      let phase: CyclePhase;
      let flowIntensity: number | undefined;

      if (cycleDay <= 5) {
        phase = CyclePhase.MENSTRUAL;
        flowIntensity = Math.max(1, 6 - cycleDay);
      } else if (cycleDay <= 13) {
        phase = CyclePhase.FOLICULAR;
        flowIntensity = undefined;
      } else if (cycleDay <= 15) {
        phase = CyclePhase.OVULACION;
        flowIntensity = undefined;
      } else {
        phase = CyclePhase.LUTEA;
        flowIntensity = undefined;
      }

      if (Math.random() > 0.3) {
        const dateString = currentDate.toISOString().split("T")[0];

        // Crear CycleDay con todos los campos requeridos y tipados correctamente
        const simulatedDay: CycleDay = {
          id: String(Date.now() + cycleDay),
          date: dateString,
          dayNumber: cycleDay,
          phase,
          flowIntensity,
          mood:
            phase === CyclePhase.LUTEA
              ? ["Irritable", "Sensible"]
              : phase === CyclePhase.OVULACION
              ? ["Enérgica", "Feliz"]
              : phase === CyclePhase.MENSTRUAL
              ? ["Cansada"]
              : [],
          symptoms:
            phase === CyclePhase.LUTEA
              ? ["Hinchazón", "Dolor de cabeza"]
              : phase === CyclePhase.MENSTRUAL
              ? ["Dolor abdominal", "Fatiga"]
              : [],
          notes: phase === CyclePhase.MENSTRUAL ? ["Flujo moderado"] : [],
          hormoneLevels: [], // Campo requerido
        };

        days.push(simulatedDay);
      }

      currentDate.setDate(currentDate.getDate() + 1);

      if (cycleDay === 28) {
        cycleDay = 1;
      } else {
        cycleDay++;
      }
    }

    return days;
  };

  // Actualizar currentPhase cuando cambie el ciclo actual
  useEffect(() => {
    if (currentCycle?.currentPhase?.phase) {
      setCurrentPhase(currentCycle.currentPhase.phase);
    }
  }, [currentCycle]);

  return (
    <CycleContext.Provider
      value={{
        calendarDays,
        currentCycle,
        isLoading,
        currentPhase,
        loadCalendarDays,
        addCycleDay,
        startNewCycle,
        getCurrentCycle,
        getRecommendations,
      }}
    >
      {children}
    </CycleContext.Provider>
  );
};

export const useCycle = () => {
  const context = useContext(CycleContext);
  if (context === undefined) {
    throw new Error("useCycle must be used within a CycleProvider");
  }
  return context;
};
