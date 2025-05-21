<?php

namespace App\Service;

use App\Entity\CycleDay;
use App\Entity\MenstrualCycle;
use App\Entity\User;
use App\Enum\CyclePhase;
use App\Repository\MenstrualCycleRepository;
use Doctrine\ORM\EntityManagerInterface;

// ! 20/05/2025 - Actualizado el servicio con algoritmo mejorado de predicción

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
        private EntityManagerInterface $entityManager
    ) {
    }

    /**
     * Predecir el próximo ciclo basado en datos históricos
     * Utiliza análisis de tendencias y ponderación de ciclos recientes
     */
    public function predictNextCycle(User $user): array
    {
        // Obtener ciclos históricos (hasta 12 para un mejor análisis)
        $cycles = $this->cycleRepository->findRecentByUser($user->getId(), self::MAX_CYCLES_FOR_PREDICTION);
        
        if (count($cycles) < 2) {
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
        
        foreach ($cycles as $index => $cycle) {
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
        $nextEndDate = (clone $nextStartDate)->modify("+{$predictedDuration} days");
        
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
            'trend' => $analysisResult['trend']
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
     * Crear un nuevo ciclo y sus días asociados
     */
    public function startNewCycle(User $user, \DateTimeInterface $startDate): MenstrualCycle
    {
        // Verificar si existe un ciclo activo
        $activeCycle = $this->cycleRepository->findCurrentForUser($user->getId());
        if ($activeCycle) {
            // Actualizar el ciclo anterior con la fecha de fin
            $activeCycle->setEndDate($startDate);
            $this->entityManager->flush();
        }
        
        // Obtener estadísticas basadas en ciclos anteriores
        $userCycles = $this->cycleRepository->findRecentByUser($user->getId(), 3);
        if (count($userCycles) > 0) {
            $stats = $this->calculateAverageStats($userCycles);
            $avgLength = $stats['cycleLength'];
            $avgDuration = $stats['periodDuration'];
        } else {
            $avgLength = 28; // Valor por defecto
            $avgDuration = 5; // Valor por defecto
        }
        
        $estimatedEndDate = (clone $startDate)->modify("+{$avgDuration} days");
        $estimatedNextStart = (clone $startDate)->modify("+{$avgLength} days");
        
        // Crear nuevo ciclo
        $newCycle = new MenstrualCycle();
        $newCycle->setUser($user);
        $newCycle->setStartDate($startDate);
        $newCycle->setEndDate($estimatedEndDate);
        $newCycle->setEstimatedNextStart($estimatedNextStart);
        $newCycle->setAverageCycleLength($avgLength);
        $newCycle->setAverageDuration($avgDuration);
        
        // Guardar el ciclo
        $this->entityManager->persist($newCycle);
        $this->entityManager->flush();
        
        // Crear los días del ciclo
        $this->createCycleDays($newCycle);
        
        return $newCycle;
    }

    /**
     * Recalcular el algoritmo de predicción para el usuario
     */
    public function recalculatePrediction(User $user): array
    {
        // Limpiar caché relacionada con el usuario si existe
        
        // Ejecutar predicción completa
        return $this->getPredictionDetails($user);
    }

    /**
     * Crear días del ciclo con fases
     */
    public function createCycleDays(MenstrualCycle $cycle): void
    {
        $startDate = clone $cycle->getStartDate();
        $cycleLength = $cycle->getAverageCycleLength();
        $menstrualDuration = $cycle->getAverageDuration();
        
        // Determinar duración aproximada de cada fase
        $follicularStart = $menstrualDuration + 1;
        $ovulationStart = round($cycleLength / 2) - 1;
        $lutealStart = round($cycleLength / 2) + 1;
        
        // Crear días para todo el ciclo
        for ($i = 1; $i <= $cycleLength; $i++) {
            $currentDate = (clone $startDate)->modify('+' . ($i - 1) . ' days');
            
            $cycleDay = new CycleDay();
            $cycleDay->setCycle($cycle);
            $cycleDay->setDate($currentDate);
            $cycleDay->setDayNumber($i);
            
            // Asignar fase basada en el día del ciclo
            if ($i <= $menstrualDuration) {
                $cycleDay->setPhase(CyclePhase::MENSTRUAL);
            } elseif ($i >= $follicularStart && $i < $ovulationStart) {
                $cycleDay->setPhase(CyclePhase::FOLICULAR);
            } elseif ($i >= $ovulationStart && $i < $lutealStart) {
                $cycleDay->setPhase(CyclePhase::OVULACION);
            } else {
                $cycleDay->setPhase(CyclePhase::LUTEA);
            }
            
            $this->entityManager->persist($cycleDay);
        }
        
        $this->entityManager->flush();
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