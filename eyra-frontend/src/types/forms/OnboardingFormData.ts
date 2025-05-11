export interface OnboardingFormData {
  isPersonal: boolean;
  genderIdentity: string;
  pronouns?: string;
  stageOfLife: string;
  lastPeriodDate?: string;
  averageCycleLength?: number;
  averagePeriodLength?: number;
  hormoneType?: string;
  hormoneStartDate?: string;
  hormoneFrequencyDays?: number;
  receiveAlerts: boolean;
  receiveRecommendations: boolean;
  receiveCyclePhaseTips: boolean;
  receiveWorkoutSuggestions: boolean;
  receiveNutritionAdvice: boolean;
  shareCycleWithPartner: boolean;
  wantAICompanion: boolean;
  healthConcerns: string[];
  accessCode?: string;
  allowParentalMonitoring: boolean;
  commonSymptoms: string[];
}
