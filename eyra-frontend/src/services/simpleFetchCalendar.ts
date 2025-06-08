import { API_ROUTES } from "../config/apiRoutes";
import { apiFetch } from "../utils/httpClient";

// ! 08/06/2025 - SIMPLIFICADO: El backend ahora incluye predicciones automáticas
export const fetchCalendarWithPredictions = async (
  startDate: string,
  endDate: string
): Promise<any[]> => {
  try {
    console.log(`📅 Fetching calendar data from ${startDate} to ${endDate}`);

    // Obtener datos del backend (ahora incluye predicciones automáticas)
    const response = await apiFetch<any>(
      `${API_ROUTES.CYCLES.CALENDAR}?start=${startDate}&end=${endDate}`
    );

    console.log("📊 Calendar API Response:", response);

    let allData: any[] = [];
    if (response && Array.isArray(response)) {
      allData = response;
    } else if (response && response.userCycles && Array.isArray(response.userCycles)) {
      allData = response.userCycles;
      
      // Log información de predicciones si está disponible
      if (response.predictionInfo) {
        console.log(`🔮 Predictions generated: ${response.predictionInfo.predictionsGenerated}`);
      }
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
    return [];
  }
};
