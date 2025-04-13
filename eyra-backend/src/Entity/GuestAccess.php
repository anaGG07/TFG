<?php

namespace App\Entity;

use App\Enum\GuestType;
use App\Repository\GuestAccessRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\HasLifecycleCallbacks;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: GuestAccessRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    normalizationContext: ['groups' => ['guest_access:read']],
    denormalizationContext: ['groups' => ['guest_access:write']],
    operations: [
        new Get(security: "is_granted('VIEW', object)"),
        new GetCollection(),
        new Post(security: "is_granted('ROLE_USER')"),
        new Put(security: "is_granted('EDIT', object)"),
        new Delete(security: "is_granted('DELETE', object)")
    ]
)]
class GuestAccess
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['guest_access:read'])]
private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'guestAccesses')]
    #[Groups(['guest_access:read'])]
private ?User $owner = null;

    #[ORM\ManyToOne(inversedBy: 'guestAccesses')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['guest_access:read', 'guest_access:write'])]
private ?User $guest = null;

    #[ORM\Column(enumType: GuestType::class)]
    #[Groups(['guest_access:read', 'guest_access:write'])]
private ?GuestType $guestType = null;

    #[ORM\Column]
    #[Groups(['guest_access:read', 'guest_access:write'])]
private array $accessTo = [];

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['guest_access:read', 'guest_access:write'])]
private ?\DateTimeInterface $expires_at = null;

    #[ORM\Column]
    #[Groups(['guest_access:read', 'guest_access:write'])]
private ?bool $state = true;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;

        return $this;
    }

    public function getGuest(): ?User
    {
        return $this->guest;
    }

    public function setGuest(?User $guest): static
    {
        $this->guest = $guest;

        return $this;
    }

    public function getGuestType(): ?GuestType
    {
        return $this->guestType;
    }

    public function setGuestType(GuestType $guestType): static
    {
        $this->guestType = $guestType;

        return $this;
    }

    public function getAccessTo(): array
    {
        return $this->accessTo;
    }

    public function setAccessTo(array $accessTo): static
    {
        $this->accessTo = $accessTo;

        return $this;
    }

    public function getExpiresAt(): ?\DateTimeInterface
    {
        return $this->expires_at;
    }

    public function setExpiresAt(\DateTimeInterface $expires_at): static
    {
        $this->expires_at = $expires_at;

        return $this;
    }

    public function getState(): ?bool
    {
        return $this->state;
    }

    public function setState(bool $state): static
    {
        $this->state = $state;

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

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    #[ORM\PrePersist]
    public function setCreatedAtValue(): void
    {
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();
    }

    #[ORM\PreUpdate]
    public function setUpdatedAtValue(): void
    {
        $this->updatedAt = new \DateTime();
    }
    
    /**
     * @var Collection<int, Notification>
     */
    #[ORM\OneToMany(mappedBy: 'guestAccess', targetEntity: Notification::class, cascade: ['persist', 'remove'])]
    #[Groups(['guest_access:read'])]
    private Collection $notifications;

    public function __construct()
    {
        $this->notifications = new ArrayCollection();
    }

    /**
     * @return Collection<int, Notification>
     */
    public function getNotifications(): Collection
    {
        return $this->notifications;
    }

    public function addNotification(Notification $notification): static
    {
        if (!$this->notifications->contains($notification)) {
            $this->notifications->add($notification);
            $notification->setGuestAccess($this);
        }
        return $this;
    }

    public function removeNotification(Notification $notification): static
    {
        if ($this->notifications->removeElement($notification)) {
            if ($notification->getGuestAccess() === $this) {
                $notification->setGuestAccess(null);
            }
        }
        return $this;
    }
}
