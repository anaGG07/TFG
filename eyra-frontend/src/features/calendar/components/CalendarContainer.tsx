import React, { useState, useEffect } from "react";
import { useCycle } from "../../../context/CycleContext";
import { CycleDay, CyclePhase } from "../../../types/domain";
import { AddCycleDayModal } from "./AddCycleDayModal";
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
  endOfDay,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Grid3X3,
  Rows3,
} from "lucide-react";
import { useCalendarData } from "../hooks/useCalendarData";

type ViewType = "month" | "week" | "day";

interface CalendarProps {
  className?: string;
}

export const CalendarContainer = ({ className = "" }: CalendarProps) => {
  const { data, isLoading, error, refetch } = useCalendarData(
    currentDate,
    viewType
  );
  const { updateDay, addSymptom } = useCycle();
  const calendarDays = data?.calendarDays || [];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDayData, setSelectedDayData] = useState<CycleDay | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewType, setViewType] = useState<ViewType>("month");

  // Funciones de navegación
  const navigatePrevious = () => {
    switch (viewType) {
      case "day":
        setCurrentDate((prev) => subDays(prev, 1));
        break;
      case "week":
        setCurrentDate((prev) => subWeeks(prev, 1));
        break;
      case "month":
        setCurrentDate((prev) => subMonths(prev, 1));
        break;
    }
  };

  const navigateNext = () => {
    switch (viewType) {
      case "day":
        setCurrentDate((prev) => addDays(prev, 1));
        break;
      case "week":
        setCurrentDate((prev) => addWeeks(prev, 1));
        break;
      case "month":
        setCurrentDate((prev) => addMonths(prev, 1));
        break;
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Generar días según la vista
  const generateViewDays = (): Date[] => {
    switch (viewType) {
      case "day":
        return [currentDate];
      case "week":
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        return eachDayOfInterval({
          start: weekStart,
          end: endOfWeek(currentDate, { weekStartsOn: 1 }),
        });
      case "month":
      default:
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
        const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
        return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    }
  };

  // Manejar clic en un día
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = format(date, "yyyy-MM-dd");
    const dayData = calendarDays.find((day) => day.date === formattedDate);
    setSelectedDayData(dayData || null);
  };

  // Abrir modal para añadir/editar datos
  const handleOpenModal = () => {
    if (selectedDate) {
      setIsModalOpen(true);
    }
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Guardar datos del día
  const handleSaveDayData = async (formData: any) => {
    try {
      if (selectedDate) {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        await updateDay(formattedDate, formData);

        if (formData.symptoms && formData.symptoms.length > 0) {
          for (const symptom of formData.symptoms) {
            await addSymptom({
              entityType: "DAY",
              entityId: parseInt(formattedDate.replace(/-/g, "")),
              symptom,
              intensity: formData.flowIntensity || 0,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error al guardar datos:", error);
    }
  };

  const getPhaseColor = (phase: CyclePhase): string => {
    switch (phase) {
      case CyclePhase.MENSTRUAL:
        return "bg-red-100 border-red-200";
      case CyclePhase.FOLICULAR:
        return "bg-yellow-100 border-yellow-200";
      case CyclePhase.OVULACION:
        return "bg-blue-100 border-blue-200";
      case CyclePhase.LUTEA:
        return "bg-green-100 border-green-200";
      default:
        return "bg-white border-gray-200";
    }
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

  return (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
    >
      {/* Header del calendario */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Título y navegación */}
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800 capitalize min-w-0 flex-shrink-0">
              {getViewTitle()}
            </h2>

            <div className="flex gap-1">
              <button
                onClick={navigatePrevious}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Hoy
              </button>
              <button
                onClick={navigateNext}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Selector de vista */}
          <div className="flex bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewType("month")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewType === "month"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              Mes
            </button>
            <button
              onClick={() => setViewType("week")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewType === "week"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Rows3 className="w-4 h-4" />
              Semana
            </button>
            <button
              onClick={() => setViewType("day")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewType === "day"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              Día
            </button>
          </div>
        </div>

        {/* Leyenda de fases */}
        <div className="flex flex-wrap gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-100 border border-red-200"></div>
            <span>Menstrual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-200"></div>
            <span>Folicular</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-200"></div>
            <span>Ovulación</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-100 border border-green-200"></div>
            <span>Lútea</span>
          </div>
        </div>
      </div>

      {/* Contenido del calendario */}
      <div className="flex-1 min-h-0">
        {/* Vista mes */}
        {viewType === "month" && (
          <div className="h-full flex flex-col">
            {/* Días de la semana */}
            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="p-3 text-center text-sm font-medium text-gray-600"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grid de días - con altura fija para evitar desbordamiento */}
            <div
              className="grid grid-cols-7 flex-1"
              style={{ minHeight: "400px", maxHeight: "500px" }}
            >
              {viewDates.map((date) => {
                const formattedDate = format(date, "yyyy-MM-dd");
                const dayData = calendarDays.find(
                  (day) => day.date === formattedDate
                );
                const isCurrentMonth = isSameMonth(date, currentDate);
                const isCurrentDay = isToday(date);

                return (
                  <div
                    key={formattedDate}
                    onClick={() => handleDayClick(date)}
                    className={`
                      border-r border-b border-gray-200 p-2 cursor-pointer hover:bg-gray-50 transition-colors
                      ${isCurrentMonth ? "bg-white" : "bg-gray-50"}
                      ${isCurrentDay ? "ring-2 ring-purple-500 ring-inset" : ""}
                      ${dayData?.phase ? getPhaseColor(dayData.phase) : ""}
                      min-h-[80px] flex flex-col
                    `}
                  >
                    <div
                      className={`text-sm ${
                        isCurrentMonth ? "text-gray-900" : "text-gray-400"
                      } ${isCurrentDay ? "font-bold" : ""}`}
                    >
                      {format(date, "d")}
                    </div>

                    {dayData?.flowIntensity && dayData.flowIntensity > 0 && (
                      <div className="mt-1 flex gap-1">
                        {[...Array(Math.min(dayData.flowIntensity, 5))].map(
                          (_, i) => (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-red-500"
                            />
                          )
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Vista semana */}
        {viewType === "week" && (
          <div className="h-full flex flex-col">
            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
              {viewDates.map((date) => (
                <div
                  key={format(date, "yyyy-MM-dd")}
                  className="p-3 text-center"
                >
                  <div className="text-xs text-gray-600">
                    {format(date, "EEE", { locale: es })}
                  </div>
                  <div
                    className={`text-lg ${
                      isToday(date)
                        ? "font-bold text-purple-600"
                        : "text-gray-900"
                    }`}
                  >
                    {format(date, "d")}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="grid grid-cols-7 flex-1"
              style={{ minHeight: "300px" }}
            >
              {viewDates.map((date) => {
                const formattedDate = format(date, "yyyy-MM-dd");
                const dayData = calendarDays.find(
                  (day) => day.date === formattedDate
                );
                const isCurrentDay = isToday(date);

                return (
                  <div
                    key={formattedDate}
                    onClick={() => handleDayClick(date)}
                    className={`
                      border-r border-gray-200 p-3 cursor-pointer hover:bg-gray-50 transition-colors
                      ${isCurrentDay ? "ring-2 ring-purple-500 ring-inset" : ""}
                      ${
                        dayData?.phase
                          ? getPhaseColor(dayData.phase)
                          : "bg-white"
                      }
                      flex flex-col gap-2
                    `}
                  >
                    {dayData?.flowIntensity && dayData.flowIntensity > 0 && (
                      <div className="flex gap-1">
                        {[...Array(Math.min(dayData.flowIntensity, 5))].map(
                          (_, i) => (
                            <div
                              key={i}
                              className="w-2 h-2 rounded-full bg-red-500"
                            />
                          )
                        )}
                      </div>
                    )}

                    {dayData?.symptoms && dayData.symptoms.length > 0 && (
                      <div className="text-xs text-gray-600 line-clamp-2">
                        {dayData.symptoms.slice(0, 2).join(", ")}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Vista día */}
        {viewType === "day" && (
          <div className="p-6 h-full overflow-auto">
            {(() => {
              const formattedDate = format(currentDate, "yyyy-MM-dd");
              const dayData = calendarDays.find(
                (day) => day.date === formattedDate
              );

              return (
                <div className="max-w-2xl mx-auto">
                  <div
                    className={`
                    p-6 rounded-lg border-2 transition-colors
                    ${
                      dayData?.phase
                        ? getPhaseColor(dayData.phase)
                        : "bg-gray-50 border-gray-200"
                    }
                  `}
                  >
                    {dayData ? (
                      <div className="space-y-6">
                        {dayData.phase && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2">
                              Fase del ciclo
                            </h3>
                            <p className="capitalize text-gray-700">
                              {dayData.phase.toLowerCase()}
                            </p>
                          </div>
                        )}

                        {dayData.flowIntensity && dayData.flowIntensity > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2">
                              Intensidad del flujo
                            </h3>
                            <div className="flex gap-2">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-4 h-4 rounded-full ${
                                    i < dayData.flowIntensity!
                                      ? "bg-red-500"
                                      : "bg-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {dayData.symptoms && dayData.symptoms.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2">
                              Síntomas
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {dayData.symptoms.map((symptom) => (
                                <span
                                  key={symptom}
                                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                                >
                                  {symptom}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {dayData.mood && dayData.mood.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2">
                              Estado de ánimo
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {dayData.mood.map((mood) => (
                                <span
                                  key={mood}
                                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                >
                                  {mood}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {dayData.notes && dayData.notes.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2">
                              Notas
                            </h3>
                            <p className="text-gray-700 bg-white p-3 rounded-md">
                              {dayData.notes.join(", ")}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">
                          No hay información registrada para este día
                        </p>
                      </div>
                    )}

                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() => {
                          setSelectedDate(currentDate);
                          setSelectedDayData(dayData || null);
                          setIsModalOpen(true);
                        }}
                        className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                      >
                        {dayData ? "Editar información" : "Añadir información"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Panel lateral para día seleccionado (solo en vista mes y semana) */}
      {(viewType === "month" || viewType === "week") &&
        selectedDate &&
        selectedDayData && (
          <div className="border-t border-gray-200 p-4 bg-gray-50 max-h-60 overflow-auto">
            <h3 className="text-lg font-semibold mb-3">
              {format(selectedDate, "EEEE d MMMM", { locale: es })}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedDayData.phase && (
                <div className="bg-white p-3 rounded-lg">
                  <h4 className="font-medium mb-1">Fase del ciclo</h4>
                  <p className="capitalize text-sm text-gray-700">
                    {selectedDayData.phase.toLowerCase()}
                  </p>
                </div>
              )}

              {selectedDayData.symptoms &&
                selectedDayData.symptoms.length > 0 && (
                  <div className="bg-white p-3 rounded-lg">
                    <h4 className="font-medium mb-1">Síntomas</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedDayData.symptoms.slice(0, 3).map((symptom) => (
                        <span
                          key={symptom}
                          className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs"
                        >
                          {symptom}
                        </span>
                      ))}
                      {selectedDayData.symptoms.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{selectedDayData.symptoms.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>
                )}
            </div>

            <div className="mt-3 flex justify-end">
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                onClick={handleOpenModal}
              >
                Editar
              </button>
            </div>
          </div>
        )}

      {/* Modal para añadir/editar datos */}
      {isModalOpen && selectedDate && (
        <AddCycleDayModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveDayData}
          date={selectedDate}
          initialData={selectedDayData || undefined}
        />
      )}
    </div>
  );
};
