<?php

namespace App\Repository;
use App\Entity\GuestAccess;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;



/**
 * @extends ServiceEntityRepository<GuestAccess>
 *
 * @method GuestAccess|null find($id, $lockMode = null, $lockVersion = null)
 * @method GuestAccess|null findOneBy(array $criteria, array $orderBy = null)
 * @method GuestAccess[]    findAll()
 * @method GuestAccess[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class GuestAccessRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, GuestAccess::class);
    }

    public function save(GuestAccess $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(GuestAccess $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Find guest accesses by guest and owner
     */
    public function findByGuestAndOwner(int $guestId, int $ownerId): array
    {
        return $this->createQueryBuilder('ga')
            ->andWhere('ga.guest = :guestId')
            ->andWhere('ga.owner = :ownerId')
            ->andWhere('ga.state = :state')
            ->andWhere('ga.expires_at > :now OR ga.expires_at IS NULL')
            ->setParameter('guestId', $guestId)
            ->setParameter('ownerId', $ownerId)
            ->setParameter('state', true)
            ->setParameter('now', new \DateTime())
            ->getQuery()
            ->getResult();
    }

    /**
     * Find active guest accesses by user (as owner or guest)
     */
    public function findActiveForUser(int $userId): array
    {
        return $this->createQueryBuilder('ga')
            ->andWhere('(ga.guest = :userId OR ga.owner = :userId)')
            ->andWhere('ga.state = :state')
            ->andWhere('ga.expires_at > :now OR ga.expires_at IS NULL')
            ->setParameter('userId', $userId)
            ->setParameter('state', true)
            ->setParameter('now', new \DateTime())
            ->getQuery()
            ->getResult();
    }
}