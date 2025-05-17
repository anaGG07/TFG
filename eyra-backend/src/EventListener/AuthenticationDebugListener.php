<?php

namespace App\EventListener;

use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class AuthenticationDebugListener implements EventSubscriberInterface
{
    private LoggerInterface $logger;
    private TokenStorageInterface $tokenStorage;

    public function __construct(LoggerInterface $logger, TokenStorageInterface $tokenStorage)
    {
        $this->logger = $logger;
        $this->tokenStorage = $tokenStorage;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => ['onKernelRequest', 5], // Antes de la autenticación
        ];
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        // Log general: entrada al listener
        error_log('🟡 JwtCookieListener: Listener activado');

        if (!$event->isMainRequest()) {
            error_log('🔸 No es una petición principal');
            return;
        }

        $request = $event->getRequest();
        $path = $request->getPathInfo();

        // Solo peticiones a /api
        if (!str_starts_with($path, '/api')) {
            error_log("🔸 Ruta no API: {$path}");
            return;
        }

        // Rutas públicas que no requieren JWT
        $publicRoutes = [
            '/api/register',
            '/api/login',
            '/api/login_check',
            '/api/docs',
            '/api/password-reset',
        ];

        if (in_array($path, $publicRoutes) || str_starts_with($path, '/api/docs')) {
            error_log("🔸 Ruta pública detectada: {$path}");
            return;
        }

        // Registrar cookies y headers
        $this->logger->info('Petición recibida en JwtCookieListener', [
            'path' => $path,
            'method' => $request->getMethod(),
            'cookies' => array_keys($request->cookies->all()),
            'headers' => [
                'origin' => $request->headers->get('Origin'),
                'content-type' => $request->headers->get('Content-Type'),
                'authorization' => $request->headers->has('Authorization') ? 'presente' : 'ausente',
            ],
            'jwt_token_cookie' => $request->cookies->has('jwt_token') ? 'presente' : 'ausente',
        ]);

        // Extraer token de la cookie
        $token = $request->cookies->get('jwt_token');

        if ($token) {
            $request->headers->set('Authorization', 'Bearer ' . $token);
            error_log('🟢 Header Authorization establecido a partir de la cookie JWT');
            $this->logger->info('JwtCookieListener: Header Authorization establecido', [
                'header_prefix' => substr($token, 0, 10) . '...',
            ]);
        } else {
            error_log('🔴 No se encontró cookie jwt_token');
            $this->logger->warning('JwtCookieListener: No se encontró la cookie jwt_token');
        }
    }
}