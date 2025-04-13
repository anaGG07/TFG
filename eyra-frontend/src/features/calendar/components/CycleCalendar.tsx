import { useState, useEffect } from 'react';
import { useCycle } from '../../../context/CycleContext';
import { CycleDay, CyclePhase } from '../../../types/domain';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface CalendarDayProps {
  date: Date;
  cycleDay?: CycleDay;
  isCurrentMonth: boolean;
  isToday: boolean;
  onClick: (date: Date) => void;
}

const CalendarDay = ({ date, cycleDay, isCurrentMonth, isToday, onClick }: CalendarDayProps) => {
  // Determinar el color basado en la fase del ciclo
  const getPhaseColor = (phase?: CyclePhase) => {
    if (!phase) return 'bg-white';
    
    switch (phase) {
      case CyclePhase.MENSTRUAL:
        return 'bg-red-100';
      case CyclePhase.FOLICULAR:
        return 'bg-yellow-100';
      case CyclePhase.OVULACION:
        return 'bg-blue-100';
      case CyclePhase.LUTEA:
        return 'bg-green-100';
      default:
        return 'bg-white';
    }
  };

  // Estilo según el estado del día
  const dayClasses = `
    h-12 w-full border rounded-md flex flex-col justify-center items-center 
    ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'} 
    ${isToday ? 'border-purple-500 border-2' : 'border-gray-200'} 
    ${getPhaseColor(cycleDay?.phase)}
    hover:bg-gray-100 cursor-pointer transition-colors
  `;

  return (
    <div 
      className={dayClasses} 
      onClick={() => onClick(date)}
    >
      <span className="text-sm font-medium">{date.getDate()}</span>
      {cycleDay?.flowIntensity && (
        <div className="mt-1 flex space-x-1">
          {[...Array(cycleDay.flowIntensity)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-red-500" />
          ))}
        </div>
      )}
    </div>
  );
};

export const CycleCalendar = () => {
  const { calendarDays, loadCalendarDays, isLoading } = useCycle();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDayData, setSelectedDayData] = useState<CycleDay | null>(null);

  // Cargar días del calendario para el mes actual
  useEffect(() => {
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    loadCalendarDays(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
  }, [currentDate, loadCalendarDays]);

  // Días de la semana
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Generar días del mes actual para el calendario
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Primer día del mes
    const firstDayOfMonth = new Date(year, month, 1);
    // Último día del mes
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Día de la semana del primer día (0 = domingo, 1 = lunes, etc.)
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    // Total de días en el mes
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Array para almacenar las fechas del calendario
    const calendarDates: Date[] = [];
    
    // Añadir días del mes anterior para completar la primera semana
    for (let i = 0; i < firstDayWeekday; i++) {
      calendarDates.push(new Date(year, month, -firstDayWeekday + i + 1));
    }
    
    // Añadir días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDates.push(new Date(year, month, day));
    }
    
    // Añadir días del mes siguiente para completar la última semana
    const remainingDays = 7 - (calendarDates.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        calendarDates.push(new Date(year, month + 1, i));
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
    const dayData = calendarDays.find(day => day.date.split('T')[0] === formattedDate);
    setSelectedDayData(dayData || null);
  };

  // Formato para el nombre del mes y año
  const monthName = currentDate.toLocaleString('es', { month: 'long' });
  const calendarDates = generateCalendarDays();
  const today = new Date();

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold capitalize">
            {monthName} {currentDate.getFullYear()}
          </h2>
          
          <div className="flex space-x-2">
            <Button 
              variant="light" 
              size="sm" 
              onClick={goToPreviousMonth}
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              }
            >
              Anterior
            </Button>
            
            <Button 
              variant="light" 
              size="sm" 
              onClick={goToCurrentMonth}
            >
              Hoy
            </Button>
            
            <Button 
              variant="light" 
              size="sm" 
              onClick={goToNextMonth}
              rightIcon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              }
            >
              Siguiente
            </Button>
          </div>
        </div>

        {/* Leyenda de fases */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-100 mr-1" />
            <span className="text-xs">Menstrual</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-100 mr-1" />
            <span className="text-xs">Folicular</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-100 mr-1" />
            <span className="text-xs">Ovulación</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-100 mr-1" />
            <span className="text-xs">Lútea</span>
          </div>
        </div>
        
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Días del calendario */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDates.map((date, index) => {
            const formattedDate = date.toISOString().split('T')[0];
            const dayData = calendarDays.find(day => day.date.split('T')[0] === formattedDate);
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isToday = 
              date.getDate() === today.getDate() && 
              date.getMonth() === today.getMonth() && 
              date.getFullYear() === today.getFullYear();
              
            return (
              <CalendarDay 
                key={index}
                date={date}
                cycleDay={dayData}
                isCurrentMonth={isCurrentMonth}
                isToday={isToday}
                onClick={handleDayClick}
              />
            );
          })}
        </div>
      </Card>
      
      {/* Detalle del día seleccionado */}
      {selectedDate && (
        <Card 
          title={`Detalles del ${selectedDate.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}`}
          className="mt-4"
        >
          {selectedDayData ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Fase del ciclo</h4>
                <p className="text-gray-700">{selectedDayData.phase}</p>
              </div>
              
              {selectedDayData.flowIntensity !== undefined && (
                <div>
                  <h4 className="font-medium">Intensidad del flujo</h4>
                  <div className="flex space-x-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-6 h-6 rounded-full ${i < (selectedDayData.flowIntensity || 0) ? 'bg-red-500' : 'bg-gray-200'}`} 
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {selectedDayData.symptoms && selectedDayData.symptoms.length > 0 && (
                <div>
                  <h4 className="font-medium">Síntomas</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedDayData.symptoms.map((symptom, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedDayData.mood && selectedDayData.mood.length > 0 && (
                <div>
                  <h4 className="font-medium">Estado de ánimo</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedDayData.mood.map((mood, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {mood}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedDayData.notes && selectedDayData.notes.length > 0 && (
                <div>
                  <h4 className="font-medium">Notas</h4>
                  <ul className="list-disc pl-5 mt-1">
                    {selectedDayData.notes.map((note, index) => (
                      <li key={index} className="text-gray-700">{note}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-4">
                <Button 
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    // Aquí iría la lógica para editar el día
                    console.log('Editar día', selectedDayData);
                  }}
                >
                  Editar información
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No hay información registrada para este día.</p>
              <Button 
                variant="primary"
                size="sm"
                className="mt-2"
                onClick={() => {
                  // Aquí iría la lógica para añadir información
                  console.log('Añadir información', selectedDate);
                }}
              >
                Añadir información
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
