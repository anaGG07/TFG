// src/features/calendar/config/calendarConstants.ts

export type ViewType = "month" | "week" | "day";

// Días de la semana (formato corto)
export const WEEK_DAYS = ["L", "M", "X", "J", "V", "S", "D"];

// Días de la semana (formato completo)
export const WEEK_DAYS_FULL = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

// Configuración de vistas disponibles
export const VIEW_TYPES = [
  { type: "month" as ViewType, label: "Mes", shortLabel: "M" },
  { type: "week" as ViewType, label: "Semana", shortLabel: "S" },
  { type: "day" as ViewType, label: "Día", shortLabel: "D" },
] as const;

// Configuración por defecto del calendario
export const CALENDAR_DEFAULTS = {
  VIEW_TYPE: "month" as ViewType,
  WEEK_STARTS_ON: 1, // Lunes = 1
  MIN_CELL_HEIGHT: 50,
  MONTH_VIEW_MIN_HEIGHT: 400,
  MONTH_VIEW_MAX_HEIGHT: 500,
  WEEK_VIEW_MIN_HEIGHT: 300,
} as const;

// Configuración del flujo menstrual
export const FLOW_INTENSITY = {
  NONE: 0,
  VERY_LIGHT: 1,
  LIGHT: 2,
  MODERATE: 3,
  HEAVY: 4,
  VERY_HEAVY: 5,
} as const;

export const FLOW_INTENSITY_LABELS = {
  [FLOW_INTENSITY.NONE]: "Sin flujo",
  [FLOW_INTENSITY.VERY_LIGHT]: "Muy ligero",
  [FLOW_INTENSITY.LIGHT]: "Ligero",
  [FLOW_INTENSITY.MODERATE]: "Moderado",
  [FLOW_INTENSITY.HEAVY]: "Abundante",
  [FLOW_INTENSITY.VERY_HEAVY]: "Muy abundante",
} as const;

// Límites para la visualización
export const DISPLAY_LIMITS = {
  MAX_FLOW_DOTS: 5,
  MAX_SYMPTOMS_PREVIEW: 2,
  MAX_MOOD_PREVIEW: 2,
  MAX_SYMPTOMS_VISIBLE: 3,
} as const;

// Colores del tema neomorphic
export const NEOMORPHIC_COLORS = {
  BASE: "#e7e0d5",
  PRIMARY: "#7a2323",
  LIGHT: "#f5ede6",
  SHADOW_INSET: "rgba(199,191,180,0.3)",
  SHADOW_LIGHT: "rgba(255,255,255,0.7)",
  SHADOW_HOVER: "rgba(122,35,35,0.15)",
  SHADOW_ACTIVE: "rgba(122,35,35,0.3)",
} as const;

// Configuración de animaciones
export const ANIMATION_DURATION = {
  FAST: 0.1,
  NORMAL: 0.3,
  SLOW: 0.5,
  EXTRA_SLOW: 1.0,
} as const;
