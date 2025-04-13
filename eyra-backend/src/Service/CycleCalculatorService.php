<?php

namespace App\Service;

use App\Entity\CycleDay;
use App\Entity\MenstrualCycle;
use App\Entity\User;
use App\Enum\CyclePhase;
use App\Repository\MenstrualCycleRepository;
use Doctrine\ORM\EntityManagerInterface;

class CycleCalculatorService
{
    public function __construct(
        private MenstrualCycleRepository $cycleRepository,
        private EntityManagerInterface $entityManager
    ) {
    }

    /**
     * Predecir el próximo ciclo basado en datos históricos
     */
    public function predictNextCycle(User $user): array
    {
        $cycles = $this->cycleRepository->findRecentByUser($user->getId(), 6);
        
        if (count($cycles) < 2) {
            return [
                'success' => false,
                'message' => 'No hay suficientes datos para una predicción precisa',
                'cycleLength' => 28,
                'periodDuration' => 5
            ];
        }

        // Calcular promedios
        $stats = $this->calculateAverageStats($cycles);
        
        $lastCycle = $cycles[0]; // El más reciente
        $nextStartDate = (clone $lastCycle->getStartDate())->modify("+{$stats['cycleLength']} days");
        $nextEndDate = (clone $nextStartDate)->modify("+{$stats['periodDuration']} days");
        
        return [
            'success' => true,
            'expectedStartDate' => $nextStartDate->format('Y-m-d'),
            'expectedEndDate' => $nextEndDate->format('Y-m-d'),
            'cycleLength' => $stats['cycleLength'],
            'periodDuration' => $stats['periodDuration'],
            'confidence' => min(90, 50 + (count($cycles) * 8)), // Confianza aumenta con más datos
            'basedOnCycles' => count($cycles)
        ];
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
}
