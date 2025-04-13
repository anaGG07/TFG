<?php

namespace App\Repository;
use App\Entity\MenopauseLog;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;



/**
 * @extends ServiceEntityRepository<MenopauseLog>
 *
 * @method MenopauseLog|null find($id, $lockMode = null, $lockVersion = null)
 * @method MenopauseLog|null findOneBy(array $criteria, array $orderBy = null)
 * @method MenopauseLog[]    findAll()
 * @method MenopauseLog[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MenopauseLogRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MenopauseLog::class);
    }

    public function save(MenopauseLog $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(MenopauseLog $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
    
    /**
     * Find menopause log by user with caching
     */
    public function findByUserCached(User $user): ?MenopauseLog
    {
        $cacheKey = "menopause_log_user_{$user->getId()}";
        
        return $this->createQueryBuilder('m')
            ->andWhere('m.user = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->enableResultCache(3600, $cacheKey) // Cache durante 1 hora
            ->getOneOrNullResult();
    }
}