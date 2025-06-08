import { API_ROUTES } from "../config/apiRoutes";
import { apiFetch } from "../utils/httpClient";

// ! 08/06/2025 - SIMPLIFICADO: El backend ahora incluye predicciones automáticas
export const fetchCalendarWithPredictions = async (
  startDate: string,
  endDate: string
): Promise<any[]> => {
  try {
    console.log('=== FETCHING CALENDAR DATA ===');
    console.log('Date range:', startDate, 'to', endDate);
    
    // Obtener datos del backend (ahora incluye predicciones automáticas)
    const response = await apiFetch<any>(
      `${API_ROUTES.CYCLES.CALENDAR}?start=${startDate}&end=${endDate}`
    );
    
    console.log('Raw backend response:', response);

    let allData: any[] = [];
    if (response && Array.isArray(response)) {
      allData = response;
      console.log('Response is direct array:', allData.length, 'items');
    } else if (response && response.userCycles && Array.isArray(response.userCycles)) {
      allData = response.userCycles;
      console.log('Response has userCycles:', allData.length, 'items');
      console.log('Host cycles:', response.hostCycles?.length || 0, 'items');
      console.log('Prediction info:', response.predictionInfo);
    } else {
      allData = [];
      console.log('No valid data structure found');
    }
    
    console.log('Final data to return:', allData);
    console.log('=== END FETCHING CALENDAR DATA ===');

    return allData;
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    return [];
  }
};
