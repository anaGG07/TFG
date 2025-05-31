<?php

namespace App\Enum;

enum ProfileType: string
{
    // ! 31/05/2025 - Actualizados valores del enum para coincidir con el frontend y documentación
    case PROFILE_WOMEN = 'profile_women';
    case PROFILE_MEN = 'profile_men';
    case PROFILE_NB = 'profile_nb';
    case PROFILE_TRANSGENDER = 'profile_transgender';
    case PROFILE_CUSTOM = 'profile_custom';
    case PROFILE_PARENT = 'profile_parent';
    case PROFILE_PARTNER = 'profile_partner';
    case PROFILE_PROVIDER = 'profile_provider';
    case PROFILE_GUEST = 'profile_guest';
    
    // ! 31/05/2025 - Mantenemos valores antiguos para compatibilidad durante migración
    case PROFILE_TRANS = 'profile_trans';
    case PROFILE_UNDERAGE = 'profile_underage';
}
