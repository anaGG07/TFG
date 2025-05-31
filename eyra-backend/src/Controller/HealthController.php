<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/* ! 31/05/2025 - Controlador de salud para verificación de Railway deployment */
class HealthController extends AbstractController
{
    #[Route('/api/health', name: 'api_health_check', methods: ['GET'])]
    public function healthCheck(): JsonResponse
    {
        return $this->json([
            'status' => 'healthy',
            'timestamp' => date('c'),
            'service' => 'EYRA Backend',
            'version' => '0.6.0'
        ]);
    }

    #[Route('/health', name: 'health_check_simple', methods: ['GET'])]
    public function simpleHealthCheck(): JsonResponse
    {
        return $this->json(['status' => 'ok']);
    }
}
