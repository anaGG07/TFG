<?php

namespace App\Repository;
use App\Entity\UserCondition;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;



/**
 * @extends ServiceEntityRepository<UserCondition>
 *
 * @method UserCondition|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserCondition|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserCondition[]    findAll()
 * @method UserCondition[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserConditionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserCondition::class);
    }

    public function save(UserCondition $entity, bool $flush = false): void
    {
        $this->_em->persist($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }

    public function remove(UserCondition $entity, bool $flush = false): void
    {
        $this->_em->remove($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }

    /**
     * Find active conditions for a user
     * This includes chronic conditions and conditions without end date
     */
    public function findActiveByUser(int $userId): array
    {
        $today = new \DateTime('today');
        $cacheKey = "active_conditions_user_{$userId}_date_{$today->format('Ymd')}";
        
        return $this->createQueryBuilder('uc')
            ->join('uc.condition', 'c')
            ->andWhere('uc.user = :userId')
            ->andWhere('uc.state = :state')
            ->andWhere('(uc.endDate IS NULL OR uc.endDate >= :today OR c.isChronic = :chronic)')
            ->setParameter('userId', $userId)
            ->setParameter('state', true)
            ->setParameter('today', $today)
            ->setParameter('chronic', true)
            ->orderBy('uc.startDate', 'DESC')
            ->getQuery()
            ->enableResultCache(3600, $cacheKey) // Cache durante 1 hora
            ->getResult();
    }
}