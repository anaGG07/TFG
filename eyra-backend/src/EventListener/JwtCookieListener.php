<?php

namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\KernelEvents;

class JwtCookieListener implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => ['onKernelRequest', 255], // Alta prioridad
        ];
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();

        // Aplicar solo a rutas API excepto login y register
        $path = $request->getPathInfo();
        if (!str_starts_with($path, '/api') || in_array($path, ['/api/login', '/api/register'])) {
            return;
        }

        // Si existe la cookie 'jwt_token', la usamos para autorizar
        $token = $request->cookies->get('jwt_token');
        if ($token) {
            $request->headers->set('Authorization', 'Bearer ' . $token);
        }
    }
}
