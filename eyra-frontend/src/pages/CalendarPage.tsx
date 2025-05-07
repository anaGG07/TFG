import React from 'react';
import { EnhancedCalendar } from '../features/calendar/components/EnhancedCalendar';

const CalendarPage = () => {
  return (
    <div className="calendar-page pt-24 pb-20 px-4">
      <div className="container">
        <h1>Calendario</h1>
        
        <div className="mb-6">
          <p>
            Registra y visualiza tu ciclo menstrual, tus síntomas y recibe recomendaciones personalizadas.
            Este calendario te ayudará a entender mejor los patrones de tu ciclo y a tomar el control de tu bienestar.
          </p>
        </div>
        
        <EnhancedCalendar />
      </div>
    </div>
  );
};

export default CalendarPage;