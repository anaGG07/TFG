<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class InsightController extends AbstractController
{
    #[Route('//insights/summary', name: 'api_insights_summary', methods: ['GET'])]
    public function summary(): JsonResponse
    {
        // Simulación: devolver resumen de ciclos
        return $this->json([
            'averageDuration' => 5,
            'shortestCycle' => 26,
            'longestCycle' => 30,
            'totalCycles' => 12,
            'commonSymptoms' => [
                ['type' => 'dolor abdominal', 'count' => 10],
                ['type' => 'cansancio', 'count' => 8]
            ]
        ]);
    }

    #[Route('//insights/predictions', name: 'api_insights_predictions', methods: ['GET'])]
    public function predictions(): JsonResponse
    {
        // Simulación: predicción próxima menstruación y ventana fértil
        return $this->json([
            'nextPeriodDate' => '2025-04-28',
            'confidenceScore' => 0.92,
            'nextFertileWindow' => [
                'start' => '2025-04-17',
                'end' => '2025-04-22',
            ]
        ]);
    }

    #[Route('//insights/patterns', name: 'api_insights_patterns', methods: ['GET'])]
    public function patterns(): JsonResponse
    {
        // Simulación: patrón de síntomas
        return $this->json([
            [
                'symptomType' => 'dolor de cabeza',
                'dayInCycle' => 2,
                'frequency' => 8,
                'averageIntensity' => 6
            ],
            [
                'symptomType' => 'hinchazón',
                'dayInCycle' => 24,
                'frequency' => 6,
                'averageIntensity' => 4
            ]
        ]);
    }
}
