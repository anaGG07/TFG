// ! 08/06/2025 - Componente que mantiene el diseño original pero con datos correctos
// Muestra "Día 3" en lugar de "Día 1" manteniendo la estética y layout existente

import React from "react";
import { useCurrentCycle } from "../../hooks/useCurrentCycle";

interface CycleVisualCorrectedProps {
  expanded: boolean;
  onMoodColorChange?: (color: string) => void;
}

export const CycleVisualCorrected: React.FC<CycleVisualCorrectedProps> = ({
  expanded,
  onMoodColorChange,
}) => {
  const {
    currentDay,
    currentPhase,
    phaseName,
    phaseDescription,
    nextPeriodDate,
    daysUntilNext,
    cycleLength,
    isLoading,
    error,
  } = useCurrentCycle();

  // Formatear fecha
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
    });
  };

  // Estado de carga - mantener diseño original
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <img
          src="/img/33.svg"
          alt="Cargando ciclo"
          style={{
            width: 240,
            height: 165,
            opacity: 0.5,
            objectFit: "contain",
          }}
        />
        <p className="text-sm text-gray-500 mt-2">Cargando...</p>
      </div>
    );
  }

  // Error - mantener diseño original
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <img
          src="/img/33.svg"
          alt="Error"
          style={{
            width: 240,
            height: 165,
            opacity: 0.3,
            objectFit: "contain",
          }}
        />
        <p className="text-sm text-red-500 mt-2">Error al cargar</p>
      </div>
    );
  }

  // Vista NO expandida - exactamente igual que antes pero con datos correctos
  if (!expanded) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <img
          src="/img/33.svg"
          alt="Ciclo menstrual"
          style={{
            width: 240,
            height: 165,
            opacity: 0.97,
            objectFit: "contain",
          }}
        />

        {/* Información superpuesta - DATOS CORRECTOS */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
          style={{ top: "20%" }}
        >
          <h1 className="text-4xl font-bold text-white mb-1">
            Día {currentDay}
          </h1>
          <p className="text-white text-lg opacity-90">{phaseName}</p>

          {/* Probabilidad de embarazo */}
          <div className="mt-4">
            <p className="text-white text-sm">
              Probabilidad de embarazo:{" "}
              <span className="font-semibold">Muy baja</span>
            </p>
          </div>
        </div>

        {/* Sección ¿Cómo te sientes hoy? - igual que antes */}
        <div className="absolute bottom-8 left-0 right-0 px-6">
          <p className="text-center text-sm text-gray-700 mb-3">
            ¿Cómo te sientes hoy?
          </p>

          <div className="flex justify-center space-x-3">
            {["😊", "😐", "😟", "😔", "😡"].map((emoji, index) => (
              <button
                key={index}
                className="text-2xl hover:scale-110 transition-transform"
                onClick={() => {
                  // Cambiar color de fondo según emoción
                  const colors = [
                    "#E8F5E9",
                    "#FFF3E0",
                    "#FFEBEE",
                    "#F3E5F5",
                    "#FFEBEE",
                  ];
                  onMoodColorChange?.(colors[index]);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Vista expandida - mantener diseño original pero con datos correctos
  return (
    <div className="h-full w-full p-6 flex flex-col">
      {/* Header con día y fase - DATOS CORRECTOS */}
      <div className="bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Día {currentDay}</h1>
            <p className="text-red-100 text-lg">{phaseName}</p>
          </div>
          <div className="text-5xl opacity-80">🔴</div>
        </div>
      </div>

      {/* Descripción de la fase */}
      <div className="bg-gray-50 p-4 rounded-xl mb-6">
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
          <span className="mr-2">✨</span>
          ¿Qué pasa en tu cuerpo hoy?
        </h3>
        <p className="text-gray-700 text-sm">{phaseDescription}</p>
      </div>

      {/* Información del ciclo en grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Duración del ciclo */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">⏱️</span>
            <h4 className="font-semibold text-blue-800 text-sm">
              Duración del ciclo
            </h4>
          </div>
          <p className="text-blue-900 font-bold text-lg">{cycleLength} días</p>
          <p className="text-blue-700 text-xs">Promedio personal</p>
        </div>

        {/* Próximo período */}
        {nextPeriodDate && daysUntilNext !== null && (
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">📅</span>
              <h4 className="font-semibold text-purple-800 text-sm">
                Próximo período
              </h4>
            </div>
            <p className="text-purple-900 font-bold">
              {formatDate(nextPeriodDate)}
            </p>
            <p className="text-purple-700 text-xs">
              {daysUntilNext > 0 ? `En ${daysUntilNext} días` : "Hoy"}
            </p>
          </div>
        )}
      </div>

      {/* Probabilidad de embarazo */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl mb-6">
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center text-sm">
          <span className="mr-2">🤰</span>
          Probabilidad de embarazo:
          <span className="ml-2 px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
            Muy baja
          </span>
        </h4>
      </div>

      {/* ¿Cómo te sientes hoy? */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-xl mb-6">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">
          💭 ¿Cómo te sientes hoy?
        </h3>

        <div className="flex justify-center space-x-3 mb-4">
          {["😊", "😐", "😟", "😔", "😡"].map((emoji, index) => (
            <button
              key={index}
              className="text-2xl hover:scale-125 transition-transform cursor-pointer p-1 rounded-full hover:bg-white/50"
              onClick={() => {
                const colors = [
                  "#E8F5E9",
                  "#FFF3E0",
                  "#FFEBEE",
                  "#F3E5F5",
                  "#FFEBEE",
                ];
                onMoodColorChange?.(colors[index]);
              }}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Recomendaciones */}
        <div className="space-y-2">
          <div className="bg-white/70 p-3 rounded-lg">
            <h5 className="font-medium text-gray-700 text-xs mb-1 flex items-center">
              <span className="mr-1">🍽️</span>
              Receta recomendada
            </h5>
            <p className="text-xs text-gray-600">No hay receta para hoy.</p>
          </div>

          <div className="bg-white/70 p-3 rounded-lg">
            <h5 className="font-medium text-gray-700 text-xs mb-1 flex items-center">
              <span className="mr-1">🏃‍♀️</span>
              Rutina de ejercicio para fase menstrual
            </h5>
            <p className="text-xs text-gray-600">Yoga suave y estiramientos</p>
          </div>
        </div>
      </div>

      {/* Botón actualizar */}
      <div className="text-center">
        <button className="text-gray-500 hover:text-gray-700 text-xs underline transition-colors">
          🔄 Actualizar información
        </button>
      </div>
    </div>
  );
};
