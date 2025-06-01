// src/features/calendar/components/NeomorphicCalendar.tsx - VERSION COMPACTA
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  format,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  startOfDay,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Grid3X3,
  Rows3,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

// IMPORTS CORRECTOS
import { useCalendarData } from "../hooks/useCalendarData";
import { useCycle } from "../../../context/CycleContext";
import { AddCycleDayModal } from "./AddCycleDayModal";
import Button from "../../../components/Button";
import { CycleDay, CyclePhase } from "../../../types/domain";
import { phaseConfig } from "../config/phaseConfig";

type ViewType = "month" | "week" | "day";

interface NeomorphicCalendarProps {
  className?: string;
}

// COMPONENTE DAY CELL COMPACTO
const NeomorphicDayCell: React.FC<{
  date: Date;
  dayData?: CycleDay;
  isCurrentMonth: boolean;
  isToday: boolean;
  onClick: (date: Date) => void;
  isSelected: boolean;
}> = ({ date, dayData, isCurrentMonth, isToday, onClick, isSelected }) => {
  const [isHovered, setIsHovered] = useState(false);

  const phaseStyle = dayData?.phase ? phaseConfig[dayData.phase] : null;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(date)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        relative overflow-hidden cursor-pointer transition-all duration-200
        ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}
        ${isToday ? "ring-2 ring-[#7a2323] ring-opacity-50" : ""}
        w-full h-full rounded-lg
        ${phaseStyle ? phaseStyle.gradient : "bg-[#e7e0d5]"}
        ${
          isSelected
            ? "shadow-inner shadow-[#7a2323]/20"
            : "shadow-[inset_1px_1px_3px_rgba(199,191,180,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.7)]"
        }
        ${isHovered ? "shadow-[1px_1px_6px_rgba(122,35,35,0.15)]" : ""}
        flex flex-col items-center justify-center
      `}
      initial={false}
      animate={isSelected ? { scale: 0.95 } : { scale: 1 }}
    >
      {/* DIA DEL MES COMPACTO */}
      <motion.div
        className={`
          text-xs font-semibold
          ${isToday ? "text-[#7a2323] font-bold text-sm" : ""}
          ${!isCurrentMonth ? "opacity-50" : ""}
          text-gray-800
        `}
        animate={isToday ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {format(date, "d")}
      </motion.div>
      {/* ICONO DE FASE SIEMPRE VISIBLE */}
      {dayData?.phase && (
        <div className="absolute bottom-1 right-1 text-lg opacity-80 pointer-events-none">
          {phaseConfig[dayData.phase].icon}
        </div>
      )}

      {/* INDICADORES DE FLUJO MUY PEQUENOS */}
      {dayData?.flowIntensity && dayData.flowIntensity > 0 && (
        <motion.div className="flex gap-0.5 mt-0.5">
          {[...Array(Math.min(dayData.flowIntensity, 5))].map((_, i) => (
            <motion.div
              key={i}
              className="w-0.5 h-0.5 rounded-full bg-red-600"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* INDICADORES MINIMOS */}
      {dayData?.symptoms && dayData.symptoms.length > 0 && (
        <motion.div
          className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {dayData?.mood && dayData.mood.length > 0 && (
        <motion.div
          className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-purple-500 rounded-full"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      )}

      {/* INDICADOR DE HOY */}
      {isToday && (
        <motion.div
          className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#7a2323] rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* EFECTO DE HOVER */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// COMPONENTE SELECTOR DE VISTA
const ViewSelector: React.FC<{
  viewType: ViewType;
  onViewChange: (view: ViewType) => void;
}> = ({ viewType, onViewChange }) => {
  return (
    <div className="bg-[#e7e0d5] rounded-xl p-1 shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)]">
      <div className="flex gap-1">
        {[
          { type: "month" as ViewType, icon: Grid3X3, label: "Mes" },
          { type: "week" as ViewType, icon: Rows3, label: "Semana" },
          { type: "day" as ViewType, icon: CalendarIcon, label: "Día" },
        ].map(({ type, icon: Icon, label }) => (
          <motion.button
            key={type}
            onClick={() => onViewChange(type)}
            className={`
              relative px-3 py-1 rounded-lg font-medium text-xs transition-all duration-300
              ${
                viewType === type
                  ? "bg-[#7a2323] text-[#e7e0d5] shadow-[2px_2px_8px_rgba(122,35,35,0.3)]"
                  : "text-[#7a2323] hover:bg-[#f5ede6]"
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-1">
              <Icon className="w-3 h-3" />
              <span>{label}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export const NeomorphicCalendar: React.FC<NeomorphicCalendarProps> = ({
  className = "",
}) => {
  // ESTADO SIMPLE
  const [currentDate, setCurrentDate] = useState(startOfDay(new Date()));
  const [viewType, setViewType] = useState<ViewType>("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // HOOKS CORRECTOS
  const { data: calendarData, isLoading } = useCalendarData(
    currentDate,
    viewType
  );
  const { addCycleDay } = useCycle();

  const calendarDays = calendarData?.calendarDays || [];

  console.log("calendarDays:", calendarDays);

  // NAVEGACION
  const navigatePrevious = () => {
    const newDate =
      viewType === "day"
        ? subDays(currentDate, 1)
        : viewType === "week"
        ? subWeeks(currentDate, 1)
        : subMonths(currentDate, 1);
    setCurrentDate(startOfDay(newDate));
  };

  const navigateNext = () => {
    const newDate =
      viewType === "day"
        ? addDays(currentDate, 1)
        : viewType === "week"
        ? addWeeks(currentDate, 1)
        : addMonths(currentDate, 1);
    setCurrentDate(startOfDay(newDate));
  };

  const goToToday = () => setCurrentDate(startOfDay(new Date()));

  // GENERAR DIAS - INCLUYE DIAS ANTERIORES Y POSTERIORES
  const generateViewDays = (): Date[] => {
    if (viewType === "day") {
      return [startOfDay(currentDate)];
    }

    if (viewType === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    }

    // VISTA MES - INCLUYE DIAS DEL MES ANTERIOR Y SIGUIENTE
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    // Obtener el calendario completo (6 semanas)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const getViewTitle = (): string => {
    switch (viewType) {
      case "day":
        return format(currentDate, "EEEE, d MMMM yyyy", { locale: es });
      case "week":
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        return `${format(weekStart, "d MMM", { locale: es })} - ${format(
          weekEnd,
          "d MMM yyyy",
          { locale: es }
        )}`;
      case "month":
      default:
        return format(currentDate, "MMMM yyyy", { locale: es });
    }
  };

  // MAPEO DE DATOS DEL MODAL
  const handleModalSave = async (modalData: any) => {
    if (!selectedDate || !addCycleDay) {
      console.error(
        "No hay fecha seleccionada o función addCycleDay disponible"
      );
      return;
    }

    try {
      await addCycleDay({
        date: format(selectedDate, "yyyy-MM-dd"),
        flowIntensity: modalData.hasPeriod ? modalData.flowIntensity : 0,
        notes: modalData.notes || "",
        phase: modalData.phase || CyclePhase.MENSTRUAL,
        symptoms: modalData.symptoms || [],
        mood: modalData.mood || [],
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al guardar el día del ciclo:", error);
    }
  };

  // Obtener la fase actual y la siguiente fase
  const getCurrentPhaseInfo = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    // Normalizo la comparación de fechas para ignorar la hora
    const dayData = calendarDays.find(day => day.date.slice(0, 10) === formattedDate);
    
    if (!dayData) return { currentPhase: undefined, nextPhaseDate: undefined };

    // Encontrar el siguiente día con una fase diferente
    const nextPhaseDay = calendarDays.find(day => 
      day.date.slice(0, 10) > formattedDate && day.phase !== dayData.phase
    );

    return {
      currentPhase: dayData.phase,
      nextPhaseDate: nextPhaseDay ? new Date(nextPhaseDay.date) : undefined
    };
  };

  const viewDates = generateViewDays();
  const weekDays = ["L", "M", "X", "J", "V", "S", "D"];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-[#7a2323]"
        >
          <Sparkles className="w-8 h-8" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* HEADER COMPACTO */}
      <motion.div
        className="flex-shrink-0 mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
          <div className="flex items-center gap-3">
            <motion.h2 className="text-xl font-serif text-[#7a2323] capitalize">
              {getViewTitle()}
            </motion.h2>

            <div className="flex gap-1">
              <motion.button
                onClick={navigatePrevious}
                className="p-2 rounded-xl bg-[#e7e0d5] text-[#7a2323] shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[2px_2px_8px_rgba(122,35,35,0.15)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>

              <Button
                onClick={goToToday}
                size="small"
                className="text-xs px-3 py-1"
              >
                Hoy
              </Button>

              <motion.button
                onClick={navigateNext}
                className="p-2 rounded-xl bg-[#e7e0d5] text-[#7a2323] shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[2px_2px_8px_rgba(122,35,35,0.15)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          <ViewSelector viewType={viewType} onViewChange={setViewType} />
        </div>

        {/* LEYENDA COMPACTA */}
        <motion.div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(phaseConfig).map(([phase, config]) => (
            <div key={phase} className="flex items-center gap-1 text-xs">
              <div
                className={`w-2.5 h-2.5 rounded-full ${config.gradient} border`}
              />
              <span className="text-[#7a2323] capitalize font-medium">
                {config.description}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* CONTENIDO DEL CALENDARIO COMPACTO */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col items-center justify-center w-full px-4">
        <AnimatePresence mode="wait">
          {viewType === "month" && (
            <motion.div
              key="month"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="h-full flex flex-col w-full"
            >
              {/* DIAS DE LA SEMANA COMPACTOS */}
              <div className="grid grid-cols-7 gap-x-2 gap-y-1 mb-1 flex-shrink-0 w-full">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-base font-semibold text-[#7a2323] py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* GRID DE DIAS AMPLIO Y CUADRADO */}
              <div className="grid grid-cols-7 grid-rows-6 gap-x-2 gap-y-2 flex-1 h-full w-full">
                {viewDates.map((date, index) => {
                  const formattedDate = format(date, "yyyy-MM-dd");
                  const dayData = calendarDays.find(
                    (day) => day.date.slice(0, 10) === formattedDate
                  );
                  const isCurrentMonth = isSameMonth(date, currentDate);
                  const isCurrentDay = isToday(date);

                  console.log("Celda:", formattedDate, "dayData:", dayData);

                  return (
                    <motion.div
                      key={formattedDate}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.005 }}
                      className="w-full h-full"
                    >
                      <NeomorphicDayCell
                        date={date}
                        dayData={dayData}
                        isCurrentMonth={isCurrentMonth}
                        isToday={isCurrentDay}
                        onClick={handleDayClick}
                        isSelected={false}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MODAL */}
      <AddCycleDayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        date={selectedDate || new Date()}
        {...(selectedDate ? getCurrentPhaseInfo(selectedDate) : {})}
      />
    </div>
  );
};
