<?php

namespace App\Entity;

use App\Enum\ProfileType;
use App\Enum\HormoneType;
use App\Repository\OnboardingRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: OnboardingRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Onboarding
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['onboarding:read'])]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'onboarding', targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['onboarding:read'])]
    private ?User $user = null;

    #[ORM\Column(enumType: ProfileType::class)]
    #[Assert\NotNull(message: 'El tipo de perfil es obligatorio')]
    #[Groups(['onboarding:read', 'onboarding:write', 'user:read'])]
    private ?ProfileType $profileType = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'La identidad de género es obligatoria')]
    #[Groups(['onboarding:read', 'onboarding:write', 'user:read'])]
    private ?string $genderIdentity = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['onboarding:read', 'onboarding:write', 'user:read'])]
    private ?string $pronouns = null;

    #[ORM\Column]
    #[Groups(['onboarding:read', 'onboarding:write', 'user:read'])]
    private bool $isPersonal = true;

    #[ORM\Column(length: 50)]
    #[Assert\NotBlank(message: 'La etapa de vida es obligatoria')]
    #[Groups(['onboarding:read', 'onboarding:write', 'user:read'])]
    private ?string $stageOfLife = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['onboarding:read', 'onboarding:write', 'user:read'])]
    private ?\DateTimeInterface $lastPeriodDate = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['onboarding:read', 'onboarding:write', 'user:read'])]
    private ?int $averageCycleLength = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['onboarding:read', 'onboarding:write', 'user:read'])]
    private ?int $averagePeriodLength = null;

    #[ORM\Column(enumType: HormoneType::class, nullable: true)]
    #[Groups(['onboarding:read', 'onboarding:write', 'user:read'])]
    private ?HormoneType $hormoneType = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['onboarding:read', 'onboarding:write', 'user:read'])]
    private ?\DateTimeInterface $hormoneStartDate = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['onboarding:read', 'onboarding:write', 'user:read'])]
    private ?int $hormoneFrequencyDays = null;

    #[ORM\Column]
    #[Groups(['onboarding:read', 'onboarding:write', 'user:read'])]
    private bool $receiveAlerts = true;

    #[ORM\Column]
    #[Groups(['onboarding:read', 'onboarding:write', 'user:read'])]
    private bool $receiveRecommendations = true;

    #[ORM\Column]
    #[Groups(['onboarding:read', 'onboarding:write', 'user:read'])]
    private bool $receiveCyclePhaseTips = true;

    #[ORM\Column]
    #[Groups(['onboarding:read', 'onboarding:write', 'user:read'])]
    private bool $receiveWorkoutSuggestions = true;

    #[ORM\Column]
    #[Groups(['onboarding:read', 'onboarding:write', 'user:read'])]
    private bool $receiveNutritionAdvice = true;

    #[ORM\Column]
    #[Groups(['onboarding:read', 'onboarding:write', 'user:read'])]
    private bool $shareCycleWithPartner = false;

    #[ORM\Column]
    #[Groups(['onboarding:read', 'onboarding:write', 'user:read'])]
    private bool $wantAiCompanion = true;

    #[ORM\Column(type: Types::JSON)]
    #[Groups(['onboarding:read', 'onboarding:write', 'user:read'])]
    private array $healthConcerns = [];

    #[ORM\Column(length: 20, nullable: true)]
    #[Groups(['onboarding:read', 'onboarding:write'])]
    private ?string $accessCode = null;

    #[ORM\Column]
    #[Groups(['onboarding:read', 'onboarding:write', 'user:read'])]
    private bool $allowParentalMonitoring = false;

    #[ORM\Column(type: Types::JSON)]
    #[Groups(['onboarding:read', 'onboarding:write', 'user:read'])]
    private array $commonSymptoms = [];

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['onboarding:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['onboarding:read'])]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\Column]
    #[Groups(['onboarding:read', 'onboarding:write', 'user:read'])]
    private bool $completed = false;

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

    public function getProfileType(): ?ProfileType
    {
        return $this->profileType;
    }

    public function setProfileType(ProfileType $profileType): static
    {
        $this->profileType = $profileType;

        return $this;
    }

    public function getGenderIdentity(): ?string
    {
        return $this->genderIdentity;
    }

    public function setGenderIdentity(string $genderIdentity): static
    {
        $this->genderIdentity = $genderIdentity;

        return $this;
    }

    public function getPronouns(): ?string
    {
        return $this->pronouns;
    }

    public function setPronouns(?string $pronouns): static
    {
        $this->pronouns = $pronouns;

        return $this;
    }

    public function isIsPersonal(): bool
    {
        return $this->isPersonal;
    }

    public function setIsPersonal(bool $isPersonal): static
    {
        $this->isPersonal = $isPersonal;

        return $this;
    }

    public function getStageOfLife(): ?string
    {
        return $this->stageOfLife;
    }

    public function setStageOfLife(string $stageOfLife): static
    {
        $this->stageOfLife = $stageOfLife;

        return $this;
    }

    public function getLastPeriodDate(): ?\DateTimeInterface
    {
        return $this->lastPeriodDate;
    }

    public function setLastPeriodDate(?\DateTimeInterface $lastPeriodDate): static
    {
        $this->lastPeriodDate = $lastPeriodDate;

        return $this;
    }

    public function getAverageCycleLength(): ?int
    {
        return $this->averageCycleLength;
    }

    public function setAverageCycleLength(?int $averageCycleLength): static
    {
        $this->averageCycleLength = $averageCycleLength;

        return $this;
    }

    public function getAveragePeriodLength(): ?int
    {
        return $this->averagePeriodLength;
    }

    public function setAveragePeriodLength(?int $averagePeriodLength): static
    {
        $this->averagePeriodLength = $averagePeriodLength;

        return $this;
    }

    public function getHormoneType(): ?HormoneType
    {
        return $this->hormoneType;
    }

    public function setHormoneType(?HormoneType $hormoneType): static
    {
        $this->hormoneType = $hormoneType;

        return $this;
    }

    public function getHormoneStartDate(): ?\DateTimeInterface
    {
        return $this->hormoneStartDate;
    }

    public function setHormoneStartDate(?\DateTimeInterface $hormoneStartDate): static
    {
        $this->hormoneStartDate = $hormoneStartDate;

        return $this;
    }

    public function getHormoneFrequencyDays(): ?int
    {
        return $this->hormoneFrequencyDays;
    }

    public function setHormoneFrequencyDays(?int $hormoneFrequencyDays): static
    {
        $this->hormoneFrequencyDays = $hormoneFrequencyDays;

        return $this;
    }

    public function isReceiveAlerts(): bool
    {
        return $this->receiveAlerts;
    }

    public function setReceiveAlerts(bool $receiveAlerts): static
    {
        $this->receiveAlerts = $receiveAlerts;

        return $this;
    }

    public function isReceiveRecommendations(): bool
    {
        return $this->receiveRecommendations;
    }

    public function setReceiveRecommendations(bool $receiveRecommendations): static
    {
        $this->receiveRecommendations = $receiveRecommendations;

        return $this;
    }

    public function isReceiveCyclePhaseTips(): bool
    {
        return $this->receiveCyclePhaseTips;
    }

    public function setReceiveCyclePhaseTips(bool $receiveCyclePhaseTips): static
    {
        $this->receiveCyclePhaseTips = $receiveCyclePhaseTips;

        return $this;
    }

    public function isReceiveWorkoutSuggestions(): bool
    {
        return $this->receiveWorkoutSuggestions;
    }

    public function setReceiveWorkoutSuggestions(bool $receiveWorkoutSuggestions): static
    {
        $this->receiveWorkoutSuggestions = $receiveWorkoutSuggestions;

        return $this;
    }

    public function isReceiveNutritionAdvice(): bool
    {
        return $this->receiveNutritionAdvice;
    }

    public function setReceiveNutritionAdvice(bool $receiveNutritionAdvice): static
    {
        $this->receiveNutritionAdvice = $receiveNutritionAdvice;

        return $this;
    }

    public function isShareCycleWithPartner(): bool
    {
        return $this->shareCycleWithPartner;
    }

    public function setShareCycleWithPartner(bool $shareCycleWithPartner): static
    {
        $this->shareCycleWithPartner = $shareCycleWithPartner;

        return $this;
    }

    public function isWantAiCompanion(): bool
    {
        return $this->wantAiCompanion;
    }

    public function setWantAiCompanion(bool $wantAiCompanion): static
    {
        $this->wantAiCompanion = $wantAiCompanion;

        return $this;
    }

    public function getHealthConcerns(): array
    {
        return $this->healthConcerns;
    }

    public function setHealthConcerns(array $healthConcerns): static
    {
        $this->healthConcerns = $healthConcerns;

        return $this;
    }

    public function getAccessCode(): ?string
    {
        return $this->accessCode;
    }

    public function setAccessCode(?string $accessCode): static
    {
        $this->accessCode = $accessCode;

        return $this;
    }

    public function isAllowParentalMonitoring(): bool
    {
        return $this->allowParentalMonitoring;
    }

    public function setAllowParentalMonitoring(bool $allowParentalMonitoring): static
    {
        $this->allowParentalMonitoring = $allowParentalMonitoring;

        return $this;
    }

    public function getCommonSymptoms(): array
    {
        return $this->commonSymptoms;
    }

    public function setCommonSymptoms(array $commonSymptoms): static
    {
        $this->commonSymptoms = $commonSymptoms;

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

    public function isCompleted(): bool
    {
        return $this->completed;
    }

    public function setCompleted(bool $completed): static
    {
        $this->completed = $completed;

        return $this;
    }

    #[ORM\PrePersist]
    public function setCreatedAtValue(): void
    {
        $this->createdAt = new \DateTime();
    }

    #[ORM\PreUpdate]
    public function setUpdatedAtValue(): void
    {
        $this->updatedAt = new \DateTime();
    }
}
