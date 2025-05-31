import React from "react";
import { CalendarContainer } from "../features/calendar/components/CalendarContainer";

const CalendarPage: React.FC = () => {
  return (
    <div className="calendar-page">
      <div className="container">
        <div className="mb-6">
          <h1>Calendario</h1>
          <p>
            Registra y visualiza tu ciclo menstrual, síntomas y recibe
            recomendaciones personalizadas. Este calendario te ayudará a
            entender mejor los patrones de tu ciclo.
          </p>
        </div>

        <CalendarContainer className="calendar-container" />
      </div>
    </div>
  );
};

export default CalendarPage;
