import React from "react";
import { NeomorphicCalendar } from "../features/calendar/components/NeomorphicCalendar";

const CalendarPage: React.FC = () => {
  return (
    <div className="h-screen overflow-hidden bg-[#e7e0d5] flex flex-col max-w-[calc(100vw-300px)]">
      {/* Header compacto */}
      <div className="flex-shrink-0 px-4 pt-4 pb-2">
        <h1 className="text-2xl font-serif text-[#7a2323] mb-1">Calendario</h1>
        <p className="text-[#7a2323]/70 text-xs max-w-2xl">
          Registra y visualiza tu ciclo menstrual
        </p>
      </div>
      {/* Calendario ocupa todo el espacio */}
      <div className="flex-1 min-h-0 px-4 pb-4 flex flex-col justify-center">
        <NeomorphicCalendar />
      </div>
    </div>
  );
};

export default CalendarPage;
