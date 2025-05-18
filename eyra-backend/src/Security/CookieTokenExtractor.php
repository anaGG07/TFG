<?php

namespace App\Security;

use Lexik\Bundle\JWTAuthenticationBundle\TokenExtractor\TokenExtractorInterface;
use Symfony\Component\HttpFoundation\Request;
use Psr\Log\LoggerInterface;

class CookieTokenExtractor implements TokenExtractorInterface
{
    private string $cookieName;
    private LoggerInterface $logger;

    public function __construct(LoggerInterface $logger, string $cookieName = 'jwt_token')
    {
        $this->cookieName = $cookieName;
        $this->logger = $logger;
    }

    public function extract(Request $request): ?string
    {
        // Verificar si estamos en una ruta pública o no una ruta API
        $path = $request->getPathInfo();
        $publicRoutes = [
            '/api/register',
            '/api/login',
            '/api/login_check',
            '/api/docs',
            '/api/password-reset'
        ];

        if (!str_starts_with($path, '/api') || in_array($path, $publicRoutes) || str_starts_with($path, '/api/docs')) {
            $this->logger->info('CookieTokenExtractor: Ruta pública, no se necesita token');
            return null;
        }

        // Verificar si hay un header Authorization
        if ($request->headers->has('Authorization')) {
            $header = $request->headers->get('Authorization');
            if (str_starts_with($header, 'Bearer ')) {
                $this->logger->info('CookieTokenExtractor: El token ya existe en Authorization header');
                return null; // No extraemos de la cookie si ya hay un header
            }
        }

        // Intentar extraer el token de la cookie
        if (!$request->cookies->has($this->cookieName)) {
            $this->logger->warning("CookieTokenExtractor: No hay cookie '{$this->cookieName}'", [
                'path' => $request->getPathInfo(),
                'cookies' => array_keys($request->cookies->all()),
                'method' => $request->getMethod()
            ]);
            return null;
        }

        $token = $request->cookies->get($this->cookieName);
        
        if (empty($token)) {
            $this->logger->warning("CookieTokenExtractor: Cookie '{$this->cookieName}' está vacía");
            return null;
        }

        $this->logger->info("CookieTokenExtractor: Token encontrado en cookie '{$this->cookieName}'", [
            'token_prefix' => substr($token, 0, 10) . '...'
        ]);

        return $token;
    }
}