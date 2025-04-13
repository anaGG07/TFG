<?php

namespace App\Repository;

use App\Entity\Notification;
use App\Entity\User;
use App\Entity\Condition;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Notification>
 *
 * @method Notification|null find($id, $lockMode = null, $lockVersion = null)
 * @method Notification|null findOneBy(array $criteria, array $orderBy = null)
 * @method Notification[]    findAll()
 * @method Notification[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class NotificationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Notification::class);
    }

    public function save(Notification $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Notification $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Find unread notifications for a user with optional filtering
     */
    public function findUnreadByUser(User $user, ?string $type = null, ?string $context = null): array
    {
        $cacheKey = "unread_notifications_user_{$user->getId()}" . 
                   ($type ? "_type_{$type}" : "") . 
                   ($context ? "_context_{$context}" : "");
                   
        $qb = $this->createQueryBuilder('n')
            ->andWhere('n.user = :user')
            ->andWhere('n.read = :read')
            ->andWhere('n.dismissed = :dismissed')
            ->setParameter('user', $user)
            ->setParameter('read', false)
            ->setParameter('dismissed', false);
            
        if ($type) {
            $qb->andWhere('n.type = :type')
               ->setParameter('type', $type);
        }
        
        if ($context) {
            $qb->andWhere('n.context = :context')
               ->setParameter('context', $context);
        }
        
        // Solo mostrar notificaciones que están programadas para mostrar
        $qb->andWhere('n.scheduledFor IS NULL OR n.scheduledFor <= :now')
           ->setParameter('now', new \DateTime());
        
        return $qb->orderBy('n.priority', 'DESC')
                ->addOrderBy('n.createdAt', 'DESC')
                ->getQuery()
                ->enableResultCache(300, $cacheKey) // Cache por 5 minutos
                ->getResult();
    }
    
    /**
     * Find notifications related to a specific condition
     */
    public function findByCondition(Condition $condition, int $limit = 10): array
    {
        $cacheKey = "notifications_condition_{$condition->getId()}_limit_{$limit}";
        
        return $this->createQueryBuilder('n')
            ->andWhere('n.relatedCondition = :condition')
            ->setParameter('condition', $condition)
            ->orderBy('n.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->enableResultCache(1800, $cacheKey) // Cache por 30 minutos
            ->getResult();
    }
    
    /**
     * Find notifications for a specific target user type (primary, partner, parent)
     */
    public function findByTargetUserType(User $user, string $targetUserType, int $limit = 20): array
    {
        $cacheKey = "notifications_user_{$user->getId()}_target_{$targetUserType}_limit_{$limit}";
        
        return $this->createQueryBuilder('n')
            ->andWhere('n.user = :user')
            ->andWhere('n.targetUserType = :targetType')
            ->andWhere('n.dismissed = :dismissed')
            ->setParameter('user', $user)
            ->setParameter('targetType', $targetUserType)
            ->setParameter('dismissed', false)
            ->orderBy('n.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->enableResultCache(900, $cacheKey) // Cache por 15 minutos
            ->getResult();
    }
    
    /**
     * Find high priority notifications that should be shown immediately
     */
    public function findHighPriorityForUser(User $user, int $limit = 5): array
    {
        $cacheKey = "high_priority_notifications_user_{$user->getId()}_limit_{$limit}";
        
        return $this->createQueryBuilder('n')
            ->andWhere('n.user = :user')
            ->andWhere('n.priority = :priority')
            ->andWhere('n.read = :read')
            ->andWhere('n.dismissed = :dismissed')
            ->andWhere('n.scheduledFor IS NULL OR n.scheduledFor <= :now')
            ->setParameter('user', $user)
            ->setParameter('priority', 'high')
            ->setParameter('read', false)
            ->setParameter('dismissed', false)
            ->setParameter('now', new \DateTime())
            ->orderBy('n.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->enableResultCache(300, $cacheKey) // Cache por 5 minutos
            ->getResult();
    }
    
    /**
     * Find notifications by related entity
     */
    public function findByRelatedEntity(string $entityType, int $entityId, int $limit = 10): array
    {
        $cacheKey = "notifications_entity_{$entityType}_{$entityId}_limit_{$limit}";
        
        return $this->createQueryBuilder('n')
            ->andWhere('n.relatedEntityType = :entityType')
            ->andWhere('n.relatedEntityId = :entityId')
            ->setParameter('entityType', $entityType)
            ->setParameter('entityId', $entityId)
            ->orderBy('n.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->enableResultCache(900, $cacheKey) // Cache por 15 minutos
            ->getResult();
    }
    
    /**
     * Mark all notifications as read for a user
     */
    public function markAllAsRead(User $user): int
    {
        $now = new \DateTime();
        
        $qb = $this->createQueryBuilder('n');
        $query = $qb->update()
            ->set('n.read', ':read')
            ->set('n.readAt', ':readAt')
            ->where('n.user = :user')
            ->andWhere('n.read = :notRead')
            ->setParameter('read', true)
            ->setParameter('readAt', $now)
            ->setParameter('user', $user)
            ->setParameter('notRead', false)
            ->getQuery();
        
        return $query->execute();
    }
    
    /**
     * Find notifications scheduled for a future date
     */
    public function findScheduled(\DateTime $before): array
    {
        return $this->createQueryBuilder('n')
            ->andWhere('n.scheduledFor IS NOT NULL')
            ->andWhere('n.scheduledFor <= :before')
            ->andWhere('n.read = :read')
            ->setParameter('before', $before)
            ->setParameter('read', false)
            ->getQuery()
            ->getResult();
    }
    
    /**
     * Count unread notifications for a user
     */
    public function countUnreadByUser(User $user): int
    {
        $cacheKey = "unread_count_user_{$user->getId()}";
        
        $qb = $this->createQueryBuilder('n')
            ->select('COUNT(n.id)')
            ->andWhere('n.user = :user')
            ->andWhere('n.read = :read')
            ->andWhere('n.dismissed = :dismissed')
            ->andWhere('n.scheduledFor IS NULL OR n.scheduledFor <= :now')
            ->setParameter('user', $user)
            ->setParameter('read', false)
            ->setParameter('dismissed', false)
            ->setParameter('now', new \DateTime());
        
        return (int) $qb->getQuery()
            ->enableResultCache(300, $cacheKey) // Cache por 5 minutos
            ->getSingleScalarResult();
    }
}
