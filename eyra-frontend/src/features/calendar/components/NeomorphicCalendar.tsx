import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCycle } from "../../../context/CycleContext";
import { CycleDay, CyclePhase } from "../../../types/domain";
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
  addMonths,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Moon,
  Sparkles,
  Heart,
  X,
} from "lucide-react";

interface NeomorphicCalendarProps {
  className?: string;
}

// Configuración mejorada de fases menstruales
const phaseConfig = {
  [CyclePhase.MENSTRUAL]: {
    color: "bg-red-100",
    borderColor: "border-red-300",
    dotColor: "bg-red-500",
    icon: "🩸",
    description: "Menstruación",
  },
  [CyclePhase.FOLICULAR]: {
    color: "bg-green-100",
    borderColor: "border-green-300",
    dotColor: "bg-green-500",
    icon: "🌱",
    description: "Fase folicular",
  },
  [CyclePhase.OVULACION]: {
    color: "bg-blue-100",
    borderColor: "border-blue-300",
    dotColor: "bg-blue-500",
    icon: "🥚",
    description: "Ovulación",
  },
  [CyclePhase.LUTEA]: {
    color: "bg-yellow-100",
    borderColor: "border-yellow-300",
    dotColor: "bg-yellow-500",
    icon: "🌙",
    description: "Fase lútea",
  },
};

// Componente de celda de día compacta
const CompactDayCell: React.FC<{
  date: Date;
  dayData?: CycleDay;
  isCurrentMonth: boolean;
  isToday: boolean;
  onClick: (date: Date) => void;
  isSelected: boolean;
}> = ({ date, dayData, isCurrentMonth, isToday, onClick, isSelected }) => {
  const [isHovered, setIsHovered] = useState(false);

  const phaseStyle = dayData?.phase ? phaseConfig[dayData.phase] : null;
  const hasData =
    dayData &&
    (dayData.flowIntensity || dayData.symptoms?.length || dayData.mood?.length);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(date)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        relative cursor-pointer transition-all duration-200
        w-8 h-8 rounded-lg flex items-center justify-center
        ${isCurrentMonth ? "text-[#7a2323]" : "text-[#7a2323]/40"}
        ${isToday ? "ring-2 ring-[#7a2323]/50" : ""}
        ${
          phaseStyle
            ? `${phaseStyle.color} ${phaseStyle.borderColor} border`
            : "bg-[#e7e0d5] border border-transparent"
        }
        ${isSelected ? "ring-2 ring-[#7a2323]" : ""}
        ${isHovered ? "shadow-lg" : "shadow-sm"}
        hover:shadow-md
      `}
    >
      {/* Número del día */}
      <span className={`text-xs font-medium ${isToday ? "font-bold" : ""}`}>
        {format(date, "d")}
      </span>

      {/* Indicadores de datos */}
      {hasData && (
        <div className="absolute -top-1 -right-1 flex flex-col gap-0.5">
          {/* Indicador de flujo */}
          {dayData?.flowIntensity && dayData.flowIntensity > 0 && (
            <div
              className={`w-2 h-2 rounded-full ${
                phaseStyle?.dotColor || "bg-red-500"
              }`}
            />
          )}

          {/* Indicador de síntomas */}
          {dayData?.symptoms && dayData.symptoms.length > 0 && (
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
          )}

          {/* Indicador de estado de ánimo */}
          {dayData?.mood && dayData.mood.length > 0 && (
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          )}
        </div>
      )}

      {/* Indicador de hoy */}
      {isToday && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#7a2323] rounded-full" />
      )}
    </motion.div>
  );
};

// Modal expandido para mostrar detalles del día
const ExpandedDayModal: React.FC<{
  date: Date;
  dayData?: CycleDay | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ date, dayData, isOpen, onClose, onSave }) => {
  const phaseStyle = dayData?.phase ? phaseConfig[dayData.phase] : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className={`
              rounded-3xl p-6 max-w-md w-full shadow-2xl border border-white/20 relative
              ${phaseStyle ? `${phaseStyle.color}` : "bg-[#e7e0d5]"}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4 text-[#7a2323]" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                {phaseStyle && (
                  <span className="text-2xl">{phaseStyle.icon}</span>
                )}
                <div>
                  <h3 className="text-lg font-serif text-[#7a2323] font-semibold">
                    {format(date, "EEEE d 'de' MMMM", { locale: es })}
                  </h3>
                  {phaseStyle && (
                    <p className="text-sm text-[#7a2323]/70">
                      {phaseStyle.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contenido del día */}
            <div className="space-y-4">
              {dayData ? (
                <>
                  {/* Intensidad del flujo */}
                  {dayData.flowIntensity && dayData.flowIntensity > 0 && (
                    <div>
                      <h4 className="font-medium text-[#7a2323] mb-2 text-sm">
                        Intensidad del flujo
                      </h4>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < dayData.flowIntensity!
                                ? "bg-red-500"
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Síntomas */}
                  {dayData.symptoms && dayData.symptoms.length > 0 && (
                    <div>
                      <h4 className="font-medium text-[#7a2323] mb-2 text-sm">
                        Síntomas
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {dayData.symptoms.map((symptom, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white/50 text-[#7a2323] rounded-full text-xs"
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Estado de ánimo */}
                  {dayData.mood && dayData.mood.length > 0 && (
                    <div>
                      <h4 className="font-medium text-[#7a2323] mb-2 text-sm">
                        Estado de ánimo
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {dayData.mood.map((mood, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white/30 text-[#7a2323] rounded-full text-xs"
                          >
                            {mood}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notas */}
                  {dayData.notes && dayData.notes.length > 0 && (
                    <div>
                      <h4 className="font-medium text-[#7a2323] mb-2 text-sm">
                        Notas
                      </h4>
                      <p className="text-sm text-[#7a2323]/80">
                        {dayData.notes.join(", ")}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <Moon className="w-8 h-8 text-[#7a2323]/50 mx-auto mb-3" />
                  <p className="text-[#7a2323]/70 text-sm mb-4">
                    No hay información para este día
                  </p>
                </div>
              )}

              {/* Formulario simple para agregar datos */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#7a2323] mb-2">
                    Intensidad del flujo
                  </label>
                  <div className="bg-[#e7e0d5] rounded-xl p-3 shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)]">
                    <select
                      className="w-full bg-transparent text-[#7a2323] focus:outline-none text-sm"
                      defaultValue={dayData?.flowIntensity || 0}
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#7a2323] mb-2">
                    Notas personales
                  </label>
                  <div className="bg-[#e7e0d5] rounded-xl p-3 shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)]">
                    <textarea
                      className="w-full bg-transparent text-[#7a2323] placeholder-[#7a2323]/50 focus:outline-none resize-none text-sm"
                      rows={3}
                      placeholder="¿Cómo te sientes hoy?"
                      defaultValue={dayData?.notes?.join(", ") || ""}
                      id="notes"
                    />
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 p-3 rounded-xl bg-[#e7e0d5] text-[#7a2323] shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[2px_2px_8px_rgba(122,35,35,0.15)] transition-all duration-300 font-medium text-sm"
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

                    const data = {
                      date: format(date, "yyyy-MM-dd"),
                      flowIntensity: parseInt(flowSelect.value),
                      notes: notesTextarea.value,
                      phase: CyclePhase.MENSTRUAL,
                      symptoms: [],
                      mood: [],
                    };

                    onSave(data);
                    onClose();
                  }}
                  className="flex-1 p-3 rounded-xl bg-[#7a2323] text-[#e7e0d5] shadow-[2px_2px_8px_rgba(122,35,35,0.3)] hover:shadow-[4px_4px_12px_rgba(122,35,35,0.4)] transition-all duration-300 font-medium text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4" />
                    Guardar
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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

  // Cargar datos cuando cambia la fecha
  useEffect(() => {
    const { start, end } = getDateRange();
    const startStr = format(start, "yyyy-MM-dd");
    const endStr = format(end, "yyyy-MM-dd");

    if (loadCalendarDays) {
      loadCalendarDays(startStr, endStr);
    }
  }, [currentDate, loadCalendarDays]);

  const getDateRange = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    return {
      start: startOfDay(startOfWeek(monthStart, { weekStartsOn: 1 })),
      end: startOfDay(endOfWeek(monthEnd, { weekStartsOn: 1 })),
    };
  };

  const generateViewDays = (): Date[] => {
    const { start, end } = getDateRange();
    return eachDayOfInterval({ start, end });
  };

  const navigatePrevious = () => {
    setCurrentDate(startOfDay(subMonths(currentDate, 1)));
  };

  const navigateNext = () => {
    setCurrentDate(startOfDay(addMonths(currentDate, 1)));
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

  const handleSaveDay = async (data: any) => {
    if (addCycleDay) {
      try {
        await addCycleDay(data);
        // Recargar datos después del guardado
        const { start, end } = getDateRange();
        const startStr = format(start, "yyyy-MM-dd");
        const endStr = format(end, "yyyy-MM-dd");
        await loadCalendarDays(startStr, endStr);
      } catch (error) {
        console.error("Error al guardar día:", error);
      }
    }
  };

  const getViewTitle = (): string => {
    return format(currentDate, "MMMM yyyy", { locale: es });
  };

  const viewDates = generateViewDays();
  const weekDays = ["L", "M", "X", "J", "V", "S", "D"];
  const safeCalendarDays = calendarDays || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-[#7a2323]"
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-2xl mx-auto p-6 ${className}`}>
      {/* Header compacto */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif text-[#7a2323] capitalize">
            {getViewTitle()}
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={navigatePrevious}
              className="p-2 rounded-lg bg-[#e7e0d5] text-[#7a2323] shadow-sm hover:shadow-md transition-shadow"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <Button
              onClick={goToToday}
              size="small"
              className="text-xs px-3 py-1"
            >
              Hoy
            </Button>

            <button
              onClick={navigateNext}
              className="p-2 rounded-lg bg-[#e7e0d5] text-[#7a2323] shadow-sm hover:shadow-md transition-shadow"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Leyenda compacta */}
        <div className="flex flex-wrap gap-3 text-xs">
          {Object.entries(phaseConfig).map(([phase, config]) => (
            <div key={phase} className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded-full ${config.dotColor}`} />
              <span className="text-[#7a2323]/70">{config.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendario compacto */}
      <div className="bg-white/50 rounded-2xl p-4 shadow-sm border border-[#7a2323]/10">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-[#7a2323]/70 py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid de días */}
        <div className="grid grid-cols-7 gap-2">
          {viewDates.map((date) => {
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
              <CompactDayCell
                key={formattedDate}
                date={date}
                dayData={dayData}
                isCurrentMonth={isCurrentMonth}
                isToday={isCurrentDay}
                onClick={handleDayClick}
                isSelected={!!isSelected}
              />
            );
          })}
        </div>
      </div>

      {/* Modal expandido */}
      <ExpandedDayModal
        date={selectedDate || new Date()}
        dayData={selectedDayData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDay}
      />
    </div>
  );
};
