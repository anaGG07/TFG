import { ProfileType } from './enums';

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
  // ! 08/06/2025 - Campo para controlar privacidad de búsqueda
  allowSearchable: boolean;
} 