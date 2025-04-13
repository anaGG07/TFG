<?php

namespace App\Entity;

use App\Repository\MenstrualCycleRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\HasLifecycleCallbacks;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\OpenApi\Model;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: MenstrualCycleRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    normalizationContext: ['groups' => ['menstrual_cycle:read']],
    denormalizationContext: ['groups' => ['menstrual_cycle:write']],
    operations: [
        new Get(
            openapi: new Model\Operation(
                summary: 'Obtiene un ciclo menstrual específico',
                description: 'Recupera todos los detalles de un ciclo menstrual basado en su ID',
                security: [['bearerAuth' => []]]
            )
        ),
        new GetCollection(
            openapi: new Model\Operation(
                summary: 'Obtiene la colección de ciclos menstruales',
                description: 'Recupera la lista de ciclos menstruales del usuario autenticado',
                security: [['bearerAuth' => []]]
            )
        ),
        new Post(
            openapi: new Model\Operation(
                summary: 'Crea un nuevo ciclo menstrual',
                description: 'Crea un registro de ciclo menstrual para el usuario autenticado',
                security: [['bearerAuth' => []]]
            )
        ),
        new Put(
            openapi: new Model\Operation(
                summary: 'Actualiza un ciclo menstrual existente',
                description: 'Actualiza la información de un ciclo menstrual específico',
                security: [['bearerAuth' => []]]
            )
        ),
        new Delete(
            openapi: new Model\Operation(
                summary: 'Elimina un ciclo menstrual',
                description: 'Elimina un registro de ciclo menstrual específico',
                security: [['bearerAuth' => []]]
            )
        )
    ]
)]
class MenstrualCycle
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['menstrual_cycle:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'menstrualCycles')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['menstrual_cycle:read'])]
    private ?User $user = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['menstrual_cycle:read', 'menstrual_cycle:write'])]
    private ?\DateTimeInterface $startDate = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['menstrual_cycle:read', 'menstrual_cycle:write'])]
    private ?\DateTimeInterface $endDate = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['menstrual_cycle:read', 'menstrual_cycle:write'])]
    private ?\DateTimeInterface $estimatedNextStart = null;

    #[ORM\Column]
    #[Groups(['menstrual_cycle:read', 'menstrual_cycle:write'])]
    private ?int $averageCycleLength = null;

    #[ORM\Column]
    #[Groups(['menstrual_cycle:read', 'menstrual_cycle:write'])]
    private ?int $averageDuration = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['menstrual_cycle:read', 'menstrual_cycle:write'])]
    private ?string $flowAmount = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['menstrual_cycle:read', 'menstrual_cycle:write'])]
    private ?string $flowColor = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['menstrual_cycle:read', 'menstrual_cycle:write'])]
    private ?string $flowOdor = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['menstrual_cycle:read', 'menstrual_cycle:write'])]
    private ?int $painLevel = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['menstrual_cycle:read', 'menstrual_cycle:write'])]
    private ?string $notes = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    /**
     * @var Collection<int, CycleDay>
     */
    #[ORM\OneToMany(mappedBy: 'cycle', targetEntity: CycleDay::class, cascade: ['persist', 'remove'])]
    #[Groups(['menstrual_cycle:read'])]
    private Collection $cycleDays;

    public function __construct()
    {
        $this->cycleDays = new ArrayCollection();
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

    public function getStartDate(): ?\DateTimeInterface
    {
        return $this->startDate;
    }

    public function setStartDate(\DateTimeInterface $startDate): static
    {
        $this->startDate = $startDate;

        return $this;
    }

    public function getEndDate(): ?\DateTimeInterface
    {
        return $this->endDate;
    }

    public function setEndDate(\DateTimeInterface $endDate): static
    {
        $this->endDate = $endDate;

        return $this;
    }

    public function getEstimatedNextStart(): ?\DateTimeInterface
    {
        return $this->estimatedNextStart;
    }

    public function setEstimatedNextStart(\DateTimeInterface $estimatedNextStart): static
    {
        $this->estimatedNextStart = $estimatedNextStart;

        return $this;
    }

    public function getAverageCycleLength(): ?int
    {
        return $this->averageCycleLength;
    }

    public function setAverageCycleLength(int $averageCycleLength): static
    {
        $this->averageCycleLength = $averageCycleLength;

        return $this;
    }

    public function getAverageDuration(): ?int
    {
        return $this->averageDuration;
    }

    public function setAverageDuration(int $averageDuration): static
    {
        $this->averageDuration = $averageDuration;

        return $this;
    }

    public function getFlowAmount(): ?string
    {
        return $this->flowAmount;
    }

    public function setFlowAmount(?string $flowAmount): static
    {
        $this->flowAmount = $flowAmount;

        return $this;
    }

    public function getFlowColor(): ?string
    {
        return $this->flowColor;
    }

    public function setFlowColor(?string $flowColor): static
    {
        $this->flowColor = $flowColor;

        return $this;
    }

    public function getFlowOdor(): ?string
    {
        return $this->flowOdor;
    }

    public function setFlowOdor(?string $flowOdor): static
    {
        $this->flowOdor = $flowOdor;

        return $this;
    }

    public function getPainLevel(): ?int
    {
        return $this->painLevel;
    }

    public function setPainLevel(?int $painLevel): static
    {
        $this->painLevel = $painLevel;

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

    /**
     * @return Collection<int, CycleDay>
     */
    public function getCycleDays(): Collection
    {
        return $this->cycleDays;
    }

    public function addCycleDay(CycleDay $cycleDay): static
    {
        if (!$this->cycleDays->contains($cycleDay)) {
            $this->cycleDays->add($cycleDay);
            $cycleDay->setCycle($this);
        }
        return $this;
    }

    public function removeCycleDay(CycleDay $cycleDay): static
    {
        if ($this->cycleDays->removeElement($cycleDay)) {
            if ($cycleDay->getCycle() === $this) {
                $cycleDay->setCycle(null);
            }
        }
        return $this;
    }
}
