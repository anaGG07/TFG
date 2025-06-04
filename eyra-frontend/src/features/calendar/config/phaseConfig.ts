// src/features/calendar/config/phaseConfig.ts
import { CyclePhase } from "../../../types/domain";

export interface PhaseConfig {
  color: string;
  icon: string;
  gradient: string;
  leftBorder: string; // ! 02/06/2025 - Nuevo: borde izquierdo para la franja
  fullBackground: string; // ! 02/06/2025 - Nuevo: fondo completo para casos especiales
  description: string;
}

// ! 02/06/2025 - Configuración actualizada con colores pasteles y óvalos superiores
export const phaseConfig: Record<CyclePhase, PhaseConfig> = {
  [CyclePhase.MENSTRUAL]: {
    color: "from-red-200 to-red-300",
    icon: "🩸",
    gradient: "bg-gradient-to-br from-red-100 via-red-200 to-red-300",
    leftBorder: "border-l-4 border-red-300", // No se usa para menstrual
    fullBackground: "bg-[#ffe8e9]", // ! 02/06/2025 - Fondo completo para menstruación
    description: "Menstruación",
  },
  [CyclePhase.FOLICULAR]: {
    color: "from-green-200 to-green-300",
    icon: "🌱",
    gradient: "bg-gradient-to-br from-green-100 via-green-200 to-green-300",
    leftBorder: "w-4 h-2 bg-emerald-200 rounded-full", // ! 02/06/2025 - Óvalo verde pastel
    fullBackground: "bg-emerald-50", // Fondo muy sutil
    description: "Fase folicular",
  },
  [CyclePhase.OVULACION]: {
    color: "from-blue-200 to-blue-300",
    icon: "🥚",
    gradient: "bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300",
    leftBorder: "w-4 h-2 bg-purple-200 rounded-full", // ! 02/06/2025 - Óvalo púrpura pastel
    fullBackground: "bg-purple-50", // ! 02/06/2025 - Fondo completo para primer día de ovulación
    description: "Ovulación",
  },
  [CyclePhase.LUTEA]: {
    color: "from-yellow-200 to-yellow-300",
    icon: "🌙",
    gradient: "bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300",
    leftBorder: "w-4 h-2 bg-amber-200 rounded-full", // ! 02/06/2025 - Óvalo ámbar pastel
    fullBackground: "bg-amber-50", // Fondo muy sutil
    description: "Fase lútea",
  },
};
