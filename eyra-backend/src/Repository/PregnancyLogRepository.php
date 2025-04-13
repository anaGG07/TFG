<?php

namespace App\Repository;
use App\Entity\PregnancyLog;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;



/**
 * @extends ServiceEntityRepository<PregnancyLog>
 *
 * @method PregnancyLog|null find($id, $lockMode = null, $lockVersion = null)
 * @method PregnancyLog|null findOneBy(array $criteria, array $orderBy = null)
 * @method PregnancyLog[]    findAll()
 * @method PregnancyLog[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PregnancyLogRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PregnancyLog::class);
    }

    public function save(PregnancyLog $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(PregnancyLog $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
    
    /**
     * Find pregnancy logs for a user with optimized query and caching
     */
    public function findByUser(User $user, array $orderBy = null): array
    {
        $cacheKey = "pregnancy_logs_user_{$user->getId()}";
        $qb = $this->createQueryBuilder('p')
            ->andWhere('p.user = :user')
            ->setParameter('user', $user);
            
        if ($orderBy) {
            foreach ($orderBy as $field => $direction) {
                $qb->orderBy("p.{$field}", $direction);
            }
        } else {
            $qb->orderBy('p.createdAt', 'DESC');
        }
        
        return $qb->getQuery()
            ->enableResultCache(3600, $cacheKey)
            ->getResult();
    }

    /**
     * Find the most recent pregnancy log for a user
     */
    public function findMostRecentForUser(User $user): ?PregnancyLog
    {
        $cacheKey = "pregnancy_recent_user_{$user->getId()}";
        
        return $this->createQueryBuilder('p')
            ->andWhere('p.user = :user')
            ->setParameter('user', $user)
            ->orderBy('p.createdAt', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->enableResultCache(3600, $cacheKey)
            ->getOneOrNullResult();
    }
}