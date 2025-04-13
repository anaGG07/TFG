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
     */
    public function findByUserAndDateRange(User $user, \DateTimeInterface $startDate, \DateTimeInterface $endDate): array
    {
        $cacheKey = "days_user_{$user->getId()}_range_{$startDate->format('Ymd')}_{$endDate->format('Ymd')}";
        
        return $this->createQueryBuilder('cd')
            ->join('cd.cycle', 'c')
            ->andWhere('c.user = :user')
            ->andWhere('cd.date >= :startDate')
            ->andWhere('cd.date <= :endDate')
            ->setParameter('user', $user)
            ->setParameter('startDate', $startDate)
            ->setParameter('endDate', $endDate)
            ->orderBy('cd.date', 'ASC')
            ->getQuery()
            ->enableResultCache(3600, $cacheKey) // Cache durante 1 hora
            ->getResult();
    }

    /**
     * Find days by cycle and phase
     */
    public function findByCycleAndPhase(MenstrualCycle $cycle, CyclePhase $phase): array
    {
        $cacheKey = "cycle_{$cycle->getId()}_phase_{$phase->value}";
        
        return $this->createQueryBuilder('cd')
            ->andWhere('cd.cycle = :cycle')
            ->andWhere('cd.phase = :phase')
            ->setParameter('cycle', $cycle)
            ->setParameter('phase', $phase)
            ->orderBy('cd.dayNumber', 'ASC')
            ->getQuery()
            ->enableResultCache(3600, $cacheKey) // Cache durante 1 hora
            ->getResult();
    }

    /**
     * Find current cycle day for user
     */
    public function findCurrentForUser(User $user): ?CycleDay
    {
        $today = new \DateTime('today');
        $cacheKey = "current_day_user_{$user->getId()}_date_{$today->format('Ymd')}";
        
        return $this->createQueryBuilder('cd')
            ->join('cd.cycle', 'c')
            ->andWhere('c.user = :user')
            ->andWhere('cd.date = :today')
            ->setParameter('user', $user)
            ->setParameter('today', $today)
            ->getQuery()
            ->enableResultCache(86400, $cacheKey) // Cache durante 24 horas
            ->getOneOrNullResult();
    }
}
