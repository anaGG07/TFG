<?php

namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\KernelEvents;

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
    public static function getSubscribedEvents(): array
    {
        return [
            // Alta prioridad (255) para asegurar que se ejecuta antes del firewall de seguridad
            KernelEvents::REQUEST => ['onKernelRequest', 255],
        ];
    }

/**
     * En cada petición, verifica si existe la cookie JWT y la convierte en header de Authorization
     * 
     * Este método permite usar cookies HttpOnly+Secure para almacenar el token JWT,
     * ofreciendo mayor protección contra ataques XSS, mientras mantiene la compatibilidad
     * con el sistema de autenticación JWT estándar basado en headers.
     */
    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        $path = $request->getPathInfo();

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
            // Log para depuración
            error_log("JwtCookieListener: Estableciendo token desde cookie para la ruta [$path]");
            
            // Añadir el token a los headers de autorización
            $request->headers->set('Authorization', 'Bearer ' . $token);
        } else {
            // Log para depuración
            error_log("JwtCookieListener: No hay cookie JWT para la ruta [$path]");
        }
    }
}
