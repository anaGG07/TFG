// Enumeraciones
export enum CyclePhase {
  MENSTRUAL = 'menstrual',
  FOLICULAR = 'folicular',
  OVULACION = 'ovulacion',
  LUTEA = 'lutea'
}

export enum ContentType {
  NUTRITION = 'nutrition',
  EXERCISE = 'exercise',
  ARTICLE = 'article',
  SELFCARE = 'selfcare',
  RECOMMENDATION = 'recommendation'
}

export enum HormoneType {
  ESTROGEN = 'estrogen',
  PROGESTERONE = 'progesterone',
  TESTOSTERONE = 'testosterone',
  LUTEINIZING_HORMONE = 'luteinizing_hormone',
  FOLLICLE_STIMULATING_HORMONE = 'follicle_stimulating_hormone'
}

export enum GuestType {
  PARTNER = 'partner',
  PARENTAL = 'parental',
  FRIEND = 'friend'
}

export enum UserProfileType {
  GUEST = 'GUEST',
  USER = 'USER',
  ADMIN = 'ADMIN'
}

// Interfaces
export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  lastName: string;
  profileType: UserProfileType;
  genderIdentity: string;
  birthDate: string;
  roles: string[];
}

export interface CycleDay {
  id: string;
  date: string;
  dayNumber: number;
  phase: CyclePhase;
  flowIntensity?: number;
  symptoms: string[];
  mood: string[];
  notes: string[];
}

export interface MenstrualCycle {
  id: string;
  userId: string;
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
}

export interface Condition {
  id: string;
  name: string;
  description: string;
  isChronic: boolean;
}

export interface UserCondition {
  id: string;
  userId: string;
  conditionId: string;
  condition?: Condition;
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  content: string;
  type: ContentType;
  targetPhase?: CyclePhase;
  tags?: string[];
  imageUrl?: string;
}

export interface HormoneLevel {
  id: string;
  userId: string;
  cycleDayId?: string;
  hormoneType: HormoneType;
  level: number;
}

export interface PregnancyLog {
  id: string;
  userId: string;
  startDate: string;
  dueDate: string;
  week: number;
  symptoms?: string;
  fetalMovements?: string;
  ultrasoundDate?: string;
  notes?: string;
}

export interface MenopauseLog {
  id: string;
  userId: string;
  startDate: string;
  hotFlashes: boolean;
  moodSwings: boolean;
  vaginalDryness: boolean;
  insomnia: boolean;
  hormoneTherapy: boolean;
  notes?: string;
}

export interface GuestAccess {
  id: string;
  ownerId: string;
  guestId: string;
  guestType: GuestType;
  accessTo: string[];
  expiresAt?: string;
}

export interface Notification {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  isRead: boolean;
  scheduledFor: string;
  sentAt?: string;
  isSent: boolean;
  metadata?: any;
}