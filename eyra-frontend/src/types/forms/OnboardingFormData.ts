import { ProfileType } from '../domain';

export interface OnboardingFormData {
  // Datos básicos
  profileType: ProfileType;
  genderIdentity: string;
  pronouns?: string;
  isPersonal: boolean;
  stageOfLife: string;

  // Datos del ciclo menstrual
  lastPeriodDate?: string | null;
  averageCycleLength?: number | null;
  averagePeriodLength?: number | null;

  // Datos de hormonas
  hormoneType?: string | null;
  hormoneStartDate?: string | null;
  hormoneFrequencyDays?: number | null;

  // Preferencias de notificaciones
  receiveAlerts: boolean;
  receiveRecommendations: boolean;
  receiveCyclePhaseTips: boolean;
  receiveWorkoutSuggestions: boolean;
  receiveNutritionAdvice: boolean;

  // Preferencias de privacidad
  shareCycleWithPartner: boolean;
  wantAiCompanion: boolean;
  allowParentalMonitoring: boolean;

  // Datos de salud
  healthConcerns: string[];
  commonSymptoms: string[];

  // Código de acceso (solo para perfiles no personales)
  accessCode?: string;
}
