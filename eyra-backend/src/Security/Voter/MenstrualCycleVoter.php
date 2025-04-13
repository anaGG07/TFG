<?php

namespace App\Security\Voter;

use App\Entity\MenstrualCycle;
use App\Entity\User;
use App\Repository\GuestAccessRepository;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Bundle\SecurityBundle\Security;

class MenstrualCycleVoter extends Voter
{
    public const VIEW = 'VIEW';
    public const EDIT = 'EDIT';
    public const DELETE = 'DELETE';

    public function __construct(
        private Security $security,
        private GuestAccessRepository $guestAccessRepository,
    ) {}

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::VIEW, self::EDIT, self::DELETE])
            && $subject instanceof MenstrualCycle;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $currentUser = $token->getUser();

        // Aseguramos que es una instancia válida
        if (!$currentUser instanceof User) {
            return false;
        }

        /** @var MenstrualCycle $cycle */
        $cycle = $subject;

        return match ($attribute) {
            self::VIEW => $this->canView($cycle, $currentUser),
            self::EDIT => $this->canEdit($cycle, $currentUser),
            self::DELETE => $this->canDelete($cycle, $currentUser),
            default => false,
        };
    }

    private function canView(MenstrualCycle $cycle, User $currentUser): bool
    {
        // Es el propietario
        if ($cycle->getUser()->getId() === $currentUser->getId()) {
            return true;
        }

        // Es administrador
        if ($this->security->isGranted('ROLE_ADMIN')) {
            return true;
        }

        // Es un invitado con acceso
        $guestAccesses = $this->guestAccessRepository->findByGuestAndOwner(
            $currentUser->getId(),
            $cycle->getUser()->getId()
        );

        foreach ($guestAccesses as $guestAccess) {
            if (
                $guestAccess->getState() &&
                in_array('menstrual_cycle', $guestAccess->getAccessTo())
            ) {
                return true;
            }
        }

        return false;
    }

    private function canEdit(MenstrualCycle $cycle, User $currentUser): bool
    {
        return $cycle->getUser()->getId() === $currentUser->getId() ||
            $this->security->isGranted('ROLE_ADMIN');
    }

    private function canDelete(MenstrualCycle $cycle, User $currentUser): bool
    {
        return $cycle->getUser()->getId() === $currentUser->getId() ||
            $this->security->isGranted('ROLE_ADMIN');
    }
}
