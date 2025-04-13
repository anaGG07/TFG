<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Enum\CyclePhase;
use App\Repository\CycleDayRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CycleDayRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    normalizationContext: ['groups' => ['cycle_day:read']],
    denormalizationContext: ['groups' => ['cycle_day:write']],
    operations: [
        new Get(security: "is_granted('VIEW', object)"),
        new GetCollection(),
        new Post(security: "is_granted('ROLE_USER')"),
        new Put(security: "is_granted('EDIT', object)")
    ]
)]
class CycleDay
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['cycle_day:read', 'menstrual_cycle:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'cycleDays')]
    #[ORM\JoinColumn(nullable: false)]
    private ?MenstrualCycle $cycle = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['cycle_day:read', 'cycle_day:write', 'menstrual_cycle:read'])]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(type: Types::SMALLINT)]
    #[Groups(['cycle_day:read', 'menstrual_cycle:read'])]
    private ?int $dayNumber = null;

    #[ORM\Column(enumType: CyclePhase::class)]
    #[Groups(['cycle_day:read', 'cycle_day:write', 'menstrual_cycle:read'])]
    private ?CyclePhase $phase = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['cycle_day:read', 'cycle_day:write'])]
    private array $symptoms = [];

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['cycle_day:read', 'cycle_day:write'])]
    private array $notes = [];

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['cycle_day:read', 'cycle_day:write'])]
    private array $mood = [];

    #[ORM\Column(type: Types::SMALLINT, nullable: true)]
    #[Groups(['cycle_day:read', 'cycle_day:write'])]
    private ?int $flowIntensity = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\OneToMany(mappedBy: 'cycleDay', targetEntity: HormoneLevel::class, cascade: ['persist', 'remove'])]
    #[Groups(['cycle_day:read'])]
    private Collection $hormoneLevels;

    public function __construct()
    {
        $this->hormoneLevels = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCycle(): ?MenstrualCycle
    {
        return $this->cycle;
    }

    public function setCycle(?MenstrualCycle $cycle): static
    {
        $this->cycle = $cycle;
        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;
        return $this;
    }

    public function getDayNumber(): ?int
    {
        return $this->dayNumber;
    }

    public function setDayNumber(int $dayNumber): static
    {
        $this->dayNumber = $dayNumber;
        return $this;
    }

    public function getPhase(): ?CyclePhase
    {
        return $this->phase;
    }

    public function setPhase(CyclePhase $phase): static
    {
        $this->phase = $phase;
        return $this;
    }

    public function getSymptoms(): array
    {
        return $this->symptoms;
    }

    public function setSymptoms(?array $symptoms): static
    {
        $this->symptoms = $symptoms;
        return $this;
    }

    public function getNotes(): array
    {
        return $this->notes;
    }

    public function setNotes(?array $notes): static
    {
        $this->notes = $notes;
        return $this;
    }

    public function getMood(): array
    {
        return $this->mood;
    }

    public function setMood(?array $mood): static
    {
        $this->mood = $mood;
        return $this;
    }

    public function getFlowIntensity(): ?int
    {
        return $this->flowIntensity;
    }

    public function setFlowIntensity(?int $flowIntensity): static
    {
        $this->flowIntensity = $flowIntensity;
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

    /**
     * @return Collection<int, HormoneLevel>
     */
    public function getHormoneLevels(): Collection
    {
        return $this->hormoneLevels;
    }

    public function addHormoneLevel(HormoneLevel $hormoneLevel): static
    {
        if (!$this->hormoneLevels->contains($hormoneLevel)) {
            $this->hormoneLevels->add($hormoneLevel);
            $hormoneLevel->setCycleDay($this);
        }
        return $this;
    }

    public function removeHormoneLevel(HormoneLevel $hormoneLevel): static
    {
        if ($this->hormoneLevels->removeElement($hormoneLevel)) {
            if ($hormoneLevel->getCycleDay() === $this) {
                $hormoneLevel->setCycleDay(null);
            }
        }
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
