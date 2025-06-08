<?php

namespace App\Service;

use App\Entity\CycleDay;
use App\Entity\MenstrualCycle;
use App\Entity\User;
use App\Enum\CyclePhase;
use App\Repository\MenstrualCycleRepository;
use App\Repository\OnboardingRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

// ! 09/06/2025 - CORRECCIÓN CRÍTICA: Archivo completamente corregido con métodos faltantes

class CycleCalculatorService
{
    // Parámetro para regularidad - ajusta la importancia de la regularidad en las predicciones
    private const REGULARITY_WEIGHT = 0.7;

    // Número máximo de ciclos para considerar en la predicción
    private const MAX_CYCLES_FOR_PREDICTION = 12;

    // Factores de confianza basados en la cantidad de datos
    private const CONFIDENCE_FACTORS = [
        2 => 60,  // 2 ciclos = 60% confianza base
        3 => 70,  // 3 ciclos = 70% confianza base
        6 => 80,  // 6 ciclos = 80% confianza base
        9 => 85,  // 9 ciclos = 85% confianza base
        12 => 90, // 12 ciclos = 90% confianza base
    ];

    public function __construct(
        private MenstrualCycleRepository $cycleRepository,
        private OnboardingRepository $onboardingRepository,
        private EntityManagerInterface $entityManager,
        private LoggerInterface $logger
    ) {}

    /**
     * Predecir el próximo ciclo basado en datos históricos
     * ! 09/06/2025 - CORREGIDO: Mejor manejo cuando no hay suficientes datos históricos
     */
    public function predictNextCycle(User $user): array
    {
        // Obtener ciclos históricos (hasta 12 para un mejor análisis)
        $cycles = $this->cycleRepository->findRecentByUser($user->getId(), self::MAX_CYCLES_FOR_PREDICTION);

        // ! 09/06/2025 - CORREGIDO: Si hay menos de 2 ciclos, usar onboarding si está disponible
        if (count($cycles) < 2) {
            $onboarding = $this->onboardingRepository->findOneBy(['user' => $user]);

            if ($onboarding && $onboarding->getAverageCycleLength() && $onboarding->getAveragePeriodLength()) {
                // Usar datos del onboarding con alta confianza para usuario nuevo
                $cycleLength = $onboarding->getAverageCycleLength();
                $periodDuration = $onboarding->getAveragePeriodLength();

                $this->logger->info('CycleCalculator: Predicción basada en onboarding', [
                    'userId' => $user->getId(),
                    'cycleLength' => $cycleLength,
                    'periodDuration' => $periodDuration,
                    'source' => 'onboarding'
                ]);

                return [
                    'success' => true,
                    'cycleLength' => $cycleLength,
                    'periodDuration' => $periodDuration,
                    'confidence' => 75, // Alta confianza para datos de onboarding
                    'algorithm' => 'onboarding_data',
                    'basedOnCycles' => 0,
                    'message' => 'Predicción basada en configuración inicial'
                ];
            }

            return [
                'success' => false,
                'message' => 'No hay suficientes datos para una predicción precisa',
                'cycleLength' => 28,
                'periodDuration' => 5,
                'confidence' => 50,
                'algorithm' => 'default'
            ];
        }

        // Extraer datos de ciclos para análisis
        $cycleLengths = [];
        $periodDurations = [];

        foreach ($cycles as $cycle) {
            $cycleLengths[] = $cycle->getAverageCycleLength();
            $periodDurations[] = $cycle->getAverageDuration();
        }

        // Analizar datos para detectar tendencias y patrones
        $analysisResult = $this->analyzePattern($cycleLengths, $periodDurations);

        $lastCycle = $cycles[0]; // El más reciente

        // Predicción según el mejor algoritmo detectado
        switch ($analysisResult['algorithm']) {
            case 'weighted_average':
                $predictedLength = $analysisResult['predictedCycleLength'];
                $predictedDuration = $analysisResult['predictedPeriodDuration'];
                break;

            case 'trend_based':
                $predictedLength = $analysisResult['predictedCycleLength'];
                $predictedDuration = $analysisResult['predictedPeriodDuration'];
                break;

            case 'seasonal':
                $predictedLength = $analysisResult['predictedCycleLength'];
                $predictedDuration = $analysisResult['predictedPeriodDuration'];
                break;

            default:
                // Método simple de promedio si no se detecta un patrón claro
                $avgStats = $this->calculateAverageStats($cycles);
                $predictedLength = $avgStats['cycleLength'];
                $predictedDuration = $avgStats['periodDuration'];
                break;
        }

        // Calcular fechas esperadas (CORREGIDO: cálculo inclusivo)
        $nextStartDate = (new \DateTime($lastCycle->getStartDate()->format('Y-m-d')))->modify("+{$predictedLength} days");
        $nextEndDate = (new \DateTime($nextStartDate->format('Y-m-d')))->modify("+" . ($predictedDuration - 1) . " days");

        // Generar array de días predichos de menstruación
        $predictedPeriodDays = [];
        for ($i = 0; $i < $predictedDuration; $i++) {
            $predictedPeriodDays[] = (new \DateTime($nextStartDate->format('Y-m-d')))->modify("+{$i} days")->format('Y-m-d');
        }

        // Ajustar confianza basado en regularidad y cantidad de datos
        $confidence = $this->calculateConfidenceLevel(
            $analysisResult['regularity'],
            count($cycles),
            $analysisResult['algorithm']
        );

        // Margen de error en días
        $marginOfError = $this->calculateMarginOfError($analysisResult['regularity'], $confidence);

        return [
            'success' => true,
            'expectedStartDate' => $nextStartDate->format('Y-m-d'),
            'expectedEndDate' => $nextEndDate->format('Y-m-d'),
            'cycleLength' => $predictedLength,
            'periodDuration' => $predictedDuration,
            'confidence' => $confidence,
            'marginOfError' => $marginOfError,
            'basedOnCycles' => count($cycles),
            'algorithm' => $analysisResult['algorithm'],
            'regularity' => round($analysisResult['regularity'] * 100),
            'trend' => $analysisResult['trend'],
            'predictedPeriodDays' => $predictedPeriodDays
        ];
    }

    /**
     * Obtener detalles completos de predicción para análisis avanzado
     */
    public function getPredictionDetails(User $user): array
    {
        $basicPrediction = $this->predictNextCycle($user);

        // Si no hay suficientes datos, devolver predicción básica
        if (!$basicPrediction['success']) {
            return $basicPrediction;
        }

        // Obtener ciclos para análisis
        $cycles = $this->cycleRepository->findRecentByUser($user->getId(), self::MAX_CYCLES_FOR_PREDICTION);

        // Extraer datos para análisis estadístico
        $cycleLengths = [];
        $periodDurations = [];
        $startDates = [];

        foreach ($cycles as $cycle) {
            $cycleLengths[] = $cycle->getAverageCycleLength();
            $periodDurations[] = $cycle->getAverageDuration();
            $startDates[] = $cycle->getStartDate()->format('Y-m-d');
        }

        // Calcular desviación estándar para variabilidad
        $stdDev = $this->calculateStandardDeviation($cycleLengths);

        // Agregar detalles a la predicción básica
        return array_merge($basicPrediction, [
            'historicalData' => [
                'cycleLengths' => $cycleLengths,
                'periodDurations' => $periodDurations,
                'startDates' => $startDates,
            ],
            'statistics' => [
                'standardDeviation' => round($stdDev, 2),
                'minCycleLength' => min($cycleLengths),
                'maxCycleLength' => max($cycleLengths),
                'variabilityIndex' => round($stdDev / array_sum($cycleLengths) * count($cycleLengths), 2),
            ],
            'forecastRange' => [
                'earliestStartDate' => (new \DateTime($basicPrediction['expectedStartDate']))
                    ->modify("-{$basicPrediction['marginOfError']} days")
                    ->format('Y-m-d'),
                'latestStartDate' => (new \DateTime($basicPrediction['expectedStartDate']))
                    ->modify("+{$basicPrediction['marginOfError']} days")
                    ->format('Y-m-d'),
            ],
        ]);
    }

    /**
     * Crear un nuevo ciclo con sus 4 fases
     */
    public function startNewCycle(User $user, \DateTimeInterface $startDate): array
    {
        // Verificar si existe un ciclo activo
        $activeCycle = $this->cycleRepository->findCurrentForUser($user->getId());
        if ($activeCycle) {
            if ($startDate < $activeCycle->getStartDate()) {
                throw new \InvalidArgumentException('La fecha de inicio del nuevo ciclo no puede ser anterior a la fecha de inicio del ciclo activo');
            }
            $activeCycle->setEndDate($startDate);
            $this->entityManager->flush();
        }

        // Obtener estadísticas basadas en ciclos anteriores
        $userCycles = $this->cycleRepository->findRecentByUser($user->getId(), 3);

        if (count($userCycles) > 0) {
            $lastCycle = $userCycles[0];
            $avgLength = $lastCycle->getAverageCycleLength();
            $avgDuration = $lastCycle->getAverageDuration();
        } else {
            $onboarding = $this->onboardingRepository->findOneBy(['user' => $user]);

            if ($onboarding) {
                $avgLength = $onboarding->getAverageCycleLength() ?? 28;
                $avgDuration = $onboarding->getAveragePeriodLength() ?? 5;

                $this->logger->info('CycleCalculator: Onboarding encontrado', [
                    'userId' => $user->getId(),
                    'onboardingId' => $onboarding->getId(),
                    'averageCycleLength' => $avgLength,
                    'averagePeriodLength' => $avgDuration,
                    'lastPeriodDate' => $onboarding->getLastPeriodDate() ? $onboarding->getLastPeriodDate()->format('Y-m-d') : null
                ]);
            } else {
                $avgLength = 28;
                $avgDuration = 5;
                $this->logger->error('CycleCalculator: NO SE ENCONTRÓ ONBOARDING - Usando valores por defecto', [
                    'userId' => $user->getId(),
                    'defaultCycleLength' => $avgLength,
                    'defaultPeriodLength' => $avgDuration
                ]);
            }
        }

        // Asegurar que los valores estén dentro de rangos razonables
        $avgLength = max(20, min(45, $avgLength));
        $avgDuration = max(2, min(10, $avgDuration));

        // Generar UUID para agrupar las 4 fases del mismo ciclo
        $cycleId = $this->generateUuid();

        // Calcular duración de cada fase
        $menstrualDuration = $avgDuration;
        $follicularDuration = max(1, floor(($avgLength / 2) - $menstrualDuration));
        $ovulationDuration = 2;
        $lutealDuration = max(1, $avgLength - $menstrualDuration - $follicularDuration - $ovulationDuration);

        $this->logger->info('CycleCalculator: Calculando fases del ciclo', [
            'userId' => $user->getId(),
            'startDate' => $startDate->format('Y-m-d'),
            'menstrualDuration' => $menstrualDuration,
            'follicularDuration' => $follicularDuration,
            'ovulationDuration' => $ovulationDuration,
            'lutealDuration' => $lutealDuration,
            'totalCycleLength' => $avgLength
        ]);

        // Calcular fechas de cada fase (CORREGIDO: cálculo inclusivo)
        $menstrualStart = new \DateTime($startDate->format('Y-m-d'));
        $menstrualEnd = (clone $menstrualStart)->modify("+" . ($menstrualDuration - 1) . " days");

        $this->logger->info('CycleCalculator: Fase menstrual calculada', [
            'startDate' => $menstrualStart->format('Y-m-d'),
            'endDate' => $menstrualEnd->format('Y-m-d'),
            'durationDays' => $menstrualDuration
        ]);

        $follicularStart = (clone $menstrualEnd)->modify("+1 day");
        $follicularEnd = (clone $follicularStart)->modify("+" . ($follicularDuration - 1) . " days");
        $ovulationStart = (clone $follicularEnd)->modify("+1 day");
        $ovulationEnd = (clone $ovulationStart)->modify("+" . ($ovulationDuration - 1) . " days");
        $lutealStart = (clone $ovulationEnd)->modify("+1 day");
        $nextCycleStart = (new \DateTime($startDate->format('Y-m-d')))->modify("+{$avgLength} days");

        // Crear las 4 fases
        $menstrualPhase = new MenstrualCycle();
        $menstrualPhase->setUser($user);
        $menstrualPhase->setStartDate($menstrualStart);
        $menstrualPhase->setEndDate($menstrualEnd);
        $menstrualPhase->setPhase(CyclePhase::MENSTRUAL);
        $menstrualPhase->setCycleId($cycleId);
        $menstrualPhase->setAverageDuration($menstrualDuration);
        $menstrualPhase->setAverageCycleLength($avgLength);
        $menstrualPhase->setEstimatedNextStart($nextCycleStart);
        $this->entityManager->persist($menstrualPhase);

        $follicularPhase = new MenstrualCycle();
        $follicularPhase->setUser($user);
        $follicularPhase->setStartDate($follicularStart);
        $follicularPhase->setEndDate($follicularEnd);
        $follicularPhase->setPhase(CyclePhase::FOLICULAR);
        $follicularPhase->setCycleId($cycleId);
        $follicularPhase->setAverageDuration($follicularDuration);
        $follicularPhase->setAverageCycleLength($avgLength);
        $follicularPhase->setEstimatedNextStart($nextCycleStart);
        $this->entityManager->persist($follicularPhase);

        $ovulationPhase = new MenstrualCycle();
        $ovulationPhase->setUser($user);
        $ovulationPhase->setStartDate($ovulationStart);
        $ovulationPhase->setEndDate($ovulationEnd);
        $ovulationPhase->setPhase(CyclePhase::OVULACION);
        $ovulationPhase->setCycleId($cycleId);
        $ovulationPhase->setAverageDuration($ovulationDuration);
        $ovulationPhase->setAverageCycleLength($avgLength);
        $ovulationPhase->setEstimatedNextStart($nextCycleStart);
        $this->entityManager->persist($ovulationPhase);

        $lutealPhase = new MenstrualCycle();
        $lutealPhase->setUser($user);
        $lutealPhase->setStartDate($lutealStart);
        $lutealPhase->setEndDate($nextCycleStart);
        $lutealPhase->setPhase(CyclePhase::LUTEA);
        $lutealPhase->setCycleId($cycleId);
        $lutealPhase->setAverageDuration($lutealDuration);
        $lutealPhase->setAverageCycleLength($avgLength);
        $lutealPhase->setEstimatedNextStart($nextCycleStart);
        $this->entityManager->persist($lutealPhase);

        $this->entityManager->flush();

        return [
            'cycleId' => $cycleId,
            'phases' => [
                'menstrual' => $menstrualPhase,
                'follicular' => $follicularPhase,
                'ovulation' => $ovulationPhase,
                'luteal' => $lutealPhase
            ],
            'estimatedNextStart' => $nextCycleStart->format('Y-m-d')
        ];
    }

    /**
     * Generar predicciones para un rango de fechas
     * ! 09/06/2025 - CORRECCIÓN CRÍTICA: Soluciona el problema de días extra
     */
    public function generatePredictionsForRange(User $user, \DateTimeInterface $endDate, int $cyclesCount = 3): array
    {
        // 1. Obtener todos los ciclos existentes del usuario (ordenados por fecha)
        $existingCycles = $this->cycleRepository->findBy(
            ['user' => $user],
            ['startDate' => 'DESC'],
            50 // Límite razonable
        );

        // 2. Encontrar la última fecha con datos reales
        $lastRealDate = null;
        if (!empty($existingCycles)) {
            foreach ($existingCycles as $cycle) {
                if ($cycle->getEndDate()) {
                    $lastRealDate = $cycle->getEndDate();
                    break;
                } elseif ($cycle->getStartDate()) {
                    $estimatedDuration = $cycle->getAverageDuration() ?? 5;
                    $lastRealDate = (clone $cycle->getStartDate())->modify("+" . ($estimatedDuration - 1) . " days");
                    break;
                }
            }
        }

        // 3. Si no hay datos reales, usar onboarding
        if (!$lastRealDate) {
            $onboarding = $this->onboardingRepository->findOneBy(['user' => $user]);
            if ($onboarding && $onboarding->getLastPeriodDate()) {
                $lastRealDate = $onboarding->getLastPeriodDate();
            } else {
                return []; // No hay datos suficientes
            }
        }

        // 4. Obtener datos de predicción - CORREGIDO AQUÍ EL PROBLEMA PRINCIPAL
        $prediction = $this->predictNextCycle($user);

        // ! 09/06/2025 - CORRECCIÓN CRÍTICA: Usar valores correctos del onboarding
        if (!$prediction['success']) {
            $onboarding = $this->onboardingRepository->findOneBy(['user' => $user]);
            if ($onboarding) {
                $cycleLength = $onboarding->getAverageCycleLength() ?? 28;
                $periodDuration = $onboarding->getAveragePeriodLength() ?? 5; // CORREGIDO: Era AveragePeriodLength
                $confidence = 75; // Buena confianza para datos de onboarding

                $this->logger->info('CycleCalculator: Predicciones usando onboarding directo', [
                    'userId' => $user->getId(),
                    'cycleLength' => $cycleLength,
                    'periodDuration' => $periodDuration,
                    'source' => 'onboarding_fallback'
                ]);
            } else {
                $cycleLength = 28;
                $periodDuration = 5;
                $confidence = 50;
            }
        } else {
            $cycleLength = $prediction['cycleLength'];
            $periodDuration = $prediction['periodDuration'];
            $confidence = $prediction['confidence'];

            $this->logger->info('CycleCalculator: Predicciones usando algoritmo', [
                'userId' => $user->getId(),
                'cycleLength' => $cycleLength,
                'periodDuration' => $periodDuration,
                'algorithm' => $prediction['algorithm'] ?? 'unknown'
            ]);
        }

        // 5. Generar predicciones comenzando DESPUÉS de la última fecha real
        $predictions = [];
        $nextCycleStart = (clone $lastRealDate)->modify('+1 day');

        // Ajustar al próximo inicio de ciclo esperado basado en el último ciclo real
        if (!empty($existingCycles)) {
            $lastCycle = $existingCycles[0];
            $daysSinceLastStart = $lastRealDate->diff($lastCycle->getStartDate())->days;
            $daysUntilNext = $cycleLength - $daysSinceLastStart;

            if ($daysUntilNext > 0) {
                $nextCycleStart = (clone $lastRealDate)->modify("+{$daysUntilNext} days");
            }
        }

        // 6. Generar ciclos futuros
        for ($cycleNum = 1; $cycleNum <= $cyclesCount; $cycleNum++) {
            // Verificar si este ciclo estaría dentro del rango solicitado
            if ($nextCycleStart > $endDate) {
                break;
            }

            // Verificar que no haya solapamiento con ciclos existentes
            $hasOverlap = false;
            foreach ($existingCycles as $existingCycle) {
                $existingStart = $existingCycle->getStartDate();
                $existingEnd = $existingCycle->getEndDate() ??
                    (clone $existingStart)->modify('+' . (($existingCycle->getAverageDuration() ?? 5) - 1) . ' days');

                if ($nextCycleStart >= $existingStart && $nextCycleStart <= $existingEnd) {
                    $hasOverlap = true;
                    break;
                }
            }

            if ($hasOverlap) {
                // Saltar al siguiente ciclo posible
                $nextCycleStart = (clone $nextCycleStart)->modify("+{$cycleLength} days");
                continue;
            }

            $cycleId = $this->generateUuid();

            // ! 09/06/2025 - CORRECCIÓN CRÍTICA: Usar la duración exacta del período
            $menstrualDuration = $periodDuration; // Ya no hay conversión errónea aquí
            $follicularDuration = max(1, floor(($cycleLength / 2) - $menstrualDuration));
            $ovulationDuration = 2;
            $lutealDuration = max(1, $cycleLength - $menstrualDuration - $follicularDuration - $ovulationDuration);

            // ! 09/06/2025 - LOGGING DETALLADO para verificar valores
            $this->logger->info('CycleCalculator: Generando predicción ciclo ' . $cycleNum, [
                'menstrualDuration' => $menstrualDuration,
                'follicularDuration' => $follicularDuration,
                'ovulationDuration' => $ovulationDuration,
                'lutealDuration' => $lutealDuration,
                'totalLength' => $cycleLength,
                'startDate' => $nextCycleStart->format('Y-m-d')
            ]);

            // Fechas de cada fase (CORREGIDO: cálculo inclusivo de duración)
            $menstrualStart = clone $nextCycleStart;
            $menstrualEnd = (clone $menstrualStart)->modify("+" . ($menstrualDuration - 1) . " days");
            $follicularStart = (clone $menstrualEnd)->modify("+1 day");
            $follicularEnd = (clone $follicularStart)->modify("+" . ($follicularDuration - 1) . " days");
            $ovulationStart = (clone $follicularEnd)->modify("+1 day");
            $ovulationEnd = (clone $ovulationStart)->modify("+" . ($ovulationDuration - 1) . " days");
            $lutealStart = (clone $ovulationEnd)->modify("+1 day");
            $nextCycleEnd = (clone $nextCycleStart)->modify("+{$cycleLength} days");

            // Solo generar predicciones que estén completamente en el futuro
            $today = new \DateTime();
            if ($menstrualStart > $today) {
                // 1. Fase Menstrual
                $predictions[] = [
                    'id' => "predicted-menstrual-{$cycleNum}-" . $menstrualStart->format('Y-m-d'),
                    'cycleId' => $cycleId,
                    'phase' => 'menstrual',
                    'startDate' => $menstrualStart->format('Y-m-d'),
                    'endDate' => $menstrualEnd->format('Y-m-d'),
                    'isPrediction' => true,
                    'confidence' => $confidence,
                    'averageCycleLength' => $cycleLength,
                    'averageDuration' => $menstrualDuration,
                    'filteredCycleDays' => []
                ];

                // 2. Fase Folicular
                $predictions[] = [
                    'id' => "predicted-folicular-{$cycleNum}-" . $follicularStart->format('Y-m-d'),
                    'cycleId' => $cycleId,
                    'phase' => 'folicular',
                    'startDate' => $follicularStart->format('Y-m-d'),
                    'endDate' => $follicularEnd->format('Y-m-d'),
                    'isPrediction' => true,
                    'confidence' => $confidence,
                    'averageCycleLength' => $cycleLength,
                    'averageDuration' => $follicularDuration,
                    'filteredCycleDays' => []
                ];

                // 3. Fase Ovulación
                $predictions[] = [
                    'id' => "predicted-ovulacion-{$cycleNum}-" . $ovulationStart->format('Y-m-d'),
                    'cycleId' => $cycleId,
                    'phase' => 'ovulacion',
                    'startDate' => $ovulationStart->format('Y-m-d'),
                    'endDate' => $ovulationEnd->format('Y-m-d'),
                    'isPrediction' => true,
                    'confidence' => $confidence,
                    'averageCycleLength' => $cycleLength,
                    'averageDuration' => $ovulationDuration,
                    'filteredCycleDays' => []
                ];

                // 4. Fase Lútea
                $predictions[] = [
                    'id' => "predicted-lutea-{$cycleNum}-" . $lutealStart->format('Y-m-d'),
                    'cycleId' => $cycleId,
                    'phase' => 'lutea',
                    'startDate' => $lutealStart->format('Y-m-d'),
                    'endDate' => $nextCycleEnd->format('Y-m-d'),
                    'isPrediction' => true,
                    'confidence' => $confidence,
                    'averageCycleLength' => $cycleLength,
                    'averageDuration' => $lutealDuration,
                    'filteredCycleDays' => []
                ];
            }

            // Preparar para el siguiente ciclo
            $nextCycleStart = $nextCycleEnd;
        }

        $this->logger->info('CycleCalculator: Predicciones generadas', [
            'userId' => $user->getId(),
            'totalPredictions' => count($predictions),
            'cyclesGenerated' => $cyclesCount
        ]);

        return $predictions;
    }

    /**
     * Recalcular el algoritmo de predicción para el usuario
     */
    public function recalculatePrediction(User $user): array
    {
        // Ejecutar predicción completa
        return $this->getPredictionDetails($user);
    }

    /**
     * Finaliza un ciclo y recalcula las métricas basadas en ciclos anteriores
     */
    public function endCycle(MenstrualCycle $cycle, \DateTimeInterface $endDate, ?string $notes = null): MenstrualCycle
    {
        // Validar que la fecha de fin no sea anterior a la fecha de inicio
        if ($endDate < $cycle->getStartDate()) {
            throw new \InvalidArgumentException('La fecha de finalización no puede ser anterior a la fecha de inicio');
        }

        // Establecer la fecha de finalización
        $cycle->setEndDate($endDate);

        // Calcular la duración real del periodo en días
        $currentDuration = $endDate->diff($cycle->getStartDate())->days + 1;

        // Añadir notas si se proporcionan
        if ($notes !== null) {
            $cycle->setNotes($notes);
        }

        // Obtener los ciclos anteriores para los cálculos
        $user = $cycle->getUser();
        $allCycles = $this->cycleRepository->findRecentByUser($user->getId(), 6);

        // Filtrar para obtener solo los ciclos anteriores al actual
        $previousCycles = [];
        foreach ($allCycles as $c) {
            if ($c->getId() !== $cycle->getId()) {
                $previousCycles[] = $c;
            }
        }

        // Ordenar los ciclos por fecha de inicio descendente (más reciente primero)
        usort($previousCycles, function ($a, $b) {
            return $b->getStartDate() <=> $a->getStartDate();
        });

        // Cálculo de la duración media del periodo
        $periodDurations = [$currentDuration]; // Iniciar con la duración actual

        // Añadir duraciones de hasta 2 ciclos anteriores
        $count = 0;
        foreach ($previousCycles as $prevCycle) {
            if ($count < 2) { // Tomamos máximo 2 anteriores (3 total contando el actual)
                $periodDurations[] = $prevCycle->getAverageDuration();
                $count++;
            } else {
                break;
            }
        }

        $newAverageDuration = round(array_sum($periodDurations) / count($periodDurations));
        // Validar que esté dentro de un rango razonable
        $newAverageDuration = max(2, min(10, $newAverageDuration));
        $cycle->setAverageDuration($newAverageDuration);

        // Cálculo de la longitud del ciclo
        if (!empty($previousCycles)) {
            // Para calcular la longitud, necesitamos el tiempo entre el inicio de este ciclo
            // y el inicio del ciclo anterior
            $previousCycle = $previousCycles[0]; // Ciclo anterior más reciente

            // Cálculo exacto entre este ciclo y el anterior
            $cycleLengthDays = abs($cycle->getStartDate()->diff($previousCycle->getStartDate())->days);

            // Si tenemos más ciclos anteriores, promediar con ellos (hasta 6 total)
            if (count($previousCycles) > 1) {
                $cycleLengths = [$cycleLengthDays]; // Empezamos con la longitud actual
                $currentCycle = $previousCycle;

                // Calcular longitudes de ciclos anteriores (hasta 5 más)
                for ($i = 1; $i < count($previousCycles) && count($cycleLengths) < 5; $i++) {
                    $prevCycle = $previousCycles[$i];
                    $daysDiff = abs($currentCycle->getStartDate()->diff($prevCycle->getStartDate())->days);

                    // Solo añadir si la diferencia es razonable (20-60 días para evitar valores atípicos)
                    if ($daysDiff >= 20 && $daysDiff <= 60) {
                        $cycleLengths[] = $daysDiff;
                    }

                    $currentCycle = $prevCycle;
                }

                // Calcular el promedio de todos los ciclos considerados
                $newAverageCycleLength = round(array_sum($cycleLengths) / count($cycleLengths));
            } else {
                // Solo tenemos un ciclo anterior, así que usamos directamente esa longitud
                $newAverageCycleLength = $cycleLengthDays;
            }

            // Actualizar los valores del ciclo
            $cycle->setAverageCycleLength($newAverageCycleLength);

            // Actualizar la fecha estimada del próximo ciclo
            $nextStartDate = (new \DateTime($cycle->getStartDate()->format('Y-m-d')))->modify("+{$newAverageCycleLength} days");
            $cycle->setEstimatedNextStart($nextStartDate);
        } else {
            // Si no hay ciclos anteriores, obtener el valor del onboarding
            $onboarding = $this->onboardingRepository->findOneBy(['user' => $user]);

            if ($onboarding && $onboarding->getAverageCycleLength()) {
                $averageCycleLength = $onboarding->getAverageCycleLength();
                // Validar que esté dentro de un rango razonable
                $averageCycleLength = max(20, min(45, $averageCycleLength));

                // Actualizar los valores del ciclo
                $cycle->setAverageCycleLength($averageCycleLength);

                // Actualizar la fecha estimada del próximo ciclo
                $nextStartDate = (new \DateTime($cycle->getStartDate()->format('Y-m-d')))->modify("+{$averageCycleLength} days");
                $cycle->setEstimatedNextStart($nextStartDate);
            } else {
                // Valores por defecto si no hay información disponible en el onboarding
                $defaultCycleLength = 28;
                $cycle->setAverageCycleLength($defaultCycleLength);

                // Actualizar la fecha estimada del próximo ciclo
                $nextStartDate = (new \DateTime($cycle->getStartDate()->format('Y-m-d')))->modify("+{$defaultCycleLength} days");
                $cycle->setEstimatedNextStart($nextStartDate);
            }
        }

        // Guardar todos los cambios
        $this->entityManager->flush();

        return $cycle;
    }

    /**
     * Calcular estadísticas promedio basadas en ciclos pasados
     */
    private function calculateAverageStats(array $cycles): array
    {
        $lengthSum = 0;
        $durationSum = 0;
        $count = count($cycles);

        foreach ($cycles as $cycle) {
            $lengthSum += $cycle->getAverageCycleLength();
            $durationSum += $cycle->getAverageDuration();
        }

        return [
            'cycleLength' => round($lengthSum / $count),
            'periodDuration' => round($durationSum / $count)
        ];
    }

    /**
     * Generar UUID v4 usando funciones nativas de PHP
     */
    private function generateUuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);

        return sprintf(
            '%08s-%04s-%04s-%04s-%12s',
            bin2hex(substr($data, 0, 4)),
            bin2hex(substr($data, 4, 2)),
            bin2hex(substr($data, 6, 2)),
            bin2hex(substr($data, 8, 2)),
            bin2hex(substr($data, 10, 6))
        );
    }

    /**
     * Analizar patrones en los datos históricos y seleccionar el mejor algoritmo
     */
    private function analyzePattern(array $cycleLengths, array $periodDurations): array
    {
        // Revertir arrays para que estén en orden cronológico (más antiguo a más reciente)
        $cycleLengths = array_reverse($cycleLengths);
        $periodDurations = array_reverse($periodDurations);

        $count = count($cycleLengths);

        // Calcular regularidad como 1 - (desviación estándar normalizada)
        $stdDev = $this->calculateStandardDeviation($cycleLengths);
        $mean = array_sum($cycleLengths) / $count;
        $regularityScore = 1 - min(1, $stdDev / ($mean * 0.5)); // Normalizamos para que 0.5*mean sea irregularidad total

        // Analizar tendencia (pendiente de regresión lineal)
        $trend = $this->calculateTrend($cycleLengths);

        // Pesos para promedio ponderado (más peso a ciclos recientes)
        $weights = [];
        for ($i = 0; $i < $count; $i++) {
            $weights[] = ($i + 1) / array_sum(range(1, $count));
        }

        // Calcular longitud del ciclo con promedio ponderado
        $weightedCycleLength = 0;
        $weightedPeriodDuration = 0;

        for ($i = 0; $i < $count; $i++) {
            $weightedCycleLength += $cycleLengths[$i] * $weights[$i];
            $weightedPeriodDuration += $periodDurations[$i] * $weights[$i];
        }

        // Redondear los resultados
        $weightedCycleLength = round($weightedCycleLength);
        $weightedPeriodDuration = round($weightedPeriodDuration);

        // Determinar si hay una tendencia significativa
        $significantTrend = abs($trend) >= 0.1;

        // Determinar si hay un patrón estacional (ciclos alternantes)
        $seasonalPattern = $this->detectSeasonalPattern($cycleLengths);

        // Seleccionar algoritmo basado en el análisis
        $algorithm = 'weighted_average'; // Por defecto
        $predictedCycleLength = $weightedCycleLength;
        $predictedPeriodDuration = $weightedPeriodDuration;

        // Si hay tendencia significativa, considerar algoritmo basado en tendencia
        if ($significantTrend && $count >= 4) {
            $algorithm = 'trend_based';
            // Ajustar predicción basada en tendencia
            $trendAdjustment = round($trend * 3); // Multiplicador para acentuar la tendencia
            $predictedCycleLength = $weightedCycleLength + $trendAdjustment;
        }

        // Si hay patrón estacional, usar algoritmo estacional
        if ($seasonalPattern['detected'] && $count >= 6) {
            $algorithm = 'seasonal';
            $predictedCycleLength = $seasonalPattern['nextPrediction'];
        }

        // Asegurarse de que las predicciones estén en rangos razonables
        $predictedCycleLength = max(20, min(45, $predictedCycleLength));
        $predictedPeriodDuration = max(2, min(10, $predictedPeriodDuration));

        return [
            'regularity' => $regularityScore,
            'trend' => $trend < -0.05 ? 'decreasing' : ($trend > 0.05 ? 'increasing' : 'stable'),
            'algorithm' => $algorithm,
            'weightedCycleLength' => $weightedCycleLength,
            'weightedPeriodDuration' => $weightedPeriodDuration,
            'predictedCycleLength' => $predictedCycleLength,
            'predictedPeriodDuration' => $predictedPeriodDuration,
            'seasonalPattern' => $seasonalPattern['detected'],
            'seasonalPatternLength' => $seasonalPattern['patternLength']
        ];
    }

    /**
     * Calcular desviación estándar de un conjunto de valores
     */
    private function calculateStandardDeviation(array $values): float
    {
        $count = count($values);

        if ($count <= 1) {
            return 0;
        }

        $mean = array_sum($values) / $count;
        $variance = 0;

        foreach ($values as $value) {
            $variance += pow($value - $mean, 2);
        }

        return sqrt($variance / ($count - 1));
    }

    /**
     * Calcular tendencia usando regresión lineal básica
     * Retorna la pendiente normalizada (-1 a 1)
     */
    private function calculateTrend(array $values): float
    {
        $count = count($values);

        if ($count <= 1) {
            return 0;
        }

        $x = range(0, $count - 1);
        $meanX = array_sum($x) / $count;
        $meanY = array_sum($values) / $count;

        $numerator = 0;
        $denominator = 0;

        for ($i = 0; $i < $count; $i++) {
            $numerator += ($x[$i] - $meanX) * ($values[$i] - $meanY);
            $denominator += pow($x[$i] - $meanX, 2);
        }

        if ($denominator == 0) {
            return 0;
        }

        $slope = $numerator / $denominator;

        // Normalizar la pendiente al promedio para obtener un valor relativo
        $avgValue = $meanY;
        if ($avgValue != 0) {
            return $slope / $avgValue;
        }

        return 0;
    }

    /**
     * Detectar patrones estacionales o cíclicos en los datos
     */
    private function detectSeasonalPattern(array $values): array
    {
        $count = count($values);

        if ($count < 6) {
            return ['detected' => false, 'patternLength' => 0, 'nextPrediction' => 0];
        }

        // Probar con diferentes longitudes de patrón
        $patternLengths = [2, 3, 4];
        $bestCorrelation = 0;
        $bestPatternLength = 0;

        foreach ($patternLengths as $patternLength) {
            if ($count < $patternLength * 2) {
                continue;
            }

            $correlation = $this->calculatePatternCorrelation($values, $patternLength);

            if ($correlation > $bestCorrelation && $correlation > 0.7) {
                $bestCorrelation = $correlation;
                $bestPatternLength = $patternLength;
            }
        }

        // Si encontramos un patrón, predecir el siguiente valor
        if ($bestPatternLength > 0) {
            $nextPosition = $count % $bestPatternLength;
            $relevantCycles = [];

            for ($i = $nextPosition; $i < $count; $i += $bestPatternLength) {
                $relevantCycles[] = $values[$i];
            }

            $nextPrediction = array_sum($relevantCycles) / count($relevantCycles);

            return [
                'detected' => true,
                'patternLength' => $bestPatternLength,
                'correlation' => $bestCorrelation,
                'nextPrediction' => round($nextPrediction)
            ];
        }

        return ['detected' => false, 'patternLength' => 0, 'nextPrediction' => 0];
    }

    /**
     * Calcular correlación entre subconjuntos de datos para detectar patrones
     */
    private function calculatePatternCorrelation(array $values, int $patternLength): float
    {
        $count = count($values);
        $chunks = [];

        // Dividir los datos en subconjuntos según la longitud del patrón
        for ($i = 0; $i < $patternLength; $i++) {
            $chunk = [];
            for ($j = $i; $j < $count; $j += $patternLength) {
                if (isset($values[$j])) {
                    $chunk[] = $values[$j];
                }
            }
            $chunks[] = $chunk;
        }

        // Calcular la variación dentro de cada subconjunto
        $intraVariation = 0;
        $totalVariation = $this->calculateStandardDeviation($values);

        foreach ($chunks as $chunk) {
            if (count($chunk) > 1) {
                $intraVariation += $this->calculateStandardDeviation($chunk);
            }
        }

        $intraVariation /= count($chunks);

        // Si la variación total es 0, no hay patrón para detectar
        if ($totalVariation == 0) {
            return 0;
        }

        // Correlación es la reducción en variación (1 = patrón perfecto)
        return max(0, 1 - ($intraVariation / $totalVariation));
    }

    /**
     * Calcular nivel de confianza para la predicción
     */
    private function calculateConfidenceLevel(float $regularity, int $cycleCount, string $algorithm): int
    {
        // Base de confianza según cantidad de ciclos
        $baseConfidence = 50;

        foreach (self::CONFIDENCE_FACTORS as $requiredCycles => $confidence) {
            if ($cycleCount >= $requiredCycles) {
                $baseConfidence = $confidence;
            }
        }

        // Ajustar confianza por regularidad (0-1)
        $regularityAdjustment = $regularity * self::REGULARITY_WEIGHT * 20; // Máximo ±20%

        // Ajustar confianza por algoritmo
        $algorithmAdjustment = 0;
        switch ($algorithm) {
            case 'trend_based':
                $algorithmAdjustment = 5; // Bonus por usar tendencia
                break;
            case 'seasonal':
                $algorithmAdjustment = 8; // Bonus por detectar patrón estacional
                break;
        }

        // Calcular confianza final (limitado a 99%)
        $finalConfidence = min(99, $baseConfidence + $regularityAdjustment + $algorithmAdjustment);

        return max(50, round($finalConfidence));
    }

    /**
     * Calcular margen de error en días basado en la regularidad y confianza
     */
    private function calculateMarginOfError(float $regularity, int $confidence): int
    {
        // Base del margen de error según regularidad
        $baseMargin = (1 - $regularity) * 5; // Entre 0 y 5 días

        // Ajustar según confianza (menor confianza = mayor margen)
        $confidenceAdjustment = (100 - $confidence) / 20; // Entre 0 y 2.5 días

        $totalMargin = $baseMargin + $confidenceAdjustment;

        // Redondear a entero y limitar a mínimo 1 día
        return max(1, round($totalMargin));
    }
}
