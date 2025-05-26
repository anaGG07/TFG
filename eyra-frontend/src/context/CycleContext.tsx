import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { apiFetch } from '../utils/httpClient';
import { CycleDay, CyclePhase } from '../types/domain';
import { API_ROUTES } from '../config/apiRoutes';

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

interface CycleContextType {
  calendarDays: CycleDay[];
  currentCycle: any | null; // Ajustar tipo específico según necesidad
  isLoading: boolean;
  loadCalendarDays: (startDate: string, endDate: string) => Promise<void>;
  addCycleDay: (data: CycleDayInput) => Promise<void>;
  startNewCycle: (data: NewCycleInput) => Promise<void>;
  getCurrentCycle: () => Promise<void>;
  getRecommendations: () => Promise<any[]>;
}

const CycleContext = createContext<CycleContextType | undefined>(undefined);

export const CycleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [calendarDays, setCalendarDays] = useState<CycleDay[]>([]);
  const [currentCycle, setCurrentCycle] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar días del calendario
  const loadCalendarDays = useCallback(async (startDate: string, endDate: string) => {
    setIsLoading(true);
    try {
      // En desarrollo, usamos datos simulados
      // En producción, descomentar esto y usar la API real
      // const response = await apiFetch(API_ROUTES.CYCLES.CALENDAR + `?start=${startDate}&end=${endDate}`);
      // setCalendarDays(response);

      // Simulación de datos para desarrollo
      setTimeout(() => {
        const simulatedDays = generateSimulatedCalendarDays(startDate, endDate);
        setCalendarDays(simulatedDays);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error al cargar datos del calendario:', error);
      setIsLoading(false);
    }
  }, []);

  // Añadir información a un día del ciclo
  const addCycleDay = useCallback(async (data: CycleDayInput) => {
    setIsLoading(true);
    try {
       await apiFetch(API_ROUTES.CYCLES.ALL, {
         method: 'POST',
         body: data
       });
      
      // Simulación para desarrollo
      setTimeout(() => {
        console.log('Datos guardados:', data);
        setIsLoading(false);
        
        // Actualizar el estado local
        setCalendarDays(prev => {
          const existingDayIndex = prev.findIndex(day => day.date === data.date);
          if (existingDayIndex >= 0) {
            const updatedDays = [...prev];
            updatedDays[existingDayIndex] = {
              ...updatedDays[existingDayIndex],
              phase: data.phase,
              flowIntensity: data.flowIntensity,
              mood: data.mood,
              symptoms: data.symptoms,
              notes: data.notes ? [data.notes] : []
            };
            return updatedDays;
          }
          return [...prev, {
            id: Date.now(), // Usando número en lugar de string
            date: data.date,
            dayNumber: 1,
            phase: data.phase,
            flowIntensity: data.flowIntensity,
            mood: data.mood,
            symptoms: data.symptoms,
            notes: data.notes ? [data.notes] : []
          }];
        });
      }, 500);
    } catch (error) {
      console.error('Error al guardar información del día:', error);
      setIsLoading(false);
    }
  }, []);

  // Iniciar un nuevo ciclo
  const startNewCycle = useCallback(async (data: NewCycleInput) => {
    setIsLoading(true);
    try {
      // En producción, descomentar esto y usar la API real
      // await apiFetch(API_ROUTES.CYCLES.START_CYCLE, {
      //   method: 'POST',
      //   body: data
      // });
      
      // Simulación para desarrollo
      setTimeout(() => {
        console.log('Nuevo ciclo iniciado:', data);
        setIsLoading(false);
        
        // Actualizar el estado local
        setCalendarDays(prev => {
          const newDay: CycleDay = {
            id: Date.now(), // Usando número en lugar de string
            date: data.startDate,
            dayNumber: 1,
            phase: CyclePhase.MENSTRUAL,
            flowIntensity: data.flowIntensity,
            mood: data.mood,
            symptoms: data.symptoms,
            notes: data.notes ? [data.notes] : []
          };
          
          const existingDayIndex = prev.findIndex(day => day.date === data.startDate);
          if (existingDayIndex >= 0) {
            const updatedDays = [...prev];
            updatedDays[existingDayIndex] = newDay;
            return updatedDays;
          }
          return [...prev, newDay];
        });
      }, 500);
    } catch (error) {
      console.error('Error al iniciar nuevo ciclo:', error);
      setIsLoading(false);
    }
  }, []);

  // Obtener el ciclo actual
  const getCurrentCycle = useCallback(async () => {
    setIsLoading(true);
    try {
      // En producción, descomentar esto y usar la API real
      // const response = await apiFetch(API_ROUTES.CYCLES.CURRENT);
      // setCurrentCycle(response);
      
      // Simulación para desarrollo
      setTimeout(() => {
        const simulatedCurrentCycle = {
          id: Date.now(),
          startDate: '2024-03-15',
          currentDay: 28,
          phase: CyclePhase.LUTEA,
          estimatedNextStart: '2024-04-12',
          averageCycleLength: 28
        };
        
        setCurrentCycle(simulatedCurrentCycle);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error al obtener ciclo actual:', error);
      setIsLoading(false);
    }
  }, []);

  // Obtener recomendaciones
  const getRecommendations = useCallback(async (): Promise<any[]> => {
    setIsLoading(true);
    try {
      // En producción, descomentar esto y usar la API real
      // const response = await apiFetch<any[]>(API_ROUTES.CYCLES.RECOMMENDATIONS);
      // return response;
      
      // Simulación para desarrollo
      return new Promise(resolve => {
        setTimeout(() => {
          const simulatedRecommendations = [
            {
              id: 1,
              title: 'Smoothie de frutos rojos',
              description: 'Ideal para fase menstrual, rico en hierro y antioxidantes',
              type: 'nutrition',
              imageUrl: API_ROUTES.MEDIA.PLACEHOLDER(300, 200)
            },
            {
              id: 2,
              title: 'Yoga suave para calambres',
              description: 'Rutina de 15 minutos para aliviar el dolor menstrual',
              type: 'exercise',
              imageUrl: API_ROUTES.MEDIA.PLACEHOLDER(300, 200)
            },
            {
              id: 3,
              title: 'Suplementos de hierro',
              description: 'Recomendaciones para prevenir la anemia durante la menstruación',
              type: 'article',
              imageUrl: API_ROUTES.MEDIA.PLACEHOLDER(300, 200)
            }
          ];
          
          setIsLoading(false);
          resolve(simulatedRecommendations);
        }, 500);
      });
    } catch (error) {
      console.error('Error al obtener recomendaciones:', error);
      setIsLoading(false);
      return [];
    }
  }, []);

  // Función auxiliar para generar datos simulados para el calendario
  const generateSimulatedCalendarDays = (startDate: string, endDate: string): CycleDay[] => {
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
        flowIntensity = 6 - cycleDay;
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
        const dateString = currentDate.toISOString().split('T')[0];
        days.push({
          id: Date.now() + cycleDay,
          date: dateString,
          dayNumber: cycleDay,
          phase,
          flowIntensity,
          mood: phase === CyclePhase.LUTEA ? ['Irritable', 'Sensible'] : 
                phase === CyclePhase.OVULACION ? ['Enérgica', 'Feliz'] : 
                phase === CyclePhase.MENSTRUAL ? ['Cansada'] : [],
          symptoms: phase === CyclePhase.LUTEA ? ['Hinchazón', 'Dolor de cabeza'] : 
                   phase === CyclePhase.MENSTRUAL ? ['Dolor abdominal', 'Fatiga'] : [],
          notes: phase === CyclePhase.MENSTRUAL ? ['Flujo moderado'] : []
        });
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

  return (
    <CycleContext.Provider value={{
      calendarDays,
      currentCycle,
      isLoading,
      loadCalendarDays,
      addCycleDay,
      startNewCycle,
      getCurrentCycle,
      getRecommendations
    }}>
      {children}
    </CycleContext.Provider>
  );
};
export const useCycle = () => {
  const context = useContext(CycleContext);
  if (context === undefined) {
    throw new Error('useCycle must be used within a CycleProvider');
  }
  return context;
};

