// ! 31/05/2025 - Actualizados ProfileTypes según el enum del backend corregido
export enum ProfileType {
  // Tipos principales de perfil
  PROFILE_WOMEN = 'profile_women',
  PROFILE_MEN = 'profile_men',
  PROFILE_NB = 'profile_nb',
  PROFILE_TRANSGENDER = 'profile_transgender',
  PROFILE_CUSTOM = 'profile_custom',
  PROFILE_PARENT = 'profile_parent',
  PROFILE_PARTNER = 'profile_partner',
  PROFILE_PROVIDER = 'profile_provider',
  PROFILE_GUEST = 'profile_guest',
  
  // Compatibilidad con valores antiguos
  PROFILE_TRANS = 'profile_trans',
  PROFILE_UNDERAGE = 'profile_underage'
}

export enum HormoneType {
  ESTROGEN = 'ESTROGEN',
  PROGESTERONE = 'PROGESTERONE',
  TESTOSTERONE = 'TESTOSTERONE',
  OTHER = 'OTHER'
}

export enum CyclePhase {
  MENSTRUAL = 'MENSTRUAL',
  FOLLICULAR = 'FOLLICULAR',
  OVULATION = 'OVULATION',
  LUTEAL = 'LUTEAL'
} 