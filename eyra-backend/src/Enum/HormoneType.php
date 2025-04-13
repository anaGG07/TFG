<?php

namespace App\Enum;

enum HormoneType: string
{
    case ESTROGEN = 'estrogen';
    case PROGESTERONE = 'progesterone';
    case TESTOSTERONE = 'testosterone';
    case LH = 'luteinizing_hormone';
    case FSH = 'follicle_stimulating_hormone';
}
