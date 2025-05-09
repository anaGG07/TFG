<?php

namespace App\Repository;

use App\Entity\Onboarding;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Onboarding>
 *
 * @method Onboarding|null find($id, $lockMode = null, $lockVersion = null)
 * @method Onboarding|null findOneBy(array $criteria, array $orderBy = null)
 * @method Onboarding[]    findAll()
 * @method Onboarding[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OnboardingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Onboarding::class);
    }

    // 🎯 Puedes añadir aquí métodos personalizados como:
    // public function findIncompleteByUser(User $user): ?Onboarding
    // {
    //     return $this->createQueryBuilder('o')
    //         ->andWhere('o.user = :user')
    //         ->andWhere('o.completed = false')
    //         ->setParameter('user', $user)
    //         ->getQuery()
    //         ->getOneOrNullResult();
    // }
}
