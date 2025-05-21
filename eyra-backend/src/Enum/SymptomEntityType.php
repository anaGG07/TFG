<?php

namespace App\Enum;

// ! 20/05/2025 - Creación del enum para los tipos de entidad en síntomas

enum SymptomEntityType: string
{
    case MENSTRUAL_CYCLE = 'menstrual_cycle';
    case PREGNANCY = 'pregnancy';
    case MENOPAUSE = 'menopause';
    case HORMONE_THERAPY = 'hormone_therapy';
    case GENERAL = 'general';
    case CHRONIC = 'chronic';
    case TRANSITION = 'transition';
    
    public static function getChoices(): array
    {
        return [
            'Menstrual Cycle' => self::MENSTRUAL_CYCLE->value,
            'Pregnancy' => self::PREGNANCY->value,
            'Menopause' => self::MENOPAUSE->value,
            'Hormone Therapy' => self::HORMONE_THERAPY->value,
            'General' => self::GENERAL->value,
            'Chronic Condition' => self::CHRONIC->value,
            'Gender Transition' => self::TRANSITION->value,
        ];
    }
}
