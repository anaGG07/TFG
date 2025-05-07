import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { AddCycleDayModal } from './AddCycleDayModal';

// Definimos interfaces para nuestros datos
interface CalendarDay {
  date: string;
  dayOfCycle?: number;
  isPeriod?: boolean;
  isFertile?: boolean;
  isOvulation?: boolean;
  hasSymptoms?: boolean;
  notes?: string;
}

interface CalendarDayProps {
  date: Date;
  dayData?: CalendarDay;
  isCurrentMonth: boolean;
  isToday: boolean;
  onClick: (date: Date) => void;
}

// Componente para un día del calendario
const CalendarDay = ({ date, dayData, isCurrentMonth, isToday, onClick }: CalendarDayProps) => {
  // Determinar clases CSS basadas en el estado del día
  let baseClasses = "calendar-cell relative h-14 w-full flex flex-col justify-start items-center p-1 cursor-pointer transition-all";
  
  if (!isCurrentMonth) {
    baseClasses += " opacity-40";
  }
  
  if (isToday) {
    baseClasses += " font-bold border-2 border-eyraRed";
  }
  
  if (dayData?.isPeriod) {
    baseClasses += " period";
  } else if (dayData?.isFertile) {
    baseClasses += " fertile";
  } else if (dayData?.isOvulation) {
    baseClasses += " bg-eyraLightRed/30";
  }

  return (
    <div className={baseClasses} onClick={() => onClick(date)}>
      <span className="text-sm leading-tight">{date.getDate()}</span>
      
      {dayData?.dayOfCycle && (
        <span className="text-xs mt-1">Día {dayData.dayOfCycle}</span>
      )}
      
      {/* Indicadores de estado */}
      <div className="flex mt-auto gap-1">
        {dayData?.isPeriod && (
          <span className="w-2 h-2 rounded-full bg-eyraRed"></span>
        )}
        {dayData?.isFertile && (
          <span className="w-2 h-2 rounded-full bg-eyraLightRed"></span>
        )}
        {dayData?.isOvulation && (
          <span className="w-2 h-2 rounded-full bg-eyraDeepRed"></span>
        )}
        {dayData?.hasSymptoms && (
          <span className="w-2 h-2 rounded-full bg-secondary-DEFAULT"></span>
        )}
      </div>
    </div>
  );
};

export const EnhancedCalendar = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [selectedDayData, setSelectedDayData] = useState<CalendarDay | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simular datos de calendario para demostración
  useEffect(() => {
    const generateMockData = () => {
      // Simulamos un ciclo que comienza 5 días antes de la fecha actual
      const today = new Date();
      const cycleStartDate = new Date(today);
      cycleStartDate.setDate(today.getDate() - 5);
      
      const mockData: CalendarDay[] = [];
      
      // Generamos datos para todo el mes actual
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDay = new Date(year, month, day);
        const daysSinceCycleStart = Math.floor((currentDay.getTime() - cycleStartDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Solo asignamos día del ciclo si es positivo (después del inicio del ciclo)
        const dayOfCycle = daysSinceCycleStart >= 0 ? daysSinceCycleStart + 1 : undefined;
        
        const isPeriod = dayOfCycle && dayOfCycle <= 5;
        const isFertile = dayOfCycle && dayOfCycle >= 11 && dayOfCycle <= 17;
        const isOvulation = dayOfCycle && dayOfCycle === 14;
        
        // Añadir síntomas aleatorios para algunos días
        const hasSymptoms = Math.random() > 0.85;
        
        mockData.push({
          date: currentDay.toISOString().split('T')[0],
          dayOfCycle,
          isPeriod,
          isFertile,
          isOvulation,
          hasSymptoms,
          notes: hasSymptoms ? "Algunos síntomas registrados" : undefined
        });
      }
      
      return mockData;
    };
    
    setIsLoading(true);
    // Simulamos una carga de datos
    setTimeout(() => {
      setCalendarDays(generateMockData());
      setIsLoading(false);
    }, 500);
  }, [currentDate]);

  // Nombres de los días de la semana
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Generar los días para el calendario
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Primer día del mes
    const firstDayOfMonth = new Date(year, month, 1);
    // Día de la semana del primer día (0 = Domingo)
    const firstDayWeekday = firstDayOfMonth.getDay();
    // Último día del mes
    const lastDayOfMonth = new Date(year, month + 1, 0);
    // Total de días en el mes
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Array para los días del calendario
    const calendarDates: Date[] = [];
    
    // Añadir días del mes anterior
    for (let i = 0; i < firstDayWeekday; i++) {
      const prevMonthDay = new Date(year, month, -firstDayWeekday + i + 1);
      calendarDates.push(prevMonthDay);
    }
    
    // Añadir días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const currentMonthDay = new Date(year, month, day);
      calendarDates.push(currentMonthDay);
    }
    
    // Añadir días del mes siguiente
    const remainingDays = 7 - (calendarDates.length % 7);
    if (remainingDays < 7) {
      for (let day = 1; day <= remainingDays; day++) {
        const nextMonthDay = new Date(year, month + 1, day);
        calendarDates.push(nextMonthDay);
      }
    }
    
    return calendarDates;
  };

  // Cambiar al mes anterior
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Cambiar al mes siguiente
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Ir al mes actual
  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  // Manejar clic en un día
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    
    // Buscar datos del día seleccionado
    const formattedDate = date.toISOString().split('T')[0];
    const dayData = calendarDays.find(day => day.date === formattedDate);
    setSelectedDayData(dayData || null);
  };

  // Abrir modal para añadir/editar datos
  const handleOpenModal = () => {
    if (selectedDate) {
      setIsModalOpen(true);
    }
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Guardar datos del día
  const handleSaveDayData = (formData: any) => {
    // En un entorno real, aquí enviaríamos los datos al backend
    console.log('Guardando datos:', formData);
    
    // Actualizar los datos locales
    const updatedDays = [...calendarDays];
    const existingDayIndex = updatedDays.findIndex(day => day.date === formData.date);
    
    const newDayData: CalendarDay = {
      date: formData.date,
      isPeriod: formData.hasPeriod,
      isFertile: false, // Esto normalmente lo calcularía el backend
      isOvulation: false, // Esto normalmente lo calcularía el backend
      hasSymptoms: formData.symptoms.length > 0,
      notes: formData.notes
    };
    
    if (existingDayIndex >= 0) {
      // Actualizar día existente
      updatedDays[existingDayIndex] = {
        ...updatedDays[existingDayIndex],
        ...newDayData
      };
    } else {
      // Añadir nuevo día
      updatedDays.push(newDayData);
    }
    
    setCalendarDays(updatedDays);
    setSelectedDayData(newDayData);
  };

  // Obtener el nombre del mes
  const monthName = currentDate.toLocaleString('es', { month: 'long' });
  const calendarDates = generateCalendarDays();
  const today = new Date();

  return (
    <div className="space-y-8">
      {/* Calendario */}
      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl capitalize">
            {monthName} {currentDate.getFullYear()}
          </h2>
          
          <div className="flex space-x-2">
            <button 
              onClick={goToPreviousMonth}
              className="button-secondary py-2 px-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Anterior
            </button>
            
            <button 
              onClick={goToCurrentMonth}
              className="button-secondary py-2 px-4"
            >
              Hoy
            </button>
            
            <button 
              onClick={goToNextMonth}
              className="button-secondary py-2 px-4"
            >
              Siguiente
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Leyenda del calendario */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center">
            <span className="indicator indicator-period"></span>
            <span>Período</span>
          </div>
          <div className="flex items-center">
            <span className="indicator indicator-fertile"></span>
            <span>Ventana fértil</span>
          </div>
          <div className="flex items-center">
            <span className="indicator indicator-ovulation"></span>
            <span>Ovulación</span>
          </div>
        </div>
        
        {/* Encabezados de días de la semana */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center font-medium text-eyraDeepRed">
              {day}
            </div>
          ))}
        </div>
        
        {/* Días del calendario */}
        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <p>Cargando calendario...</p>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {calendarDates.map((date, index) => {
              const formattedDate = date.toISOString().split('T')[0];
              const dayData = calendarDays.find(day => day.date === formattedDate);
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const isToday = 
                date.getDate() === today.getDate() && 
                date.getMonth() === today.getMonth() && 
                date.getFullYear() === today.getFullYear();
                
              return (
                <CalendarDay 
                  key={index}
                  date={date}
                  dayData={dayData}
                  isCurrentMonth={isCurrentMonth}
                  isToday={isToday}
                  onClick={handleDayClick}
                />
              );
            })}
          </div>
        )}
      </div>
      
      {/* Detalles del día seleccionado */}
      {selectedDate && (
        <div className="card">
          <h3 className="text-xl mb-4 capitalize">
            {selectedDate.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h3>
          
          {selectedDayData ? (
            <div className="space-y-4">
              {selectedDayData.dayOfCycle && (
                <div>
                  <p className="label-text">Día del ciclo</p>
                  <p className="text-xl font-medium">{selectedDayData.dayOfCycle}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#FFF5F5] p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Estado del ciclo</h4>
                  <ul className="space-y-2">
                    {selectedDayData.isPeriod && (
                      <li className="flex items-center">
                        <span className="indicator indicator-period"></span>
                        <span>Período menstrual</span>
                      </li>
                    )}
                    {selectedDayData.isFertile && (
                      <li className="flex items-center">
                        <span className="indicator indicator-fertile"></span>
                        <span>Ventana fértil</span>
                      </li>
                    )}
                    {selectedDayData.isOvulation && (
                      <li className="flex items-center">
                        <span className="indicator indicator-ovulation"></span>
                        <span>Día de ovulación</span>
                      </li>
                    )}
                    {!selectedDayData.isPeriod && !selectedDayData.isFertile && !selectedDayData.isOvulation && (
                      <li>Fase lútea</li>
                    )}
                  </ul>
                </div>
                
                {selectedDayData.hasSymptoms && (
                  <div className="bg-[#F5F5FF] p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Síntomas registrados</h4>
                    <ul className="list-disc pl-5">
                      <li>Dolor de cabeza leve</li>
                      <li>Sensibilidad en los senos</li>
                    </ul>
                  </div>
                )}
                
                <div className="bg-[#F5FFF5] p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Recomendaciones</h4>
                  {selectedDayData.isPeriod ? (
                    <p>Descansa lo suficiente y mantente hidratada. Evita alimentos inflamatorios.</p>
                  ) : selectedDayData.isOvulation ? (
                    <p>Momento ideal para concebir si estás buscando embarazo.</p>
                  ) : (
                    <p>Buen momento para actividades físicas de mayor intensidad.</p>
                  )}
                </div>
              </div>
              
              {selectedDayData.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notas personales</h4>
                  <p className="bg-[#FFFCF5] p-3 rounded-md">{selectedDayData.notes}</p>
                </div>
              )}
              
              <div className="pt-4 flex flex-wrap gap-2">
                <button className="button-primary" onClick={handleOpenModal}>
                  Editar información
                </button>
                
                <button className="button-secondary">
                  Añadir síntomas
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="mb-4">No hay información registrada para este día.</p>
              <button className="button-primary" onClick={handleOpenModal}>
                Añadir información
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Modal para añadir/editar día */}
      {selectedDate && (
        <AddCycleDayModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveDayData}
          date={selectedDate}
          initialData={selectedDayData ? {
            hasPeriod: selectedDayData.isPeriod,
            hasPain: selectedDayData.hasSymptoms, // Simplificación para este ejemplo
            notes: selectedDayData.notes || ''
          } : undefined}
        />
      )}
    </div>
  );
};
