<?php

namespace App\Repository;

use App\Entity\MenstrualCycle;
use App\Entity\User; // ! 25/05/2025 - Añadido import para la clase User
use App\Enum\CyclePhase;
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

    // ! 23/05/2025 - Nuevos métodos para trabajar con el modelo basado en fases

    /**
     * Encuentra todas las fases del ciclo actual para un usuario
     */
    public function findCurrentPhasesForUser(int $userId): array
    {
        $today = new \DateTime('today');

        // Primero encontramos la fase menstrual más reciente que ya haya comenzado
        $latestMenstrualPhase = $this->createQueryBuilder('mc')
            ->andWhere('mc.user = :userId')
            ->andWhere('mc.phase = :phase')
            ->andWhere('mc.startDate <= :today')
            ->setParameter('userId', $userId)
            ->setParameter('phase', CyclePhase::MENSTRUAL)
            ->setParameter('today', $today)
            ->orderBy('mc.startDate', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();

        if (!$latestMenstrualPhase) {
            return [];
        }

        // Luego obtenemos todas las fases con el mismo cycleId
        return $this->createQueryBuilder('mc')
            ->andWhere('mc.cycleId = :cycleId')
            ->setParameter('cycleId', $latestMenstrualPhase->getCycleId())
            ->orderBy('mc.startDate', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Encuentra todas las fases para un ciclo específico por su cycleId
     */
    public function findPhasesByCycleId(string $cycleId): array
    {
        return $this->createQueryBuilder('mc')
            ->andWhere('mc.cycleId = :cycleId')
            ->setParameter('cycleId', $cycleId)
            ->orderBy('mc.startDate', 'ASC')
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

    // ! 25/05/2025 - Nuevo método para encontrar ciclos dentro de un rango de fechas
    /**
     * Encuentra ciclos que se solapan con el rango de fechas especificado
     * Un ciclo se considera dentro del rango si:
     * - Comienza dentro del rango
     * - Termina dentro del rango
     * - Abarca completamente el rango (comienza antes y termina después)
     */
    public function findByDateRange(User $user, \DateTimeInterface $startDate, \DateTimeInterface $endDate): array
    {
        $cacheKey = "cycles_user_{$user->getId()}_range_{$startDate->format('Ymd')}_{$endDate->format('Ymd')}";

        return $this->createQueryBuilder('mc')
            ->andWhere('mc.user = :user')
            ->andWhere(
                '(mc.startDate BETWEEN :startDate AND :endDate) OR ' .             // Comienza en el rango
                    '(mc.endDate BETWEEN :startDate AND :endDate) OR ' .               // Termina en el rango
                    '(mc.startDate <= :startDate AND mc.endDate >= :endDate)'          // Abarca el rango completo
            )
            ->setParameter('user', $user)
            ->setParameter('startDate', $startDate)
            ->setParameter('endDate', $endDate)
            ->orderBy('mc.startDate', 'ASC')
            ->getQuery()
            ->enableResultCache(3600, $cacheKey) // Cache durante 1 hora
            ->getResult();
    }
}
