import React from "react";
import { NeomorphicCalendar } from "../features/calendar/components/NeomorphicCalendar";
import { useViewport } from "../hooks/useViewport";

const CalendarPage: React.FC = () => {
  const { isMobile, isTablet, isDesktop } = useViewport();

  return (
    <div className={`h-screen overflow-hidden bg-[#e7e0d5] flex flex-col ${
      isDesktop ? 'max-w-[calc(100vw-300px)]' : 'w-full'
    }`}>
      {/* Header compacto */}
      <div className={`flex-shrink-0 pt-4 pb-2 ${
        isMobile ? 'px-3' : isTablet ? 'px-4' : 'px-4'
      }`}>
        <h1 className={`font-serif text-[#7a2323] mb-1 ${
          isMobile ? 'text-xl' : 'text-2xl'
        }`}>Calendario</h1>
        <p className={`text-[#7a2323]/70 max-w-2xl ${
          isMobile ? 'text-xs' : 'text-xs'
        }`}>
          Registra y visualiza tu ciclo menstrual
        </p>
      </div>
      {/* Calendario ocupa todo el espacio */}
      <div className={`flex-1 min-h-0 pb-4 flex flex-col justify-center ${
        isMobile ? 'px-1' : isTablet ? 'px-2' : 'px-4'
      }`}>
        <NeomorphicCalendar />
      </div>
    </div>
  );
};

export default CalendarPage;