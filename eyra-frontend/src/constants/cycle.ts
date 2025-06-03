import { CyclePhase } from '../types/domain';

// Paleta de colores
export const COLORS = {
  background: '#FCE9E6',
  circle: '#F8D9D6',
  phaseMenstrual: '#222',
  phaseFolicular: '#E6B7C1',
  phaseOvulatory: '#FFF',
  phaseLuteal: '#B7C1E6',
  marker: '#E57373',
  text: '#222',
  feliz: '#FFE6A7',
  cansada: '#D6E6F8',
  irritable: '#FFD6D6',
  triste: '#D6D6F8',
  motivada: '#D6F8E6',
  tranquila: '#D6E6F8',
  sensible: '#D6D6F8',
};

// Fases del ciclo
export const PHASES = [
  { name: 'Menstrual', color: COLORS.phaseMenstrual, value: CyclePhase.MENSTRUAL },
  { name: 'Folicular', color: COLORS.phaseFolicular, value: CyclePhase.FOLICULAR },
  { name: 'Ovulatoria', color: COLORS.phaseOvulatory, value: CyclePhase.OVULACION },
  { name: 'Lútea', color: COLORS.phaseLuteal, value: CyclePhase.LUTEA },
];

// Estados de ánimo
export const MOODS = [
  { value: 'feliz', label: 'Feliz', color: COLORS.feliz, intenseColor: '#E6B800' },
  { value: 'tranquila', label: 'Tranquila', color: COLORS.tranquila, intenseColor: '#3A7CA5' },
  { value: 'motivada', label: 'Motivada', color: COLORS.motivada, intenseColor: '#1DB954' },
  { value: 'sensible', label: 'Sensible', color: COLORS.sensible, intenseColor: '#6C63FF' },
  { value: 'irritable', label: 'Irritable', color: COLORS.irritable, intenseColor: '#C62328' },
];

// Síntomas
export const SYMPTOM_OPTIONS = [
  'Dolor abdominal',
  'Fatiga',
  'Dolor de cabeza',
  'Hinchazón',
  'Náuseas',
  'Sensibilidad en senos',
  'Cambios de humor',
];

// Constantes del ciclo
export const CYCLE_DAYS = 28;

// Función para obtener la probabilidad de embarazo según la fase
export function getPregnancyProbability(phase: CyclePhase) {
  switch (phase) {
    case CyclePhase.OVULACION:
      return { text: 'Alta', color: '#E57373' };
    case CyclePhase.FOLICULAR:
      return { text: 'Media', color: '#E6B7C1' };
    case CyclePhase.LUTEA:
      return { text: 'Baja', color: '#B7C1E6' };
    case CyclePhase.MENSTRUAL:
    default:
      return { text: 'Muy baja', color: '#222' };
  }
} 