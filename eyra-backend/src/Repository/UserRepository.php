<?php

namespace App\Repository;

use App\Entity\User;
use App\Enum\ProfileType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\QueryBuilder;

/**
 * @extends ServiceEntityRepository<User>
 *
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function save(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * ! 31/05/2025 - Método optimizado para búsqueda de usuarios con filtrado en base de datos
     */
    public function findUsersWithFilters(
        ?string $search = null,
        ?string $role = null,
        ?ProfileType $profileType = null,
        int $limit = 20,
        int $offset = 0
    ): array {
        $qb = $this->createQueryBuilder('u')
            ->orderBy('u.id', 'ASC')
            ->setMaxResults($limit)
            ->setFirstResult($offset);
        
        // Aplicar filtros de búsqueda de texto
        if ($search) {
            $qb->andWhere(
                $qb->expr()->orX(
                    $qb->expr()->like('LOWER(u.email)', ':search'),
                    $qb->expr()->like('LOWER(u.username)', ':search'),
                    $qb->expr()->like('LOWER(u.name)', ':search'),
                    $qb->expr()->like('LOWER(u.lastName)', ':search')
                )
            )
            ->setParameter('search', '%' . strtolower($search) . '%');
        }
        
        // Aplicar filtro por tipo de perfil
        if ($profileType) {
            $qb->andWhere('u.profileType = :profileType')
               ->setParameter('profileType', $profileType);
        }
        
        // Aplicar filtro por rol (usando sintaxis de PostgreSQL para JSON)
        if ($role) {
            $qb->andWhere('u.roles::text LIKE :role')
               ->setParameter('role', '%"' . $role . '"%');
        }
        
        return $qb->getQuery()->getResult();
    }

    /**
     * ! 31/05/2025 - Método optimizado para contar usuarios con filtrado en base de datos
     */
    public function countUsersWithFilters(
        ?string $search = null,
        ?string $role = null,
        ?ProfileType $profileType = null
    ): int {
        $qb = $this->createQueryBuilder('u')
            ->select('COUNT(u.id)');
        
        // Aplicar filtros de búsqueda de texto
        if ($search) {
            $qb->andWhere(
                $qb->expr()->orX(
                    $qb->expr()->like('LOWER(u.email)', ':search'),
                    $qb->expr()->like('LOWER(u.username)', ':search'),
                    $qb->expr()->like('LOWER(u.name)', ':search'),
                    $qb->expr()->like('LOWER(u.lastName)', ':search')
                )
            )
            ->setParameter('search', '%' . strtolower($search) . '%');
        }
        
        // Aplicar filtro por tipo de perfil
        if ($profileType) {
            $qb->andWhere('u.profileType = :profileType')
               ->setParameter('profileType', $profileType);
        }
        
        // Aplicar filtro por rol (usando sintaxis de PostgreSQL para JSON)
        if ($role) {
            $qb->andWhere('u.roles::text LIKE :role')
               ->setParameter('role', '%"' . $role . '"%');
        }
        
        return (int) $qb->getQuery()->getSingleScalarResult();
    }



    // Add custom query methods below as needed
}