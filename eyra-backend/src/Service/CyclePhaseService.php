<?php

namespace App\Service;

use App\Entity\CycleDay;
use App\Entity\MenstrualCycle;
use App\Entity\User;
use App\Enum\CyclePhase;
use App\Repository\CycleDayRepository;
use App\Repository\MenstrualCycleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\Uid\Uuid;

/**
 * Servicio para gestionar la coordinación entre fases del ciclo
 * 
 * ! 23/05/2025 - Creación del servicio para gestionar cambios coordinados entre fases
 */
class CyclePhaseService
{
    public function __construct(
        private MenstrualCycleRepository $cycleRepository,
        private CycleDayRepository $cycleDayRepository,
        private EntityManagerInterface $entityManager,
        private LoggerInterface $logger
    ) {
    }
    
    /**
     * Actualiza todas las fases de un ciclo cuando una de ellas es modificada
     * 
     * @param MenstrualCycle $modifiedPhase La fase que fue modificada
     * @return array Las fases actualizadas
     */
    public function recalculateCyclePhases(MenstrualCycle $modifiedPhase): array
    {
        // Obtener todas las fases del mismo ciclo
        $cycleId = $modifiedPhase->getCycleId();
        
        if (!$cycleId) {
            throw new \InvalidArgumentException('La fase modificada no tiene un cycleId válido');
        }
        
        $allPhases = $this->cycleRepository->findPhasesByCycleId($cycleId);
        
        if (count($allPhases) !== 4) {
            $this->logger->warning('El ciclo {cycleId} no tiene exactamente 4 fases', ['cycleId' => $cycleId]);
        }
        
        // Ordenar fases por su tipo (menstrual → folicular → ovulación → lútea)
        usort($allPhases, function($a, $b) {
            return $this->getPhaseOrder($a->getPhase()) <=> $this->getPhaseOrder($b->getPhase());
        });
        
        // Actualizar fechas de inicio/fin para mantener la continuidad
        for ($i = 1; $i < count($allPhases); $i++) {
            $previousPhase = $allPhases[$i-1];
            $currentPhase = $allPhases[$i];
            
            // La fecha de inicio de esta fase es la fecha de fin de la fase anterior
            $currentPhase->setStartDate($previousPhase->getEndDate());
            
            // Si es la última fase (lútea), actualizar la fecha estimada del próximo ciclo
            if ($i == count($allPhases) - 1) {
                $cycleLength = $modifiedPhase->getAverageCycleLength();
                $nextCycleStart = (clone $allPhases[0]->getStartDate())->modify('+' . $cycleLength . ' days');
                $currentPhase->setEndDate($nextCycleStart);
                
                // Actualizar la estimación del próximo ciclo para todas las fases
                foreach ($allPhases as $phase) {
                    $phase->setEstimatedNextStart($nextCycleStart);
                }
            }
        }
        
        // Actualizar duración promedio en todas las fases
        foreach ($allPhases as $phase) {
            // Calcular duración de esta fase
            $phaseDuration = $phase->getStartDate()->diff($phase->getEndDate())->days;
            $phase->setAverageDuration($phaseDuration);
            
            // Propagar la duración del ciclo a todas las fases
            $phase->setAverageCycleLength($modifiedPhase->getAverageCycleLength());
        }
        
        // Persistir cambios
        $this->entityManager->flush();
        
        // Reasignar días del ciclo a las fases correctas
        $this->reassignCycleDays($allPhases);
        
        return $allPhases;
    }
    
    /**
     * Reasigna días del ciclo cuando las fases cambian
     * 
     * @param array $updatedPhases Las fases actualizadas
     * @return int Número de días reasignados
     */
    public function reassignCycleDays(array $updatedPhases): int
    {
        if (empty($updatedPhases)) {
            return 0;
        }
        
        $cycleId = $updatedPhases[0]->getCycleId();
        
        // Obtener todos los días asociados a cualquier fase de este ciclo
        $qb = $this->cycleDayRepository->createQueryBuilder('cd')
            ->join('cd.cyclePhase', 'p')
            ->andWhere('p.cycleId = :cycleId')
            ->setParameter('cycleId', $cycleId);
        
        $cycleDays = $qb->getQuery()->getResult();
        
        $reassignedCount = 0;
        $problemDays = [];
        
        foreach ($cycleDays as $cycleDay) {
            $date = $cycleDay->getDate();
            $assignedToPhase = false;
            
            foreach ($updatedPhases as $phase) {
                // Si el día está dentro del rango de esta fase
                if ($date >= $phase->getStartDate() && $date < $phase->getEndDate()) {
                    // Reasignar a la fase correcta si es necesario
                    if ($cycleDay->getCyclePhase()->getId() !== $phase->getId()) {
                        // Registrar cambio en notas
                        $notes = $cycleDay->getNotes();
                        $notes[] = [
                            'timestamp' => (new \DateTime())->format('Y-m-d H:i:s'),
                            'type' => 'system',
                            'text' => sprintf(
                                'Día reasignado automáticamente de la fase %s a la fase %s debido a cambios en las fechas del ciclo',
                                $cycleDay->getCyclePhase()->getPhase()->value,
                                $phase->getPhase()->value
                            )
                        ];
                        $cycleDay->setNotes($notes);
                        
                        // Actualizar fase
                        $cycleDay->setCyclePhase($phase);
                        
                        // Recalcular el número de día
                        $dayNumber = $date->diff($phase->getStartDate())->days + 1;
                        $cycleDay->setDayNumber($dayNumber);
                        
                        $reassignedCount++;
                    }
                    
                    $assignedToPhase = true;
                    break;
                }
            }
            
            // Si el día no pertenece a ninguna fase, registrarlo para revisión manual
            if (!$assignedToPhase) {
                $problemDays[] = [
                    'id' => $cycleDay->getId(),
                    'date' => $cycleDay->getDate()->format('Y-m-d'),
                    'originalPhase' => $cycleDay->getCyclePhase()->getPhase()->value
                ];
                
                $this->logger->warning('Día del ciclo {id} con fecha {date} no pertenece a ninguna fase del ciclo {cycleId}', [
                    'id' => $cycleDay->getId(),
                    'date' => $cycleDay->getDate()->format('Y-m-d'),
                    'cycleId' => $cycleId
                ]);
            }
        }
        
        // Si hay días problemáticos, los registramos para revisión manual
        if (!empty($problemDays)) {
            $this->logger->warning('Se encontraron {count} días que no pertenecen a ninguna fase después de la actualización', [
                'count' => count($problemDays),
                'days' => $problemDays
            ]);
        }
        
        $this->entityManager->flush();
        
        return $reassignedCount;
    }
    
    /**
     * Maneja el inicio de un nuevo ciclo cuando hay datos registrados en el mismo día
     * 
     * @param User $user Usuario
     * @param \DateTimeInterface $newCycleStartDate Fecha de inicio del nuevo ciclo
     * @return array Datos del nuevo ciclo creado
     */
    public function handleSameDayCycleTransition(
        User $user, 
        \DateTimeInterface $newCycleStartDate, 
        CycleCalculatorService $cycleCalculator
    ): array {
        // 1. Buscar si hay datos registrados para esta fecha
        $existingDays = $this->cycleDayRepository->createQueryBuilder('cd')
            ->join('cd.cyclePhase', 'p')
            ->andWhere('p.user = :user')
            ->andWhere('cd.date = :date')
            ->setParameter('user', $user)
            ->setParameter('date', $newCycleStartDate)
            ->getQuery()
            ->getResult();
        
        // 2. Crear el nuevo ciclo
        $newCycleData = $cycleCalculator->startNewCycle($user, $newCycleStartDate);
        $menstrualPhase = $newCycleData['phases']['menstrual'];
        
        // 3. Si hay días existentes, moverlos a la nueva fase menstrual
        if (!empty($existingDays)) {
            foreach ($existingDays as $existingDay) {
                $oldPhase = $existingDay->getCyclePhase();
                $oldCycleId = $oldPhase->getCycleId();
                
                // Cambiar la asociación a la nueva fase menstrual
                $existingDay->setCyclePhase($menstrualPhase);
                $existingDay->setDayNumber(1); // Primer día del nuevo ciclo
                
                // 4. Registrar este cambio en los datos del día para tener un historial
                $notes = $existingDay->getNotes();
                $notes[] = [
                    'timestamp' => (new \DateTime())->format('Y-m-d H:i:s'),
                    'type' => 'system',
                    'text' => sprintf(
                        'Este día fue reasignado de la fase %s (ciclo %s) a la fase menstrual del nuevo ciclo %s',
                        $oldPhase->getPhase()->value,
                        $oldCycleId,
                        $menstrualPhase->getCycleId()
                    )
                ];
                $existingDay->setNotes($notes);
                
                $this->logger->info('Día {id} reasignado al nuevo ciclo {newCycleId}', [
                    'id' => $existingDay->getId(),
                    'oldCycleId' => $oldCycleId,
                    'oldPhase' => $oldPhase->getPhase()->value,
                    'newCycleId' => $menstrualPhase->getCycleId()
                ]);
            }
            
            // 5. Recalcular las fechas de las fases del ciclo anterior si es necesario
            $oldCyclePhases = $this->cycleRepository->findPhasesByCycleId($oldCycleId);
            if (!empty($oldCyclePhases)) {
                $this->recalculateOldCycleDurations($oldCyclePhases, $newCycleStartDate);
            }
            
            $this->entityManager->flush();
        }
        
        return $newCycleData;
    }
    
    /**
     * Recalcula las duraciones de las fases del ciclo anterior
     * 
     * @param array $phases Fases del ciclo anterior
     * @param \DateTimeInterface $newCycleStartDate Fecha de inicio del nuevo ciclo
     */
    private function recalculateOldCycleDurations(array $phases, \DateTimeInterface $newCycleStartDate): void
    {
        // Ordenar fases por tipo
        usort($phases, function($a, $b) {
            return $this->getPhaseOrder($a->getPhase()) <=> $this->getPhaseOrder($b->getPhase());
        });
        
        // La última fase (lútea) termina cuando comienza el nuevo ciclo
        $lastPhase = end($phases);
        if ($lastPhase) {
            $lastPhase->setEndDate($newCycleStartDate);
            
            // Actualizar la estimación del próximo ciclo
            foreach ($phases as $phase) {
                $phase->setEstimatedNextStart($newCycleStartDate);
            }
            
            // Recalcular duraciones
            foreach ($phases as $phase) {
                $phaseDuration = $phase->getStartDate()->diff($phase->getEndDate())->days;
                $phase->setAverageDuration($phaseDuration);
            }
            
            // Recalcular duración total del ciclo
            $cycleStart = reset($phases)->getStartDate();
            $cycleDuration = $cycleStart->diff($newCycleStartDate)->days;
            
            foreach ($phases as $phase) {
                $phase->setAverageCycleLength($cycleDuration);
            }
        }
    }
    
    /**
     * Helper para determinar el orden de las fases
     * 
     * @param CyclePhase $phase Fase del ciclo
     * @return int Valor de orden
     */
    private function getPhaseOrder(CyclePhase $phase): int
    {
        return match($phase) {
            CyclePhase::MENSTRUAL => 1,
            CyclePhase::FOLICULAR => 2,
            CyclePhase::OVULACION => 3,
            CyclePhase::LUTEA => 4,
            default => 99
        };
    }
    
    /**
     * Migra datos del modelo anterior al nuevo modelo basado en fases
     * 
     * @return array Estadísticas del proceso de migración
     */
    public function migrateDataToPhaseModel(CycleCalculatorService $cycleCalculator): array
    {
        $stats = [
            'cycles_processed' => 0, 
            'days_reassigned' => 0, 
            'errors' => []
        ];
        
        // 1. Obtener todos los ciclos que no tienen phase y cycleId
        $oldCycles = $this->cycleRepository->createQueryBuilder('c')
            ->andWhere('c.phase IS NULL')
            ->andWhere('c.cycleId IS NULL')
            ->getQuery()
            ->getResult();
        
        foreach ($oldCycles as $oldCycle) {
            try {
                // 2. Obtener los días asociados al ciclo antiguo
                $cycleDays = $this->cycleDayRepository->findBy(['cycle' => $oldCycle]);
                
                // 3. Crear las 4 fases para este ciclo
                $user = $oldCycle->getUser();
                $startDate = $oldCycle->getStartDate();
                $newCycleData = $cycleCalculator->startNewCycle($user, $startDate);
                
                // 4. Reasignar días
                $daysReassigned = 0;
                foreach ($cycleDays as $day) {
                    $date = $day->getDate();
                    $phase = $day->getPhase();
                    
                    // Asignar a la fase correspondiente en el nuevo modelo
                    switch ($phase) {
                        case CyclePhase::MENSTRUAL:
                            $day->setCyclePhase($newCycleData['phases']['menstrual']);
                            break;
                        case CyclePhase::FOLICULAR:
                            $day->setCyclePhase($newCycleData['phases']['follicular']);
                            break;
                        case CyclePhase::OVULACION:
                            $day->setCyclePhase($newCycleData['phases']['ovulation']);
                            break;
                        case CyclePhase::LUTEA:
                            $day->setCyclePhase($newCycleData['phases']['luteal']);
                            break;
                    }
                    
                    $daysReassigned++;
                }
                
                $stats['cycles_processed']++;
                $stats['days_reassigned'] += $daysReassigned;
                
                // 5. Marcar el ciclo antiguo como migrado (opcional)
                // $oldCycle->setMigratedToPhasesModel(true);
                
            } catch (\Exception $e) {
                $stats['errors'][] = "Error al procesar ciclo {$oldCycle->getId()}: " . $e->getMessage();
                $this->logger->error('Error al migrar ciclo {id}: {message}', [
                    'id' => $oldCycle->getId(),
                    'message' => $e->getMessage(),
                    'exception' => $e
                ]);
            }
        }
        
        $this->entityManager->flush();
        
        return $stats;
    }
}
