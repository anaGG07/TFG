// ! 08/06/2025 - Componente CycleStatusCard que reemplaza la lógica incorrecta del dashboard
// Muestra correctamente "Día 3" en lugar de "Día 1" basado en datos reales

import React from "react";
import { useCurrentCycle } from "../../hooks/useCurrentCycle";

interface CycleStatusCardProps {
  className?: string;
}

export const CycleStatusCard: React.FC<CycleStatusCardProps> = ({
  className = "",
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
    refreshCycleInfo,
  } = useCurrentCycle();

  // Colores según la fase del ciclo
  const getPhaseColor = (phase: string): string => {
    const colors = {
      menstrual: "from-red-400 to-red-600",
      folicular: "from-yellow-400 to-orange-500",
      ovulacion: "from-blue-400 to-blue-600",
      lutea: "from-green-400 to-green-600",
    };
    return colors[phase as keyof typeof colors] || colors.menstrual;
  };

  // Emoji según la fase
  const getPhaseEmoji = (phase: string): string => {
    const emojis = {
      menstrual: "🔴",
      folicular: "🌱",
      ovulacion: "🥚",
      lutea: "🌙",
    };
    return emojis[phase as keyof typeof emojis] || "🔴";
  };

  // Formatear fecha
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "No disponible";

    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
    });
  };

  // Estado de carga
  if (isLoading) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg p-8 ${className}`}>
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <span className="text-gray-600">Cargando tu ciclo...</span>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg p-8 ${className}`}>
        <div className="text-center">
          <div className="text-red-500 text-3xl mb-3">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Error al cargar
          </h3>
          <p className="text-gray-600 mb-4 text-sm">{error}</p>
          <button
            onClick={refreshCycleInfo}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}
    >
      {/* Header con gradiente según la fase */}
      <div
        className={`bg-gradient-to-r ${getPhaseColor(
          currentPhase
        )} p-6 text-white relative overflow-hidden`}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-1">Día {currentDay}</h1>
              <p className="text-white/90 text-lg">{phaseName}</p>
            </div>
            <div className="text-5xl opacity-80">
              {getPhaseEmoji(currentPhase)}
            </div>
          </div>
        </div>

        {/* Patrón decorativo de fondo */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <circle cx="20" cy="20" r="15" fill="currentColor" />
            <circle cx="80" cy="80" r="20" fill="currentColor" />
            <circle cx="90" cy="30" r="10" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-6 space-y-6">
        {/* Descripción de la fase */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
            <span className="mr-2">✨</span>
            ¿Qué pasa en tu cuerpo hoy?
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {phaseDescription}
          </p>
        </div>

        {/* Información del ciclo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Duración del ciclo */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">⏱️</span>
              <h4 className="font-semibold text-blue-800 text-sm">
                Duración del ciclo
              </h4>
            </div>
            <p className="text-blue-900 font-bold">{cycleLength} días</p>
            <p className="text-blue-700 text-xs">Promedio personal</p>
          </div>
        </div>

        {/* Probabilidad de embarazo */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center text-sm">
            <span className="mr-2">🤰</span>
            Probabilidad de embarazo:
            <span
              className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                currentPhase === "ovulacion"
                  ? "bg-red-100 text-red-800"
                  : currentPhase === "folicular" && currentDay > 10
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {currentPhase === "ovulacion"
                ? "Alta"
                : currentPhase === "folicular" && currentDay > 10
                ? "Media"
                : "Muy baja"}
            </span>
          </h4>
        </div>

        {/* Sección ¿Cómo te sientes hoy? */}
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-xl">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">
            💭 ¿Cómo te sientes hoy?
          </h3>

          <div className="flex justify-center space-x-3 mb-4">
            {[
              { emoji: "😊", label: "Bien" },
              { emoji: "😐", label: "Normal" },
              { emoji: "😟", label: "Mal" },
              { emoji: "😔", label: "Triste" },
              { emoji: "😡", label: "Irritable" },
            ].map((mood, index) => (
              <button
                key={index}
                className="text-2xl hover:scale-125 transition-transform cursor-pointer p-1 rounded-full hover:bg-white/50"
                title={mood.label}
                onClick={() => console.log(`Mood selected: ${mood.label}`)}
              >
                {mood.emoji}
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
              <p className="text-xs text-gray-600">
                {currentPhase === "menstrual"
                  ? "No hay receta para hoy."
                  : currentPhase === "folicular"
                  ? "Ensalada energética con aguacate"
                  : currentPhase === "ovulacion"
                  ? "Salmón con quinoa y verduras"
                  : "Té de manzanilla con miel"}
              </p>
            </div>

            <div className="bg-white/70 p-3 rounded-lg">
              <h5 className="font-medium text-gray-700 text-xs mb-1 flex items-center">
                <span className="mr-1">🏃‍♀️</span>
                Rutina de ejercicio para fase menstrual
              </h5>
              <p className="text-xs text-gray-600">
                {currentPhase === "menstrual"
                  ? "Yoga suave y estiramientos"
                  : currentPhase === "folicular"
                  ? "Cardio moderado y caminatas"
                  : currentPhase === "ovulacion"
                  ? "Entrenamientos de alta intensidad"
                  : "Pilates y ejercicios de fuerza"}
              </p>
            </div>
          </div>
        </div>

        {/* Botón de actualizar */}
        <div className="text-center pt-2">
          <button
            onClick={refreshCycleInfo}
            className="text-gray-500 hover:text-gray-700 text-xs underline transition-colors"
          >
            🔄 Actualizar información
          </button>
        </div>
      </div>
    </div>
  );
};
