// src/features/calendar/config/phaseConfig.ts
import { CyclePhase } from "../../../types/domain";
import { PhaseIcons } from "../../../components/icons/PhaseIcons";

export interface PhaseConfig {
  color: string;
  icon: (color: string) => React.ReactElement;
  gradient: string;
  leftBorder: string; // Solo para la leyenda
  fullBackground: string;
  description: string;
}

// Configuración actualizada - franjas eliminadas del calendario, mantenidas en leyenda
export const phaseConfig: Record<CyclePhase, PhaseConfig> = {
  [CyclePhase.MENSTRUAL]: {
    color: "from-red-100 to-red-200",
    icon: PhaseIcons.menstrual,
    gradient: "bg-gradient-to-br from-red-50 via-red-100 to-red-200",
    leftBorder: "border-l-4 border-red-200",
    fullBackground: "bg-[#fef2f2]",
    description: "Menstruación",
  },
  [CyclePhase.FOLICULAR]: {
    color: "from-green-100 to-green-200",
    icon: PhaseIcons.folicular,
    gradient: "bg-gradient-to-br from-green-50 via-green-100 to-green-200",
    leftBorder: "",
    fullBackground: "bg-emerald-50",
    description: "Fase folicular",
  },
  [CyclePhase.OVULACION]: {
    color: "from-purple-100 to-purple-200",
    icon: PhaseIcons.ovulacion,
    gradient: "bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200",
    leftBorder: "",
    fullBackground: "bg-purple-50",
    description: "Ovulación",
  },
  [CyclePhase.LUTEA]: {
    color: "from-amber-100 to-amber-200",
    icon: PhaseIcons.lutea,
    gradient: "bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200",
    leftBorder: "",
    fullBackground: "bg-amber-50",
    description: "Fase lútea",
  },
};
