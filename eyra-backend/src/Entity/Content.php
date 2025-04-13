<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Enum\ContentType;
use App\Enum\CyclePhase;
use App\Repository\ContentRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ContentRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    normalizationContext: ['groups' => ['content:read']],
    denormalizationContext: ['groups' => ['content:write']],
    operations: [
        new Get(),
        new GetCollection()
    ]
)]
class Content
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['content:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['content:read', 'content:write'])]
    #[Assert\NotBlank(message: "El título es obligatorio")]
    #[Assert\Length(min: 3, max: 255)]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['content:read', 'content:write'])]
    #[Assert\NotBlank(message: "La descripción es obligatoria")]
    private ?string $description = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['content:read', 'content:write'])]
    #[Assert\NotBlank(message: "El contenido es obligatorio")]
    private ?string $content = null;

    #[ORM\Column(enumType: ContentType::class)]
    #[Groups(['content:read', 'content:write'])]
    #[Assert\NotNull(message: "El tipo de contenido es obligatorio")]
    private ?ContentType $type = null;

    #[ORM\Column(enumType: CyclePhase::class, nullable: true)]
    #[Groups(['content:read', 'content:write'])]
    private ?CyclePhase $targetPhase = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['content:read', 'content:write'])]
    private array $tags = [];

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['content:read', 'content:write'])]
    private ?string $imageUrl = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\ManyToMany(targetEntity: Condition::class, inversedBy: 'relatedContent')]
    private Collection $relatedConditions;

    public function __construct()
    {
        $this->relatedConditions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;
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

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;
        return $this;
    }

    public function getType(): ?ContentType
    {
        return $this->type;
    }

    public function setType(ContentType $type): static
    {
        $this->type = $type;
        return $this;
    }

    public function getTargetPhase(): ?CyclePhase
    {
        return $this->targetPhase;
    }

    public function setTargetPhase(?CyclePhase $targetPhase): static
    {
        $this->targetPhase = $targetPhase;
        return $this;
    }

    public function getTags(): array
    {
        return $this->tags;
    }

    public function setTags(?array $tags): static
    {
        $this->tags = $tags;
        return $this;
    }

    public function getImageUrl(): ?string
    {
        return $this->imageUrl;
    }

    public function setImageUrl(?string $imageUrl): static
    {
        $this->imageUrl = $imageUrl;
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
     * @return Collection<int, Condition>
     */
    public function getRelatedConditions(): Collection
    {
        return $this->relatedConditions;
    }

    public function addRelatedCondition(Condition $condition): static
    {
        if (!$this->relatedConditions->contains($condition)) {
            $this->relatedConditions->add($condition);
        }
        return $this;
    }

    public function removeRelatedCondition(Condition $condition): static
    {
        $this->relatedConditions->removeElement($condition);
        return $this;
    }
}
