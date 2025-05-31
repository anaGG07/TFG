import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useCycle } from "../../../context/CycleContext";
import { CycleDay, CyclePhase } from "../../../types/domain";
import { Card } from "../../../components/ui/Card";
import Button from "../../../components/Button";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek,
  startOfDay,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Grid3X3,
  Rows3,
  ChevronLeft,
  ChevronRight,
  Plus,
  Moon,
  Sun,
  Sparkles,
  Heart,
} from "lucide-react";

type ViewType = "month" | "week" | "day";

interface NeomorphicCalendarProps {
  className?: string;
}

const phaseConfig = {
  [CyclePhase.MENSTRUAL]: {
    color: "from-red-100 to-red-200",
    shadow: "shadow-red-200/50",
    icon: "🔴",
    gradient: "bg-gradient-to-br from-red-50 via-red-100 to-red-150",
  },
  [CyclePhase.FOLICULAR]: {
    color: "from-yellow-100 to-yellow-200",
    shadow: "shadow-yellow-200/50",
    icon: "🌱",
    gradient: "bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-150",
  },
  [CyclePhase.OVULACION]: {
    color: "from-blue-100 to-blue-200",
    shadow: "shadow-blue-200/50",
    icon: "💙",
    gradient: "bg-gradient-to-br from-blue-50 via-blue-100 to-blue-150",
  },
  [CyclePhase.LUTEA]: {
    color: "from-green-100 to-green-200",
    shadow: "shadow-green-200/50",
    icon: "🌿",
    gradient: "bg-gradient-to-br from-green-50 via-green-100 to-green-150",
  },
};

const NeomorphicDayCell: React.FC<{
  date: Date;
  dayData?: CycleDay;
  isCurrentMonth: boolean;
  isToday: boolean;
  onClick: (date: Date) => void;
  isSelected: boolean;
}> = ({ date, dayData, isCurrentMonth, isToday, onClick, isSelected }) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses = `
    relative overflow-hidden cursor-pointer transition-all duration-300
    ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}
    ${isToday ? "ring-2 ring-[#7a2323] ring-opacity-50" : ""}
  `;

  const phaseStyle = dayData?.phase ? phaseConfig[dayData.phase] : null;

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(date)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        ${baseClasses}
        bg-[#e7e0d5] rounded-2xl
        ${phaseStyle ? `bg-gradient-to-br ${phaseStyle.color}` : "bg-[#e7e0d5]"}
        ${
          isSelected
            ? "shadow-inner shadow-[#7a2323]/20"
            : "shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)]"
        }
        ${isHovered ? "shadow-[2px_2px_12px_rgba(122,35,35,0.15)]" : ""}
        aspect-square flex flex-col items-center justify-center p-1 min-h-[60px]
      `}
      initial={false}
      animate={isSelected ? { scale: 0.95 } : { scale: 1 }}
    >
      {/* Día del mes */}
      <motion.div
        className={`
          text-sm font-medium mb-1
          ${isToday ? "text-[#7a2323] font-bold text-base" : ""}
          ${!isCurrentMonth ? "opacity-50" : ""}
        `}
        animate={isToday ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {format(date, "d")}
      </motion.div>

      {/* Indicadores de flujo */}
      {dayData?.flowIntensity && dayData.flowIntensity > 0 && (
        <motion.div
          className="flex gap-0.5 mb-1"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {[...Array(Math.min(dayData.flowIntensity, 5))].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full bg-red-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Emoji de fase */}
      {dayData?.phase && (
        <motion.div
          className="text-xs opacity-70"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {phaseConfig[dayData.phase].icon}
        </motion.div>
      )}

      {/* Efecto de hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Indicador de hoy */}
      {isToday && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-[#7a2323] rounded-full"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

const ViewSelector: React.FC<{
  viewType: ViewType;
  onViewChange: (view: ViewType) => void;
}> = ({ viewType, onViewChange }) => {
  return (
    <div className="bg-[#e7e0d5] rounded-2xl p-2 shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)]">
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
              relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300
              ${
                viewType === type
                  ? "bg-[#7a2323] text-[#e7e0d5] shadow-[2px_2px_8px_rgba(122,35,35,0.3)]"
                  : "text-[#7a2323] hover:bg-[#f5ede6]"
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={viewType === type ? { y: [-1, 0] } : {}}
          >
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </div>
            {viewType === type && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-[#7a2323] rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export const NeomorphicCalendar: React.FC<NeomorphicCalendarProps> = ({
  className = "",
}) => {
  const { calendarDays, isLoading, loadCalendarDays, addCycleDay } = useCycle();
  const [currentDate, setCurrentDate] = useState(startOfDay(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDayData, setSelectedDayData] = useState<CycleDay | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewType, setViewType] = useState<ViewType>("month");

  // Cargar datos cuando cambia la fecha o vista
  useEffect(() => {
    const { start, end } = getDateRange();
    const startStr = format(start, "yyyy-MM-dd");
    const endStr = format(end, "yyyy-MM-dd");

    if (loadCalendarDays) {
      loadCalendarDays(startStr, endStr);
    }
  }, [currentDate, viewType, loadCalendarDays]);

  const getDateRange = () => {
    switch (viewType) {
      case "day":
        return { start: startOfDay(currentDate), end: startOfDay(currentDate) };
      case "week":
        return {
          start: startOfDay(startOfWeek(currentDate, { weekStartsOn: 1 })),
          end: startOfDay(endOfWeek(currentDate, { weekStartsOn: 1 })),
        };
      case "month":
      default:
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        return {
          start: startOfDay(startOfWeek(monthStart, { weekStartsOn: 1 })),
          end: startOfDay(endOfWeek(monthEnd, { weekStartsOn: 1 })),
        };
    }
  };

  const generateViewDays = (): Date[] => {
    const { start, end } = getDateRange();
    return eachDayOfInterval({ start, end });
  };

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

  const goToToday = () => {
    setCurrentDate(startOfDay(new Date()));
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = format(date, "yyyy-MM-dd");
    const dayData =
      calendarDays?.find((day) => day.date === formattedDate) || null;
    setSelectedDayData(dayData);
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

  const viewDates = generateViewDays();
  const weekDays = ["L", "M", "X", "J", "V", "S", "D"];
  const safeCalendarDays = calendarDays || [];

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center h-[calc(100vh-200px)] ${className}`}
      >
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
    <div className={`h-[calc(100vh-200px)] flex flex-col ${className}`}>
      {/* Header */}
      <motion.div
        className="flex-shrink-0 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Título y navegación */}
          <div className="flex items-center gap-4">
            <motion.h2
              className="text-2xl font-serif text-[#7a2323] capitalize min-w-0"
              key={getViewTitle()}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {getViewTitle()}
            </motion.h2>

            <div className="flex gap-2">
              <motion.button
                onClick={navigatePrevious}
                className="p-3 rounded-2xl bg-[#e7e0d5] text-[#7a2323] shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[2px_2px_8px_rgba(122,35,35,0.15)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              <Button onClick={goToToday} size="small">
                Hoy
              </Button>

              <motion.button
                onClick={navigateNext}
                className="p-3 rounded-2xl bg-[#e7e0d5] text-[#7a2323] shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[2px_2px_8px_rgba(122,35,35,0.15)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Selector de vista */}
          <ViewSelector viewType={viewType} onViewChange={setViewType} />
        </div>

        {/* Leyenda de fases */}
        <motion.div
          className="flex flex-wrap gap-4 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {Object.entries(phaseConfig).map(([phase, config]) => (
            <div key={phase} className="flex items-center gap-2 text-sm">
              <div
                className={`w-4 h-4 rounded-full bg-gradient-to-br ${config.color}`}
              />
              <span className="text-[#7a2323] capitalize">
                {phase.toLowerCase()}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Contenido del calendario */}
      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          {viewType === "month" && (
            <motion.div
              key="month"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              {/* Días de la semana */}
              <div className="grid grid-cols-7 gap-2 mb-4 flex-shrink-0">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-[#7a2323] py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Grid de días - altura fija para evitar scroll */}
              <div
                className="grid grid-cols-7 gap-2 flex-1"
                style={{ height: "calc(100% - 60px)" }}
              >
                {viewDates.map((date, index) => {
                  const formattedDate = format(date, "yyyy-MM-dd");
                  const dayData = safeCalendarDays.find(
                    (day) => day.date === formattedDate
                  );
                  const isCurrentMonth = isSameMonth(date, currentDate);
                  const isCurrentDay = isToday(date);
                  const isSelected =
                    selectedDate &&
                    format(selectedDate, "yyyy-MM-dd") === formattedDate;

                  return (
                    <motion.div
                      key={formattedDate}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="h-full"
                    >
                      <NeomorphicDayCell
                        date={date}
                        dayData={dayData}
                        isCurrentMonth={isCurrentMonth}
                        isToday={isCurrentDay}
                        onClick={handleDayClick}
                        isSelected={!!isSelected}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {viewType === "week" && (
            <motion.div
              key="week"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <div className="grid grid-cols-7 gap-4 h-full">
                {viewDates.map((date, index) => {
                  const formattedDate = format(date, "yyyy-MM-dd");
                  const dayData = safeCalendarDays.find(
                    (day) => day.date === formattedDate
                  );
                  const isCurrentDay = isToday(date);

                  return (
                    <motion.div
                      key={formattedDate}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col"
                    >
                      <div className="text-center mb-3">
                        <div className="text-xs text-[#7a2323] opacity-70">
                          {format(date, "EEE", { locale: es })}
                        </div>
                        <div
                          className={`text-lg font-medium ${
                            isCurrentDay
                              ? "text-[#7a2323] font-bold"
                              : "text-gray-900"
                          }`}
                        >
                          {format(date, "d")}
                        </div>
                      </div>
                      <div
                        className={`
                          flex-1 p-4 rounded-2xl cursor-pointer transition-all duration-300
                          ${
                            dayData?.phase
                              ? `bg-gradient-to-br ${
                                  phaseConfig[dayData.phase].color
                                }`
                              : "bg-[#e7e0d5]"
                          }
                          shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)]
                          hover:shadow-[2px_2px_12px_rgba(122,35,35,0.15)]
                        `}
                        onClick={() => handleDayClick(date)}
                      >
                        {dayData && (
                          <div className="space-y-2">
                            {dayData.flowIntensity &&
                              dayData.flowIntensity > 0 && (
                                <div className="flex gap-1">
                                  {[
                                    ...Array(
                                      Math.min(dayData.flowIntensity, 5)
                                    ),
                                  ].map((_, i) => (
                                    <div
                                      key={i}
                                      className="w-2 h-2 rounded-full bg-red-500"
                                    />
                                  ))}
                                </div>
                              )}
                            {dayData.symptoms &&
                              dayData.symptoms.length > 0 && (
                                <div className="text-xs text-gray-600 line-clamp-2">
                                  {dayData.symptoms.slice(0, 2).join(", ")}
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {viewType === "day" && (
            <motion.div
              key="day"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="h-full flex items-center justify-center"
            >
              {(() => {
                const formattedDate = format(currentDate, "yyyy-MM-dd");
                const dayData = safeCalendarDays.find(
                  (day) => day.date === formattedDate
                );

                return (
                  <div className="max-w-md w-full">
                    <Card
                      noPadding
                      className={`
                        ${
                          dayData?.phase
                            ? `bg-gradient-to-br ${
                                phaseConfig[dayData.phase].color
                              }`
                            : "bg-[#e7e0d5]"
                        }
                        shadow-[8px_8px_24px_rgba(122,35,35,0.1)] border-none
                      `}
                    >
                      <div className="p-8">
                        {dayData ? (
                          <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {dayData.phase && (
                              <div className="text-center">
                                <div className="text-4xl mb-2">
                                  {phaseConfig[dayData.phase].icon}
                                </div>
                                <h3 className="text-xl font-serif text-[#7a2323] capitalize">
                                  Fase {dayData.phase.toLowerCase()}
                                </h3>
                              </div>
                            )}

                            {dayData.flowIntensity &&
                              dayData.flowIntensity > 0 && (
                                <div>
                                  <h4 className="font-medium text-[#7a2323] mb-2">
                                    Intensidad del flujo
                                  </h4>
                                  <div className="flex gap-2">
                                    {[...Array(5)].map((_, i) => (
                                      <motion.div
                                        key={i}
                                        className={`w-4 h-4 rounded-full ${
                                          i < dayData.flowIntensity!
                                            ? "bg-red-500"
                                            : "bg-gray-200"
                                        }`}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.3 + i * 0.1 }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}

                            {dayData.symptoms &&
                              dayData.symptoms.length > 0 && (
                                <div>
                                  <h4 className="font-medium text-[#7a2323] mb-2">
                                    Síntomas
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {dayData.symptoms.map((symptom, index) => (
                                      <motion.span
                                        key={symptom}
                                        className="px-3 py-1 bg-white/50 text-[#7a2323] rounded-full text-sm"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                          delay: 0.4 + index * 0.1,
                                        }}
                                      >
                                        {symptom}
                                      </motion.span>
                                    ))}
                                  </div>
                                </div>
                              )}

                            {dayData.mood && dayData.mood.length > 0 && (
                              <div>
                                <h4 className="font-medium text-[#7a2323] mb-2">
                                  Estado de ánimo
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {dayData.mood.map((mood, index) => (
                                    <motion.span
                                      key={mood}
                                      className="px-3 py-1 bg-white/30 text-[#7a2323] rounded-full text-sm"
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.5 + index * 0.1 }}
                                    >
                                      {mood}
                                    </motion.span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ) : (
                          <motion.div
                            className="text-center py-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <Moon className="w-12 h-12 text-[#7a2323] opacity-50 mx-auto mb-4" />
                            <p className="text-[#7a2323] opacity-70 mb-4">
                              No hay información para este día
                            </p>
                          </motion.div>
                        )}

                        <motion.div
                          className="mt-6 flex justify-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <Button
                            onClick={() => {
                              setSelectedDate(currentDate);
                              setSelectedDayData(dayData || null);
                              setIsModalOpen(true);
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            {dayData
                              ? "Editar información"
                              : "Añadir información"}
                          </Button>
                        </motion.div>
                      </div>
                    </Card>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal neomorphic */}
      <AnimatePresence>
        {isModalOpen && selectedDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-[#e7e0d5] rounded-3xl p-8 max-w-md w-full shadow-[8px_8px_32px_rgba(122,35,35,0.15)] border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <motion.h3
                  className="text-xl font-serif text-[#7a2323]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {selectedDayData
                    ? "Editar información"
                    : "Añadir información"}
                </motion.h3>
                <motion.button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-2xl bg-[#e7e0d5] text-[#7a2323] shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[2px_2px_8px_rgba(122,35,35,0.15)]"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>

              <motion.p
                className="text-[#7a2323] opacity-70 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.2 }}
              >
                {format(selectedDate, "EEEE d MMMM yyyy", { locale: es })}
              </motion.p>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-[#7a2323] mb-3">
                    Intensidad del flujo
                  </label>
                  <div className="bg-[#e7e0d5] rounded-2xl p-4 shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)]">
                    <select
                      className="w-full bg-transparent text-[#7a2323] focus:outline-none"
                      defaultValue={selectedDayData?.flowIntensity || 0}
                      id="flowIntensity"
                    >
                      <option value={0}>Sin flujo</option>
                      <option value={1}>Muy ligero</option>
                      <option value={2}>Ligero</option>
                      <option value={3}>Moderado</option>
                      <option value={4}>Abundante</option>
                      <option value={5}>Muy abundante</option>
                    </select>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-[#7a2323] mb-3">
                    Notas personales
                  </label>
                  <div className="bg-[#e7e0d5] rounded-2xl p-4 shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)]">
                    <textarea
                      className="w-full bg-transparent text-[#7a2323] placeholder-[#7a2323]/50 focus:outline-none resize-none"
                      rows={3}
                      placeholder="¿Cómo te sientes hoy? Anota cualquier síntoma o estado de ánimo..."
                      defaultValue={selectedDayData?.notes?.join(", ") || ""}
                      id="notes"
                    />
                  </div>
                </motion.div>
              </div>

              <motion.div
                className="flex gap-3 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 p-3 rounded-2xl bg-[#e7e0d5] text-[#7a2323] shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[2px_2px_8px_rgba(122,35,35,0.15)] transition-all duration-300 font-medium"
                >
                  Cancelar
                </button>
                <motion.button
                  onClick={async () => {
                    const flowSelect = document.getElementById(
                      "flowIntensity"
                    ) as HTMLSelectElement;
                    const notesTextarea = document.getElementById(
                      "notes"
                    ) as HTMLTextAreaElement;

                    if (addCycleDay) {
                      await addCycleDay({
                        date: format(selectedDate, "yyyy-MM-dd"),
                        flowIntensity: parseInt(flowSelect.value),
                        notes: notesTextarea.value,
                        phase: CyclePhase.MENSTRUAL,
                        symptoms: [],
                        mood: [],
                      });
                    }

                    setIsModalOpen(false);
                  }}
                  className="flex-1 p-3 rounded-2xl bg-[#7a2323] text-[#e7e0d5] shadow-[2px_2px_8px_rgba(122,35,35,0.3)] hover:shadow-[4px_4px_12px_rgba(122,35,35,0.4)] transition-all duration-300 font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4" />
                    Guardar
                  </div>
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
