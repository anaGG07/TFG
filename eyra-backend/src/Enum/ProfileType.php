<?php

namespace App\Enum;

enum ProfileType: string
{
    case GUEST = 'profile_guest';
    case WOMEN = 'profile_women';
    case TRANS = 'profile_trans';
    case UNDERAGE = 'profile_underage';
}
