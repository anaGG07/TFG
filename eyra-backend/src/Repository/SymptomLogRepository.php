<?php

namespace App\Repository;
use App\Entity\SymptomLog;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;



/**
 * @extends ServiceEntityRepository<SymptomLog>
 *
 * @method SymptomLog|null find($id, $lockMode = null, $lockVersion = null)
 * @method SymptomLog|null findOneBy(array $criteria, array $orderBy = null)
 * @method SymptomLog[]    findAll()
 * @method SymptomLog[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SymptomLogRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SymptomLog::class);
    }

    public function save(SymptomLog $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(SymptomLog $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    // Add custom query methods below if needed
}