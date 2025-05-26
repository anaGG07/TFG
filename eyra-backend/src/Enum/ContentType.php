<?php

namespace App\Enum;

enum ContentType: string
{
    case NUTRITION = 'nutrition';          // Recetas
    case EXERCISE = 'exercise';      // Ejercicio
    case ARTICLE = 'article';        // Artículo informativo
    case SELFCARE = 'selfcare';      // Autocuidado
    case RECOMMENDATION = 'recommendation'; // Recomendación general
}
