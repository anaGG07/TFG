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
  Grid3X3,
  Rows3,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

// IMPORTS CORRECTOS
import { useCalendarData } from "../hooks/useCalendarData";
import { useCycle } from "../../../context/CycleContext";
import { useViewport } from "../../../hooks/useViewport";
import { AddCycleDayModal } from "./AddCycleDayModal";
import Button from "../../../components/Button";
import { CycleDay, CyclePhase } from "../../../types/domain";
import { phaseConfig } from "../config/phaseConfig";

type ViewType = "month" | "week"; // ! 02/06/2025 - Eliminada vista "day"

interface NeomorphicCalendarProps {
  className?: string;
}

/* ! 02/06/2025 - Componente actualizado para manejar predicciones y nuevos estilos */
const NeomorphicDayCell: React.FC<{
  date: Date;
  dayData?: CycleDay;
  isCurrentMonth: boolean;
  isToday: boolean;
  onClick: (date: Date) => void;
  isSelected: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
}> = ({ date, dayData, isCurrentMonth, isToday, onClick, isSelected, isMobile = false, isTablet = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  const phaseStyle = dayData?.phase ? phaseConfig[dayData.phase] : null;
  const isPredicted = dayData?.isPrediction || false;
  const confidence = dayData?.confidence || 0;

  // ! 02/06/2025 - Lógica para determinar el estilo de la celda
  const getCellStyle = () => {
    if (!phaseStyle) {
      return "bg-[#e7e0d5]"; // Color base sin fase
    }

    // Menstruación: fondo completo con color pastel
    if (dayData?.phase === CyclePhase.MENSTRUAL) {
      return phaseStyle.fullBackground;
    }

    // Primer día de ovulación: fondo completo
    if (dayData?.phase === CyclePhase.OVULACION && dayData?.dayNumber === 1) {
      return phaseStyle.fullBackground;
    }

    // Resto de fases: fondo base
    return "bg-[#e7e0d5]";
  };

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
        ${getCellStyle()}
        ${
          isPredicted ? "opacity-70 border-2 border-dashed border-gray-400" : ""
        }
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
      {/* DIA DEL MES COMPACTO CON INDICADOR DE PREDICCIÓN */}
      <motion.div
        className={`
          font-semibold
          ${isToday ? "text-[#7a2323] font-bold" : ""}
          ${!isCurrentMonth ? "opacity-50" : ""}
          ${isPredicted ? "text-gray-600 italic" : "text-gray-800"}
          ${
            isMobile 
              ? isToday ? 'text-base' : 'text-sm'
              : isTablet 
                ? isToday ? 'text-lg' : 'text-base'
                : isToday ? 'text-lg' : 'text-base'
          }
        `}
        animate={isToday ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {format(date, "d")}
        {isPredicted && <span className={`ml-0.5 opacity-60 ${
          isMobile ? 'text-[6px]' : 'text-[8px]'
        }`}>?</span>}
      </motion.div>



      {/* ICONO DE FASE ANIMADO */}
      {dayData?.phase && phaseStyle && (
        <motion.div
          className={`absolute bottom-1 right-1 pointer-events-none ${
            isPredicted ? "opacity-50" : "opacity-80"
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 400,
            damping: 30
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`${
              isMobile ? 'scale-[0.85]' : 'scale-[0.9]'
            }`}
          >
            {phaseConfig[dayData.phase].icon(
              dayData.phase === CyclePhase.MENSTRUAL ? "#ef4444" :
              dayData.phase === CyclePhase.FOLICULAR ? "#10b981" :
              dayData.phase === CyclePhase.OVULACION ? "#8b5cf6" :
              "#f59e0b"
            )}
          </motion.div>
        </motion.div>
      )}
      
      {/* INDICADOR DE PREDICCIÓN EN ESQUINA SUPERIOR IZQUIERDA */}
      {isPredicted && (
        <motion.div 
          className={`absolute top-1 left-1 bg-blue-400 rounded-full ${
            isMobile ? 'w-2 h-2' : 'w-2.5 h-2.5'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            delay: 0.1,
            type: "spring",
            stiffness: 500,
            damping: 25
          }}
        />
      )}

      {/* INDICADORES DE FLUJO CON ESTILO PREDICCIÓN */}
      {dayData?.flowIntensity && dayData.flowIntensity > 0 && (
        <motion.div className={`flex gap-0.5 ${
          isMobile ? 'mt-0' : 'mt-0.5'
        }`}>
          {[...Array(Math.min(dayData.flowIntensity, 5))].map((_, i) => (
            <motion.div
              key={i}
              className={`rounded-full ${
                isPredicted ? "bg-red-300" : "bg-red-500"
              } ${
                isMobile ? 'w-0.5 h-0.5' : 'w-0.5 h-0.5'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: i * 0.05,
                type: "spring",
                stiffness: 500,
                damping: 25
              }}
            />
          ))}
        </motion.div>
      )}

      {/* INDICADORES MINIMOS */}
      {dayData?.symptoms && dayData.symptoms.length > 0 && (
        <motion.div
          className={`absolute top-0.5 right-0.5 bg-orange-500 rounded-full ${
            isMobile ? 'w-1 h-1' : 'w-1.5 h-1.5'
          }`}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {dayData?.mood && dayData.mood.length > 0 && (
        <motion.div
          className={`absolute top-0.5 left-0.5 bg-purple-500 rounded-full ${
            isMobile ? 'w-1 h-1' : 'w-1.5 h-1.5'
          }`}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      )}

      {/* INDICADOR DE HOY CON TOOLTIP DE PREDICCIÓN */}
      {isToday && (
        <motion.div
          className={`absolute -top-0.5 -right-0.5 bg-[#7a2323] rounded-full ${
            isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'
          }`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* TOOLTIP DE CONFIANZA PARA PREDICCIONES */}
      {isPredicted && isHovered && confidence > 0 && (
        <motion.div
          className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-1 py-0.5 rounded whitespace-nowrap z-10 ${
            isMobile ? 'text-[7px]' : 'text-[8px]'
          }`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
        >
          Predicción {confidence}%
        </motion.div>
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
  isMobile?: boolean;
  isTablet?: boolean;
}> = ({ viewType, onViewChange, isMobile = false, isTablet = false }) => {
  return (
    <div className={`bg-[#e7e0d5] rounded-xl shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)] ${
      isMobile ? 'p-0.5' : 'p-1'
    }`}>
      <div className={`flex ${
        isMobile ? 'gap-0.5' : 'gap-1'
      }`}>
        {[
          { type: "month" as ViewType, icon: Grid3X3, label: "Mes" },
          { type: "week" as ViewType, icon: Rows3, label: "Semana" },
        ].map(({ type, icon: Icon, label }) => (
          <motion.button
            key={type}
            onClick={() => onViewChange(type)}
            className={`
              relative rounded-lg font-medium transition-all duration-300
              ${
                viewType === type
                  ? "bg-[#7a2323] text-[#e7e0d5] shadow-[2px_2px_8px_rgba(122,35,35,0.3)]"
                  : "text-[#7a2323] hover:bg-[#f5ede6]"
              }
              ${
                isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-xs'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className={`flex items-center ${
              isMobile ? 'gap-0.5' : 'gap-1'
            }`}>
              <Icon className={isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
              {!isMobile && <span>{label}</span>}
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
  const { isMobile, isTablet, isDesktop } = useViewport();
  
  // ! 03/06/2025 - ESTADO MEJORADO con datos del día seleccionado
  const [currentDate, setCurrentDate] = useState(startOfDay(new Date()));
  const [viewType, setViewType] = useState<ViewType>("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDayData, setSelectedDayData] = useState<CycleDay | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // HOOKS CORRECTOS
  const { data: calendarData, isLoading } = useCalendarData(
    currentDate,
    viewType
  );
  const { addCycleDay } = useCycle();

  const calendarDays = calendarData?.calendarDays || [];

  // ! 03/06/2025 - Función para convertir datos del día del ciclo a formato del modal
  const convertCycleDayToModalData = (dayData: CycleDay | null) => {
    if (!dayData) return {};

    // Convertir array de notas a string
    const notesString = Array.isArray(dayData.notes)
      ? dayData.notes.join("\n")
      : dayData.notes || "";

    return {
      date: dayData.date.slice(0, 10), // Solo la fecha YYYY-MM-DD
      hasPeriod: (dayData.flowIntensity && dayData.flowIntensity > 0) || false,
      flowIntensity: dayData.flowIntensity || 1,
      hasPain: false, // Por ahora no tenemos este campo en la BD
      painLevel: 1, // Por ahora no tenemos este campo en la BD
      symptoms: dayData.symptoms || [],
      mood: dayData.mood || [],
      notes: notesString,
      phase: dayData.phase,
    };
  };

  // NAVEGACION - Solo mes y semana
  const navigatePrevious = () => {
    const newDate =
      viewType === "week"
        ? subWeeks(currentDate, 1)
        : subMonths(currentDate, 1);
    setCurrentDate(startOfDay(newDate));
  };

  const navigateNext = () => {
    const newDate =
      viewType === "week"
        ? addWeeks(currentDate, 1)
        : addMonths(currentDate, 1);
    setCurrentDate(startOfDay(newDate));
  };

  const goToToday = () => setCurrentDate(startOfDay(new Date()));

  // GENERAR DIAS - Solo mes y semana
  const generateViewDays = (): Date[] => {
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

  // ! 03/06/2025 - Función mejorada para manejar clic en día con detección de datos existentes
  const handleDayClick = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");

    // Buscar datos existentes para esta fecha
    const existingDayData = calendarDays.find(
      (day) => day.date.slice(0, 10) === formattedDate
    );

    setSelectedDate(date);
    setSelectedDayData(existingDayData || null);
    setIsModalOpen(true);
  };

  const getViewTitle = (): string => {
    switch (viewType) {
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

  // ! 03/06/2025 - MAPEO DE DATOS DEL MODAL corregido para backend
  const handleModalSave = async (modalData: any) => {
    if (!selectedDate || !addCycleDay) {
      console.error(
        "No hay fecha seleccionada o función addCycleDay disponible"
      );
      return;
    }

    try {
      // ! 03/06/2025 - Mapear los datos del modal al formato simple esperado por el backend
      const cycleDayData = {
        date: format(selectedDate, "yyyy-MM-dd"),
        symptoms: modalData.symptoms || [],
        mood: modalData.mood || [],
        notes: modalData.notes || "",
        // Solo incluir flowIntensity si hay período
        ...(modalData.hasPeriod &&
          modalData.flowIntensity && {
            flowIntensity: modalData.flowIntensity,
          }),
      };

      await addCycleDay(cycleDayData);
      setIsModalOpen(false);
      setSelectedDayData(null); // Limpiar datos después de guardar
    } catch (error) {
      console.error("Error al guardar el día del ciclo:", error);
    }
  };

  // Obtener la fase actual y la siguiente fase
  const getCurrentPhaseInfo = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    // Normalizo la comparación de fechas para ignorar la hora
    const dayData = calendarDays.find(
      (day) => day.date.slice(0, 10) === formattedDate
    );

    if (!dayData) return { currentPhase: undefined, nextPhaseDate: undefined };

    // Encontrar el siguiente día con una fase diferente
    const nextPhaseDay = calendarDays.find(
      (day) =>
        day.date.slice(0, 10) > formattedDate && day.phase !== dayData.phase
    );

    return {
      currentPhase: dayData.phase,
      nextPhaseDate: nextPhaseDay ? new Date(nextPhaseDay.date) : undefined,
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
        className={`flex-shrink-0 ${
          isMobile ? 'mb-1' : 'mb-2'
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={`flex items-center justify-between gap-2 ${
          isMobile ? 'flex-col space-y-2' : isTablet ? 'flex-col space-y-2' : 'flex-row'
        }`}>
          <div className={`flex items-center gap-2 ${
            isMobile ? 'w-full justify-center' : ''
          }`}>
            <motion.h2 className={`font-serif text-[#7a2323] capitalize ${
              isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-xl'
            }`}>
              {getViewTitle()}
            </motion.h2>

            <div className="flex gap-1">
              <motion.button
                onClick={navigatePrevious}
                className={`rounded-xl bg-[#e7e0d5] text-[#7a2323] shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[2px_2px_8px_rgba(122,35,35,0.15)] ${
                  isMobile ? 'p-1.5' : 'p-2'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
              </motion.button>

              <Button
                onClick={goToToday}
                size="small"
                className={`px-3 py-1 ${
                  isMobile ? 'text-xs' : 'text-xs'
                }`}
              >
                Hoy
              </Button>

              <motion.button
                onClick={navigateNext}
                className={`rounded-xl bg-[#e7e0d5] text-[#7a2323] shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[2px_2px_8px_rgba(122,35,35,0.15)] ${
                  isMobile ? 'p-1.5' : 'p-2'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
              </motion.button>
            </div>
          </div>

          <ViewSelector 
            viewType={viewType} 
            onViewChange={setViewType}
            isMobile={isMobile}
            isTablet={isTablet}
          />
        </div>

        {/* LEYENDA COMPACTA CON INDICADOR DE PREDICCIONES */}
        <motion.div className={`flex flex-wrap gap-1 ${
          isMobile ? 'mt-1 justify-center' : 'mt-2 gap-2'
        }`}>
          {Object.entries(phaseConfig).map(([phase, config]) => (
            <div key={phase} className={`flex items-center gap-1 ${
              isMobile ? 'text-xs' : 'text-xs'
            }`}>
              <div className={`relative bg-[#e7e0d5] rounded-sm border border-gray-200 flex items-center justify-center overflow-hidden ${
                isMobile ? 'w-6 h-5' : 'w-8 h-6'
              }`}>
                {phase === "menstrual" ? (
                  <div className="w-full h-full bg-[#fef2f2] rounded-sm flex items-center justify-center">
                    <div className="scale-[0.7]">
                      {config.icon("#ef4444")}
                    </div>
                  </div>
                ) : phase === "ovulacion" ? (
                  <div className="w-full h-full bg-purple-50 rounded-sm flex items-center justify-center">
                    <div className="scale-[0.7]">
                      {config.icon("#8b5cf6")}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={`absolute top-0.5 ${config.leftBorder}`} />
                    <div className="scale-[0.7]">
                      {phase === "folicular" ? config.icon("#10b981") : config.icon("#f59e0b")}
                    </div>
                  </>
                )}
              </div>
              {!isMobile && (
                <span className="text-[#7a2323] capitalize font-medium">
                  {config.description}
                </span>
              )}
            </div>
          ))}
          {/* Indicador de predicciones */}
          <div className={`flex items-center gap-1 border-l pl-1 ml-1 ${
            isMobile ? 'text-xs' : 'text-xs pl-2 ml-1'
          }`}>
            <div className={`rounded-full bg-blue-400 border-2 border-dashed border-gray-400 opacity-70 ${
              isMobile ? 'w-2 h-2' : 'w-2.5 h-2.5'
            }`} />
            {!isMobile && (
              <span className="text-[#7a2323] font-medium">Predicción</span>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* CONTENIDO DEL CALENDARIO COMPACTO */}
      <div className={`flex-1 min-h-0 overflow-hidden flex flex-col items-center justify-center w-full ${
        isMobile ? 'px-1' : isTablet ? 'px-2' : 'px-4'
      }`}>
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
              <div className={`grid grid-cols-7 mb-1 flex-shrink-0 w-full ${
                isMobile ? 'gap-x-1 gap-y-0.5' : isTablet ? 'gap-x-1.5 gap-y-1' : 'gap-x-2 gap-y-1'
              }`}>
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className={`text-center font-semibold text-[#7a2323] py-1 ${
                      isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-base'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* GRID DE DIAS AMPLIO Y CUADRADO */}
              <div className={`grid grid-cols-7 grid-rows-6 flex-1 h-full w-full ${
                isMobile ? 'gap-x-1 gap-y-1' : isTablet ? 'gap-x-1.5 gap-y-1.5' : 'gap-x-2 gap-y-2'
              }`}>
                {viewDates.map((date, index) => {
                  const formattedDate = format(date, "yyyy-MM-dd");
                  const dayData = calendarDays.find(
                    (day) => day.date.slice(0, 10) === formattedDate
                  );
                  const isCurrentMonth = isSameMonth(date, currentDate);
                  const isCurrentDay = isToday(date);

                  return (
                    <motion.div
                      key={formattedDate}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.002 }}
                      className="w-full h-full"
                    >
                      <NeomorphicDayCell
                        date={date}
                        dayData={dayData}
                        isCurrentMonth={isCurrentMonth}
                        isToday={isCurrentDay}
                        onClick={handleDayClick}
                        isSelected={false}
                        isMobile={isMobile}
                        isTablet={isTablet}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* VISTA SEMANA */}
          {viewType === "week" && (
            <motion.div
              key="week"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="h-full flex flex-col w-full"
            >
              <div className={`grid grid-cols-7 mb-1 flex-shrink-0 w-full ${
                isMobile ? 'gap-x-1 gap-y-0.5' : isTablet ? 'gap-x-1.5 gap-y-1' : 'gap-x-2 gap-y-1'
              }`}>
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className={`text-center font-semibold text-[#7a2323] py-1 ${
                      isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-base'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className={`grid grid-cols-7 flex-1 h-full w-full ${
                isMobile ? 'gap-x-1 gap-y-1' : isTablet ? 'gap-x-1.5 gap-y-1.5' : 'gap-x-2 gap-y-2'
              }`}>
                {viewDates.map((date, index) => {
                  const formattedDate = format(date, "yyyy-MM-dd");
                  const dayData = calendarDays.find(
                    (day) => day.date.slice(0, 10) === formattedDate
                  );
                  const isCurrentDay = isToday(date);
                  return (
                    <motion.div
                      key={formattedDate}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.01 }}
                      className="w-full h-full"
                    >
                      <NeomorphicDayCell
                        date={date}
                        dayData={dayData}
                        isCurrentMonth={true}
                        isToday={isCurrentDay}
                        onClick={handleDayClick}
                        isSelected={false}
                        isMobile={isMobile}
                        isTablet={isTablet}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ! 03/06/2025 - MODAL con datos existentes si los hay */}
      <AddCycleDayModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDayData(null); // Limpiar datos seleccionados
        }}
        onSave={handleModalSave}
        date={selectedDate || new Date()}
        initialData={convertCycleDayToModalData(selectedDayData)}
        {...(selectedDate ? getCurrentPhaseInfo(selectedDate) : {})}
      />
    </div>
  );
};
