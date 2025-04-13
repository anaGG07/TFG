<?php

namespace App\Service;

use App\Entity\User;
use App\Entity\RefreshToken;
use App\Repository\RefreshTokenRepository;
use Symfony\Component\HttpFoundation\Request;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class TokenService
{
    private const REFRESH_TOKEN_TTL = 2592000; // 30 days in seconds

    public function __construct(
        private JWTTokenManagerInterface $jwtManager,
        private RefreshTokenRepository $refreshTokenRepository,
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

    /**
     * Generate a new refresh token for a user
     */
    public function createRefreshToken(User $user, Request $request = null): RefreshToken
    {
        // Clean up old tokens first to prevent accumulation
        $this->cleanup($user);
        
        $refreshToken = new RefreshToken();
        $refreshToken->setUser($user);
        $refreshToken->setToken($this->generateRefreshTokenString());
        
        // Set expiration date (30 days by default)
        $expiresAt = new \DateTime();
        $expiresAt->modify('+' . self::REFRESH_TOKEN_TTL . ' seconds');
        $refreshToken->setExpiresAt($expiresAt);
        
        // Store client information for security if request is available
        if ($request) {
            $refreshToken->setIpAddress($request->getClientIp());
            $refreshToken->setUserAgent($request->headers->get('User-Agent'));
        }
        
        $this->refreshTokenRepository->save($refreshToken, true);
        
        return $refreshToken;
    }

    /**
     * Validates a refresh token and returns the associated user if valid
     */
    public function validateRefreshToken(string $token): ?User
    {
        $refreshToken = $this->refreshTokenRepository->findValidToken($token);
        
        if (!$refreshToken) {
            return null;
        }
        
        return $refreshToken->getUser();
    }

    /**
     * Revoke a specific refresh token
     */
    public function revokeRefreshToken(string $token): bool
    {
        $refreshToken = $this->refreshTokenRepository->findOneBy(['token' => $token]);
        
        if (!$refreshToken) {
            return false;
        }
        
        $this->refreshTokenRepository->remove($refreshToken, true);
        
        return true;
    }

    /**
     * Revoke all refresh tokens for a user
     */
    public function revokeAllUserTokens(User $user): int
    {
        return $this->refreshTokenRepository->removeAllForUser($user);
    }
    
    /**
     * Get all active tokens for a user
     */
    public function getUserActiveTokens(User $user): array
    {
        return $this->refreshTokenRepository->findActiveTokensForUser($user);
    }

    /**
     * Cleanup - Remove expired tokens and limit number of active tokens per user
     */
    public function cleanup(User $user = null): void
    {
        // Remove expired tokens for all users
        $this->refreshTokenRepository->removeExpiredTokens();
        
        // If a user is specified, ensure they don't have too many active tokens
        if ($user) {
            $maxTokensPerUser = 5; // Limit to 5 active refresh tokens per user
            $activeTokens = $this->refreshTokenRepository->findActiveTokensForUser($user);
            
            // If user has more than the max allowed tokens, remove the oldest ones
            if (count($activeTokens) >= $maxTokensPerUser) {
                // Sort by creation date, oldest first
                usort($activeTokens, function (RefreshToken $a, RefreshToken $b) {
                    return $a->getCreatedAt() <=> $b->getCreatedAt();
                });
                
                // Remove oldest tokens, keeping only the max allowed minus 1 (to make room for the new one)
                $tokensToRemove = array_slice($activeTokens, 0, count($activeTokens) - $maxTokensPerUser + 1);
                
                foreach ($tokensToRemove as $token) {
                    $this->refreshTokenRepository->remove($token);
                }
                
                $this->refreshTokenRepository->getEntityManager()->flush();
            }
        }
    }

    /**
     * Generate a cryptographically secure random string for refresh tokens
     */
    private function generateRefreshTokenString(int $length = 64): string
    {
        return bin2hex(random_bytes($length / 2));
    }
}
