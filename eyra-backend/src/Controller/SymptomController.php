<?php

namespace App\Controller;

use App\Entity\SymptomLog;
use App\Entity\User;
use App\Repository\CycleDayRepository;
use App\Repository\SymptomLogRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

#[Route('/symptoms')]
class SymptomController extends AbstractController
{
    public function __construct(
        private CycleDayRepository $cycleDayRepository,
        private EntityManagerInterface $entityManager,
        private LoggerInterface $logger,
        private SymptomLogRepository $symptomLogRepository
    ) {}

    #[Route('/history', name: 'api_symptoms_history', methods: ['GET'])]
    public function getSymptomHistory(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof User) {
            throw new AccessDeniedException('User not authenticated');
        }

        $userId = $request->query->get('userId');
        $startDate = $request->query->get('startDate');
        $endDate = $request->query->get('endDate');

        // Validar que el usuario solo pueda acceder a sus propios datos
        if ($userId && (int)$userId !== $user->getId()) {
            throw new AccessDeniedException('Cannot access other user data');
        }

        try {
            $startDateTime = $startDate ? new \DateTime($startDate) : new \DateTime('-90 days');
            $endDateTime = $endDate ? new \DateTime($endDate) : new \DateTime();
        } catch (\Exception $e) {
            return $this->json(['error' => 'Invalid date format'], 400);
        }

        // Consultar symptom_log directamente
        $symptomLogs = $this->symptomLogRepository->findByUserAndDateRange(
            $user,
            $startDateTime,
            $endDateTime
        );

        $symptomHistory = [];
        foreach ($symptomLogs as $log) {
            $symptomHistory[] = [
                'id' => $log->getId(),
                'date' => $log->getDate()->format('Y-m-d'),
                'symptom' => $log->getSymptom(),
                'intensity' => $log->getIntensity(),
                'notes' => $log->getNotes(),
                'entity' => 'symptom_log'
            ];
        }

        return $this->json($symptomHistory);
    }

    #[Route('/patterns', name: 'api_symptoms_patterns', methods: ['GET'])]
    public function getSymptomPatterns(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof User) {
            throw new AccessDeniedException('User not authenticated');
        }

        $userId = $request->query->get('userId');

        // Validar que el usuario solo pueda acceder a sus propios datos
        if ($userId && (int)$userId !== $user->getId()) {
            throw new AccessDeniedException('Cannot access other user data');
        }

        // Obtener datos de los últimos 6 meses para análisis de patrones
        $startDate = new \DateTime('-6 months');
        $endDate = new \DateTime();

        // ! 08/06/2025 - Cambiado a usar SymptomLog en lugar de CycleDay para consistencia
        $symptomLogs = $this->symptomLogRepository->findByUserAndDateRange(
            $user,
            $startDate,
            $endDate
        );

        // Analizar patrones de síntomas
        $symptomData = [];
        $totalDays = 0;

        foreach ($symptomLogs as $log) {
            $symptomType = $log->getSymptom();
            $intensity = $log->getIntensity();

            if (!isset($symptomData[$symptomType])) {
                $symptomData[$symptomType] = [
                    'occurrences' => 0,
                    'totalIntensity' => 0,
                    'dates' => []
                ];
            }

            $symptomData[$symptomType]['occurrences']++;
            $symptomData[$symptomType]['totalIntensity'] += $intensity;
            $symptomData[$symptomType]['dates'][] = $log->getDate()->format('Y-m-d');

            $totalDays++;
        }

        // Calcular patrones
        $patterns = [];
        foreach ($symptomData as $symptomType => $data) {
            if ($data['occurrences'] > 0) {
                $patterns[] = [
                    'symptomType' => $symptomType,
                    'frequency' => round(($data['occurrences'] / max($totalDays, 1)) * 100, 2),
                    'averageIntensity' => round($data['totalIntensity'] / $data['occurrences'], 2),
                    'totalOccurrences' => $data['occurrences'],
                    'dateRange' => [
                        'first' => min($data['dates']),
                        'last' => max($data['dates'])
                    ]
                ];
            }
        }

        return $this->json($patterns);
    }

    #[Route('', name: 'api_symptoms_create', methods: ['POST'])]
    public function createSymptomLog(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof User) {
            throw new AccessDeniedException('User not authenticated');
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['date'], $data['symptom'], $data['intensity'])) {
            return $this->json(['error' => 'Missing required fields'], 400);
        }

        try {
            $date = new \DateTime($data['date']);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Invalid date format'], 400);
        }

        // ! 08/06/2025 - Crear nuevo SymptomLog en lugar de modificar CycleDay
        $symptomLog = new SymptomLog();
        $symptomLog->setUser($user);
        $symptomLog->setDate($date);
        $symptomLog->setSymptom($data['symptom']);
        $symptomLog->setIntensity((int)$data['intensity']);

        if (isset($data['notes'])) {
            $symptomLog->setNotes($data['notes']);
        }

        $this->entityManager->persist($symptomLog);
        $this->entityManager->flush();

        return $this->json([
            'id' => $symptomLog->getId(),
            'date' => $symptomLog->getDate()->format('Y-m-d'),
            'symptom' => $symptomLog->getSymptom(),
            'intensity' => $symptomLog->getIntensity(),
            'notes' => $symptomLog->getNotes(),
            'entity' => $symptomLog->getEntity()
        ], 201);
    }

    #[Route('/logs', name: 'api_symptoms_logs', methods: ['GET'])]
    public function getSymptomLogs(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof User) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Obtener últimos 30 días de registros
        $startDate = new \DateTime('-30 days');
        $endDate = new \DateTime();

        // ! 08/06/2025 - Cambiado a usar SymptomLog para consistencia
        $symptomLogs = $this->symptomLogRepository->findByUserAndDateRange(
            $user,
            $startDate,
            $endDate
        );

        $logs = [];
        foreach ($symptomLogs as $log) {
            $logs[] = [
                'date' => $log->getDate()->format('Y-m-d'),
                'symptom' => $log->getSymptom(),
                'intensity' => $log->getIntensity(),
                'notes' => $log->getNotes()
            ];
        }

        return $this->json($logs);
    }
}
