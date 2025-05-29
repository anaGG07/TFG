<?php

namespace App\Entity;

use App\Repository\InvitationCodeRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

// ! 28/05/2025 - Entidad creada para gestionar códigos de invitación temporales

#[ORM\Entity(repositoryClass: InvitationCodeRepository::class)]
#[ORM\Table(name: 'invitation_code')]
class InvitationCode
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    // ! 28/05/2025 - Código único alfanumérico de 8 caracteres
    #[ORM\Column(length: 10, unique: true)]
    #[Assert\NotBlank]
    private string $code;

    // ! 28/05/2025 - Usuario que genera el código de invitación
    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private User $creator;

    // ! 28/05/2025 - Tipo de invitado (partner, friend, parental, healthcare_provider)
    #[ORM\Column(length: 50)]
    #[Assert\NotBlank]
    #[Assert\Choice(callback: 'getValidGuestTypes')]
    private string $guestType;

    // ! 28/05/2025 - Permisos específicos otorgados con este código
    #[ORM\Column(type: 'json')]
    private array $accessPermissions = [];

    // ! 28/05/2025 - Fecha de creación del código
    #[ORM\Column(type: 'datetime_immutable')]
    private \DateTimeImmutable $createdAt;

    // ! 28/05/2025 - Fecha de expiración del código
    #[ORM\Column(type: 'datetime')]
    private \DateTime $expiresAt;

    // ! 28/05/2025 - Estado del código (active, used, expired, revoked)
    #[ORM\Column(length: 20)]
    #[Assert\Choice(choices: ['active', 'used', 'expired', 'revoked'])]
    private string $status = 'active';

    // ! 28/05/2025 - Usuario que canjeó el código
    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: true)]
    private ?User $redeemedBy = null;

    // ! 28/05/2025 - Fecha cuando se canjeó el código
    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTime $redeemedAt = null;

    public function __construct(User $creator, string $guestType, array $accessPermissions, \DateTime $expiresAt)
    {
        $this->creator = $creator;
        $this->guestType = $guestType;
        $this->accessPermissions = $accessPermissions;
        $this->expiresAt = $expiresAt;
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCode(): string
    {
        return $this->code;
    }

    public function setCode(string $code): self
    {
        $this->code = $code;
        return $this;
    }

    public function getCreator(): User
    {
        return $this->creator;
    }

    public function setCreator(User $creator): self
    {
        $this->creator = $creator;
        return $this;
    }

    public function getGuestType(): string
    {
        return $this->guestType;
    }

    public function setGuestType(string $guestType): self
    {
        $this->guestType = $guestType;
        return $this;
    }

    public function getAccessPermissions(): array
    {
        return $this->accessPermissions;
    }

    public function setAccessPermissions(array $accessPermissions): self
    {
        $this->accessPermissions = $accessPermissions;
        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getExpiresAt(): \DateTime
    {
        return $this->expiresAt;
    }

    public function setExpiresAt(\DateTime $expiresAt): self
    {
        $this->expiresAt = $expiresAt;
        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;
        return $this;
    }

    public function getRedeemedBy(): ?User
    {
        return $this->redeemedBy;
    }

    public function setRedeemedBy(?User $redeemedBy): self
    {
        $this->redeemedBy = $redeemedBy;
        return $this;
    }

    public function getRedeemedAt(): ?\DateTime
    {
        return $this->redeemedAt;
    }

    public function setRedeemedAt(?\DateTime $redeemedAt): self
    {
        $this->redeemedAt = $redeemedAt;
        return $this;
    }

    // ! 28/05/2025 - Determina si el código sigue siendo válido para usar
    public function isValid(): bool
    {
        return $this->status === 'active' && $this->expiresAt > new \DateTime();
    }

    // ! 28/05/2025 - Marca el código como canjeado por un usuario
    public function redeem(User $user): void
    {
        if (!$this->isValid()) {
            throw new \LogicException('This invitation code is no longer valid');
        }

        $this->redeemedBy = $user;
        $this->redeemedAt = new \DateTime();
        $this->status = 'used';
    }

    // ! 28/05/2025 - Marca el código como revocado
    public function revoke(): void
    {
        if ($this->status === 'used') {
            throw new \LogicException('Cannot revoke a code that has already been used');
        }

        $this->status = 'revoked';
    }

    // ! 28/05/2025 - Verifica si el código ha expirado y actualiza el estado si es necesario
    public function checkExpiration(): bool
    {
        if ($this->status === 'active' && $this->expiresAt <= new \DateTime()) {
            $this->status = 'expired';
            return true;
        }
        return false;
    }

    // ! 28/05/2025 - Obtiene los tipos de invitado válidos
    public static function getValidGuestTypes(): array
    {
        return ['partner', 'friend', 'parental', 'healthcare_provider'];
    }
}
