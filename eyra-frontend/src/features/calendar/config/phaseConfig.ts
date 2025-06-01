// src/features/calendar/config/phaseConfig.ts
import { CyclePhase } from "../../../types/domain";

export interface PhaseConfig {
  color: string;
  icon: string;
  gradient: string;
  description: string;
}

export const phaseConfig: Record<CyclePhase, PhaseConfig> = {
  [CyclePhase.MENSTRUAL]: {
    color: "from-red-200 to-red-300",
    icon: "🩸",
    gradient: "bg-gradient-to-br from-red-100 via-red-200 to-red-300",
    description: "Menstruación",
  },
  [CyclePhase.FOLICULAR]: {
    color: "from-green-200 to-green-300",
    icon: "🌱",
    gradient: "bg-gradient-to-br from-green-100 via-green-200 to-green-300",
    description: "Fase folicular",
  },
  [CyclePhase.OVULACION]: {
    color: "from-blue-200 to-blue-300",
    icon: "🥚",
    gradient: "bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300",
    description: "Ovulación",
  },
  [CyclePhase.LUTEA]: {
    color: "from-yellow-200 to-yellow-300",
    icon: "🌙",
    gradient: "bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300",
    description: "Fase lútea",
  },
};
