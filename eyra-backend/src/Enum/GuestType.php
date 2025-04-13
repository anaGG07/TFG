<?php

namespace App\Enum;

enum GuestType: string
{
    case PARTNER = 'partner';    // Pareja
    case PARENTAL = 'parental';  // Control parental
    case FRIEND = 'friend';      // Amigo
}
