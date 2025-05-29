<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\ConditionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class ActiveConditionsController extends AbstractController
{
    public function __construct(
        private ConditionRepository $conditionRepository
    ) {}

    // ! 28/05/2025 - Endpoint independiente para listar condiciones activas
    #[Route('/conditions-active', name: 'api_conditions_active_standalone', methods: ['GET'])]
    public function getActiveConditions(): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Obtener todas las condiciones con state=true
        $conditions = $this->conditionRepository->findBy(['state' => true]);

        return $this->json($conditions, 200, [], ['groups' => 'condition:read']);
    }
}
