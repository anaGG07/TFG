<?php

namespace App\Repository;

use App\Entity\CycleDay;
use App\Entity\MenstrualCycle;
use App\Entity\User;
use App\Enum\CyclePhase;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<CycleDay>
 */
class CycleDayRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CycleDay::class);
    }

    /**
     * Find days by user and date range
     * ! 08/06/2025 - Corregido método para evitar error 500
     */
    public function findByUserAndDateRange(User $user, \DateTimeInterface $startDate, \DateTimeInterface $endDate): array
    {
        try {
            return $this->createQueryBuilder('cd')
                ->innerJoin('cd.cyclePhase', 'mc')  // Relación con MenstrualCycle
                ->where('mc.user = :user')          // MenstrualCycle tiene campo user
                ->andWhere('cd.date >= :startDate')
                ->andWhere('cd.date <= :endDate')
                ->setParameter('user', $user)
                ->setParameter('startDate', $startDate)
                ->setParameter('endDate', $endDate)
                ->orderBy('cd.date', 'ASC')
                ->getQuery()
                ->getResult();
        } catch (\Exception $e) {
            // Log del error para debugging
            error_log("Error in findByUserAndDateRange: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Find days by cycle phase and date range
     * 
     * ! 25/05/2025 - Nuevo método para encontrar días por fase y rango de fechas para el calendario
     * ! 08/06/2025 - Removido cache problemático
     */
    public function findByCyclePhaseAndDateRange(MenstrualCycle $cyclePhase, \DateTimeInterface $startDate, \DateTimeInterface $endDate): array
    {
        $results = $this->createQueryBuilder('cd')
            ->andWhere('cd.cyclePhase = :cyclePhase')
            ->andWhere('cd.date >= :startDate')
            ->andWhere('cd.date <= :endDate')
            ->setParameter('cyclePhase', $cyclePhase)
            ->setParameter('startDate', $startDate)
            ->setParameter('endDate', $endDate)
            ->orderBy('cd.date', 'ASC')
            ->getQuery()
            ->getResult();

        // Filtrar para que solo haya un día por fecha (el primero encontrado)
        $uniqueDays = [];
        foreach ($results as $day) {
            $dateKey = $day->getDate()->format('Y-m-d');
            if (!isset($uniqueDays[$dateKey])) {
                $uniqueDays[$dateKey] = $day;
            }
        }

        return array_values($uniqueDays);
    }

    /**
     * Find days by cycle and phase
     * ! 08/06/2025 - Corregido método que usaba campos inexistentes
     */
    public function findByCycleAndPhase(MenstrualCycle $cycle, CyclePhase $phase): array
    {
        return $this->createQueryBuilder('cd')
            ->andWhere('cd.cyclePhase = :cycle')       // Usar cyclePhase en lugar de cycle
            ->andWhere('cd.phase = :phase')            // phase es string, no enum
            ->setParameter('cycle', $cycle)
            ->setParameter('phase', $phase->value)     // Convertir enum a string
            ->orderBy('cd.dayNumber', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find current cycle day for user
     * ! 25/05/2025 - Actualizado para usar CyclePhaseService para coordinar cambios entre fases
     * ! 08/06/2025 - Removido cache problemático y corregido JOIN
     */
    public function findCurrentForUser(User $user): ?CycleDay
    {
        $today = new \DateTime('today');

        try {
            return $this->createQueryBuilder('cd')
                ->innerJoin('cd.cyclePhase', 'mc')
                ->where('mc.user = :user')
                ->andWhere('cd.date = :today')
                ->setParameter('user', $user)
                ->setParameter('today', $today)
                ->getQuery()
                ->getOneOrNullResult();
        } catch (\Exception $e) {
            error_log("Error in findCurrentForUser: " . $e->getMessage());
            return null;
        }
    }

    /**
     * ! 08/06/2025 - Nuevo método para buscar CycleDay por fecha y usuario
     * Necesario para createSymptomLog en SymptomController
     */
    public function findByDateAndUser(\DateTimeInterface $date, User $user): ?CycleDay
    {
        try {
            return $this->createQueryBuilder('cd')
                ->innerJoin('cd.cyclePhase', 'mc')
                ->where('mc.user = :user')
                ->andWhere('cd.date = :date')
                ->setParameter('user', $user)
                ->setParameter('date', $date)
                ->getQuery()
                ->getOneOrNullResult();
        } catch (\Exception $e) {
            error_log("Error in findByDateAndUser: " . $e->getMessage());
            return null;
        }
    }
}
