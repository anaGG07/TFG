import React from "react";
import { NeomorphicCalendar } from "../features/calendar/components/NeomorphicCalendar";

const CalendarPage: React.FC = () => {
  return (
    <div className="h-screen overflow-hidden bg-[#e7e0d5] flex flex-col">
      {/* Header fijo */}
      <div className="flex-shrink-0 px-6 pt-6 pb-2">
        <h1 className="text-3xl font-serif text-[#7a2323] mb-2">Calendario</h1>
        <p className="text-[#7a2323]/70 text-sm max-w-3xl">
          Registra y visualiza tu ciclo menstrual, síntomas y recibe
          recomendaciones personalizadas. Este calendario te ayudará a entender
          mejor los patrones de tu ciclo.
        </p>
      </div>

      {/* Calendario - ocupa el resto del espacio sin scroll */}
      <div className="flex-1 min-h-0 px-6 pb-6">
        <NeomorphicCalendar />
      </div>
    </div>
  );
};

export default CalendarPage;
