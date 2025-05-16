<?php

namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;

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
    private const COOKIE_NAME = 'jwt_token';

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }
    
    public static function getSubscribedEvents(): array
    {
        return [
            // Prioridad extremadamente alta (999) para asegurar que se ejecuta antes de cualquier otro listener
            KernelEvents::REQUEST => ['onKernelRequest', 999],
        ];
    }

    /**
     * En cada petición, verifica si existe la cookie JWT y la convierte en header de Authorization
     */
    public function onKernelRequest(RequestEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();
        $path = $request->getPathInfo();

        // Para depuración - registrar todas las peticiones API
        if (str_starts_with($path, '/api')) {
            $this->logger->info("JwtCookieListener: Petición a {$path}", [
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

        // Intentar extraer el token JWT desde la cookie
        $token = $this->extractTokenFromCookie($request);
        
        if ($token) {
            // Registrar la presencia del token
            $this->logger->info("JwtCookieListener: Token JWT encontrado en cookie para: {$path}", [
                'token_prefix' => substr($token, 0, 10) . '...'
            ]);
            
            // Añadir el token a los headers de autorización
            $request->headers->set('Authorization', 'Bearer ' . $token);
            
            // Verificar que se añadió correctamente
            $authHeader = $request->headers->get('Authorization');
            if ($authHeader) {
                $this->logger->info('JwtCookieListener: Header Authorization establecido correctamente', [
                    'header' => substr($authHeader, 0, 15) . '...'
                ]);
            } else {
                $this->logger->critical('JwtCookieListener: FALLO AL ESTABLECER el header Authorization');
            }
        } else {
            // Log para depuración
            $this->logger->error("JwtCookieListener: No hay cookie JWT para la ruta {$path}");
            $this->logger->info('Cookies disponibles: ' . json_encode(array_keys($request->cookies->all())));
        }
    }
    
    /**
     * Extrae el token JWT de la cookie
     */
    private function extractTokenFromCookie(Request $request): ?string
    {
        if (!$request->cookies->has(self::COOKIE_NAME)) {
            return null;
        }
        
        $token = $request->cookies->get(self::COOKIE_NAME);
        if (empty($token)) {
            $this->logger->warning("Cookie '".self::COOKIE_NAME."' está vacía");
            return null;
        }
        
        return $token;
    }
}
