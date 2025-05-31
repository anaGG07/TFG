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
     * ! 31/05/2025 - Método híbrido: filtros SQL seguros + filtro por rol en PHP
     */
    public function findUsersWithFilters(
        ?string $search = null,
        ?string $role = null,
        ?ProfileType $profileType = null,
        int $limit = 20,
        int $offset = 0
    ): array {
        $qb = $this->createQueryBuilder('u')
            ->orderBy('u.id', 'ASC');
        
        // Aplicar solo filtros SQL seguros (no rol)
        $this->applyBasicFilters($qb, $search, $profileType);
        
        // Obtener usuarios con filtros básicos
        $users = $qb->getQuery()->getResult();
        
        // Aplicar filtro por rol en PHP (más seguro)
        if ($role) {
            $users = array_filter($users, function (User $user) use ($role) {
                return in_array($role, $user->getRoles());
            });
            $users = array_values($users); // Reindexar array
        }
        
        // Aplicar paginación manualmente
        return array_slice($users, $offset, $limit);
    }
    
    /**
     * ! 31/05/2025 - Aplicar filtros SQL básicos (seguros)
     */
    private function applyBasicFilters(QueryBuilder $qb, ?string $search, ?ProfileType $profileType): void
    {
        // Filtro de búsqueda de texto
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
    }

    /**
     * ! 31/05/2025 - Método híbrido: filtros SQL seguros + filtro por rol en PHP
     */
    public function countUsersWithFilters(
        ?string $search = null,
        ?string $role = null,
        ?ProfileType $profileType = null
    ): int {
        $qb = $this->createQueryBuilder('u');
        
        // Aplicar solo filtros SQL seguros (no rol)
        $this->applyBasicFilters($qb, $search, $profileType);
        
        // Obtener usuarios con filtros básicos
        $users = $qb->getQuery()->getResult();
        
        // Aplicar filtro por rol en PHP si es necesario
        if ($role) {
            $users = array_filter($users, function (User $user) use ($role) {
                return in_array($role, $user->getRoles());
            });
        }
        
        return count($users);
    }



    // Add custom query methods below as needed
}