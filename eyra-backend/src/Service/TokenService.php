<?php

namespace App\Service;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class TokenService
{
    public function __construct(
        private JWTTokenManagerInterface $jwtManager,
        private TokenStorageInterface $tokenStorage,
        private ParameterBagInterface $parameterBag
    ) {
    }

    /**
     * Generate a JWT token for a user
     */
    public function createJwtToken(User $user): string
    {
        return $this->jwtManager->create($user);
    }
}
