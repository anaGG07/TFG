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

type ViewType = "month" | "week" | "day";

interface NeomorphicCalendarProps {
  className?: string;
}

// CONFIGURACIÓN DE FASES CON COLORES MEJORADOS
const phaseConfig = {
  [CyclePhase.MENSTRUAL]: {
    color: "from-red-200 to-red-300",
    bgColor: "bg-red-100",
    borderColor: "border-red-300",
    textColor: "text-red-800",
    icon: "🩸",
    description: "Menstruación",
  },
  [CyclePhase.FOLICULAR]: {
    color: "from-green-200 to-green-300",
    bgColor: "bg-green-100",
    borderColor: "border-green-300",
    textColor: "text-green-800",
    icon: "🌱",
    description: "Fase folicular",
  },
  [CyclePhase.OVULACION]: {
    color: "from-blue-200 to-blue-300",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-300",
    textColor: "text-blue-800",
    icon: "🥚",
    description: "Ovulación",
  },
  [CyclePhase.LUTEA]: {
    color: "from-yellow-200 to-yellow-300",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-300",
    textColor: "text-yellow-800",
    icon: "🌙",
    description: "Fase lútea",
  },
};

// COMPONENTE DAY CELL MEJORADO CON ASPECTOS VISUALES CORREGIDOS
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
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(date)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        relative overflow-hidden cursor-pointer transition-all duration-300
        ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}
        ${isToday ? "ring-2 ring-[#7a2323] ring-opacity-50" : ""}
        
        ${/* HACER CELDAS MÁS CUADRADAS */ ""}
        aspect-square rounded-xl
        
        ${/* APLICAR COLORES DE FASE */ ""}
        ${
          phaseStyle
            ? `${phaseStyle.bgColor} ${phaseStyle.borderColor} border-2`
            : "bg-[#e7e0d5] border border-gray-200"
        }
        
        ${
          isSelected
            ? "shadow-inner shadow-[#7a2323]/20"
            : "shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)]"
        }
        ${isHovered ? "shadow-[2px_2px_12px_rgba(122,35,35,0.15)]" : ""}
        flex flex-col items-center justify-center p-2 min-h-[60px]
      `}
      initial={false}
      animate={isSelected ? { scale: 0.95 } : { scale: 1 }}
    >
      {/* DÍA DEL MES CON MEJOR CONTRASTE */}
      <motion.div
        className={`
          text-sm font-semibold mb-1
          ${isToday ? "text-[#7a2323] font-bold text-base" : ""}
          ${!isCurrentMonth ? "opacity-50" : ""}
          ${phaseStyle ? phaseStyle.textColor : "text-gray-800"}
        `}
        animate={isToday ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {format(date, "d")}
      </motion.div>

      {/* INDICADORES DE FLUJO MEJORADOS */}
      {dayData?.flowIntensity && dayData.flowIntensity > 0 && (
        <motion.div className="flex gap-0.5 mb-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${
                i < dayData.flowIntensity! ? "bg-red-600" : "bg-red-200"
              }`}
              animate={{
                scale: i < dayData.flowIntensity! ? [1, 1.3, 1] : 1,
                opacity: i < dayData.flowIntensity! ? 1 : 0.3,
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

      {/* EMOJI DE FASE MÁS VISIBLE */}
      {dayData?.phase && (
        <motion.div
          className="text-sm opacity-80"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {phaseConfig[dayData.phase].icon}
        </motion.div>
      )}

      {/* INDICADORES DE SÍNTOMAS MEJORADOS */}
      {dayData?.symptoms && dayData.symptoms.length > 0 && (
        <motion.div
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-orange-500 rounded-full border border-white"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* INDICADORES DE ÁNIMO MEJORADOS */}
      {dayData?.mood && dayData.mood.length > 0 && (
        <motion.div
          className="absolute -top-0.5 -left-0.5 w-3 h-3 bg-purple-500 rounded-full border border-white"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      )}

      {/* INDICADOR DE HOY MÁS VISIBLE */}
      {isToday && (
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-[#7a2323] rounded-full border-2 border-white"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* EFECTO DE HOVER MEJORADO */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// COMPONENTE SELECTOR DE VISTA (sin cambios)
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

  // NAVEGACIÓN
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

  // GENERAR DÍAS CORREGIDO - INCLUYE DÍAS ANTERIORES Y POSTERIORES
  const generateViewDays = (): Date[] => {
    if (viewType === "day") {
      return [startOfDay(currentDate)];
    }

    if (viewType === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    }

    // VISTA MES - INCLUYE DÍAS DEL MES ANTERIOR Y SIGUIENTE
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
        phase: CyclePhase.MENSTRUAL,
        symptoms: modalData.symptoms || [],
        mood: modalData.mood || [],
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al guardar el día del ciclo:", error);
    }
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
    <div
      className={`h-full flex flex-col ${className}`}
      style={{
        maxWidth: "calc(100vw - 320px)",
        maxHeight: "calc(100vh - 120px)",
      }}
    >
      {/* HEADER */}
      <motion.div
        className="flex-shrink-0 mb-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
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

        {/* LEYENDA MEJORADA */}
        <motion.div className="flex flex-wrap gap-4 mt-3">
          {Object.entries(phaseConfig).map(([phase, config]) => (
            <div key={phase} className="flex items-center gap-2 text-xs">
              <div
                className={`w-4 h-4 rounded-full ${config.bgColor} ${config.borderColor} border-2`}
              />
              <span className="text-[#7a2323] capitalize font-medium">
                {config.description}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* CONTENIDO DEL CALENDARIO */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {viewType === "month" && (
            <motion.div
              key="month"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="h-full flex flex-col"
            >
              {/* DÍAS DE LA SEMANA */}
              <div className="grid grid-cols-7 gap-2 mb-3 flex-shrink-0">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-semibold text-[#7a2323] py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* GRID DE DÍAS MEJORADO */}
              <div className="grid grid-cols-7 gap-2 flex-1">
                {viewDates.map((date, index) => {
                  const formattedDate = format(date, "yyyy-MM-dd");
                  const dayData = calendarDays.find(
                    (day) => day.date === formattedDate
                  );
                  const isCurrentMonth = isSameMonth(date, currentDate);
                  const isCurrentDay = isToday(date);

                  return (
                    <motion.div
                      key={formattedDate}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.01 }}
                      className="h-full"
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
      />
    </div>
  );
};
