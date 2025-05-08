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
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();
        
        // Solo depurar peticiones a /api
        if (!str_starts_with($request->getPathInfo(), '/api')) {
            return;
        }

        // Registrar información de la petición
        $this->logger->info('Petición recibida', [
            'path' => $request->getPathInfo(),
            'method' => $request->getMethod(),
            'cookies' => array_keys($request->cookies->all()),
            'headers' => [
                'origin' => $request->headers->get('Origin'),
                'content-type' => $request->headers->get('Content-Type'),
                'authorization' => $request->headers->has('Authorization') ? 'presente' : 'ausente',
            ],
            'jwt_token_cookie' => $request->cookies->has('jwt_token') ? 'presente' : 'ausente',
            'refresh_token_cookie' => $request->cookies->has('refresh_token') ? 'presente' : 'ausente',
        ]);
    }
}