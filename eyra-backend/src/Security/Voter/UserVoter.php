<?php

namespace App\Security\Voter;

use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security; // ✅ CORRECTO
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class UserVoter extends Voter
{
    public const VIEW = 'VIEW';
    public const EDIT = 'EDIT';
    public const DELETE = 'DELETE';

    public function __construct(
        private Security $security,
    ) {}

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::VIEW, self::EDIT, self::DELETE])
            && $subject instanceof User;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $currentUser = $token->getUser();

        // ✅ Aseguramos que sea una instancia válida de App\Entity\User
        if (!$currentUser instanceof User) {
            return false;
        }

        /** @var User $user */
        $user = $subject;

        return match ($attribute) {
            self::VIEW => $this->canView($user, $currentUser),
            self::EDIT => $this->canEdit($user, $currentUser),
            self::DELETE => $this->canDelete($user, $currentUser),
            default => false,
        };
    }

    private function canView(User $user, User $currentUser): bool
    {
        // ✅ Es el mismo usuario
        if ($user->getId() === $currentUser->getId()) {
            return true;
        }

        // ✅ Es un administrador
        if ($this->security->isGranted('ROLE_ADMIN')) {
            return true;
        }

        // 🚧 Pendiente: acceso por invitado (pareja, parental, etc.)
        return false;
    }

    private function canEdit(User $user, User $currentUser): bool
    {
        return $user->getId() === $currentUser->getId() || $this->security->isGranted('ROLE_ADMIN');
    }

    private function canDelete(User $user, User $currentUser): bool
    {
        return $this->security->isGranted('ROLE_ADMIN');
    }
}
