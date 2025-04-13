<?php

namespace App\Security\Voter;

use App\Entity\GuestAccess;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class GuestAccessVoter extends Voter
{
    public const VIEW = 'VIEW';
    public const EDIT = 'EDIT';
    public const DELETE = 'DELETE';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::VIEW, self::EDIT, self::DELETE])
            && $subject instanceof GuestAccess;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $currentUser = $token->getUser();

        // Verificamos que sea una instancia válida de App\Entity\User
        if (!$currentUser instanceof User) {
            return false;
        }

        /** @var GuestAccess $guestAccess */
        $guestAccess = $subject;

        return match ($attribute) {
            self::VIEW => $this->canView($guestAccess, $currentUser),
            self::EDIT => $this->canEdit($guestAccess, $currentUser),
            self::DELETE => $this->canDelete($guestAccess, $currentUser),
            default => false,
        };
    }

    private function canView(GuestAccess $guestAccess, User $user): bool
    {
        return $guestAccess->getOwner()->getId() === $user->getId()
            || $guestAccess->getGuest()->getId() === $user->getId();
    }

    private function canEdit(GuestAccess $guestAccess, User $user): bool
    {
        return $guestAccess->getOwner()->getId() === $user->getId();
    }

    private function canDelete(GuestAccess $guestAccess, User $user): bool
    {
        return $guestAccess->getOwner()->getId() === $user->getId();
    }
}
