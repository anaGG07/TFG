<?php

namespace App\Repository;

use App\Entity\Content;
use App\Enum\ContentType;
use App\Enum\CyclePhase;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Content>
 */
class ContentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Content::class);
    }

    /**
     * Find content by type and cycle phase
     */
    public function findByTypeAndPhase(ContentType $type, CyclePhase $phase, int $limit = 10): array
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.type = :type')
            ->andWhere('c.targetPhase = :phase')
            ->setParameter('type', $type)
            ->setParameter('phase', $phase)
            ->orderBy('c.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
    
    /**
     * Find content by cycle phase
     */
    public function findByPhase(CyclePhase $phase, int $limit = 10): array
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.targetPhase = :phase')
            ->setParameter('phase', $phase)
            ->orderBy('c.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Find content related to a specific condition
     */
    public function findByCondition(int $conditionId, int $limit = 10): array
    {
        return $this->createQueryBuilder('c')
            ->join('c.relatedConditions', 'rc')
            ->andWhere('rc.id = :conditionId')
            ->setParameter('conditionId', $conditionId)
            ->orderBy('c.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
