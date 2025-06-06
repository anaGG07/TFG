<?php

namespace App\Repository;

use App\Entity\User;
use App\Enum\ProfileType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

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
     * Cuenta usuarios con filtros aplicados para paginación
     * 
     * @param string|null $search Término de búsqueda (name, lastName, email, username)
     * @param string|null $role Rol a filtrar
     * @param ProfileType|null $profileType Tipo de perfil a filtrar
     * @return int Total de usuarios que coinciden con los filtros
     */
    public function countUsersWithFilters(?string $search = null, ?string $role = null, ?ProfileType $profileType = null): int
    {
        $qb = $this->createQueryBuilder('u');
        
        // Aplicar filtros solo si se proporcionan
        $this->applyFilters($qb, $search, $role, $profileType);
        
        return (int) $qb->select('COUNT(u.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Busca usuarios con filtros aplicados y paginación
     * 
     * @param string|null $search Término de búsqueda (name, lastName, email, username)
     * @param string|null $role Rol a filtrar
     * @param ProfileType|null $profileType Tipo de perfil a filtrar
     * @param int $limit Límite de resultados
     * @param int $offset Offset para paginación
     * @return User[] Array de usuarios que coinciden con los filtros
     */
    public function findUsersWithFilters(?string $search = null, ?string $role = null, ?ProfileType $profileType = null, int $limit = 20, int $offset = 0): array
    {
        $qb = $this->createQueryBuilder('u');
        
        // Aplicar filtros
        $this->applyFilters($qb, $search, $role, $profileType);
        
        return $qb->orderBy('u.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }

    /**
     * Aplica filtros comunes al QueryBuilder
     * 
     * @param \Doctrine\ORM\QueryBuilder $qb QueryBuilder a modificar
     * @param string|null $search Término de búsqueda
     * @param string|null $role Rol a filtrar
     * @param ProfileType|null $profileType Tipo de perfil a filtrar
     */
    private function applyFilters($qb, ?string $search = null, ?string $role = null, ?ProfileType $profileType = null): void
    {
        // Filtro de búsqueda por texto
        if ($search) {
            $qb->andWhere(
                $qb->expr()->orX(
                    $qb->expr()->like('u.name', ':search'),
                    $qb->expr()->like('u.lastName', ':search'),
                    $qb->expr()->like('u.email', ':search'),
                    $qb->expr()->like('u.username', ':search')
                )
            )->setParameter('search', '%' . $search . '%');
        }

        // Filtro por rol (búsqueda en campo JSON)
        if ($role) {
            $qb->andWhere('JSON_CONTAINS(u.roles, :role) = 1')
                ->setParameter('role', json_encode($role));
        }

        // Filtro por tipo de perfil
        if ($profileType) {
            $qb->andWhere('u.profileType = :profileType')
                ->setParameter('profileType', $profileType);
        }
    }
}