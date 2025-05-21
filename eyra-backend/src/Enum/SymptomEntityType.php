<?php

namespace App\Enum;

// ! 21/05/2025 - Creada enumeración para categorizar síntomas según su contexto

enum SymptomEntityType: string
{
    case MENSTRUAL_CYCLE = 'menstrual_cycle';
    case PREGNANCY = 'pregnancy';
    case MENOPAUSE = 'menopause';
    case HORMONE_THERAPY = 'hormone_therapy';
    case OTHER = 'other';
}
