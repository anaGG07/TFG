<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\MenstrualCycle;
use App\Service\CycleCalculatorService;
use App\Service\ContentRecommendationService;
use App\Repository\CycleDayRepository;
use App\Repository\MenstrualCycleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Doctrine\ORM\EntityManagerInterface;

// ! 20/05/2025 - Actualización completa del controlador para implementar endpoints CRUD faltantes

#[Route('//cycles')]
class CycleController extends AbstractController
{
    public function __construct(
        private MenstrualCycleRepository $cycleRepository,
        private CycleDayRepository $cycleDayRepository,
        private CycleCalculatorService $cycleCalculator,
        private ContentRecommendationService $contentRecommendation,
        private EntityManagerInterface $entityManager
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

    // ! 20/05/2025 - Implementación del endpoint para obtener recomendaciones personalizadas según la fase del ciclo
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

    // ! 20/05/2025 - Nuevo endpoint para obtener detalles avanzados de predicción
    #[Route('/prediction-details', name: 'api_cycles_prediction_details', methods: ['GET'])]
    public function getPredictionDetails(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Usar el servicio para obtener detalles completos de predicción
        $predictionDetails = $this->cycleCalculator->getPredictionDetails($user);
        
        if (!isset($predictionDetails['success']) || !$predictionDetails['success']) {
            return $this->json([
                'message' => $predictionDetails['message'] ?? 'No hay suficientes datos para generar una predicción detallada',
                'defaultValues' => true,
                'cycleLength' => 28,
                'periodDuration' => 5
            ], 200);
        }
        
        return $this->json($predictionDetails);
    }

    // ! 20/05/2025 - Nuevo endpoint para recalcular el algoritmo de predicción
    #[Route('/sync-algorithm', name: 'api_cycles_sync_algorithm', methods: ['POST'])]
    public function syncPredictionAlgorithm(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Recalcular predicciones con datos actualizados
        $recalculatedPrediction = $this->cycleCalculator->recalculatePrediction($user);
        
        return $this->json([
            'message' => 'Algoritmo de predicción sincronizado correctamente',
            'prediction' => $recalculatedPrediction
        ]);
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

    // ! 20/05/2025 - Nuevo endpoint para listar todos los ciclos del usuario con opciones de filtrado
    #[Route('', name: 'api_cycles_list', methods: ['GET'])]
    public function getAllCycles(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }
        
        // Parámetros de paginación y filtrado
        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 10);
        $year = $request->query->getInt('year', 0);
        $month = $request->query->getInt('month', 0);
        
        // Crear query builder base
        $qb = $this->cycleRepository->createQueryBuilder('c')
            ->andWhere('c.user = :user')
            ->setParameter('user', $user);
        
        // Aplicar filtros si están presentes
        if ($year > 0) {
            $qb->andWhere('YEAR(c.startDate) = :year')
               ->setParameter('year', $year);
        }
        
        if ($month > 0) {
            $qb->andWhere('MONTH(c.startDate) = :month')
               ->setParameter('month', $month);
        }
        
        // Obtener el total de ciclos con estos filtros
        $totalQuery = clone $qb;
        $total = $totalQuery->select('COUNT(c.id)')
                            ->getQuery()
                            ->getSingleScalarResult();
        
        // Obtener los ciclos paginados
        $cycles = $qb->orderBy('c.startDate', 'DESC')
                     ->setFirstResult(($page - 1) * $limit)
                     ->setMaxResults($limit)
                     ->getQuery()
                     ->getResult();
        
        $totalPages = ceil($total / $limit);
        
        return $this->json([
            'cycles' => $cycles,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'totalPages' => $totalPages
            ]
        ], 200, [], ['groups' => 'menstrual_cycle:read']);
    }

    // ! 20/05/2025 - Nuevo endpoint para obtener un ciclo específico por ID
    #[Route('/{id}', name: 'api_cycles_get', methods: ['GET'])]
    public function getCycle(int $id): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }
        
        $cycle = $this->cycleRepository->find($id);
        
        if (!$cycle) {
            return $this->json(['message' => 'Cycle not found'], 404);
        }
        
        // Verificar que el ciclo pertenece al usuario actual
        if ($cycle->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('You do not have permission to access this cycle');
        }
        
        return $this->json($cycle, 200, [], ['groups' => 'menstrual_cycle:read']);
    }

    // ! 20/05/2025 - Nuevo endpoint para actualizar un ciclo existente
    #[Route('/{id}', name: 'api_cycles_update', methods: ['PUT'])]
    public function updateCycle(int $id, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }
        
        $cycle = $this->cycleRepository->find($id);
        
        if (!$cycle) {
            return $this->json(['message' => 'Cycle not found'], 404);
        }
        
        // Verificar que el ciclo pertenece al usuario actual
        if ($cycle->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('You do not have permission to update this cycle');
        }
        
        $data = json_decode($request->getContent(), true);
        
        // Actualizar campos básicos del ciclo
        if (isset($data['startDate'])) {
            $cycle->setStartDate(new \DateTime($data['startDate']));
        }
        
        if (isset($data['endDate'])) {
            $cycle->setEndDate(new \DateTime($data['endDate']));
        }
        
        if (isset($data['estimatedNextStart'])) {
            $cycle->setEstimatedNextStart(new \DateTime($data['estimatedNextStart']));
        }
        
        if (isset($data['averageCycleLength'])) {
            $cycle->setAverageCycleLength($data['averageCycleLength']);
        }
        
        if (isset($data['averageDuration'])) {
            $cycle->setAverageDuration($data['averageDuration']);
        }
        
        if (isset($data['flowAmount'])) {
            $cycle->setFlowAmount($data['flowAmount']);
        }
        
        if (isset($data['flowColor'])) {
            $cycle->setFlowColor($data['flowColor']);
        }
        
        if (isset($data['flowOdor'])) {
            $cycle->setFlowOdor($data['flowOdor']);
        }
        
        if (isset($data['painLevel'])) {
            $cycle->setPainLevel($data['painLevel']);
        }
        
        if (isset($data['notes'])) {
            $cycle->setNotes($data['notes']);
        }
        
        // Persistir los cambios
        $this->entityManager->flush();
        
        return $this->json($cycle, 200, [], ['groups' => 'menstrual_cycle:read']);
    }

    // ! 20/05/2025 - Nuevo endpoint para eliminar un ciclo
    #[Route('/{id}', name: 'api_cycles_delete', methods: ['DELETE'])]
    public function deleteCycle(int $id): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }
        
        $cycle = $this->cycleRepository->find($id);
        
        if (!$cycle) {
            return $this->json(['message' => 'Cycle not found'], 404);
        }
        
        // Verificar que el ciclo pertenece al usuario actual
        if ($cycle->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('You do not have permission to delete this cycle');
        }
        
        // Eliminar el ciclo
        $this->entityManager->remove($cycle);
        $this->entityManager->flush();
        
        return $this->json(['message' => 'Cycle deleted successfully']);
    }

    // ! 20/05/2025 - Nuevo endpoint para finalizar un ciclo activo
    #[Route('/end-cycle/{id}', name: 'api_cycles_end', methods: ['POST'])]
    public function endCycle(int $id, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }
        
        $cycle = $this->cycleRepository->find($id);
        
        if (!$cycle) {
            return $this->json(['message' => 'Cycle not found'], 404);
        }
        
        // Verificar que el ciclo pertenece al usuario actual
        if ($cycle->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('You do not have permission to end this cycle');
        }
        
        $data = json_decode($request->getContent(), true);
        $endDate = isset($data['endDate']) ? new \DateTime($data['endDate']) : new \DateTime();
        
        // Establecer la fecha de finalización
        $cycle->setEndDate($endDate);
        
        // Añadir notas si se proporcionan
        if (isset($data['notes'])) {
            $cycle->setNotes($data['notes']);
        }
        
        // Actualizar la duración del ciclo si es necesario
        $duration = $endDate->diff($cycle->getStartDate())->days + 1;
        if ($duration > 0) {
            $cycle->setAverageDuration($duration);
        }
        
        // Persistir los cambios
        $this->entityManager->flush();
        
        return $this->json($cycle, 200, [], ['groups' => 'menstrual_cycle:read']);
    }

    // ! 20/05/2025 - Implementación del endpoint para obtener estadísticas detalladas sobre los ciclos del usuario
    #[Route('/statistics', name: 'api_cycles_statistics', methods: ['GET'])]
    public function getCycleStatistics(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }
        
        $months = $request->query->getInt('months', 6); // Por defecto, analiza los últimos 6 meses
        
        // Calcular la fecha de inicio para la consulta
        $startDate = (new \DateTime())->modify("-{$months} months");
        
        // Obtener ciclos en el rango de tiempo
        $cycles = $this->cycleRepository->createQueryBuilder('c')
            ->andWhere('c.user = :user')
            ->andWhere('c.startDate >= :startDate')
            ->setParameter('user', $user)
            ->setParameter('startDate', $startDate)
            ->orderBy('c.startDate', 'ASC')
            ->getQuery()
            ->getResult();
        
        // Si no hay ciclos, devolver estadísticas por defecto
        if (count($cycles) === 0) {
            return $this->json([
                'cyclesAnalyzed' => 0,
                'averageCycleLength' => 28, // Valor por defecto
                'averagePeriodLength' => 5, // Valor por defecto
                'longestCycle' => null,
                'shortestCycle' => null,
                'regularity' => 0,
                'monthsAnalyzed' => $months
            ]);
        }
        
        // Calcular estadísticas
        $totalCycleLength = 0;
        $totalPeriodLength = 0;
        $cycleLengthValues = [];
        $longestCycle = null;
        $shortestCycle = null;
        
        foreach ($cycles as $cycle) {
            // Para el promedio de duración del ciclo
            $cycleLength = $cycle->getAverageCycleLength();
            $totalCycleLength += $cycleLength;
            $cycleLengthValues[] = $cycleLength;
            
            // Para el promedio de duración del período
            $totalPeriodLength += $cycle->getAverageDuration();
            
            // Para encontrar el ciclo más largo y más corto
            if ($longestCycle === null || $cycleLength > $longestCycle['length']) {
                $longestCycle = [
                    'id' => $cycle->getId(),
                    'startDate' => $cycle->getStartDate()->format('Y-m-d'),
                    'length' => $cycleLength
                ];
            }
            
            if ($shortestCycle === null || $cycleLength < $shortestCycle['length']) {
                $shortestCycle = [
                    'id' => $cycle->getId(),
                    'startDate' => $cycle->getStartDate()->format('Y-m-d'),
                    'length' => $cycleLength
                ];
            }
        }
        
        $cycleCount = count($cycles);
        $averageCycleLength = $totalCycleLength / $cycleCount;
        $averagePeriodLength = $totalPeriodLength / $cycleCount;
        
        // Calcular regularidad como desviación estándar inversa
        $variance = 0;
        foreach ($cycleLengthValues as $length) {
            $variance += pow($length - $averageCycleLength, 2);
        }
        $variance = $variance / $cycleCount;
        $stdDev = sqrt($variance);
        
        // Convertir desviación estándar a un índice de regularidad (0-100)
        // Menor desviación = mayor regularidad
        $regularityIndex = max(0, min(100, 100 - ($stdDev * 10)));
        
        return $this->json([
            'cyclesAnalyzed' => $cycleCount,
            'averageCycleLength' => round($averageCycleLength, 1),
            'averagePeriodLength' => round($averagePeriodLength, 1),
            'longestCycle' => $longestCycle,
            'shortestCycle' => $shortestCycle,
            'regularity' => round($regularityIndex),
            'cycleLengthVariation' => round($stdDev, 1),
            'monthsAnalyzed' => $months,
            'cyclesByMonth' => $this->getCycleCountByMonth($cycles, $months)
        ]);
    }
    
    /**
     * Método auxiliar para agrupar ciclos por mes para estadísticas
     */
    private function getCycleCountByMonth(array $cycles, int $months): array
    {
        $result = [];
        $currentDate = new \DateTime();
        
        // Inicializar array con los últimos X meses
        for ($i = 0; $i < $months; $i++) {
            $monthDate = (clone $currentDate)->modify("-{$i} months");
            $yearMonth = $monthDate->format('Y-m');
            $result[$yearMonth] = [
                'year' => (int)$monthDate->format('Y'),
                'month' => (int)$monthDate->format('m'),
                'count' => 0
            ];
        }
        
        // Contar ciclos por mes
        foreach ($cycles as $cycle) {
            $yearMonth = $cycle->getStartDate()->format('Y-m');
            if (isset($result[$yearMonth])) {
                $result[$yearMonth]['count']++;
            }
        }
        
        // Convertir a array indexado para JSON
        return array_values($result);
    }
}