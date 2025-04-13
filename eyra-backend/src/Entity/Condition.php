<?php

namespace App\Entity;

use App\Repository\ConditionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ConditionRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    normalizationContext: ['groups' => ['condition:read']],
    denormalizationContext: ['groups' => ['condition:write']],
    operations: [
        new Get(),
        new GetCollection()
    ]
)]
class Condition
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['condition:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['condition:read', 'condition:write'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['condition:read', 'condition:write'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['condition:read', 'condition:write'])]
    private ?bool $isChronic = false;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['condition:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['condition:read'])]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\Column]
    #[Groups(['condition:read', 'condition:write'])]
    private ?bool $state = true;

    /**
     * @var Collection<int, UserCondition>
     */
    #[ORM\OneToMany(targetEntity: UserCondition::class, mappedBy: 'condition')]
    private Collection $userConditions;

    /**
     * @var Collection<int, Notification>
     */
    #[ORM\OneToMany(targetEntity: Notification::class, mappedBy: 'relatedCondition')]
    private Collection $notifications;

    /**
     * @var Collection<int, Content>
     */
    #[ORM\ManyToMany(targetEntity: Content::class, mappedBy: 'relatedConditions')]
    #[Groups(['condition:read'])]
    private Collection $relatedContent;

    public function __construct()
    {
        $this->userConditions = new ArrayCollection();
        $this->notifications = new ArrayCollection();
        $this->relatedContent = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getIsChronic(): ?bool
    {
        return $this->isChronic;
    }

    public function setIsChronic(bool $isChronic): static
    {
        $this->isChronic = $isChronic;

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


    public function getState(): ?bool
    {
        return $this->state;
    }

    public function setState(bool $state): static
    {
        $this->state = $state;

        return $this;
    }

    /**
     * @return Collection<int, UserCondition>
     */
    public function getUserConditions(): Collection
    {
        return $this->userConditions;
    }

    public function addUserCondition(UserCondition $userCondition): static
    {
        if (!$this->userConditions->contains($userCondition)) {
            $this->userConditions->add($userCondition);
            $userCondition->setCondition($this);
        }

        return $this;
    }

    public function removeUserCondition(UserCondition $userCondition): static
    {
        if ($this->userConditions->removeElement($userCondition)) {
            // set the owning side to null (unless already changed)
            if ($userCondition->getCondition() === $this) {
                $userCondition->setCondition(null);
            }
        }

        return $this;
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
            $notification->setRelatedCondition($this);
        }

        return $this;
    }

    public function removeNotification(Notification $notification): static
    {
        if ($this->notifications->removeElement($notification)) {
            // set the owning side to null (unless already changed)
            if ($notification->getRelatedCondition() === $this) {
                $notification->setRelatedCondition(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Content>
     */
    public function getRelatedContent(): Collection
    {
        return $this->relatedContent;
    }

    public function addRelatedContent(Content $content): static
    {
        if (!$this->relatedContent->contains($content)) {
            $this->relatedContent->add($content);
            $content->addRelatedCondition($this);
        }

        return $this;
    }

    public function removeRelatedContent(Content $content): static
    {
        if ($this->relatedContent->removeElement($content)) {
            $content->removeRelatedCondition($this);
        }

        return $this;
    }
}
