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
  wantAiCompanion: boolean;
  healthConcerns: string[];
  accessCode?: string;
  allowParentalMonitoring: boolean;
  commonSymptoms: string[];
  profileType:
    | "profile_guest"
    | "profile_women"
    | "profile_trans"
    | "profile_underage";
  completed: boolean;
  pregnancyStartDate?: string | null;
  pregnancyDueDate?: string | null;
  pregnancyWeek?: number | null;
  pregnancySymptoms?: string | null;
  pregnancyFetalMovements?: string | null;
  pregnancyUltrasoundDate?: string | null;
  pregnancyNotes?: string | null;
  otherSymptoms?: string | null;
}
