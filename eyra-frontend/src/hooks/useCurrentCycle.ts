// ! 08/06/2025 - Hook corregido para obtener información precisa del ciclo actual
// Reemplaza la lógica problemática que mostraba "Día 1" cuando debería ser "Día 3"

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../utils/httpClient";
import { API_ROUTES } from "../config/apiRoutes";

// Interfaces para la respuesta real del backend
export interface CyclePhaseData {
  id: number;
  phase: "menstrual" | "folicular" | "ovulacion" | "lutea";
  cycleId: string;
  startDate: string;
  endDate: string;
  filteredCycleDays?: Array<{
    id: number;
    date: string;
    dayNumber: number;
    symptoms: any[];
    notes: any[];
    mood: any[];
    flowIntensity: number | null;
  }>;
}

export interface CalendarResponse {
  userCycles: CyclePhaseData[];
  hostCycles: any[];
  predictionInfo: any;
}

export interface CurrentCycleInfo {
  currentDay: number;
  currentPhase: string;
  phaseName: string;
  phaseDescription: string;
  nextPeriodDate: string | null;
  daysUntilNext: number | null;
  cycleLength: number;
  isLoading: boolean;
  error: string | null;
}

export const useCurrentCycle = () => {
  const { user, isAuthenticated } = useAuth();
  const [cycleInfo, setCycleInfo] = useState<CurrentCycleInfo>({
    currentDay: 1,
    currentPhase: "menstrual",
    phaseName: "Menstrual",
    phaseDescription: "Cargando información del ciclo...",
    nextPeriodDate: null,
    daysUntilNext: null,
    cycleLength: 28,
    isLoading: true,
    error: null,
  });

  // 🎯 Función para calcular el día actual del ciclo correctamente
  const calculateCurrentCycleDay = useCallback(
    (cycles: CyclePhaseData[]): number => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Buscar el ciclo que contiene la fecha actual
      for (const cycle of cycles) {
        const startDate = new Date(cycle.startDate);
        const endDate = new Date(cycle.endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        if (today >= startDate && today <= endDate) {
          // Encontrar el inicio del ciclo completo (fase menstrual)
          const cycleStart = findCycleStart(cycles, cycle.cycleId);
          if (cycleStart) {
            const diffTime = today.getTime() - cycleStart.getTime();
            const dayNumber = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

            console.log(`✅ DÍA CALCULADO CORRECTAMENTE: ${dayNumber}`, {
              today: today.toISOString().split("T")[0],
              cycleStart: cycleStart.toISOString().split("T")[0],
              currentPhase: cycle.phase,
              cycleId: cycle.cycleId,
            });

            return dayNumber;
          }
        }
      }

      return 1; // Fallback
    },
    []
  );

  // 🔍 Función para encontrar el inicio real del ciclo (fase menstrual)
  const findCycleStart = useCallback(
    (cycles: CyclePhaseData[], cycleId: string): Date | null => {
      const cyclePhases = cycles.filter((c) => c.cycleId === cycleId);
      if (cyclePhases.length === 0) return null;

      // Buscar la fase menstrual (inicio del ciclo)
      const menstrualPhase = cyclePhases.find((p) => p.phase === "menstrual");
      if (menstrualPhase) {
        return new Date(menstrualPhase.startDate);
      }

      // Si no hay fase menstrual, tomar la fecha más temprana
      const sortedPhases = cyclePhases.sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
      return new Date(sortedPhases[0].startDate);
    },
    []
  );

  // 🎨 Información de cada fase del ciclo
  const getPhaseInfo = useCallback((phase: string) => {
    const phaseData = {
      menstrual: {
        name: "Menstrual",
        description:
          "Durante la fase menstrual, tu cuerpo elimina el revestimiento uterino. Es normal experimentar sangrado, cólicos y fatiga. ¡Cuídate extra!",
      },
      folicular: {
        name: "Folicular",
        description:
          "En la fase folicular, tus hormonas estimulan el crecimiento de folículos ováricos. Es común sentir un aumento de energía y mejor estado de ánimo.",
      },
      ovulacion: {
        name: "Ovulación",
        description:
          "La ovulación es cuando liberas un óvulo. Puedes notar cambios en el flujo vaginal, ligero dolor abdominal y aumento del deseo sexual.",
      },
      lutea: {
        name: "Lútea",
        description:
          "Durante la fase lútea, tu cuerpo se prepara para un posible embarazo. Puedes experimentar síntomas premenstruales como sensibilidad en los senos.",
      },
    };

    return phaseData[phase as keyof typeof phaseData] || phaseData.menstrual;
  }, []);

  // 📅 Función para calcular el próximo período
  const calculateNextPeriod = useCallback(
    (
      cycles: CyclePhaseData[]
    ): { date: string | null; days: number | null } => {
      if (cycles.length === 0) return { date: null, days: null };

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Buscar próximos ciclos menstruales
      const futureMenstrualCycles = cycles
        .filter((c) => c.phase === "menstrual" && new Date(c.startDate) > today)
        .sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );

      if (futureMenstrualCycles.length > 0) {
        const nextPeriod = new Date(futureMenstrualCycles[0].startDate);
        const diffTime = nextPeriod.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
          date: nextPeriod.toISOString().split("T")[0],
          days: diffDays,
        };
      }

      return { date: null, days: null };
    },
    []
  );

  // 🚀 Función principal para cargar información del ciclo
  const loadCurrentCycleInfo = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setCycleInfo((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    setCycleInfo((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log("🔄 Cargando información del ciclo actual...");

      // Obtener datos del calendario del mes actual
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const response = await apiFetch<CalendarResponse>(
        `${API_ROUTES.CYCLES.CALENDAR}?start=${
          startOfMonth.toISOString().split("T")[0]
        }&end=${endOfMonth.toISOString().split("T")[0]}`
      );

      console.log("📊 Respuesta del calendario:", response);

      if (response.userCycles && response.userCycles.length > 0) {
        const cycles = response.userCycles;

        // Calcular día actual del ciclo
        const currentDay = calculateCurrentCycleDay(cycles);

        // Encontrar fase actual
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let currentPhase = "menstrual";
        for (const cycle of cycles) {
          const startDate = new Date(cycle.startDate);
          const endDate = new Date(cycle.endDate);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);

          if (today >= startDate && today <= endDate) {
            currentPhase = cycle.phase;
            break;
          }
        }

        // Obtener información de la fase
        const phaseInfo = getPhaseInfo(currentPhase);

        // Calcular próximo período
        const nextPeriod = calculateNextPeriod(cycles);

        // Calcular duración promedio del ciclo
        const cycleLengths = cycles
          .filter((c) => c.phase === "menstrual")
          .map((c) => {
            const start = new Date(c.startDate);
            const end = new Date(c.endDate);
            return Math.ceil(
              (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
            );
          });

        const avgCycleLength =
          cycleLengths.length > 0
            ? Math.round(
                cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length
              )
            : 28;

        console.log("✅ Información del ciclo calculada:", {
          currentDay,
          currentPhase,
          phaseName: phaseInfo.name,
          nextPeriodDays: nextPeriod.days,
          avgCycleLength,
        });

        setCycleInfo({
          currentDay,
          currentPhase,
          phaseName: phaseInfo.name,
          phaseDescription: phaseInfo.description,
          nextPeriodDate: nextPeriod.date,
          daysUntilNext: nextPeriod.days,
          cycleLength: avgCycleLength,
          isLoading: false,
          error: null,
        });
      } else {
        // Sin datos de ciclos
        setCycleInfo({
          currentDay: 1,
          currentPhase: "menstrual",
          phaseName: "Menstrual",
          phaseDescription:
            "No hay datos de ciclo disponibles. ¡Registra tu primer período para comenzar!",
          nextPeriodDate: null,
          daysUntilNext: null,
          cycleLength: 28,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error("❌ Error cargando información del ciclo:", error);
      setCycleInfo((prev) => ({
        ...prev,
        isLoading: false,
        error: "Error al cargar información del ciclo",
      }));
    }
  }, [
    isAuthenticated,
    user,
    calculateCurrentCycleDay,
    getPhaseInfo,
    calculateNextPeriod,
  ]);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadCurrentCycleInfo();
    // Actualizar cada minuto por si cambia el día
    const interval = setInterval(loadCurrentCycleInfo, 60000);
    return () => clearInterval(interval);
  }, [loadCurrentCycleInfo]);

  return {
    ...cycleInfo,
    refreshCycleInfo: loadCurrentCycleInfo,
  };
};
