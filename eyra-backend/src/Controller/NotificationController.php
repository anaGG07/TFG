<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Notification;
use App\Repository\NotificationRepository;
use App\Service\NotificationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Doctrine\ORM\EntityManagerInterface;

#[Route('/api/notifications')]
class NotificationController extends AbstractController
{
    public function __construct(
        private NotificationRepository $notificationRepository,
        private NotificationService $notificationService,
        private EntityManagerInterface $entityManager
    ) {
    }

    #[Route('', name: 'api_notifications_list', methods: ['GET'])]
    public function getNotifications(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Filtros opcionales
        $type = $request->query->get('type');
        $context = $request->query->get('context');
        $limit = $request->query->getInt('limit', 20);
        $page = $request->query->getInt('page', 1);
        $targetType = $request->query->get('target');
        
        // Calcular offset para paginación
        $offset = ($page - 1) * $limit;
        
        // Criterios de búsqueda
        $criteria = ['user' => $user];
        if ($type) {
            $criteria['type'] = $type;
        }
        if ($context) {
            $criteria['context'] = $context;
        }
        if ($targetType) {
            $criteria['targetUserType'] = $targetType;
        }
        
        // Criterios de ordenación
        $orderBy = ['createdAt' => 'DESC'];
        
        // Obtener notificaciones
        $notifications = $this->notificationRepository->findBy($criteria, $orderBy, $limit, $offset);
        
        // Contar total para paginación
        $total = $this->notificationRepository->count($criteria);
        
        return $this->json([
            'notifications' => $notifications,
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'pages' => ceil($total / $limit)
        ], 200, [], ['groups' => 'notification:read']);
    }

    #[Route('/unread', name: 'api_notifications_unread', methods: ['GET'])]
    public function getUnreadNotifications(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Filtros opcionales
        $type = $request->query->get('type');
        $context = $request->query->get('context');
        
        // Obtener notificaciones no leídas
        $notifications = $this->notificationService->getUnreadNotifications($user, $type, $context);
        
        // Contar el total de no leídas (para el badge de notificaciones)
        $totalUnread = $this->notificationService->countUnread($user);
        
        return $this->json([
            'notifications' => $notifications,
            'totalUnread' => $totalUnread
        ], 200, [], ['groups' => 'notification:read']);
    }

    #[Route('/high-priority', name: 'api_notifications_high_priority', methods: ['GET'])]
    public function getHighPriorityNotifications(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Obtener notificaciones de alta prioridad
        $notifications = $this->notificationService->getHighPriorityNotifications($user);
        
        return $this->json($notifications, 200, [], ['groups' => 'notification:read']);
    }

    #[Route('/{id}', name: 'api_notifications_get', methods: ['GET'])]
    public function getNotification(int $id): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        $notification = $this->notificationRepository->find($id);
        
        if (!$notification) {
            return $this->json(['message' => 'Notification not found'], 404);
        }
        
        // Verificar propiedad
        if ($notification->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('Cannot access notification from another user');
        }
        
        return $this->json($notification, 200, [], ['groups' => 'notification:read']);
    }

    #[Route('/read/{id}', name: 'api_notifications_read', methods: ['POST'])]
    public function markAsRead(int $id): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        $notification = $this->notificationRepository->find($id);
        
        if (!$notification) {
            return $this->json(['message' => 'Notification not found'], 404);
        }
        
        // Verificar propiedad
        if ($notification->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('Cannot modify notification from another user');
        }
        
        // Marcar como leída
        $this->notificationService->markAsRead($notification);
        
        return $this->json(['message' => 'Notification marked as read'], 200);
    }

    #[Route('/read-all', name: 'api_notifications_read_all', methods: ['POST'])]
    public function markAllAsRead(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Opcionalmente filtrar por tipo o contexto
        $data = json_decode($request->getContent(), true);
        $type = $data['type'] ?? null;
        $context = $data['context'] ?? null;
        
        if ($type || $context) {
            // Si hay filtros, obtenemos las notificaciones y las marcamos una por una
            $notifications = $this->notificationService->getUnreadNotifications($user, $type, $context);
            $count = 0;
            
            foreach ($notifications as $notification) {
                $this->notificationService->markAsRead($notification);
                $count++;
            }
        } else {
            // Si no hay filtros, usamos el método optimizado para marcar todas
            $count = $this->notificationService->markAllAsRead($user);
        }
        
        return $this->json([
            'message' => 'Notifications marked as read',
            'count' => $count
        ], 200);
    }

    #[Route('/dismiss/{id}', name: 'api_notifications_dismiss', methods: ['POST'])]
    public function dismissNotification(int $id): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        $notification = $this->notificationRepository->find($id);
        
        if (!$notification) {
            return $this->json(['message' => 'Notification not found'], 404);
        }
        
        // Verificar propiedad
        if ($notification->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('Cannot modify notification from another user');
        }
        
        // Marcar como descartada
        $this->notificationService->dismiss($notification);
        
        return $this->json(['message' => 'Notification dismissed'], 200);
    }

    #[Route('/{id}', name: 'api_notifications_delete', methods: ['DELETE'])]
    public function deleteNotification(int $id): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        $notification = $this->notificationRepository->find($id);
        
        if (!$notification) {
            return $this->json(['message' => 'Notification not found'], 404);
        }
        
        // Verificar propiedad
        if ($notification->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('Cannot delete notification from another user');
        }
        
        // Eliminar notificación
        $this->notificationRepository->remove($notification, true);
        
        return $this->json(['message' => 'Notification deleted'], 200);
    }

    #[Route('/by-related/{entityType}/{entityId}', name: 'api_notifications_by_related', methods: ['GET'])]
    public function getNotificationsByRelatedEntity(string $entityType, int $entityId): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Buscar notificaciones relacionadas con una entidad específica y que pertenezcan al usuario
        $notifications = $this->entityManager->createQueryBuilder()
            ->select('n')
            ->from(Notification::class, 'n')
            ->where('n.relatedEntityType = :entityType')
            ->andWhere('n.relatedEntityId = :entityId')
            ->andWhere('n.user = :user')
            ->setParameter('entityType', $entityType)
            ->setParameter('entityId', $entityId)
            ->setParameter('user', $user)
            ->orderBy('n.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
        
        return $this->json($notifications, 200, [], ['groups' => 'notification:read']);
    }

    #[Route('/count', name: 'api_notifications_count', methods: ['GET'])]
    public function getNotificationsCount(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        $unreadCount = $this->notificationService->countUnread($user);
        
        // Contar por tipo para mostrar badges específicos
        $typeCounts = [];
        $types = [
            NotificationService::TYPE_CYCLE_START,
            NotificationService::TYPE_CYCLE_PREDICTION,
            NotificationService::TYPE_MEDICAL_ALERT,
            NotificationService::TYPE_EDUCATIONAL,
            NotificationService::TYPE_REMINDER,
            NotificationService::TYPE_PARTNER,
            NotificationService::TYPE_PARENTAL
        ];
        
        foreach ($types as $type) {
            $notifications = $this->notificationService->getUnreadNotifications($user, $type);
            $typeCounts[$type] = count($notifications);
        }
        
        // Contar por contexto
        $contextCounts = [];
        $contexts = [
            NotificationService::CONTEXT_CYCLE,
            NotificationService::CONTEXT_CONDITION,
            NotificationService::CONTEXT_PREGNANCY,
            NotificationService::CONTEXT_MENOPAUSE,
            NotificationService::CONTEXT_SYSTEM
        ];
        
        foreach ($contexts as $context) {
            $notifications = $this->notificationService->getUnreadNotifications($user, null, $context);
            $contextCounts[$context] = count($notifications);
        }
        
        return $this->json([
            'totalUnread' => $unreadCount,
            'byType' => $typeCounts,
            'byContext' => $contextCounts
        ]);
    }

    #[Route('/partner-test/{userId}', name: 'api_notifications_partner_test', methods: ['POST'], priority: -1)]
    public function createPartnerTestNotification(int $userId): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }
        
        // Verificar que el usuario es administrador (solo para pruebas)
        if (!in_array('ROLE_ADMIN', $user->getRoles())) {
            throw new AccessDeniedException('Not authorized');
        }
        
        $targetUser = $this->entityManager->getRepository(User::class)->find($userId);
        if (!$targetUser) {
            return $this->json(['message' => 'Target user not found'], 404);
        }
        
        // Crear una notificación de prueba para pareja
        $notification = $this->notificationService->createPartnerCycleNotification(
            $targetUser,
            $user,
            'folicular',
            'Fase folicular para tu pareja',
            'Tu pareja está en fase folicular. Es un buen momento para actividades energéticas juntos.'
        );
        
        return $this->json([
            'message' => 'Test partner notification created',
            'notification' => $notification
        ], 201, [], ['groups' => 'notification:read']);
    }
}
