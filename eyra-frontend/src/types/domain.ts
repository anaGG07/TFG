import { AvatarConfig } from './avatar';

export enum ProfileType {
  GUEST = 'profile_guest',
  WOMEN = 'profile_women',
  TRANS = 'profile_trans',
  UNDERAGE = 'profile_underage',
}

export enum CyclePhase {
  MENSTRUAL = 'menstrual',
  FOLICULAR = 'folicular',
  OVULACION = 'ovulacion',
  LUTEA = 'lutea',
}

export enum ContentType {
  NUTRITION = 'nutrition',
  EXERCISE = 'exercise',
  ARTICLE = 'article',
  SELFCARE = 'selfcare',
  RECOMMENDATION = 'recommendation',
  RITUAL = 'ritual',
}

export interface User {
  id: number;
  email: string;
  username: string;
  name: string;
  lastName: string;
  roles: string[];
  profileType: ProfileType;
  birthDate: string;
  createdAt: string;
  updatedAt: string | null;
  state: boolean;
  onboardingCompleted: boolean;
  avatar: AvatarConfig;
  // ! 08/06/2025 - Campo para controlar privacidad de búsqueda
  allowSearchable: boolean;
  onboarding: {
    receiveAlerts: boolean;
    receiveRecommendations: boolean;
    receiveCyclePhaseTips: boolean; 
    receiveWorkoutSuggestions: boolean;
    receiveNutritionAdvice: boolean;
    profileType: string;
    stageOfLife: string;
    lastPeriodDate: string | null;
    averageCycleLength: number | null;
    averagePeriodLength: number | null;
    completed: boolean;
  };
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  sets: number;
  reps: number;
  restTime: number;
  equipment: string[];
  muscleGroups: string[];
}

export interface MenstrualCycle {
  id: number;
  user: User;
  startDate: string;
  endDate: string;
  estimatedNextStart: string;
  averageCycleLength: number;
  averageDuration: number;
  flowAmount?: string;
  flowColor?: string;
  flowOdor?: string;
  painLevel?: number;
  notes?: string;
  cycleDays: CycleDay[];
}

export interface CycleDay {
  id: string;
  date: string;
  dayNumber: number;
  phase: CyclePhase;
  symptoms: string[];
  notes: string[];
  mood: string[];
  flowIntensity?: number;
  hormoneLevels?: HormoneLevel[];
  // Propiedades para predicciones
  isPrediction?: boolean;
  confidence?: number;
}

export interface HormoneLevel {
  id: number;
  hormone: string;
  value: number;
  unit: string;
  date: string;
}

export interface Content {
  id: number;
  title: string;
  type: ContentType;
  summary: string;
  body: string;
  targetPhase?: CyclePhase;
  imageUrl?: string;
  tags?: string[];
}

export interface GuestAccess {
  id: number;
  owner: User;
  guest: User;
  accessType: 'partner' | 'parental';
  permissions: string[];
  createdAt: string;
  expiresAt?: string;
}

export interface AIQuery {
  id: number;
  user: User;
  question: string;
  answer: string;
  createdAt: string;
}

// ✅ Re-exportar tipos de avatar para facilitar importaciones
export type { AvatarConfig } from './avatar';
export { 
  defaultAvatarConfig, 
  createEmptyAvatarConfig, 
  isValidAvatarConfig, 
  ensureValidAvatarConfig 
} from './avatar';
