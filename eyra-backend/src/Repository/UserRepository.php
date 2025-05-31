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
     * ! 31/05/2025 - Método simplificado para búsqueda de usuarios - Filtrado completo en PHP
     */
    public function findUsersWithFilters(
        ?string $search = null,
        ?string $role = null,
        ?ProfileType $profileType = null,
        int $limit = 20,
        int $offset = 0
    ): array {
        // Obtener TODOS los usuarios sin filtros complejos
        $qb = $this->createQueryBuilder('u')
            ->orderBy('u.id', 'ASC');
        
        $users = $qb->getQuery()->getResult();
        
        // Aplicar TODOS los filtros en PHP para evitar errores SQL
        $filteredUsers = [];
        
        foreach ($users as $user) {
            $includeUser = true;
            
            // Filtro por búsqueda de texto
            if ($search && $includeUser) {
                $searchLower = strtolower($search);
                $includeUser = (
                    str_contains(strtolower($user->getEmail() ?? ''), $searchLower) ||
                    str_contains(strtolower($user->getUsername() ?? ''), $searchLower) ||
                    str_contains(strtolower($user->getName() ?? ''), $searchLower) ||
                    str_contains(strtolower($user->getLastName() ?? ''), $searchLower)
                );
            }
            
            // Filtro por tipo de perfil
            if ($profileType && $includeUser) {
                $includeUser = ($user->getProfileType() === $profileType);
            }
            
            // Filtro por rol
            if ($role && $includeUser) {
                $userRoles = $user->getRoles();
                $includeUser = in_array($role, $userRoles);
            }
            
            if ($includeUser) {
                $filteredUsers[] = $user;
            }
        }
        
        // Aplicar paginación
        return array_slice($filteredUsers, $offset, $limit);
    }

    /**
     * ! 31/05/2025 - Método simplificado para contar usuarios - Filtrado completo en PHP
     */
    public function countUsersWithFilters(
        ?string $search = null,
        ?string $role = null,
        ?ProfileType $profileType = null
    ): int {
        // Obtener TODOS los usuarios sin filtros complejos
        $qb = $this->createQueryBuilder('u');
        $users = $qb->getQuery()->getResult();
        
        // Aplicar TODOS los filtros en PHP para evitar errores SQL
        $filteredCount = 0;
        
        foreach ($users as $user) {
            $includeUser = true;
            
            // Filtro por búsqueda de texto
            if ($search && $includeUser) {
                $searchLower = strtolower($search);
                $includeUser = (
                    str_contains(strtolower($user->getEmail() ?? ''), $searchLower) ||
                    str_contains(strtolower($user->getUsername() ?? ''), $searchLower) ||
                    str_contains(strtolower($user->getName() ?? ''), $searchLower) ||
                    str_contains(strtolower($user->getLastName() ?? ''), $searchLower)
                );
            }
            
            // Filtro por tipo de perfil
            if ($profileType && $includeUser) {
                $includeUser = ($user->getProfileType() === $profileType);
            }
            
            // Filtro por rol
            if ($role && $includeUser) {
                $userRoles = $user->getRoles();
                $includeUser = in_array($role, $userRoles);
            }
            
            if ($includeUser) {
                $filteredCount++;
            }
        }
        
        return $filteredCount;
    }

    /**
     * ! 31/05/2025 - Método privado simplificado - Ya no se usa para filtros complejos
     */
    private function applyFilters(
        QueryBuilder $qb,
        ?string $search = null,
        ?string $role = null,
        ?ProfileType $profileType = null
    ): void {
        // Método mantenido para compatibilidad pero ya no se usa
        // Los filtros ahora se aplican completamente en PHP
    }

    // Add custom query methods below as needed
}