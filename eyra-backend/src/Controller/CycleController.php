<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\CycleCalculatorService;
use App\Service\ContentRecommendationService;
use App\Repository\CycleDayRepository;
use App\Repository\MenstrualCycleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

#[Route('//cycles')]
class CycleController extends AbstractController
{
    public function __construct(
        private MenstrualCycleRepository $cycleRepository,
        private CycleDayRepository $cycleDayRepository,
        private CycleCalculatorService $cycleCalculator,
        private ContentRecommendationService $contentRecommendation
    ) {
    }

    #[Route('/current', name: 'api_cycles_current', methods: ['GET'])]
    public function getCurrentCycle(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        $currentCycle = $this->cycleRepository->findCurrentForUser($user->getId());
        
        if (!$currentCycle) {
            return $this->json(['message' => 'No active cycle found'], 404);
        }

        return $this->json($currentCycle, 200, [], ['groups' => 'menstrual_cycle:read']);
    }

    #[Route('/today', name: 'api_cycles_today', methods: ['GET'])]
    public function getCurrentDay(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        $today = $this->cycleDayRepository->findCurrentForUser($user);
        
        if (!$today) {
            return $this->json(['message' => 'No cycle day found for today'], 404);
        }

        return $this->json($today, 200, [], ['groups' => 'cycle_day:read']);
    }

    #[Route('/recommendations', name: 'api_cycles_recommendations', methods: ['GET'])]
    public function getRecommendations(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        $contentType = $request->query->get('type');
        $limit = $request->query->getInt('limit', 5);
        
        // Usar el servicio de recomendaciones
        $type = $contentType ? \App\Enum\ContentType::from($contentType) : null;
        $recommendations = $this->contentRecommendation->getPersonalizedRecommendations($user, $type, $limit);
        
        return $this->json($recommendations, 200, [], ['groups' => 'content:read']);
    }

    #[Route('/calendar', name: 'api_cycles_calendar', methods: ['GET'])]
    public function getCalendar(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Parámetros para el rango de fechas
        $startDate = new \DateTime($request->query->get('start', 'first day of this month'));
        $endDate = new \DateTime($request->query->get('end', 'last day of this month'));

        $cycleDays = $this->cycleDayRepository->findByUserAndDateRange($user, $startDate, $endDate);
        
        return $this->json($cycleDays, 200, [], ['groups' => 'cycle_day:read']);
    }

    #[Route('/predict', name: 'api_cycles_predict', methods: ['GET'])]
    public function predictNextCycle(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Usar el servicio para las predicciones
        $prediction = $this->cycleCalculator->predictNextCycle($user);
        
        if (!$prediction['success']) {
            return $this->json(['message' => $prediction['message']], 400);
        }
        
        return $this->json($prediction);
    }

    #[Route('/start-cycle', name: 'api_cycles_start', methods: ['POST'])]
    public function startNewCycle(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }
        
        $data = json_decode($request->getContent(), true);
        $startDate = new \DateTime($data['startDate'] ?? 'now');
        
        // Usar el servicio para crear el ciclo
        $newCycle = $this->cycleCalculator->startNewCycle($user, $startDate);
        
        return $this->json($newCycle, 201, [], ['groups' => 'menstrual_cycle:read']);
    }


}
