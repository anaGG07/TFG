<?php

namespace App\Repository;

use App\Entity\AIQuery;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AIQuery>
 */
class AIQueryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AIQuery::class);
    }

    /**
     * Find recent queries by user
     */
    public function findRecentByUser(User $user, int $limit = 10): array
    {
        return $this->createQueryBuilder('q')
            ->andWhere('q.user = :user')
            ->setParameter('user', $user)
            ->orderBy('q.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Find similar queries to help with recommendations
     */
    public function findSimilar(string $queryText, int $limit = 5): array
    {
        // Implementación básica, se podría mejorar con búsqueda de texto
        $words = explode(' ', strtolower(trim($queryText)));
        $qb = $this->createQueryBuilder('q');
        
        foreach ($words as $i => $word) {
            if (strlen($word) > 3) {
                $qb->orWhere("LOWER(q.query) LIKE :word{$i}")
                   ->setParameter("word{$i}", "%{$word}%");
            }
        }
        
        return $qb->orderBy('q.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
