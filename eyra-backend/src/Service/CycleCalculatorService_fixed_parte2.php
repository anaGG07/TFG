            $this->logger->info('CycleCalculator: Generando predicción ciclo ' . $cycleNum, [
                'menstrualDuration' => $menstrualDuration,
                'follicularDuration' => $follicularDuration,
                'ovulationDuration' => $ovulationDuration,
                'lutealDuration' => $lutealDuration,
                'totalLength' => $cycleLength,
                'startDate' => $nextCycleStart->format('Y-m-d')
            ]);

            // CORRECCIÓN: Fechas de cada fase con manejo seguro
            $menstrualStart = $this->createSafeDateFromDateTime($nextCycleStart);
            $menstrualEnd = $this->createSafeDateFromDateTime($menstrualStart)->modify("+" . ($menstrualDuration - 1) . " days");
            $follicularStart = $this->createSafeDateFromDateTime($menstrualEnd)->modify("+1 day");
            $follicularEnd = $this->createSafeDateFromDateTime($follicularStart)->modify("+" . ($follicularDuration - 1) . " days");
            $ovulationStart = $this->createSafeDateFromDateTime($follicularEnd)->modify("+1 day");
            $ovulationEnd = $this->createSafeDateFromDateTime($ovulationStart)->modify("+" . ($ovulationDuration - 1) . " days");
            $lutealStart = $this->createSafeDateFromDateTime($ovulationEnd)->modify("+1 day");
            $nextCycleEnd = $this->createSafeDateFromDateTime($nextCycleStart)->modify("+{$cycleLength} days");

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
        return $this->getPredictionDetails($user);
    }

    /**
     * Finaliza un ciclo y recalcula las métricas basadas en ciclos anteriores
     */
    public function endCycle(MenstrualCycle $cycle, \DateTimeInterface $endDate, ?string $notes = null): MenstrualCycle
    {
        if ($endDate < $cycle->getStartDate()) {
            throw new \InvalidArgumentException('La fecha de finalización no puede ser anterior a la fecha de inicio');
        }

        $cycle->setEndDate($endDate);
        $currentDuration = $endDate->diff($cycle->getStartDate())->days + 1;

        if ($notes !== null) {
            $cycle->setNotes($notes);
        }

        $user = $cycle->getUser();
        $allCycles = $this->cycleRepository->findRecentByUser($user->getId(), 6);

        $previousCycles = [];
        foreach ($allCycles as $c) {
            if ($c->getId() !== $cycle->getId()) {
                $previousCycles[] = $c;
            }
        }

        usort($previousCycles, function ($a, $b) {
            return $b->getStartDate() <=> $a->getStartDate();
        });

        $periodDurations = [$currentDuration];
        $count = 0;
        foreach ($previousCycles as $prevCycle) {
            if ($count < 2) {
                $periodDurations[] = $prevCycle->getAverageDuration();
                $count++;
            } else {
                break;
            }
        }

        $newAverageDuration = round(array_sum($periodDurations) / count($periodDurations));
        $newAverageDuration = max(2, min(10, $newAverageDuration));
        $cycle->setAverageDuration($newAverageDuration);

        if (!empty($previousCycles)) {
            $previousCycle = $previousCycles[0];
            $cycleLengthDays = abs($cycle->getStartDate()->diff($previousCycle->getStartDate())->days);

            if (count($previousCycles) > 1) {
                $cycleLengths = [$cycleLengthDays];
                $currentCycle = $previousCycle;

                for ($i = 1; $i < count($previousCycles) && count($cycleLengths) < 5; $i++) {
                    $prevCycle = $previousCycles[$i];
                    $daysDiff = abs($currentCycle->getStartDate()->diff($prevCycle->getStartDate())->days);

                    if ($daysDiff >= 20 && $daysDiff <= 60) {
                        $cycleLengths[] = $daysDiff;
                    }

                    $currentCycle = $prevCycle;
                }

                $newAverageCycleLength = round(array_sum($cycleLengths) / count($cycleLengths));
            } else {
                $newAverageCycleLength = $cycleLengthDays;
            }

            $cycle->setAverageCycleLength($newAverageCycleLength);

            // CORRECCIÓN: Usar método seguro para modificar fecha
            $nextStartDate = $this->createSafeDateFromDateTime($cycle->getStartDate())
                ->modify("+{$newAverageCycleLength} days");
            $cycle->setEstimatedNextStart($nextStartDate);
        } else {
            $onboarding = $this->onboardingRepository->findOneBy(['user' => $user]);

            if ($onboarding && $onboarding->getAverageCycleLength()) {
                $averageCycleLength = $onboarding->getAverageCycleLength();
                $averageCycleLength = max(20, min(45, $averageCycleLength));

                $cycle->setAverageCycleLength($averageCycleLength);

                $nextStartDate = $this->createSafeDateFromDateTime($cycle->getStartDate())
                    ->modify("+{$averageCycleLength} days");
                $cycle->setEstimatedNextStart($nextStartDate);
            } else {
                $defaultCycleLength = 28;
                $cycle->setAverageCycleLength($defaultCycleLength);

                $nextStartDate = $this->createSafeDateFromDateTime($cycle->getStartDate())
                    ->modify("+{$defaultCycleLength} days");
                $cycle->setEstimatedNextStart($nextStartDate);
            }
        }

        $this->entityManager->flush();
        return $cycle;
    }

    /**
     * MÉTODO AUXILIAR CRÍTICO: Crear DateTime seguro desde DateTimeInterface
     * 
     * Este método garantiza que siempre tenemos un objeto DateTime mutable
     * que soporte el método modify() sin errores
     */
    private function createSafeDateFromDateTime(\DateTimeInterface $dateTime): \DateTime
    {
        if ($dateTime instanceof \DateTime) {
            return clone $dateTime;
        }
        
        // Si es DateTimeImmutable o cualquier otra implementación, convertir a DateTime
        return new \DateTime($dateTime->format('Y-m-d H:i:s'), $dateTime->getTimezone());
    }

    /**
     * MÉTODO AUXILIAR: Crear DateTime seguro desde string
     */
    private function createSafeDateFromString(string $dateString): \DateTime
    {
        try {
            return new \DateTime($dateString);
        } catch (\Exception $e) {
            throw new \InvalidArgumentException("Invalid date string: {$dateString}", 0, $e);
        }
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
        $cycleLengths = array_reverse($cycleLengths);
        $periodDurations = array_reverse($periodDurations);
        $count = count($cycleLengths);

        $stdDev = $this->calculateStandardDeviation($cycleLengths);
        $mean = array_sum($cycleLengths) / $count;
        $regularityScore = 1 - min(1, $stdDev / ($mean * 0.5));

        $trend = $this->calculateTrend($cycleLengths);

        $weights = [];
        for ($i = 0; $i < $count; $i++) {
            $weights[] = ($i + 1) / array_sum(range(1, $count));
        }

        $weightedCycleLength = 0;
        $weightedPeriodDuration = 0;

        for ($i = 0; $i < $count; $i++) {
            $weightedCycleLength += $cycleLengths[$i] * $weights[$i];
            $weightedPeriodDuration += $periodDurations[$i] * $weights[$i];
        }

        $weightedCycleLength = round($weightedCycleLength);
        $weightedPeriodDuration = round($weightedPeriodDuration);

        $significantTrend = abs($trend) >= 0.1;
        $seasonalPattern = $this->detectSeasonalPattern($cycleLengths);

        $algorithm = 'weighted_average';
        $predictedCycleLength = $weightedCycleLength;
        $predictedPeriodDuration = $weightedPeriodDuration;

        if ($significantTrend && $count >= 4) {
            $algorithm = 'trend_based';
            $trendAdjustment = round($trend * 3);
            $predictedCycleLength = $weightedCycleLength + $trendAdjustment;
        }

        if ($seasonalPattern['detected'] && $count >= 6) {
            $algorithm = 'seasonal';
            $predictedCycleLength = $seasonalPattern['nextPrediction'];
        }

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

        for ($i = 0; $i < $patternLength; $i++) {
            $chunk = [];
            for ($j = $i; $j < $count; $j += $patternLength) {
                if (isset($values[$j])) {
                    $chunk[] = $values[$j];
                }
            }
            $chunks[] = $chunk;
        }

        $intraVariation = 0;
        $totalVariation = $this->calculateStandardDeviation($values);

        foreach ($chunks as $chunk) {
            if (count($chunk) > 1) {
                $intraVariation += $this->calculateStandardDeviation($chunk);
            }
        }

        $intraVariation /= count($chunks);

        if ($totalVariation == 0) {
            return 0;
        }

        return max(0, 1 - ($intraVariation / $totalVariation));
    }

    /**
     * Calcular nivel de confianza para la predicción
     */
    private function calculateConfidenceLevel(float $regularity, int $cycleCount, string $algorithm): int
    {
        $baseConfidence = 50;

        foreach (self::CONFIDENCE_FACTORS as $requiredCycles => $confidence) {
            if ($cycleCount >= $requiredCycles) {
                $baseConfidence = $confidence;
            }
        }

        $regularityAdjustment = $regularity * self::REGULARITY_WEIGHT * 20;

        $algorithmAdjustment = 0;
        switch ($algorithm) {
            case 'trend_based':
                $algorithmAdjustment = 5;
                break;
            case 'seasonal':
                $algorithmAdjustment = 8;
                break;
        }

        $finalConfidence = min(99, $baseConfidence + $regularityAdjustment + $algorithmAdjustment);

        return max(50, round($finalConfidence));
    }

    /**
     * Calcular margen de error en días basado en la regularidad y confianza
     */
    private function calculateMarginOfError(float $regularity, int $confidence): int
    {
        $baseMargin = (1 - $regularity) * 5;
        $confidenceAdjustment = (100 - $confidence) / 20;
        $totalMargin = $baseMargin + $confidenceAdjustment;

        return max(1, round($totalMargin));
    }
}
