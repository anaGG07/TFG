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
     * ! 31/05/2025 - Método para búsqueda avanzada de usuarios con filtros para el panel de administración
     */
    public function findUsersWithFilters(
        ?string $search = null,
        ?string $role = null,
        ?ProfileType $profileType = null,
        int $limit = 20,
        int $offset = 0
    ): array {
        $qb = $this->createQueryBuilder('u');
        
        $this->applyFilters($qb, $search, $role, $profileType);
        
        return $qb
            ->orderBy('u.id', 'ASC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }

    /**
     * ! 31/05/2025 - Método para contar usuarios con filtros aplicados
     */
    public function countUsersWithFilters(
        ?string $search = null,
        ?string $role = null,
        ?ProfileType $profileType = null
    ): int {
        $qb = $this->createQueryBuilder('u')
            ->select('COUNT(u.id)');
        
        $this->applyFilters($qb, $search, $role, $profileType);
        
        return (int) $qb->getQuery()->getSingleScalarResult();
    }

    /**
     * ! 31/05/2025 - Método privado para aplicar filtros comunes a las consultas
     */
    private function applyFilters(
        QueryBuilder $qb,
        ?string $search = null,
        ?string $role = null,
        ?ProfileType $profileType = null
    ): void {
        // Filtro de búsqueda por texto
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

        // Filtro por tipo de perfil
        if ($profileType) {
            $qb->andWhere('u.profileType = :profileType')
               ->setParameter('profileType', $profileType);
        }

        // Filtro por rol - utilizamos CAST para convertir JSON a texto
        if ($role) {
            // Convertimos el JSON a texto y buscamos el rol
            $qb->andWhere('CAST(u.roles AS text) LIKE :rolePattern')
               ->setParameter('rolePattern', '%"' . $role . '"%');
        }
    }

    // Add custom query methods below as needed
}