import React, { useState, useEffect } from 'react';
import { useCycle } from '../../../context/CycleContext';
import { CycleDay, CyclePhase } from '../../../types/domain';
import { AddCycleDayModal } from './AddCycleDayModal';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { es } from 'date-fns/locale';

export const EnhancedCalendar = () => {
  const { 
    calendarDays, 
    isLoading, 
    error,
    updateDay,
    addSymptom,
    statistics,
    predictions
  } = useCycle();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDayData, setSelectedDayData] = useState<CycleDay | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Generar días del calendario
  const generateCalendarDays = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  // Manejar clic en un día
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = format(date, 'yyyy-MM-dd');
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
  const handleSaveDayData = async (formData: any) => {
    try {
      if (selectedDate) {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        await updateDay(formattedDate, formData);
        
        // Si hay síntomas nuevos, añadirlos
        if (formData.symptoms && formData.symptoms.length > 0) {
          for (const symptom of formData.symptoms) {
            await addSymptom({
              entityType: 'DAY',
              entityId: parseInt(formattedDate.replace(/-/g, '')),
              symptom,
              intensity: formData.flowIntensity || 0
            });
          }
        }
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
    }
  };

  // Obtener el nombre del mes
  const monthName = format(currentDate, 'MMMM yyyy', { locale: es });
  const calendarDates = generateCalendarDays();
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Encabezado del calendario */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 capitalize">{monthName}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            →
          </button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Días del calendario */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDates.map(date => {
          const formattedDate = format(date, 'yyyy-MM-dd');
          const dayData = calendarDays.find(day => day.date === formattedDate);
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isCurrentDay = isToday(date);

          return (
            <div
              key={formattedDate}
              onClick={() => handleDayClick(date)}
              className={`
                aspect-square p-2 border rounded-lg cursor-pointer
                ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                ${isCurrentDay ? 'border-purple-500 border-2' : 'border-gray-200'}
                ${dayData?.phase ? `bg-${getPhaseColor(dayData.phase)}` : ''}
                hover:bg-gray-50
              `}
            >
              <div className="text-sm font-medium">{format(date, 'd')}</div>
              {dayData?.flowIntensity && (
                <div className="mt-1 flex space-x-1">
                  {[...Array(dayData.flowIntensity)].map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-red-500" />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Panel lateral con detalles del día seleccionado */}
      {selectedDate && selectedDayData && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {format(selectedDate, 'EEEE d MMMM', { locale: es })}
          </h3>
          
          <div className="space-y-4">
            {selectedDayData.phase && (
              <div className="bg-white p-3 rounded-lg">
                <h4 className="font-medium mb-2">Fase del ciclo</h4>
                <p className="capitalize">{selectedDayData.phase.toLowerCase()}</p>
              </div>
            )}
            
            {selectedDayData.symptoms.length > 0 && (
              <div className="bg-[#F5F5FF] p-4 rounded-lg">
                <h4 className="font-medium mb-2">Síntomas registrados</h4>
                <ul className="list-disc pl-5">
                  {selectedDayData.symptoms.map(symptom => (
                    <li key={symptom}>{symptom}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {selectedDayData.mood.length > 0 && (
              <div className="bg-[#F5FFF5] p-4 rounded-lg">
                <h4 className="font-medium mb-2">Estado de ánimo</h4>
                <ul className="list-disc pl-5">
                  {selectedDayData.mood.map(mood => (
                    <li key={mood}>{mood}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {selectedDayData.notes.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Notas personales</h4>
                <p className="bg-[#FFFCF5] p-3 rounded-md">
                  {selectedDayData.notes.join(', ')}
                </p>
              </div>
            )}
            
            <div className="pt-4 flex flex-wrap gap-2">
              <button 
                className="button-primary"
                onClick={handleOpenModal}
              >
                Editar información
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para añadir/editar datos */}
      {isModalOpen && selectedDate && (
        <AddCycleDayModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveDayData}
          date={selectedDate}
          initialData={selectedDayData || undefined}
        />
      )}
    </div>
  );
};

// Función auxiliar para obtener el color según la fase
const getPhaseColor = (phase: CyclePhase): string => {
  switch (phase) {
    case CyclePhase.MENSTRUAL:
      return 'red-100';
    case CyclePhase.FOLICULAR:
      return 'yellow-100';
    case CyclePhase.OVULACION:
      return 'blue-100';
    case CyclePhase.LUTEA:
      return 'green-100';
    default:
      return 'white';
  }
};
