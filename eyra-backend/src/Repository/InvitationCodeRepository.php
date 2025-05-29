<?php

namespace App\Repository;

use App\Entity\InvitationCode;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

// ! 28/05/2025 - Repositorio creado para gestionar códigos de invitación

/**
 * @extends ServiceEntityRepository<InvitationCode>
 *
 * @method InvitationCode|null find($id, $lockMode = null, $lockVersion = null)
 * @method InvitationCode|null findOneBy(array $criteria, array $orderBy = null)
 * @method InvitationCode[]    findAll()
 * @method InvitationCode[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InvitationCodeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, InvitationCode::class);
    }

    // ! 28/05/2025 - Encuentra un código válido por su valor de cadena
    public function findValidCode(string $code): ?InvitationCode
    {
        $qb = $this->createQueryBuilder('i')
            ->where('i.code = :code')
            ->andWhere('i.status = :status')
            ->andWhere('i.expiresAt > :now')
            ->setParameter('code', $code)
            ->setParameter('status', 'active')
            ->setParameter('now', new \DateTime())
            ->setMaxResults(1);

        return $qb->getQuery()->getOneOrNullResult();
    }

    // ! 28/05/2025 - Encuentra todos los códigos activos creados por un usuario
    public function findActiveByCreator(User $user): array
    {
        $qb = $this->createQueryBuilder('i')
            ->where('i.creator = :user')
            ->andWhere('i.status = :status')
            ->andWhere('i.expiresAt > :now')
            ->setParameter('user', $user)
            ->setParameter('status', 'active')
            ->setParameter('now', new \DateTime())
            ->orderBy('i.createdAt', 'DESC');

        return $qb->getQuery()->getResult();
    }

    // ! 28/05/2025 - Encuentra todos los códigos creados por un usuario con filtro opcional de estado
    public function findByCreatorAndStatus(User $user, ?string $status = null): array
    {
        $qb = $this->createQueryBuilder('i')
            ->where('i.creator = :user')
            ->setParameter('user', $user)
            ->orderBy('i.createdAt', 'DESC');

        if ($status) {
            $qb->andWhere('i.status = :status')
                ->setParameter('status', $status);
        }

        return $qb->getQuery()->getResult();
    }

    // ! 28/05/2025 - Actualiza códigos expirados y devuelve el número de códigos actualizados
    public function updateExpiredCodes(): int
    {
        $qb = $this->createQueryBuilder('i')
            ->update()
            ->set('i.status', ':expired')
            ->where('i.status = :active')
            ->andWhere('i.expiresAt <= :now')
            ->setParameter('expired', 'expired')
            ->setParameter('active', 'active')
            ->setParameter('now', new \DateTime());

        return $qb->getQuery()->execute();
    }

    // ! 28/05/2025 - Guarda una entidad InvitationCode
    public function save(InvitationCode $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    // ! 28/05/2025 - Elimina una entidad InvitationCode
    public function remove(InvitationCode $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
