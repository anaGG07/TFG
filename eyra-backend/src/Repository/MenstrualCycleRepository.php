<?php

namespace App\Repository;
use App\Entity\MenstrualCycle;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;



/**
 * @extends ServiceEntityRepository<MenstrualCycle>
 *
 * @method MenstrualCycle|null find($id, $lockMode = null, $lockVersion = null)
 * @method MenstrualCycle|null findOneBy(array $criteria, array $orderBy = null)
 * @method MenstrualCycle[]    findAll()
 * @method MenstrualCycle[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MenstrualCycleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MenstrualCycle::class);
    }

    public function save(MenstrualCycle $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(MenstrualCycle $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Find current cycle for user
     */
    public function findCurrentForUser(int $userId): ?MenstrualCycle
    {
        $today = new \DateTime('today');
        
        return $this->createQueryBuilder('c')
            ->andWhere('c.user = :userId')
            ->andWhere('c.startDate <= :today')
            ->andWhere('c.estimatedNextStart > :today OR c.endDate >= :today')
            ->setParameter('userId', $userId)
            ->setParameter('today', $today)
            ->orderBy('c.startDate', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Find recent cycles by user
     */
    public function findRecentByUser(int $userId, int $limit = 10): array
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.user = :userId')
            ->setParameter('userId', $userId)
            ->orderBy('c.startDate', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Calculate average cycle stats for user
     */
    public function calculateAverageStats(int $userId): array
    {
        $cycles = $this->findRecentByUser($userId, 6);
        
        if (count($cycles) < 2) {
            return [
                'cycleLength' => 28, // Default values
                'periodDuration' => 5,
                'cyclesAnalyzed' => count($cycles)
            ];
        }
        
        $lengthSum = 0;
        $durationSum = 0;
        $count = count($cycles);
        
        foreach ($cycles as $cycle) {
            $lengthSum += $cycle->getAverageCycleLength();
            $durationSum += $cycle->getAverageDuration();
        }
        
        return [
            'cycleLength' => round($lengthSum / $count),
            'periodDuration' => round($durationSum / $count),
            'cyclesAnalyzed' => $count
        ];
    }
}