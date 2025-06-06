<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\CycleDayRepository;
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
        private LoggerInterface $logger
    ) {
    }

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

        // Obtener días del ciclo con síntomas en el rango de fechas
        $cycleDays = $this->cycleDayRepository->findByUserAndDateRange(
            $user,
            $startDateTime,
            $endDateTime
        );

        $symptomHistory = [];
        foreach ($cycleDays as $cycleDay) {
            $symptoms = $cycleDay->getSymptoms();
            if (!empty($symptoms)) {
                foreach ($symptoms as $symptomType => $intensity) {
                    $symptomHistory[] = [
                        'id' => $cycleDay->getId() . '_' . $symptomType,
                        'date' => $cycleDay->getDate()->format('Y-m-d'),
                        'symptom' => $symptomType,
                        'intensity' => $intensity,
                        'notes' => $cycleDay->getNotes(),
                        'entity' => 'menstrual_cycle'
                    ];
                }
            }
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

        $cycleDays = $this->cycleDayRepository->findByUserAndDateRange(
            $user,
            $startDate,
            $endDate
        );

        // Analizar patrones de síntomas
        $symptomData = [];
        $totalDays = 0;

        foreach ($cycleDays as $cycleDay) {
            $symptoms = $cycleDay->getSymptoms();
            $dayInCycle = $cycleDay->getDayNumber();
            
            if (!empty($symptoms)) {
                foreach ($symptoms as $symptomType => $intensity) {
                    if (!isset($symptomData[$symptomType])) {
                        $symptomData[$symptomType] = [
                            'occurrences' => 0,
                            'totalIntensity' => 0,
                            'daysInCycle' => []
                        ];
                    }
                    
                    $symptomData[$symptomType]['occurrences']++;
                    $symptomData[$symptomType]['totalIntensity'] += $intensity;
                    $symptomData[$symptomType]['daysInCycle'][] = $dayInCycle;
                }
            }
            $totalDays++;
        }

        // Calcular patrones
        $patterns = [];
        foreach ($symptomData as $symptomType => $data) {
            if ($data['occurrences'] > 0) {
                $patterns[] = [
                    'symptomType' => $symptomType,
                    'frequency' => round(($data['occurrences'] / $totalDays) * 100, 2),
                    'averageIntensity' => round($data['totalIntensity'] / $data['occurrences'], 2),
                    'dayInCycle' => !empty($data['daysInCycle']) ? 
                        round(array_sum($data['daysInCycle']) / count($data['daysInCycle'])) : 0
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

        // Buscar o crear el día del ciclo correspondiente
        $cycleDay = $this->cycleDayRepository->findOneBy([
            'date' => $date,
            'user' => $user
        ]);

        if (!$cycleDay) {
            return $this->json(['error' => 'Cycle day not found'], 404);
        }

        // Actualizar síntomas
        $symptoms = $cycleDay->getSymptoms() ?? [];
        $symptoms[$data['symptom']] = (int)$data['intensity'];
        $cycleDay->setSymptoms($symptoms);

        if (isset($data['notes'])) {
            $cycleDay->setNotes($data['notes']);
        }

        $this->entityManager->flush();

        return $this->json([
            'id' => $cycleDay->getId() . '_' . $data['symptom'],
            'date' => $cycleDay->getDate()->format('Y-m-d'),
            'symptom' => $data['symptom'],
            'intensity' => $data['intensity'],
            'notes' => $cycleDay->getNotes(),
            'entity' => 'menstrual_cycle'
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

        $cycleDays = $this->cycleDayRepository->findByUserAndDateRange(
            $user,
            $startDate,
            $endDate
        );

        $logs = [];
        foreach ($cycleDays as $cycleDay) {
            $symptoms = $cycleDay->getSymptoms();
            if (!empty($symptoms)) {
                $logs[] = [
                    'date' => $cycleDay->getDate()->format('Y-m-d'),
                    'symptoms' => $symptoms,
                    'notes' => $cycleDay->getNotes()
                ];
            }
        }

        return $this->json($logs);
    }
}
