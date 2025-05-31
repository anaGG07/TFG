<?php

namespace App\Enum;

/* ! 31/05/2025 - Enum creado para categorizar las condiciones médicas */
enum ConditionCategory: string
{
    case GYNECOLOGICAL = 'gynecological';
    case HORMONAL = 'hormonal';
    case REPRODUCTIVE = 'reproductive';
    case ENDOCRINE = 'endocrine';
    case AUTOIMMUNE = 'autoimmune';
    case MENTAL_HEALTH = 'mental_health';
    case CHRONIC_PAIN = 'chronic_pain';
    case CANCER = 'cancer';
    case GENETIC = 'genetic';
    case INFECTIOUS = 'infectious';
    case OTHER = 'other';

    public function getLabel(): string
    {
        return match($this) {
            self::GYNECOLOGICAL => 'Ginecológicas',
            self::HORMONAL => 'Hormonales',
            self::REPRODUCTIVE => 'Reproductivas',
            self::ENDOCRINE => 'Endocrinas',
            self::AUTOIMMUNE => 'Autoinmunes',
            self::MENTAL_HEALTH => 'Salud Mental',
            self::CHRONIC_PAIN => 'Dolor Crónico',
            self::CANCER => 'Cáncer',
            self::GENETIC => 'Genéticas',
            self::INFECTIOUS => 'Infecciosas',
            self::OTHER => 'Otras',
        };
    }

    public function getDescription(): string
    {
        return match($this) {
            self::GYNECOLOGICAL => 'Condiciones relacionadas con el sistema reproductivo femenino',
            self::HORMONAL => 'Desbalances y trastornos hormonales',
            self::REPRODUCTIVE => 'Problemas de fertilidad y reproducción',
            self::ENDOCRINE => 'Trastornos del sistema endocrino',
            self::AUTOIMMUNE => 'Enfermedades autoinmunes que afectan la salud femenina',
            self::MENTAL_HEALTH => 'Condiciones de salud mental relacionadas con el ciclo menstrual',
            self::CHRONIC_PAIN => 'Síndromes de dolor crónico',
            self::CANCER => 'Tipos de cáncer que afectan a las mujeres',
            self::GENETIC => 'Condiciones genéticas hereditarias',
            self::INFECTIOUS => 'Infecciones del tracto reproductivo',
            self::OTHER => 'Otras condiciones médicas relevantes',
        };
    }
}
