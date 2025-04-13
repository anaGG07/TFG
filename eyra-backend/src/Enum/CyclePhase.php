<?php

namespace App\Enum;

enum CyclePhase: string
{
    case MENSTRUAL = 'menstrual';    // Fase menstrual
    case FOLICULAR = 'folicular';    // Fase folicular
    case OVULACION = 'ovulacion';    // Ovulación
    case LUTEA = 'lutea';            // Fase lútea
}
