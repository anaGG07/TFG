<?php
namespace App\Repository;
use App\Entity\Condition;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;




/**
 * @extends ServiceEntityRepository<Condition>
 *
 * @method Condition|null find($id, $lockMode = null, $lockVersion = null)
 * @method Condition|null findOneBy(array $criteria, array $orderBy = null)
 * @method Condition[]    findAll()
 * @method Condition[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ConditionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Condition::class);
    }

    public function save(Condition $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Condition $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /* ! 31/05/2025 - Método para buscar condiciones por término de búsqueda */
    public function search(string $query, ?string $category = null, ?bool $state = null): array
    {
        $qb = $this->createQueryBuilder('c')
            ->where('c.name LIKE :query OR c.description LIKE :query')
            ->setParameter('query', '%' . $query . '%')
            ->orderBy('c.name', 'ASC');

        if ($category !== null) {
            $qb->andWhere('c.category = :category')
               ->setParameter('category', $category);
        }

        if ($state !== null) {
            $qb->andWhere('c.state = :state')
               ->setParameter('state', $state);
        }

        return $qb->getQuery()->getResult();
    }

    /* ! 31/05/2025 - Método para obtener todas las categorías únicas */
    public function getUniqueCategories(): array
    {
        $result = $this->createQueryBuilder('c')
            ->select('DISTINCT c.category')
            ->where('c.category IS NOT NULL')
            ->andWhere('c.state = true')
            ->orderBy('c.category', 'ASC')
            ->getQuery()
            ->getScalarResult();

        return array_column($result, 'category');
    }

    /* ! 31/05/2025 - Método para obtener condiciones por categoría */
    public function findByCategory(string $category, ?bool $state = true): array
    {
        $qb = $this->createQueryBuilder('c')
            ->where('c.category = :category')
            ->setParameter('category', $category)
            ->orderBy('c.name', 'ASC');

        if ($state !== null) {
            $qb->andWhere('c.state = :state')
               ->setParameter('state', $state);
        }

        return $qb->getQuery()->getResult();
    }
}