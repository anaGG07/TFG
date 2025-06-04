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
}> = ({ date, dayData, isCurrentMonth, isToday, onClick, isSelected }) => {
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

    // Resto de fases: fondo base con óvalo superior
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
          text-xs font-semibold
          ${isToday ? "text-[#7a2323] font-bold text-sm" : ""}
          ${!isCurrentMonth ? "opacity-50" : ""}
          ${isPredicted ? "text-gray-600 italic" : "text-gray-800"}
        `}
        animate={isToday ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {format(date, "d")}
        {isPredicted && <span className="text-[8px] ml-0.5 opacity-60">?</span>}
      </motion.div>

      {/* ÓVALO SUPERIOR PARA FASES (excepto menstruación y primer día ovulación) */}
      {dayData?.phase &&
        dayData.phase !== CyclePhase.MENSTRUAL &&
        !(
          dayData.phase === CyclePhase.OVULACION && dayData.dayNumber === 1
        ) && (
          <div
            className={`absolute top-1 left-1/2 transform -translate-x-1/2 ${phaseStyle?.leftBorder}`}
          />
        )}

      {/* ICONO DE FASE CON INDICADOR DE PREDICCIÓN */}
      {dayData?.phase && (
        <div
          className={`absolute bottom-1 right-1 text-lg pointer-events-none ${
            isPredicted ? "opacity-50" : "opacity-80"
          }`}
        >
          {phaseConfig[dayData.phase].icon}
          {isPredicted && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full flex items-center justify-center">
              <span className="text-[6px] text-white font-bold">P</span>
            </div>
          )}
        </div>
      )}

      {/* INDICADORES DE FLUJO CON ESTILO PREDICCIÓN */}
      {dayData?.flowIntensity && dayData.flowIntensity > 0 && (
        <motion.div className="flex gap-0.5 mt-0.5">
          {[...Array(Math.min(dayData.flowIntensity, 5))].map((_, i) => (
            <motion.div
              key={i}
              className={`w-0.5 h-0.5 rounded-full ${
                isPredicted ? "bg-red-400 opacity-60" : "bg-red-600"
              }`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: isPredicted ? [0.4, 0.7, 0.4] : [0.7, 1, 0.7],
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

      {/* INDICADOR DE HOY CON TOOLTIP DE PREDICCIÓN */}
      {isToday && (
        <motion.div
          className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#7a2323] rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* TOOLTIP DE CONFIANZA PARA PREDICCIONES */}
      {isPredicted && isHovered && confidence > 0 && (
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-[8px] px-1 py-0.5 rounded whitespace-nowrap z-10"
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
}> = ({ viewType, onViewChange }) => {
  return (
    <div className="bg-[#e7e0d5] rounded-xl p-1 shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)]">
      <div className="flex gap-1">
        {[
          { type: "month" as ViewType, icon: Grid3X3, label: "Mes" },
          { type: "week" as ViewType, icon: Rows3, label: "Semana" },
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

  console.log("calendarDays:", calendarDays);

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

    console.log(
      "Día seleccionado:",
      formattedDate,
      "Datos existentes:",
      existingDayData
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

      console.log("Enviando datos del día del ciclo:", cycleDayData);

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

        {/* LEYENDA COMPACTA CON INDICADOR DE PREDICCIONES */}
        <motion.div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(phaseConfig).map(([phase, config]) => (
            <div key={phase} className="flex items-center gap-1 text-xs">
              <div className="relative w-6 h-4 bg-[#e7e0d5] rounded-sm border flex items-center justify-center">
                {phase === "menstrual" ? (
                  <div className="w-full h-full bg-[#ffe8e9] rounded-sm" />
                ) : phase === "ovulacion" ? (
                  <div className="w-full h-full bg-purple-50 rounded-sm" />
                ) : (
                  <div className={`absolute top-0.5 ${config.leftBorder}`} />
                )}
              </div>
              <span className="text-[#7a2323] capitalize font-medium">
                {config.description}
              </span>
            </div>
          ))}
          {/* Indicador de predicciones */}
          <div className="flex items-center gap-1 text-xs border-l pl-2 ml-1">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-400 border-2 border-dashed border-gray-400 opacity-70" />
            <span className="text-[#7a2323] font-medium">Predicción</span>
          </div>
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

          {/* VISTA SEMANA */}
          {viewType === "week" && (
            <motion.div
              key="week"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="h-full flex flex-col w-full"
            >
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
              <div className="grid grid-cols-7 gap-x-2 gap-y-2 flex-1 h-full w-full">
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
