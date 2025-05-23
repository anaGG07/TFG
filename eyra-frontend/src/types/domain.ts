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
  RECIPE = 'recipe',
  EXERCISE = 'exercise',
  ARTICLE = 'article',
  SELFCARE = 'selfcare',
  RECOMMENDATION = 'recommendation',
}

export interface User {
  id: number;
  email: string;
  username: string;
  name: string;
  lastName: string;
  profileType: ProfileType;
  roles: string[];
  birthDate: string;
  createdAt: string;
  updatedAt: string | null;
  state: boolean;
  onboardingCompleted: boolean;
  onboarding?: {
    id: number;
    profileType: string;
    stageOfLife: string;
    lastPeriodDate: string | null;
    averageCycleLength: number | null;
    averagePeriodLength: number | null;
    completed: boolean;
  };
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
  id: number;
  date: string;
  dayNumber: number;
  phase: CyclePhase;
  symptoms: string[];
  notes: string[];
  mood: string[];
  flowIntensity?: number;
  hormoneLevels?: HormoneLevel[];
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
