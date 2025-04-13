<?php

namespace App\Entity;

use Symfony\Component\Serializer\Annotation\Groups;

use App\Repository\PregnancyLogRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity(repositoryClass: PregnancyLogRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    normalizationContext: ['groups' => ['pregnancy:read']],
    denormalizationContext: ['groups' => ['pregnancy:write']]
)]
class PregnancyLog
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['pregnancy:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'pregnancyLogs')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['pregnancy:read'])]
    private ?User $user = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['pregnancy:read', 'pregnancy:write'])]
    private ?\DateTimeInterface $startDate = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['pregnancy:read', 'pregnancy:write'])]
    private ?\DateTimeInterface $dueDate = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['pregnancy:read', 'pregnancy:write'])]
    private ?int $week = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['pregnancy:read', 'pregnancy:write'])]
    private ?string $symptoms = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['pregnancy:read', 'pregnancy:write'])]
    private ?string $fetalMovements = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['pregnancy:read', 'pregnancy:write'])]
    private ?\DateTimeInterface $ultrasoundDate = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['pregnancy:read', 'pregnancy:write'])]
    private ?string $notes = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['pregnancy:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['pregnancy:read'])]
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

    public function getStartDate(): ?\DateTimeInterface
    {
        return $this->startDate;
    }

    public function setStartDate(\DateTimeInterface $startDate): static
    {
        $this->startDate = $startDate;

        return $this;
    }

    public function getDueDate(): ?\DateTimeInterface
    {
        return $this->dueDate;
    }

    public function setDueDate(\DateTimeInterface $dueDate): static
    {
        $this->dueDate = $dueDate;

        return $this;
    }

    public function getWeek(): ?int
    {
        return $this->week;
    }

    public function setWeek(int $week): static
    {
        $this->week = $week;

        return $this;
    }

    public function getSymptoms(): ?string
    {
        return $this->symptoms;
    }

    public function setSymptoms(?string $symptoms): static
    {
        $this->symptoms = $symptoms;

        return $this;
    }

    public function getFetalMovements(): ?string
    {
        return $this->fetalMovements;
    }

    public function setFetalMovements(?string $fetalMovements): static
    {
        $this->fetalMovements = $fetalMovements;

        return $this;
    }

    public function getUltrasoundDate(): ?\DateTimeInterface
    {
        return $this->ultrasoundDate;
    }

    public function setUltrasoundDate(?\DateTimeInterface $ultrasoundDate): static
    {
        $this->ultrasoundDate = $ultrasoundDate;

        return $this;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): static
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
