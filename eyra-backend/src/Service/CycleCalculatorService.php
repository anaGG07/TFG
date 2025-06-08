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
     */
    public function predictNextCycle(User $user): array
    {
        // Obtener ciclos históricos (hasta 12 para un mejor análisis)
        $cycles = $this->cycleRepository->findRecentByUser($user->getId(), self::MAX_CYCLES_FOR_PREDICTION);

        // Si hay menos de 2 ciclos, usar onboarding si está disponible
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

        // Calcular fechas esperadas
        $nextStartDate = (clone $lastCycle->getStartDate())->modify("+{$predictedLength} days");
        $nextEndDate = (clone $nextStartDate)->modify("+" . ($predictedDuration - 1) . " days");

        // Generar array de días predichos de menstruación
        $predictedPeriodDays = [];
        for ($i = 0; $i < $predictedDuration; $i++) {
            $predictedPeriodDays[] = (clone $nextStartDate)->modify("+{$i} days")->format('Y-m-d');
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
     * Generar predicciones para un rango de fechas
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

        // 4. Obtener datos de predicción
        $prediction = $this->predictNextCycle($user);

        // CORRECCIÓN: Usar valores correctos del onboarding
        if (!$prediction['success']) {
            $onboarding = $this->onboardingRepository->findOneBy(['user' => $user]);
            if ($onboarding) {
                $cycleLength = $onboarding->getAverageCycleLength() ?? 28;
                $periodDuration = $onboarding->getAveragePeriodLength() ?? 5; // CORREGIDO
                $confidence = 75;

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

            // CORRECCIÓN: Usar la duración exacta del período
            $menstrualDuration = $periodDuration;
            $follicularDuration = max(1, floor(($cycleLength / 2) - $menstrualDuration));
            $ovulationDuration = 2;
            $lutealDuration = max(1, $cycleLength - $menstrualDuration - $follicularDuration - $ovulationDuration);

            // Fechas de cada fase
            $menstrualStart = clone $nextCycleStart;
            $menstrualEnd = (clone $menstrualStart)->modify("+" . ($menstrualDuration - 1) . " days");
            $follicularStart = (clone $menstrualEnd)->modify("+1 day");
            $follicularEnd = (clone $follicularStart)->modify("+" . ($follicularDuration - 1) . " days");
            $ovulationStart = (clone $follicularEnd)->modify("+1 day");
            $ovulationEnd = (clone $ovulationStart)->modify("+" . ($ovulationDuration - 1) . " days");
            $lutealStart = (clone $ovulationEnd)->modify("+1 day");
            $nextCycleEnd = (clone $nextCycleStart)->modify("+" . ($cycleLength - 1) . " days");

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

            // Preparar para el siguiente ciclo - CORRECCIÓN: usar +$cycleLength días
            $nextCycleStart = (clone $nextCycleStart)->modify("+{$cycleLength} days");
        }

        $this->logger->info('CycleCalculator: Predicciones generadas', [
            'userId' => $user->getId(),
            'totalPredictions' => count($predictions),
            'cyclesGenerated' => $cyclesCount
        ]);

        return $predictions;
    }

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
                $avgDuration = $onboarding->getAveragePeriodLength() ?? 5; // CORREGIDO

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
                $this->logger->warning('CycleCalculator: NO SE ENCONTRÓ ONBOARDING - Usando valores por defecto', [
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

        // Calcular fechas de cada fase
        $menstrualStart = new \DateTime($startDate->format('Y-m-d'));
        $menstrualEnd = (clone $menstrualStart)->modify("+" . ($menstrualDuration - 1) . " days");

        $follicularStart = (clone $menstrualEnd)->modify("+1 day");
        $follicularEnd = (clone $follicularStart)->modify("+" . ($follicularDuration - 1) . " days");
        $ovulationStart = (clone $follicularEnd)->modify("+1 day");
        $ovulationEnd = (clone $ovulationStart)->modify("+" . ($ovulationDuration - 1) . " days");
        $lutealStart = (clone $ovulationEnd)->modify("+1 day");
        $nextCycleStart = (clone $startDate)->modify("+{$avgLength} days");

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
     * Analizar patrones en los datos históricos de ciclos
     */
    private function analyzePattern(array $cycleLengths, array $periodDurations): array
    {
        if (empty($cycleLengths) || empty($periodDurations)) {
            return [
                'algorithm' => 'simple_average',
                'predictedCycleLength' => 28,
                'predictedPeriodDuration' => 5,
                'regularity' => 0.5,
                'trend' => 'stable'
            ];
        }

        // Calcular estadísticas básicas
        $avgCycleLength = array_sum($cycleLengths) / count($cycleLengths);
        $avgPeriodDuration = array_sum($periodDurations) / count($periodDurations);

        // Calcular regularidad (basada en desviación estándar)
        $cycleStdDev = $this->calculateStandardDeviation($cycleLengths);
        $periodStdDev = $this->calculateStandardDeviation($periodDurations);

        // Regularidad normalizada (0-1, donde 1 es muy regular)
        $cycleRegularity = max(0, 1 - ($cycleStdDev / 10)); // 10 días como referencia
        $periodRegularity = max(0, 1 - ($periodStdDev / 3)); // 3 días como referencia
        $overallRegularity = ($cycleRegularity + $periodRegularity) / 2;

        // Detectar tendencia
        $trend = $this->detectTrend($cycleLengths);

        // Seleccionar algoritmo basado en regularidad y cantidad de datos
        $algorithm = 'simple_average';
        if (count($cycleLengths) >= 6 && $overallRegularity > 0.7) {
            $algorithm = 'weighted_average';
        } elseif (count($cycleLengths) >= 4 && $trend !== 'stable') {
            $algorithm = 'trend_based';
        }

        return [
            'algorithm' => $algorithm,
            'predictedCycleLength' => round($avgCycleLength),
            'predictedPeriodDuration' => round($avgPeriodDuration),
            'regularity' => $overallRegularity,
            'trend' => $trend
        ];
    }

    private function calculateStandardDeviation(array $values): float
    {
        $mean = array_sum($values) / count($values);
        $variance = array_sum(array_map(fn($x) => pow($x - $mean, 2), $values)) / count($values);
        return sqrt($variance);
    }

    private function detectTrend(array $values): string
    {
        if (count($values) < 3) return 'stable';

        $increases = 0;
        $decreases = 0;

        for ($i = 1; $i < count($values); $i++) {
            if ($values[$i] > $values[$i - 1]) $increases++;
            elseif ($values[$i] < $values[$i - 1]) $decreases++;
        }

        if ($increases > $decreases * 1.5) return 'increasing';
        if ($decreases > $increases * 1.5) return 'decreasing';
        return 'stable';
    }

    private function calculateAverageStats(array $cycles): array
    {
        $totalCycleLength = 0;
        $totalPeriodDuration = 0;
        $count = count($cycles);

        foreach ($cycles as $cycle) {
            $totalCycleLength += $cycle->getAverageCycleLength();
            $totalPeriodDuration += $cycle->getAverageDuration();
        }

        return [
            'cycleLength' => round($totalCycleLength / $count),
            'periodDuration' => round($totalPeriodDuration / $count)
        ];
    }

    private function calculateConfidenceLevel(float $regularity, int $cycleCount, string $algorithm): int
    {
        // Confianza base según cantidad de ciclos
        $baseConfidence = 50;
        foreach (self::CONFIDENCE_FACTORS as $cycles => $confidence) {
            if ($cycleCount >= $cycles) {
                $baseConfidence = $confidence;
            }
        }

        // Ajustar por regularidad
        $regularityBonus = $regularity * 20; // Hasta 20 puntos adicionales

        // Ajustar por algoritmo
        $algorithmBonus = match ($algorithm) {
            'weighted_average' => 10,
            'trend_based' => 5,
            'seasonal' => 15,
            default => 0
        };

        return min(95, $baseConfidence + $regularityBonus + $algorithmBonus);
    }

    private function calculateMarginOfError(float $regularity, int $confidence): int
    {
        // Margen base inversamente proporcional a la confianza
        $baseMargin = max(1, 7 - floor($confidence / 15));

        // Ajustar por regularidad (menos regular = más margen)
        $regularityPenalty = (1 - $regularity) * 3;

        return min(7, $baseMargin + $regularityPenalty);
    }

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
}
