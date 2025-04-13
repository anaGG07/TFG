<?php

namespace App\Enum;

enum ContentType: string
{
    case RECIPE = 'recipe';          // Recetas
    case EXERCISE = 'exercise';      // Ejercicio
    case ARTICLE = 'article';        // Artículo informativo
    case SELFCARE = 'selfcare';      // Autocuidado
    case RECOMMENDATION = 'recommendation'; // Recomendación general
}
