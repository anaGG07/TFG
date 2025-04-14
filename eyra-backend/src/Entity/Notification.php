<?php

namespace App\Entity;

use App\Repository\NotificationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: NotificationRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    normalizationContext: ['groups' => ['notification:read']],
    denormalizationContext: ['groups' => ['notification:write']],
    operations: [
        new Get(),
        new GetCollection(),
        new Post(),
        new Put(),
        new Delete()
    ]
)]
class Notification
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['notification:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'notifications')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['notification:read'])]
    private ?User $user = null;

    #[ORM\Column(length: 255)]
    #[Groups(['notification:read', 'notification:write'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['notification:read', 'notification:write'])]
    private ?string $message = null;

    #[ORM\Column(length: 50)]
    #[Groups(['notification:read', 'notification:write'])]
    private ?string $type = null;

    #[ORM\Column(length: 20)]
    #[Groups(['notification:read', 'notification:write'])]
    private ?string $priority = 'normal';

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['notification:read', 'notification:write'])]
    private ?string $context = null;

    #[ORM\Column]
    #[Groups(['notification:read', 'notification:write'])]
    private ?bool $read = false;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['notification:read', 'notification:write'])]
    private ?\DateTimeInterface $readAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['notification:read', 'notification:write'])]
    private ?\DateTimeInterface $scheduledFor = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['notification:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(length: 30, nullable: true)]
    #[Groups(['notification:read', 'notification:write'])]
    private ?string $targetUserType = 'primary';

    #[ORM\ManyToOne(inversedBy: 'notifications')]
    #[Groups(['notification:read', 'notification:write'])]
    private ?Condition $relatedCondition = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['notification:read', 'notification:write'])]
    private ?string $relatedEntityType = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['notification:read', 'notification:write'])]
    private ?int $relatedEntityId = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['notification:read', 'notification:write'])]
    private ?string $actionUrl = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['notification:read', 'notification:write'])]
    private ?string $actionText = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['notification:read', 'notification:write'])]
    private array $metadata = [];

    #[ORM\ManyToOne(inversedBy: 'notifications')]
    private ?GuestAccess $guestAccess = null;

    #[ORM\Column]
    #[Groups(['notification:read'])]
    private ?bool $dismissed = false;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getGuestAccess(): ?GuestAccess
    {
        return $this->guestAccess;
    }

    public function setGuestAccess(?GuestAccess $guestAccess): static
    {
        $this->guestAccess = $guestAccess;
        return $this;
    }


    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): static
    {
        $this->message = $message;

        return $this;
    }


    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getPriority(): ?string
    {
        return $this->priority;
    }

    public function setPriority(string $priority): static
    {
        $this->priority = $priority;

        return $this;
    }

    public function getContext(): ?string
    {
        return $this->context;
    }

    public function setContext(?string $context): static
    {
        $this->context = $context;

        return $this;
    }

    public function isRead(): ?bool
    {
        return $this->read;
    }

    public function setRead(bool $read): static
    {
        $this->read = $read;

        if ($read && $this->readAt === null) {
            $this->readAt = new \DateTime();
        }

        return $this;
    }

    public function getReadAt(): ?\DateTimeInterface
    {
        return $this->readAt;
    }

    public function setReadAt(?\DateTimeInterface $readAt): static
    {
        $this->readAt = $readAt;

        return $this;
    }

    public function getScheduledFor(): ?\DateTimeInterface
    {
        return $this->scheduledFor;
    }

    public function setScheduledFor(?\DateTimeInterface $scheduledFor): static
    {
        $this->scheduledFor = $scheduledFor;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    #[ORM\PrePersist]
    public function setCreatedAtValue(): void
    {
        $this->createdAt = new \DateTime();
    }

    public function getTargetUserType(): ?string
    {
        return $this->targetUserType;
    }

    public function setTargetUserType(?string $targetUserType): static
    {
        $this->targetUserType = $targetUserType;

        return $this;
    }

    public function getRelatedCondition(): ?Condition
    {
        return $this->relatedCondition;
    }

    public function setRelatedCondition(?Condition $relatedCondition): static
    {
        $this->relatedCondition = $relatedCondition;

        return $this;
    }

    public function getRelatedEntityType(): ?string
    {
        return $this->relatedEntityType;
    }

    public function setRelatedEntityType(?string $relatedEntityType): static
    {
        $this->relatedEntityType = $relatedEntityType;

        return $this;
    }

    public function getRelatedEntityId(): ?int
    {
        return $this->relatedEntityId;
    }

    public function setRelatedEntityId(?int $relatedEntityId): static
    {
        $this->relatedEntityId = $relatedEntityId;

        return $this;
    }

    public function getActionUrl(): ?string
    {
        return $this->actionUrl;
    }

    public function setActionUrl(?string $actionUrl): static
    {
        $this->actionUrl = $actionUrl;

        return $this;
    }

    public function getActionText(): ?string
    {
        return $this->actionText;
    }

    public function setActionText(?string $actionText): static
    {
        $this->actionText = $actionText;

        return $this;
    }

    public function getMetadata(): array
    {
        return $this->metadata;
    }

    public function setMetadata(?array $metadata): static
    {
        $this->metadata = $metadata ?? [];

        return $this;
    }

    public function isDismissed(): ?bool
    {
        return $this->dismissed;
    }

    public function setDismissed(bool $dismissed): static
    {
        $this->dismissed = $dismissed;

        return $this;
    }
}
