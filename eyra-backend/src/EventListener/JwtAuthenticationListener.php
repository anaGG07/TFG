<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTAuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTFailedAuthenticationEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTInvalidEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTNotFoundEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class JwtAuthenticationListener implements EventSubscriberInterface
{
    private LoggerInterface $logger;
    private RequestStack $requestStack;

    public function __construct(LoggerInterface $logger, RequestStack $requestStack)
    {
        $this->logger = $logger;
        $this->requestStack = $requestStack;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            Events::AUTHENTICATION_SUCCESS => 'onAuthenticationSuccess',
            Events::AUTHENTICATION_FAILURE => 'onAuthenticationFailure',
            Events::JWT_INVALID => 'onJwtInvalid',
            Events::JWT_NOT_FOUND => 'onJwtNotFound',
        ];
    }

    public function onAuthenticationSuccess(JWTAuthenticationSuccessEvent $event): void
    {
        $request = $this->requestStack->getCurrentRequest();
        $this->logger->info('JWT Autenticación exitosa', [
            'path' => $request ? $request->getPathInfo() : 'unknown',
            'user' => $event->getUser() ? $event->getUser()->getUserIdentifier() : 'unknown'
        ]);
    }

    public function onAuthenticationFailure(JWTFailedAuthenticationEvent $event): void
    {
        $request = $this->requestStack->getCurrentRequest();
        $this->logger->error('JWT Autenticación fallida', [
            'path' => $request ? $request->getPathInfo() : 'unknown',
            'exception' => $event->getException()->getMessage(),
            'cookies' => $request ? array_keys($request->cookies->all()) : [],
            'has_auth_header' => $request ? $request->headers->has('Authorization') : false,
            'auth_header' => $request ? $request->headers->get('Authorization') : null
        ]);
    }

    public function onJwtInvalid(JWTInvalidEvent $event): void
    {
        $request = $this->requestStack->getCurrentRequest();
        $this->logger->error('JWT Token inválido', [
            'path' => $request ? $request->getPathInfo() : 'unknown',
            'cookies' => $request ? array_keys($request->cookies->all()) : [],
            'has_auth_header' => $request ? $request->headers->has('Authorization') : false,
            'auth_header' => $request ? ($request->headers->has('Authorization') ? substr($request->headers->get('Authorization'), 0, 20) . '...' : null) : null
        ]);
    }

    public function onJwtNotFound(JWTNotFoundEvent $event): void
    {
        $request = $this->requestStack->getCurrentRequest();
        $this->logger->error('JWT Token no encontrado', [
            'path' => $request ? $request->getPathInfo() : 'unknown',
            'cookies' => $request ? array_keys($request->cookies->all()) : [],
            'has_auth_header' => $request ? $request->headers->has('Authorization') : false
        ]);
    }
}