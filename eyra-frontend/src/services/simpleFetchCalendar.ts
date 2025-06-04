import { API_ROUTES } from "../config/apiRoutes";
import { apiFetch } from "../utils/httpClient";
import { addDays, format } from "date-fns";

interface PredictedCycle {
  id: string;
  startDate: string;
  endDate: string;
  phase: string;
  cycleLength: number;
  periodDuration: number;
  isPrediction: true;
  confidence: number;
}

// ! 04/06/2025 - SOLUCIÓN COMPLETA: Generar todas las 4 fases de cada ciclo predicho
const generateSimplePrediction = (calendarData: any[]): PredictedCycle[] => {
  if (!calendarData || calendarData.length === 0) {
    return [];
  }

  // Buscar la fecha de fin más reciente de cualquier ciclo
  let lastEndDate: Date | null = null;

  for (const cycle of calendarData) {
    if (cycle && cycle.endDate) {
      const endDate = new Date(cycle.endDate);
      if (!lastEndDate || endDate > lastEndDate) {
        lastEndDate = endDate;
      }
    }
  }

  if (!lastEndDate) {
    console.log("⚠️ No se encontró fecha de fin del último ciclo");
    return [];
  }

  console.log(
    `📅 Última fecha de fin encontrada: ${format(lastEndDate, "yyyy-MM-dd")}`
  );

  const predictions: PredictedCycle[] = [];

  // Configuración de duraciones de fases
  const CYCLE_LENGTH = 28;
  const MENSTRUAL_DURATION = 5;
  const FOLLICULAR_DURATION = 9;
  const OVULATION_DURATION = 2;
  const LUTEAL_DURATION = 12; // 28 - 5 - 9 - 2 = 12

  // Generar 3 ciclos completos futuros
  for (let cycleNum = 1; cycleNum <= 3; cycleNum++) {
    // El día de fin del último ciclo ES el día de inicio del siguiente
    const daysFromLastEnd = CYCLE_LENGTH * (cycleNum - 1);
    const cycleStart = addDays(lastEndDate, daysFromLastEnd);

    console.log(
      `🔄 Generando ciclo ${cycleNum} desde: ${format(
        cycleStart,
        "yyyy-MM-dd"
      )}`
    );

    // 1. FASE MENSTRUAL (días 0-4)
    const menstrualStart = cycleStart;
    const menstrualEnd = addDays(menstrualStart, MENSTRUAL_DURATION - 1);

    predictions.push({
      id: `predicted-menstrual-${cycleNum}-${format(
        menstrualStart,
        "yyyy-MM-dd"
      )}`,
      startDate: format(menstrualStart, "yyyy-MM-dd"),
      endDate: format(menstrualEnd, "yyyy-MM-dd"),
      phase: "menstrual",
      cycleLength: CYCLE_LENGTH,
      periodDuration: MENSTRUAL_DURATION,
      isPrediction: true,
      confidence: 80,
    });

    // 2. FASE FOLICULAR (días 5-13)
    const follicularStart = addDays(menstrualStart, MENSTRUAL_DURATION);
    const follicularEnd = addDays(follicularStart, FOLLICULAR_DURATION - 1);

    predictions.push({
      id: `predicted-folicular-${cycleNum}-${format(
        follicularStart,
        "yyyy-MM-dd"
      )}`,
      startDate: format(follicularStart, "yyyy-MM-dd"),
      endDate: format(follicularEnd, "yyyy-MM-dd"),
      phase: "folicular",
      cycleLength: CYCLE_LENGTH,
      periodDuration: FOLLICULAR_DURATION,
      isPrediction: true,
      confidence: 80,
    });

    // 3. FASE OVULACIÓN (días 14-15)
    const ovulationStart = addDays(follicularStart, FOLLICULAR_DURATION);
    const ovulationEnd = addDays(ovulationStart, OVULATION_DURATION - 1);

    predictions.push({
      id: `predicted-ovulacion-${cycleNum}-${format(
        ovulationStart,
        "yyyy-MM-dd"
      )}`,
      startDate: format(ovulationStart, "yyyy-MM-dd"),
      endDate: format(ovulationEnd, "yyyy-MM-dd"),
      phase: "ovulacion",
      cycleLength: CYCLE_LENGTH,
      periodDuration: OVULATION_DURATION,
      isPrediction: true,
      confidence: 80,
    });

    // 4. FASE LÚTE A (días 16-27)
    const lutealStart = addDays(ovulationStart, OVULATION_DURATION);
    const lutealEnd = addDays(lutealStart, LUTEAL_DURATION - 1);

    predictions.push({
      id: `predicted-lutea-${cycleNum}-${format(lutealStart, "yyyy-MM-dd")}`,
      startDate: format(lutealStart, "yyyy-MM-dd"),
      endDate: format(lutealEnd, "yyyy-MM-dd"),
      phase: "lutea",
      cycleLength: CYCLE_LENGTH,
      periodDuration: LUTEAL_DURATION,
      isPrediction: true,
      confidence: 80,
    });

    console.log(`✅ Ciclo ${cycleNum} completo:`);
    console.log(
      `  🔴 Menstrual: ${format(menstrualStart, "yyyy-MM-dd")} - ${format(
        menstrualEnd,
        "yyyy-MM-dd"
      )}`
    );
    console.log(
      `  🔵 Folicular: ${format(follicularStart, "yyyy-MM-dd")} - ${format(
        follicularEnd,
        "yyyy-MM-dd"
      )}`
    );
    console.log(
      `  🟡 Ovulación: ${format(ovulationStart, "yyyy-MM-dd")} - ${format(
        ovulationEnd,
        "yyyy-MM-dd"
      )}`
    );
    console.log(
      `  🟢 Lútea: ${format(lutealStart, "yyyy-MM-dd")} - ${format(
        lutealEnd,
        "yyyy-MM-dd"
      )}`
    );
  }

  console.log(
    `🎆 Total predicciones generadas: ${predictions.length} fases (${
      predictions.length / 4
    } ciclos completos)`
  );
  return predictions;
};

// ! 04/06/2025 - FUNCIÓN SIMPLIFICADA: El backend ahora incluye predicciones automáticas
export const fetchCalendarWithPredictions = async (
  startDate: string,
  endDate: string
): Promise<any[]> => {
  try {
    console.log(`📅 Fetching calendar data from ${startDate} to ${endDate}`);

    // Obtener datos del backend (ya incluye predicciones automáticas)
    const response = await apiFetch<any>(
      `${API_ROUTES.CYCLES.CALENDAR}?start=${startDate}&end=${endDate}`
    );

    console.log("📊 Calendar API Response:", response);

    let allData: any[] = [];
    if (response && Array.isArray(response)) {
      allData = response;
    } else if (
      response &&
      response.userCycles &&
      Array.isArray(response.userCycles)
    ) {
      allData = response.userCycles;
    } else {
      console.warn("⚠️ Formato inesperado:", response);
      allData = [];
    }

    // Separar datos reales y predicciones para logging
    const realData = allData.filter((cycle) => !cycle.isPrediction);
    const predictions = allData.filter((cycle) => cycle.isPrediction);

    console.log(
      `✅ Backend response: ${realData.length} real cycles + ${predictions.length} predicted cycles = ${allData.length} total`
    );

    return allData;
  } catch (error) {
    console.error("❌ Error al obtener calendario:", error);

    // Fallback: intentar una vez más
    try {
      const fallback = await apiFetch<any>(
        `${API_ROUTES.CYCLES.CALENDAR}?start=${startDate}&end=${endDate}`
      );
      return Array.isArray(fallback) ? fallback : fallback?.userCycles || [];
    } catch {
      return [];
    }
  }
};
