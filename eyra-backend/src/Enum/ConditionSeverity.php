<?php

namespace App\Enum;

/* ! 31/05/2025 - Enum creado para clasificar la severidad de las condiciones médicas */
enum ConditionSeverity: string
{
    case MILD = 'mild';
    case MODERATE = 'moderate';
    case SEVERE = 'severe';
    case CRITICAL = 'critical';

    public function getLabel(): string
    {
        return match($this) {
            self::MILD => 'Leve',
            self::MODERATE => 'Moderada',
            self::SEVERE => 'Severa',
            self::CRITICAL => 'Crítica',
        };
    }

    public function getDescription(): string
    {
        return match($this) {
            self::MILD => 'Condición leve que requiere monitoreo básico',
            self::MODERATE => 'Condición moderada que requiere seguimiento regular',
            self::SEVERE => 'Condición severa que requiere atención médica frecuente',
            self::CRITICAL => 'Condición crítica que requiere atención médica inmediata',
        };
    }
}
