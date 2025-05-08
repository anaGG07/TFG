<?php

namespace App\Security;

use Lexik\Bundle\JWTAuthenticationBundle\TokenExtractor\TokenExtractorInterface;
use Symfony\Component\HttpFoundation\Request;
use Psr\Log\LoggerInterface;

class CookieTokenExtractor implements TokenExtractorInterface
{
    private string $cookieName;
    private LoggerInterface $logger;

    public function __construct(string $cookieName = 'jwt_token', LoggerInterface $logger)
    {
        $this->cookieName = $cookieName;
        $this->logger = $logger;
    }

    public function extract(Request $request): ?string
    {
        // Extraemos y registramos todas las cookies para depurar
        $this->logger->info('CookieTokenExtractor: Extracting token', [
            'has_cookie' => $request->cookies->has($this->cookieName),
            'all_cookies' => array_keys($request->cookies->all()),
            'has_auth_header' => $request->headers->has('Authorization'),
            'request_uri' => $request->getRequestUri()
        ]);

        if (!$request->cookies->has($this->cookieName)) {
            $this->logger->warning("CookieTokenExtractor: No token found in cookie named '{$this->cookieName}'");
            return null;
        }

        $token = $request->cookies->get($this->cookieName);
        
        if (empty($token)) {
            $this->logger->warning("CookieTokenExtractor: Empty token in cookie '{$this->cookieName}'");
            return null;
        }

        $this->logger->info("CookieTokenExtractor: Token found in cookie '{$this->cookieName}'", [
            'token_start' => substr($token, 0, 10) . '...'
        ]);

        return $token;
    }
}