<?php

namespace App\Entity;

use App\Repository\HormoneLevelRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\HasLifecycleCallbacks;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Enum\HormoneType;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: HormoneLevelRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    normalizationContext: ['groups' => ['hormone_level:read']],
    denormalizationContext: ['groups' => ['hormone_level:write']],
    operations: [
        new Get(),
        new GetCollection(),
        new Post(security: "is_granted('ROLE_USER')"),
        new Put(security: "is_granted('EDIT', object)")
    ]
)]
class HormoneLevel
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['hormone_level:read', 'cycle_day:read'])]
private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'hormoneLevels')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['hormone_level:read'])]
private ?User $user = null;

    #[ORM\Column(enumType: HormoneType::class)]
    #[Groups(['hormone_level:read', 'hormone_level:write', 'cycle_day:read'])]
    private ?HormoneType $hormoneType = null;

    #[ORM\ManyToOne(inversedBy: 'hormoneLevels')]
    #[Groups(['hormone_level:read'])]
    private ?CycleDay $cycleDay = null;

    #[ORM\Column(type: Types::FLOAT)]
    #[Groups(['hormone_level:read', 'hormone_level:write', 'cycle_day:read'])]
private ?float $level = null;

    #[ORM\Column]
    #[Groups(['hormone_level:read', 'hormone_level:write'])]
private ?bool $state = true;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

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

    public function getHormoneType(): ?HormoneType
    {
        return $this->hormoneType;
    }

    public function setHormoneType(HormoneType $hormoneType): static
    {
        $this->hormoneType = $hormoneType;

        return $this;
    }

    public function getCycleDay(): ?CycleDay
    {
        return $this->cycleDay;
    }

    public function setCycleDay(?CycleDay $cycleDay): static
    {
        $this->cycleDay = $cycleDay;

        return $this;
    }

    public function getLevel(): ?float
    {
        return $this->level;
    }

    public function setLevel(float $level): static
    {
        $this->level = $level;

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

    public function setUpdatedAt(?\DateTimeInterface $updated_at): static
    {
        $this->updatedAt = $updated_at;

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
}
