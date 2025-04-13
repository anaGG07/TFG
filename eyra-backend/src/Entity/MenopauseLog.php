<?php

namespace App\Entity;

use Symfony\Component\Serializer\Annotation\Groups;

use App\Repository\MenopauseLogRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity(repositoryClass: MenopauseLogRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    normalizationContext: ['groups' => ['menopause:read']],
    denormalizationContext: ['groups' => ['menopause:write']]
)]
class MenopauseLog
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['menopause:read'])]
    private ?int $id = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['menopause:read'])]
    private ?User $user = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['menopause:read', 'menopause:write'])]
    private ?bool $hotFlashes = false;

    #[ORM\Column(nullable: true)]
    #[Groups(['menopause:read', 'menopause:write'])]
    private ?bool $moodSwings = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['menopause:read', 'menopause:write'])]
    private ?bool $vaginalDryness = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['menopause:read', 'menopause:write'])]
    private ?bool $insomnia = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['menopause:read', 'menopause:write'])]
    private ?bool $hormoneTherapy = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['menopause:read', 'menopause:write'])]
    private ?string $notes = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['menopause:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['menopause:read'])]
    private ?\DateTimeInterface $updatedAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function isHotFlashes(): ?bool
    {
        return $this->hotFlashes;
    }

    public function setHotFlashes(bool $hotFlashes): static
    {
        $this->hotFlashes = $hotFlashes;

        return $this;
    }

    public function isMoodSwings(): ?bool
    {
        return $this->moodSwings;
    }

    public function setMoodSwings(bool $moodSwings): static
    {
        $this->moodSwings = $moodSwings;

        return $this;
    }

    public function isVaginalDryness(): ?bool
    {
        return $this->vaginalDryness;
    }

    public function setVaginalDryness(bool $vaginalDryness): static
    {
        $this->vaginalDryness = $vaginalDryness;

        return $this;
    }

    public function isInsomnia(): ?bool
    {
        return $this->insomnia;
    }

    public function setInsomnia(bool $insomnia): static
    {
        $this->insomnia = $insomnia;

        return $this;
    }

    public function isHormoneTherapy(): ?bool
    {
        return $this->hormoneTherapy;
    }

    public function setHormoneTherapy(bool $hormoneTherapy): static
    {
        $this->hormoneTherapy = $hormoneTherapy;

        return $this;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(string $notes): static
    {
        $this->notes = $notes;

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
}
