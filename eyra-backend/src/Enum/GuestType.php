<?php

namespace App\Enum;

enum GuestType: string
{
    case PARTNER = 'partner';    // Pareja
    case PARENTAL = 'parental';  // Control parental
    case FRIEND = 'friend';      // Amigo
        // ! 28/05/2025 - Añadido tipo healthcare_provider para profesionales de salud
    case HEALTHCARE_PROVIDER = 'healthcare_provider'; // Profesional de salud
}
