<?php

namespace App\Service;

use App\Entity\User;
use App\Entity\Notification;
use App\Entity\Condition;
use App\Entity\GuestAccess;
use App\Repository\NotificationRepository;
use App\Repository\GuestAccessRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class NotificationService
{
    // Tipos de notificación predefinidos
    public const TYPE_CYCLE_START = 'cycle_start';
    public const TYPE_CYCLE_PREDICTION = 'cycle_prediction';
    public const TYPE_MEDICAL_ALERT = 'medical_alert';
    public const TYPE_SYSTEM = 'system';
    public const TYPE_EDUCATIONAL = 'educational';
    public const TYPE_REMINDER = 'reminder';
    public const TYPE_PARTNER = 'partner';
    public const TYPE_PARENTAL = 'parental';
    
    // Contextos predefinidos
    public const CONTEXT_CYCLE = 'cycle';
    public const CONTEXT_CONDITION = 'condition';
    public const CONTEXT_PREGNANCY = 'pregnancy';
    public const CONTEXT_MENOPAUSE = 'menopause';
    public const CONTEXT_SYSTEM = 'system';
    
    // Prioridades
    public const PRIORITY_LOW = 'low';
    public const PRIORITY_NORMAL = 'normal';
    public const PRIORITY_HIGH = 'high';
    public const PRIORITY_URGENT = 'urgent';
    
    // Tipos de usuario destino
    public const TARGET_PRIMARY = 'primary';
    public const TARGET_PARTNER = 'partner';
    public const TARGET_PARENT = 'parent';

    public function __construct(
        private EntityManagerInterface $entityManager,
        private NotificationRepository $notificationRepository,
        private GuestAccessRepository $guestAccessRepository,
        private RequestStack $requestStack
    ) {
    }

    /**
     * Crear una notificación básica
     */
    public function createNotification(
        User $user, 
        string $title, 
        string $message, 
        string $type = self::TYPE_SYSTEM,
        string $priority = self::PRIORITY_NORMAL,
        ?string $context = null
    ): Notification {
        $notification = new Notification();
        $notification->setUser($user);
        $notification->setTitle($title);
        $notification->setMessage($message);
        $notification->setType($type);
        $notification->setPriority($priority);
        $notification->setContext($context);
        
        $this->notificationRepository->save($notification, true);
        
        return $notification;
    }

    /**
     * Programar una notificación para el futuro
     */
    public function scheduleNotification(
        User $user, 
        string $title, 
        string $message, 
        \DateTime $scheduledFor,
        string $type = self::TYPE_REMINDER,
        string $priority = self::PRIORITY_NORMAL,
        ?string $context = null
    ): Notification {
        $notification = new Notification();
        $notification->setUser($user);
        $notification->setTitle($title);
        $notification->setMessage($message);
        $notification->setType($type);
        $notification->setPriority($priority);
        $notification->setContext($context);
        $notification->setScheduledFor($scheduledFor);
        
        $this->notificationRepository->save($notification, true);
        
        return $notification;
    }

    /**
     * Crear una notificación relacionada con una condición médica
     */
    public function createMedicalNotification(
        User $user, 
        Condition $condition, 
        string $title,
        string $message,
        string $priority = self::PRIORITY_HIGH
    ): Notification {
        $notification = new Notification();
        $notification->setUser($user);
        $notification->setTitle($title);
        $notification->setMessage($message);
        $notification->setType(self::TYPE_MEDICAL_ALERT);
        $notification->setPriority($priority);
        $notification->setContext(self::CONTEXT_CONDITION);
        $notification->setRelatedCondition($condition);
        
        $this->notificationRepository->save($notification, true);
        
        return $notification;
    }

    /**
     * Crear notificación con URL de acción
     */
    public function createActionNotification(
        User $user, 
        string $title, 
        string $message, 
        string $actionUrl, 
        string $actionText,
        string $type = self::TYPE_SYSTEM,
        string $priority = self::PRIORITY_NORMAL
    ): Notification {
        $notification = new Notification();
        $notification->setUser($user);
        $notification->setTitle($title);
        $notification->setMessage($message);
        $notification->setType($type);
        $notification->setPriority($priority);
        $notification->setActionUrl($actionUrl);
        $notification->setActionText($actionText);
        
        $this->notificationRepository->save($notification, true);
        
        return $notification;
    }

    /**
     * Crear notificación relacionada con otra entidad
     */
    public function createEntityRelatedNotification(
        User $user, 
        string $title, 
        string $message, 
        string $entityType, 
        int $entityId,
        string $type = self::TYPE_SYSTEM,
        string $priority = self::PRIORITY_NORMAL,
        ?string $context = null
    ): Notification {
        $notification = new Notification();
        $notification->setUser($user);
        $notification->setTitle($title);
        $notification->setMessage($message);
        $notification->setType($type);
        $notification->setPriority($priority);
        $notification->setContext($context);
        $notification->setRelatedEntityType($entityType);
        $notification->setRelatedEntityId($entityId);
        
        $this->notificationRepository->save($notification, true);
        
        return $notification;
    }

    /**
     * Enviar notificaciones a todos los invitados de un usuario
     */
    public function sendNotificationsToGuests(
        User $owner, 
        string $title,
        string $message,
        string $accessType = null,
        string $type = self::TYPE_PARTNER,
        string $priority = self::PRIORITY_NORMAL
    ): int {
        $guests = $this->guestAccessRepository->findActiveForUser($owner);
        
        $count = 0;
        foreach ($guests as $guestAccess) {
            // Si se especifica un tipo de acceso, filtrar por él
            if ($accessType && $guestAccess->getAccessType() !== $accessType) {
                continue;
            }
            
            $guest = $guestAccess->getGuest();
            
            // Determinar el tipo de usuario destino basado en el tipo de acceso
            $targetUserType = ($guestAccess->getAccessType() === 'parent') 
                ? self::TARGET_PARENT 
                : self::TARGET_PARTNER;
            
            $notification = new Notification();
            $notification->setUser($guest);
            $notification->setTitle($title);
            $notification->setMessage($message);
            $notification->setType($type);
            $notification->setPriority($priority);
            $notification->setTargetUserType($targetUserType);
            $notification->setRelatedEntityType('User');
            $notification->setRelatedEntityId($owner->getId());
            
            // Agregar metadatos para referencia
            $metadata = [
                'ownerName' => $owner->getName() . ' ' . $owner->getLastName(),
                'ownerUsername' => $owner->getUsername(),
                'relationshipType' => $guestAccess->getAccessType()
            ];
            $notification->setMetadata($metadata);
            
            $this->notificationRepository->save($notification);
            $count++;
        }
        
        if ($count > 0) {
            $this->entityManager->flush();
        }
        
        return $count;
    }

    /**
     * Marcar notificación como leída
     */
    public function markAsRead(Notification $notification): void
    {
        $notification->setRead(true);
        $notification->setReadAt(new \DateTime());
        
        $this->notificationRepository->save($notification, true);
    }

    /**
     * Marcar todas las notificaciones de un usuario como leídas
     */
    public function markAllAsRead(User $user): int
    {
        return $this->notificationRepository->markAllAsRead($user);
    }

    /**
     * Descartar notificación (marcarla como descartada sin leerla)
     */
    public function dismiss(Notification $notification): void
    {
        $notification->setDismissed(true);
        
        $this->notificationRepository->save($notification, true);
    }

    /**
     * Obtener notificaciones no leídas con opciones de filtrado
     */
    public function getUnreadNotifications(
        User $user, 
        ?string $type = null, 
        ?string $context = null
    ): array {
        return $this->notificationRepository->findUnreadByUser($user, $type, $context);
    }

    /**
     * Obtener notificaciones de alta prioridad
     */
    public function getHighPriorityNotifications(User $user, int $limit = 5): array
    {
        return $this->notificationRepository->findHighPriorityForUser($user, $limit);
    }

    /**
     * Contar notificaciones no leídas
     */
    public function countUnread(User $user): int
    {
        return $this->notificationRepository->countUnreadByUser($user);
    }

    /**
     * Procesar notificaciones programadas (para ser llamado por un cron job)
     */
    public function processScheduledNotifications(\DateTime $before = null): int
    {
        if (!$before) {
            $before = new \DateTime();
        }
        
        $scheduledNotifications = $this->notificationRepository->findScheduled($before);
        
        // No hay necesidad de hacer nada, las notificaciones ya están en la base de datos
        // y serán enviadas cuando el usuario consulte sus notificaciones
        
        return count($scheduledNotifications);
    }

    /**
     * Crear notificación para inicios de ciclo menstrual
     */
    public function createCycleStartNotification(User $user, \DateTime $startDate): Notification
    {
        $formattedDate = $startDate->format('d/m/Y');
        
        return $this->createNotification(
            $user,
            'Inicio de ciclo registrado',
            "Se ha registrado el inicio de tu ciclo menstrual con fecha {$formattedDate}.",
            self::TYPE_CYCLE_START,
            self::PRIORITY_NORMAL,
            self::CONTEXT_CYCLE
        );
    }

    /**
     * Crear notificación para predicción de próximo ciclo
     */
    public function createCyclePredictionNotification(User $user, \DateTime $predictedDate): Notification
    {
        $formattedDate = $predictedDate->format('d/m/Y');
        $daysUntil = (int) $predictedDate->diff(new \DateTime())->format('%a');
        
        $title = 'Próximo ciclo menstrual';
        $message = "Tu próximo ciclo menstrual está previsto para comenzar el {$formattedDate}, en {$daysUntil} días.";
        
        // Determinar prioridad basada en la proximidad
        $priority = self::PRIORITY_NORMAL;
        if ($daysUntil <= 2) {
            $priority = self::PRIORITY_HIGH;
            $message .= " ¡Prepárate!";
        } elseif ($daysUntil <= 7) {
            $priority = self::PRIORITY_NORMAL;
            $message .= " Te recomendamos tener preparados tus suministros.";
        }
        
        return $this->createNotification(
            $user,
            $title,
            $message,
            self::TYPE_CYCLE_PREDICTION,
            $priority,
            self::CONTEXT_CYCLE
        );
    }

    /**
     * Crear notificación educativa sobre fase del ciclo
     */
    public function createCyclePhaseEducationalNotification(
        User $user, 
        string $phase, 
        string $title, 
        string $content
    ): Notification {
        return $this->createNotification(
            $user,
            $title,
            $content,
            self::TYPE_EDUCATIONAL,
            self::PRIORITY_LOW,
            self::CONTEXT_CYCLE
        );
    }

    /**
     * Crear notificación relacionada con embarazo
     */
    public function createPregnancyNotification(
        User $user, 
        int $week, 
        string $title, 
        string $content,
        string $priority = self::PRIORITY_NORMAL
    ): Notification {
        $notification = $this->createNotification(
            $user,
            $title,
            $content,
            self::TYPE_REMINDER,
            $priority,
            self::CONTEXT_PREGNANCY
        );
        
        $metadata = ['pregnancyWeek' => $week];
        $notification->setMetadata($metadata);
        $notification->setRelatedEntityType('PregnancyLog');
        
        $this->notificationRepository->save($notification, true);
        
        return $notification;
    }

    /**
     * Crear notificación para pareja sobre ciclo
     */
    public function createPartnerCycleNotification(
        User $partner, 
        User $primary, 
        string $phase,
        string $title,
        string $message
    ): Notification {
        $notification = new Notification();
        $notification->setUser($partner);
        $notification->setTitle($title);
        $notification->setMessage($message);
        $notification->setType(self::TYPE_PARTNER);
        $notification->setPriority(self::PRIORITY_NORMAL);
        $notification->setContext(self::CONTEXT_CYCLE);
        $notification->setTargetUserType(self::TARGET_PARTNER);
        $notification->setRelatedEntityType('User');
        $notification->setRelatedEntityId($primary->getId());
        
        // Agregar metadatos para referencia
        $metadata = [
            'primaryName' => $primary->getName() . ' ' . $primary->getLastName(),
            'primaryUsername' => $primary->getUsername(),
            'cyclePhase' => $phase
        ];
        $notification->setMetadata($metadata);
        
        $this->notificationRepository->save($notification, true);
        
        return $notification;
    }
}
