<?php

namespace App\Repository;

use App\Entity\RefreshToken;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<RefreshToken>
 *
 * @method RefreshToken|null find($id, $lockMode = null, $lockVersion = null)
 * @method RefreshToken|null findOneBy(array $criteria, array $orderBy = null)
 * @method RefreshToken[]    findAll()
 * @method RefreshToken[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RefreshTokenRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RefreshToken::class);
    }

    public function save(RefreshToken $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(RefreshToken $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Find valid refresh token by token value
     */
    public function findValidToken(string $token): ?RefreshToken
    {
        $count = $this->createQueryBuilder('r')
            ->select('COUNT(r.id)')
            ->getQuery()
            ->getSingleScalarResult();

        error_log('Total de tokens en BD: ' . $count);


        return $this->createQueryBuilder('r')
            ->where('r.token = :token')
            ->andWhere('r.expiresAt > :now')
            ->setParameter('token', $token)
            ->setParameter('now', new \DateTime())
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Remove all expired tokens
     */
    public function removeExpiredTokens(): int
    {
        $queryBuilder = $this->createQueryBuilder('r');
        $query = $queryBuilder->delete()
            ->where('r.expiresAt < :now')
            ->setParameter('now', new \DateTime())
            ->getQuery();
        
        return $query->execute();
    }

    /**
     * Remove all tokens for a specific user
     */
    public function removeAllForUser(User $user): int
    {
        $queryBuilder = $this->createQueryBuilder('r');
        $query = $queryBuilder->delete()
            ->where('r.user = :user')
            ->setParameter('user', $user)
            ->getQuery();
        
        return $query->execute();
    }

    /**
     * Get active tokens for a user
     */
    public function findActiveTokensForUser(User $user): array
    {
        return $this->createQueryBuilder('r')
            ->where('r.user = :user')
            ->andWhere('r.expiresAt > :now')
            ->setParameter('user', $user)
            ->setParameter('now', new \DateTime())
            ->orderBy('r.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
