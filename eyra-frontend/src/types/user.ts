import { ProfileType } from './enums';

// ! 31/05/2025 - Agregada interfaz Avatar según documentación
export interface Avatar {
  skinColor: string;
  eyes: string;
  eyebrows: string;
  mouth: string;
  hairStyle: string;
  hairColor: string;
  facialHair: string;
  clothes: string;
  fabricColor: string;
  glasses: string;
  glassOpacity: string;
  accessories: string;
  tattoos: string;
  backgroundColor: string;
}

export interface Onboarding {
  id: number;
  profileType: ProfileType;
  stageOfLife: string;
  lastPeriodDate: string | null;
  averageCycleLength: number | null;
  averagePeriodLength: number | null;
  completed: boolean;
  receiveAlerts: boolean;
  receiveRecommendations: boolean;
  receiveCyclePhaseTips: boolean;
  receiveWorkoutSuggestions: boolean;
  receiveNutritionAdvice: boolean;
  shareCycleWithPartner: boolean;
}

// ! 31/05/2025 - Actualizada interfaz User con avatar
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
  onboarding: Onboarding;
  avatar?: Avatar;
} 