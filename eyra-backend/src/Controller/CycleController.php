<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\MenstrualCycle;
use App\Entity\CycleDay;
use App\Enum\CyclePhase;
use App\Service\CycleCalculatorService;
use App\Service\CyclePhaseService;
use App\Service\ContentRecommendationService;
use App\Service\CalendarAccessService;
use App\Repository\CycleDayRepository;
use App\Repository\MenstrualCycleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Doctrine\ORM\EntityManagerInterface;

// ! 20/05/2025 - Actualización completa del controlador para implementar endpoints CRUD faltantes
// ! 23/05/2025 - Actualizado para trabajar con el nuevo modelo basado en fases

#[Route('//cycles')]
class CycleController extends AbstractController
{
    public function __construct(
        private MenstrualCycleRepository $cycleRepository,
        private CycleDayRepository $cycleDayRepository,
        private CycleCalculatorService $cycleCalculator,
        private CyclePhaseService $cyclePhaseService,
        private ContentRecommendationService $contentRecommendation,
        private CalendarAccessService $calendarAccessService,
        private EntityManagerInterface $entityManager
    ) {}

    // ! 23/05/2025 - Actualizado para trabajar con el nuevo modelo basado en fases
    // ! 25/05/2025 - Actualizado para devolver el ciclo actual con las fases organizadas
    #[Route('/current', name: 'api_cycles_current', methods: ['GET'])]
    public function getCurrentCycle(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Obtener todas las fases del ciclo actual
        $currentPhases = $this->cycleRepository->findCurrentPhasesForUser($user->getId());
        //return $this->json($currentPhases ,200);

        if (empty($currentPhases)) {
            return $this->json(['message' => 'No active cycle found'], 404);
        }

        //dd($currentPhases);
        // Organizar las fases por tipo
        $organizedPhases = [];
        $cycleId = null;

        foreach ($currentPhases as $phase) {
            $cycleId = $phase->getCycleId();
            $organizedPhases[$phase->getPhase()->value] = [
                'phase' => $phase->getPhase()->value,
                'startDate' => $phase->getStartDate()->format('Y-m-d'),
                'endDate' => $phase->getEndDate()?->format('Y-m-d'),
                'cycleId' => $phase->getCycleId(),
                'notes' => $phase->getNotes(),
                // agrega lo que necesites
            ];
        }

        $current = $this->determineCurrentPhase($currentPhases);
        $currentPhase = $current ? [
            'phase' => $current->getPhase()->value,
            'startDate' => $current->getStartDate()->format('Y-m-d'),
            'endDate' => $current->getEndDate()?->format('Y-m-d'),
            'cycleId' => $current->getCycleId(),
            'notes' => $current->getNotes(),
        ] : null;

        return $this->json([
            'cycleId' => $cycleId,
            'phases' => $organizedPhases,
            'currentPhase' => $currentPhase
        ]);
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

        // Si no existe un día para hoy, intentamos crearlo automáticamente
        if (!$today) {
            // Buscar si hay un ciclo activo para este usuario
            $currentPhases = $this->cycleRepository->findCurrentPhasesForUser($user->getId());

            if (empty($currentPhases)) {
                return $this->json(['message' => 'No active cycle found. Please start a cycle first.'], 404);
            }

            // Determinar la fase actual
            $currentPhase = $this->determineCurrentPhase($currentPhases);

            if (!$currentPhase) {
                return $this->json(['message' => 'Could not determine current cycle phase'], 500);
            }

            $date = new \DateTime();

            // Calcular el número de día (días desde el inicio de la fase)
            $dayNumber = $date->diff($currentPhase->getStartDate())->days + 1;

            // Crear nuevo día de ciclo
            $today = new CycleDay();
            $today->setCyclePhase($currentPhase);
            // Solución temporal: Establecer cycle_id para compatibilidad con BD
            $today->setCycleId($currentPhase->getId());
            // Solución temporal: Establecer phase para compatibilidad con BD
            $today->setPhase($currentPhase->getPhase() ? $currentPhase->getPhase()->value : 'UNKNOWN');
            $today->setDate($date);
            $today->setDayNumber($dayNumber);

            // Persistir el nuevo día de ciclo
            $this->entityManager->persist($today);
            $this->entityManager->flush();
        }

        return $this->json($today, 200, [], ['groups' => 'cycle_day:read']);
    }

    // ! 20/05/2025 - Implementación del endpoint para obtener recomendaciones personalizadas según la fase del ciclo
    // ! 25/05/2025 - Actualizado para generar automáticamente un día de ciclo si no existe
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

        // Si no hay información sobre el ciclo, intentar crear un día automáticamente
        if (!$recommendations['success'] && $recommendations['message'] == 'No se encontró información sobre tu ciclo actual') {
            // Intentar crear un día para hoy si no existe
            $currentPhases = $this->cycleRepository->findCurrentPhasesForUser($user->getId());

            if (!empty($currentPhases)) {
                // Determinar la fase actual
                $currentPhase = $this->determineCurrentPhase($currentPhases);

                if ($currentPhase) {
                    $date = new \DateTime();

                    // Calcular el número de día (días desde el inicio de la fase)
                    $dayNumber = $date->diff($currentPhase->getStartDate())->days + 1;

                    // Crear nuevo día de ciclo
                    $today = new CycleDay();
                    $today->setCyclePhase($currentPhase);
                    // Solución temporal: Establecer cycle_id para compatibilidad con BD
                    $today->setCycleId($currentPhase->getId());
                    // Solución temporal: Establecer phase para compatibilidad con BD
                    $today->setPhase($currentPhase->getPhase() ? $currentPhase->getPhase()->value : 'UNKNOWN');
                    $today->setDate($date);
                    $today->setDayNumber($dayNumber);

                    // Persistir el nuevo día de ciclo
                    $this->entityManager->persist($today);
                    $this->entityManager->flush();

                    // Intentar obtener recomendaciones nuevamente
                    $recommendations = $this->contentRecommendation->getPersonalizedRecommendations($user, $type, $limit);
                }
            }
        }

        return $this->json($recommendations, 200, [], ['groups' => 'content:read']);
    }

    // ! 25/05/2025 - Modificado para devolver los ciclos y sus días asociados en el rango de fechas
    // ! 31/05/2025 - Actualizado para incluir datos de anfitriones en calendario compartido
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

        // 1. Obtener los ciclos propios del usuario (funcionalidad actual)
        $userCycles = $this->cycleRepository->findByDateRange($user, $startDate, $endDate);

        // Para cada ciclo, cargar los días que estén dentro del rango de fechas
        foreach ($userCycles as $cycle) {
            // Obtener solo los días dentro del rango de fechas para este ciclo
            $cycleDays = $this->cycleDayRepository->findByCyclePhaseAndDateRange(
                $cycle,
                $startDate,
                $endDate
            );

            // Cargar manualmente los días para evitar cargar todos los días del ciclo
            $cycle->setFilteredCycleDays($cycleDays);
        }

        // 2. Obtener datos de anfitriones (NUEVA funcionalidad)
        $hostCycles = $this->calendarAccessService->getAccessibleHostData($user, $startDate, $endDate);

        // 3. Estructura de respuesta actualizada
        return $this->json([
            'userCycles' => $userCycles,  // Datos propios (funcionalidad actual)
            'hostCycles' => $hostCycles   // NUEVO: Datos de anfitriones filtrados
        ], 200, [], ['groups' => 'calendar:read']);
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

    // ! 23/05/2025 - Actualizado para trabajar con el nuevo servicio CyclePhaseService
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

        try {
            // Comprobar si hay días existentes para esta fecha
            $existingDays = $this->cycleDayRepository->createQueryBuilder('cd')
                ->join('cd.cyclePhase', 'p')
                ->andWhere('p.user = :user')
                ->andWhere('cd.date = :date')
                ->setParameter('user', $user)
                ->setParameter('date', $startDate)
                ->getQuery()
                ->getResult();

            // Si hay días existentes, utilizar el servicio especializado para gestionar la transición
            if (!empty($existingDays)) {
                $cycleData = $this->cyclePhaseService->handleSameDayCycleTransition(
                    $user,
                    $startDate,
                    $this->cycleCalculator
                );
            } else {
                // Creación normal si no hay conflictos
                $cycleData = $this->cycleCalculator->startNewCycle($user, $startDate);
            }

            return $this->json([
                'cycleId' => $cycleData['cycleId'],
                'phases' => $cycleData['phases'],
                'estimatedNextStart' => $cycleData['estimatedNextStart']
            ], 201, [], ['groups' => 'menstrual_cycle:read']);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            return $this->json(['message' => 'Error al crear el ciclo: ' . $e->getMessage()], 500);
        }
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

    // ! 21/05/2025 - Implementación del endpoint para obtener estadísticas detalladas sobre los ciclos del usuario
    // ! 21/05/2025 - Reposicionado para darle mayor prioridad que las rutas con parámetros genéricos
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
    // ! 23/05/2025 - Actualizado para usar CyclePhaseService para coordinar cambios entre fases
    #[Route('/{id}', name: 'api_cycles_update', methods: ['PUT'])]
    public function updateCycle(int $id, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        $phase = $this->cycleRepository->find($id);

        if (!$phase) {
            return $this->json(['message' => 'Cycle phase not found'], 404);
        }

        // Verificar que la fase pertenece al usuario actual
        if ($phase->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('You do not have permission to update this cycle phase');
        }

        $data = json_decode($request->getContent(), true);
        $needsRecalculation = false;

        // Actualizar campos básicos de la fase
        if (isset($data['startDate'])) {
            $phase->setStartDate(new \DateTime($data['startDate']));
            $needsRecalculation = true;
        }

        if (isset($data['endDate'])) {
            $phase->setEndDate(new \DateTime($data['endDate']));
            $needsRecalculation = true;
        }

        if (isset($data['estimatedNextStart'])) {
            $phase->setEstimatedNextStart(new \DateTime($data['estimatedNextStart']));
        }

        if (isset($data['averageCycleLength'])) {
            $phase->setAverageCycleLength($data['averageCycleLength']);
            $needsRecalculation = true;
        }

        if (isset($data['averageDuration'])) {
            $phase->setAverageDuration($data['averageDuration']);
            $needsRecalculation = true;
        }

        if (isset($data['flowAmount'])) {
            $phase->setFlowAmount($data['flowAmount']);
        }

        if (isset($data['flowColor'])) {
            $phase->setFlowColor($data['flowColor']);
        }

        if (isset($data['flowOdor'])) {
            $phase->setFlowOdor($data['flowOdor']);
        }

        if (isset($data['painLevel'])) {
            $phase->setPainLevel($data['painLevel']);
        }

        if (isset($data['notes'])) {
            $phase->setNotes($data['notes']);
        }

        // Si hay cambios que afectan a otras fases, recalcular todas las fases del ciclo
        if ($needsRecalculation) {
            try {
                $updatedPhases = $this->cyclePhaseService->recalculateCyclePhases($phase);
                return $this->json([
                    'cycleId' => $phase->getCycleId(),
                    'phases' => $updatedPhases
                ], 200, [], ['groups' => 'menstrual_cycle:read']);
            } catch (\Exception $e) {
                return $this->json(['message' => 'Error al recalcular fases: ' . $e->getMessage()], 500);
            }
        } else {
            // Si son cambios simples, solo persistir esta fase
            $this->entityManager->flush();
            return $this->json($phase, 200, [], ['groups' => 'menstrual_cycle:read']);
        }
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

    // ! 20/05/2025 - Endpoint para finalizar un ciclo activo
    // ! 21/05/2025 - Actualizado para usar el nuevo método del servicio que recalcula las métricas
    // ! 21/05/2025 - Añadido manejo de error para fecha de fin inválida
    // ! 25/05/2025 - Modificado para permitir finalizar solo ciclos de fase menstrual y recalcular ciclos posteriores
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

        // Verificar que sea un ciclo de fase menstrual
        if ($cycle->getPhase() !== CyclePhase::MENSTRUAL) {
            return $this->json([
                'message' => 'Solo se pueden finalizar ciclos de fase menstrual',
                'phase' => $cycle->getPhase()?->value ?? 'unknown'
            ], 400);
        }

        $data = json_decode($request->getContent(), true);
        $endDate = isset($data['endDate']) ? new \DateTime($data['endDate']) : new \DateTime();
        $notes = $data['notes'] ?? null;

        try {
            // Usar el servicio para finalizar el ciclo y recalcular métricas
            $updatedCycle = $this->cycleCalculator->endCycle($cycle, $endDate, $notes);

            // Buscar otros ciclos con el mismo cycleId para recalcularlos
            $relatedCycles = $this->cycleRepository->findBy(['cycleId' => $cycle->getCycleId()]);

            // Recalcular fechas de las otras fases del mismo ciclo
            if (count($relatedCycles) > 1) {
                try {
                    $updatedPhases = $this->cyclePhaseService->recalculateCyclePhases($cycle);

                    return $this->json([
                        'message' => 'Ciclo finalizado correctamente y fases recalculadas',
                        'cycle' => $updatedCycle,
                        'phases' => $updatedPhases
                    ], 200, [], ['groups' => 'menstrual_cycle:read']);
                } catch (\Exception $e) {
                    // Si falla la recalculación, devolver solo el ciclo actualizado
                    return $this->json([
                        'message' => 'Ciclo finalizado correctamente, pero no se pudieron recalcular todas las fases',
                        'cycle' => $updatedCycle,
                        'error' => $e->getMessage()
                    ], 200, [], ['groups' => 'menstrual_cycle:read']);
                }
            }

            return $this->json($updatedCycle, 200, [], ['groups' => 'menstrual_cycle:read']);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['message' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            return $this->json(['message' => 'Error al finalizar el ciclo: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Método auxiliar para agrupar ciclos por mes para estadísticas
     */
    // ! 23/05/2025 - Método para determinar la fase actual basado en la fecha
    private function determineCurrentPhase(array $phases): ?MenstrualCycle
    {
        $today = new \DateTime();
        $currentPhase = null;

        // Ordenar fases por fecha de inicio (más reciente primero)
        usort($phases, function ($a, $b) {
            return $b->getStartDate() <=> $a->getStartDate();
        });

        // La fase actual es la última que comenzó antes de hoy
        foreach ($phases as $phase) {
            if ($phase->getStartDate() <= $today) {
                $currentPhase = $phase;
                break;
            }
        }

        return $currentPhase;
    }

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
