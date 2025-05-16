<?php

namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Psr\Log\LoggerInterface;

/**
 * JwtCookieListener
 * 
 * Este listener es clave para el sistema de autenticación basado en cookies.
 * Intercepta todas las peticiones a la API y convierte automáticamente las cookies JWT
 * en headers de Authorization, permitiendo que el sistema de autenticación JWT funcione
 * de manera transparente con cookies HttpOnly (que son más seguras al no ser accesibles via JavaScript).
 */
class JwtCookieListener implements EventSubscriberInterface
{
    private LoggerInterface $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }
    
    public static function getSubscribedEvents(): array
    {
        return [
            // Alta prioridad (255) para asegurar que se ejecuta antes del firewall de seguridad
            KernelEvents::REQUEST => ['onKernelRequest', 255],
        ];
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        $path = $request->getPathInfo();

        // Para depuración - registrar todas las peticiones API
        if (str_starts_with($path, '/api')) {
            $this->logger->info("JwtCookieListener: Petición a [{$path}]", [
                'cookies' => array_keys($request->cookies->all()),
                'has_auth_header' => $request->headers->has('Authorization'),
                'method' => $request->getMethod()
            ]);
        }

        // Rutas públicas que no necesitan el token JWT
        $publicRoutes = [
            '/api/register',
            '/api/login',
            '/api/login_check',
            '/api/docs',
            '/api/password-reset'
        ];
        
        // No procesar si no es una petición a la API o es una ruta pública
        if (!str_starts_with($path, '/api') || in_array($path, $publicRoutes) || str_starts_with($path, '/api/docs')) {
            return;
        }

        $token = $request->cookies->get('jwt_token');
        if ($token) {
            // Registrar la presencia del token
            $this->logger->info("JwtCookieListener: Token JWT encontrado en cookie, añadiendo a Authorization para: {$path}");
            
            // Añadir el token a los headers de autorización
            $request->headers->set('Authorization', 'Bearer ' . $token);
            
            // Verificar que se añadió correctamente
            $authHeader = $request->headers->get('Authorization');
            if ($authHeader) {
                $this->logger->info('JwtCookieListener: Header Authorization establecido correctamente', [
                    'header' => substr($authHeader, 0, 20) . '...'
                ]);
            } else {
                $this->logger->warning('JwtCookieListener: No se pudo establecer el header Authorization');
            }
        } else {
            // Log para depuración
            $this->logger->warning("JwtCookieListener: No hay cookie JWT para la ruta {$path}");
        }
    }
}
