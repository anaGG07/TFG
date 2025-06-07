<?php

namespace App\Security;

use App\Entity\User;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAccountStatusException;

class UserChecker implements UserCheckerInterface
{
    public function checkPreAuth(UserInterface $user): void
    {
        if ($user instanceof User && !$user->getState()) {
            throw new CustomUserMessageAccountStatusException('Tu cuenta está desactivada. Contacta con soporte.');
        }
    }

    public function checkPostAuth(UserInterface $user): void
    {
        // Puedes añadir más comprobaciones aquí si lo necesitas
    }
} 