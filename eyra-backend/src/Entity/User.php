<?php

namespace App\Entity;

use App\Enum\ProfileType;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use App\Entity\GuestAccess;
use App\Entity\AIQuery;


#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    normalizationContext: ['groups' => ['user:read']],
    denormalizationContext: ['groups' => ['user:write']],
    operations: [
        new Get(security: "is_granted('VIEW', object)"),
        new GetCollection(security: "is_granted('ROLE_ADMIN')"),
        new Post(),
        new Put(security: "is_granted('EDIT', object)")
    ]
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Groups(['user:read', 'user:write'])]
    #[Assert\NotBlank(message: "El email es obligatorio")]
    #[Assert\Email(message: "El email {{ value }} no es válido")]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    #[Groups(['user:read', 'user:write'])]
    private array $roles = ['ROLE_USER'];


    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    #[Groups(['user:write'])]
    #[Assert\NotBlank(message: "La contraseña es obligatoria", groups: ['create'])]
    #[Assert\Length(min: 8, minMessage: "La contraseña debe tener al menos {{ limit }} caracteres")]
    private ?string $password = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read', 'user:write'])]
    #[Assert\NotBlank(message: "El nombre de usuario es obligatorio")]
    private ?string $username = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read', 'user:write'])]
    #[Assert\NotBlank(message: "El nombre es obligatorio")]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read', 'user:write'])]
    #[Assert\NotBlank(message: "El apellido es obligatorio")]
    private ?string $lastName = null;

    #[ORM\Column(enumType: ProfileType::class)]
    #[Groups(['user:read', 'user:write'])]
    private ?ProfileType $profileType = ProfileType::GUEST;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $genderIdentity = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['user:read', 'user:write'])]
    #[Assert\NotBlank(message: "La fecha de nacimiento es obligatoria")]
    #[Assert\LessThanOrEqual("today", message: "La fecha de nacimiento no puede ser futura")]
    private ?\DateTimeInterface $birthDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['user:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['user:read'])]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\Column]
    #[Groups(['user:read', 'user:write'])]
    private ?bool $state = true;

    #[ORM\Column(options: ["default" => false])]
    #[Groups(['user:read', 'user:write'])]
    private ?bool $onboardingCompleted = false;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: AIQuery::class)]
    private Collection $aiQueries;


    #[ORM\OneToMany(mappedBy: 'owner', targetEntity: GuestAccess::class)]
    private Collection $ownedGuestAccesses;

    /**
     * @var Collection<int, UserCondition>
     */
    #[ORM\OneToMany(targetEntity: UserCondition::class, mappedBy: 'user')]
    private Collection $userConditions;

    /**
     * @var Collection<int, MenstrualCycle>
     */
    #[ORM\OneToMany(mappedBy: 'user', targetEntity: MenstrualCycle::class)]
    private Collection $menstrualCycles;


    /**
     * @var Collection<int, PregnancyLog>
     */
    #[ORM\OneToMany(targetEntity: PregnancyLog::class, mappedBy: 'user')]
    private Collection $pregnancyLogs;

    /**
     * @var Collection<int, Notification>
     */
    #[ORM\OneToMany(targetEntity: Notification::class, mappedBy: 'user')]
    private Collection $notifications;

    /**
     * @var Collection<int, HormoneLevel>
     */
    #[ORM\OneToMany(targetEntity: HormoneLevel::class, mappedBy: 'user')]
    private Collection $hormoneLevels;

    /**
     * @var Collection<int, SymptomLog>
     */
    #[ORM\OneToMany(targetEntity: SymptomLog::class, mappedBy: 'user')]
    private Collection $symptomLogs;

    /**
     * @var Collection<int, GuestAccess>
     */
    #[ORM\OneToMany(mappedBy: 'guest', targetEntity: GuestAccess::class)]
    private Collection $guestAccesses;

    public function __construct()
    {
        $this->userConditions = new ArrayCollection();
        $this->menstrualCycles = new ArrayCollection();
        $this->pregnancyLogs = new ArrayCollection();
        $this->notifications = new ArrayCollection();
        $this->hormoneLevels = new ArrayCollection();
        $this->symptomLogs = new ArrayCollection();
        $this->guestAccesses = new ArrayCollection();
        $this->ownedGuestAccesses = new ArrayCollection();
        $this->aiQueries = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getOwnedGuestAccesses(): Collection
    {
        return $this->ownedGuestAccesses;
    }

    public function addGuestInvitation(GuestAccess $guestAccess): static
    {
        if (!$this->ownedGuestAccesses->contains($guestAccess)) {
            $this->ownedGuestAccesses->add($guestAccess);
            $guestAccess->setGuest($this);
        }

        return $this;
    }

    public function removeGuestInvitation(GuestAccess $guestAccess): static
    {
        if ($this->ownedGuestAccesses->removeElement($guestAccess)) {
            if ($guestAccess->getGuest() === $this) {
                $guestAccess->setGuest(null);
            }
        }

        return $this;
    }


    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
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

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): static
    {
        $this->lastName = $lastName;

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

    public function getBirthDate(): ?\DateTimeInterface
    {
        return $this->birthDate;
    }

    public function setBirthDate(\DateTimeInterface $birthDate): static
    {
        $this->birthDate = $birthDate;

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
        $this->updatedAt = new \DateTime(); // Opcional: se puede setear en PrePersist también
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
            $userCondition->setUser($this);
        }

        return $this;
    }

    public function removeUserCondition(UserCondition $userCondition): static
    {
        if ($this->userConditions->removeElement($userCondition)) {
            // set the owning side to null (unless already changed)
            if ($userCondition->getUser() === $this) {
                $userCondition->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, MenstrualCycle>
     */
    public function getMenstrualCycles(): Collection
    {
        return $this->menstrualCycles;
    }

    public function addMenstrualCycle(MenstrualCycle $menstrualCycle): static
    {
        if (!$this->menstrualCycles->contains($menstrualCycle)) {
            $this->menstrualCycles->add($menstrualCycle);
            $menstrualCycle->setUser($this);
        }

        return $this;
    }

    public function removeMenstrualCycle(MenstrualCycle $menstrualCycle): static
    {
        if ($this->menstrualCycles->removeElement($menstrualCycle)) {
            // set the owning side to null (unless already changed)
            if ($menstrualCycle->getUser() === $this) {
                $menstrualCycle->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, PregnancyLog>
     */
    public function getPregnancyLogs(): Collection
    {
        return $this->pregnancyLogs;
    }

    public function addPregnancyLog(PregnancyLog $pregnancyLog): static
    {
        if (!$this->pregnancyLogs->contains($pregnancyLog)) {
            $this->pregnancyLogs->add($pregnancyLog);
            $pregnancyLog->setUser($this);
        }

        return $this;
    }

    public function removePregnancyLog(PregnancyLog $pregnancyLog): static
    {
        if ($this->pregnancyLogs->removeElement($pregnancyLog)) {
            // set the owning side to null (unless already changed)
            if ($pregnancyLog->getUser() === $this) {
                $pregnancyLog->setUser(null);
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
            $notification->setUser($this);
        }

        return $this;
    }

    public function removeNotification(Notification $notification): static
    {
        if ($this->notifications->removeElement($notification)) {
            // set the owning side to null (unless already changed)
            if ($notification->getUser() === $this) {
                $notification->setUser(null);
            }
        }

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
            $hormoneLevel->setUser($this);
        }

        return $this;
    }

    public function removeHormoneLevel(HormoneLevel $hormoneLevel): static
    {
        if ($this->hormoneLevels->removeElement($hormoneLevel)) {
            // set the owning side to null (unless already changed)
            if ($hormoneLevel->getUser() === $this) {
                $hormoneLevel->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, SymptomLog>
     */
    public function getSymptomLogs(): Collection
    {
        return $this->symptomLogs;
    }

    public function addSymptomLog(SymptomLog $symptomLog): static
    {
        if (!$this->symptomLogs->contains($symptomLog)) {
            $this->symptomLogs->add($symptomLog);
            $symptomLog->setUser($this);
        }

        return $this;
    }

    public function removeSymptomLog(SymptomLog $symptomLog): static
    {
        if ($this->symptomLogs->removeElement($symptomLog)) {
            // set the owning side to null (unless already changed)
            if ($symptomLog->getUser() === $this) {
                $symptomLog->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, GuestAccess>
     */
    public function getGuestAccesses(): Collection
    {
        return $this->guestAccesses;
    }

    public function addGuestAccess(GuestAccess $guestAccess): static
    {
        if (!$this->guestAccesses->contains($guestAccess)) {
            $this->guestAccesses->add($guestAccess);
            $guestAccess->setOwner($this);
        }

        return $this;
    }

    public function removeGuestAccess(GuestAccess $guestAccess): static
    {
        if ($this->guestAccesses->removeElement($guestAccess)) {
            // set the owning side to null (unless already changed)
            if ($guestAccess->getOwner() === $this) {
                $guestAccess->setOwner(null);
            }
        }

        return $this;
    }

    public function isOnboardingCompleted(): ?bool
    {
        return $this->onboardingCompleted;
    }

    public function setOnboardingCompleted(bool $onboardingCompleted): static
    {
        $this->onboardingCompleted = $onboardingCompleted;

        return $this;
    }
}
