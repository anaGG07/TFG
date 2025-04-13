<?php
namespace App\Repository;
use App\Entity\HormoneLevel;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;




/**
 * @extends ServiceEntityRepository<HormoneLevel>
 *
 * @method HormoneLevel|null find($id, $lockMode = null, $lockVersion = null)
 * @method HormoneLevel|null findOneBy(array $criteria, array $orderBy = null)
 * @method HormoneLevel[]    findAll()
 * @method HormoneLevel[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class HormoneLevelRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, HormoneLevel::class);
    }

    public function save(HormoneLevel $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(HormoneLevel $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    // Add custom methods if needed
}