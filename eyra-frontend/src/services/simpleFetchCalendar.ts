import { API_ROUTES } from "../config/apiRoutes";
import { apiFetch } from "../utils/httpClient";

// ! 08/06/2025 - SIMPLIFICADO: El backend ahora incluye predicciones automáticas
export const fetchCalendarWithPredictions = async (
  startDate: string,
  endDate: string
): Promise<any[]> => {
  try {
    // Obtener datos del backend (ahora incluye predicciones automáticas)
    const response = await apiFetch<any>(
      `${API_ROUTES.CYCLES.CALENDAR}?start=${startDate}&end=${endDate}`
    );

    let allData: any[] = [];
    if (response && Array.isArray(response)) {
      allData = response;
    } else if (response && response.userCycles && Array.isArray(response.userCycles)) {
      allData = response.userCycles;
    } else {
      allData = [];
    }

    return allData;
  } catch (error) {
    return [];
  }
};
