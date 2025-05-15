<?php

namespace App\Security;

use App\Entity\User;
use App\Service\TokenService;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Response\JWTAuthenticationSuccessResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

/**
 * Handler personalizado para el éxito de autenticación que establece cookies HTTP-only
 */
class JwtCookieSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    private $jwtManager;
    private $tokenService;
    private $requestStack;
    private $eventDispatcher;
    private $cookieSecure;
    
    public function __construct(
        JWTTokenManagerInterface $jwtManager,
        TokenService $tokenService,
        RequestStack $requestStack,
        EventDispatcherInterface $eventDispatcher,
        bool $cookieSecure = true
    ) {
        $this->jwtManager = $jwtManager;
        $this->tokenService = $tokenService;
        $this->requestStack = $requestStack;
        $this->eventDispatcher = $eventDispatcher;
        $this->cookieSecure = $cookieSecure;
    }
    
    /**
     * Este método se ejecuta cuando la autenticación es exitosa
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token): Response
    {
        try {
            /** @var User $user */
            $user = $token->getUser();
            
            // Determinar si estamos en entorno de desarrollo
            $isDevEnvironment = isset($_SERVER['APP_ENV']) && $_SERVER['APP_ENV'] === 'dev';
            
            // Añadir información de depuración
            error_log('Autenticación exitosa para: ' . $user->getEmail());
            error_log('Entorno de aplicación: ' . ($isDevEnvironment ? 'desarrollo' : 'producción'));
            
            try {
                // Generar JWT token
                $jwtToken = $this->jwtManager->create($user);
                error_log('JWT generado correctamente');
            } catch (\Exception $e) {
                error_log('Error al generar JWT: ' . $e->getMessage());
                throw $e; // Re-lanzar para manejo posterior
            }
            
            // Generar refresh token
            $refreshToken = $this->tokenService->createRefreshToken($user, $request);
            
            // Añadir datos del usuario a la respuesta
            $userData = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
                'name' => $user->getName(),
                'lastName' => $user->getLastName(),
                'roles' => $user->getRoles(),
                'profileType' => $user->getProfileType()->value,
                'genderIdentity' => $user->getGenderIdentity(),
                'birthDate' => $user->getBirthDate()->format('Y-m-d'),
                'createdAt' => $user->getCreatedAt()->format('c'),
                'updatedAt' => $user->getUpdatedAt() ? $user->getUpdatedAt()->format('c') : null,
                'state' => $user->getState()
            ];
            
            // Crear una respuesta JSON con datos de usuario
            $responseData = [
                'message' => 'Login exitoso',
                'expiresAt' => $refreshToken->getExpiresAt()->format('c'),
                'user' => $userData
            ];
            
            $response = new Response(json_encode($responseData), Response::HTTP_OK, [
                'Content-Type' => 'application/json'
            ]);
            
            // Establecer cookie JWT con configuración adaptada al entorno
            $response->headers->setCookie(
                new Cookie(
                    'jwt_token',       // Nombre de la cookie
                    $jwtToken,         // Valor (el token JWT)
                    time() + 7200,     // Expiración (2 horas)
                    '/',              // Path
                    null,              // Domain (null = current domain)
                    $isDevEnvironment ? false : $this->cookieSecure, // No requerir HTTPS en desarrollo
                    true,              // HTTPOnly - Previene acceso desde JavaScript
                    false,             // Raw
                    $isDevEnvironment ? 'Lax' : 'Lax'  // Siempre usar Lax para mayor compatibilidad
                )
            );
            
            // Establecer cookie de refresh token con configuración adaptada
            $response->headers->setCookie(
                new Cookie(
                    'refresh_token',               // Nombre de la cookie
                    $refreshToken->getToken(),     // Valor (el refresh token)
                    $refreshToken->getExpiresAt()->getTimestamp(), // Expiración
                    '/',                          // Path
                    null,                          // Domain (null = current domain)
                    $isDevEnvironment ? false : $this->cookieSecure, // No requerir HTTPS en desarrollo
                    true,                          // HTTPOnly
                    false,                         // Raw
                    $isDevEnvironment ? 'Lax' : 'Lax'  // Siempre usar Lax para mayor compatibilidad
                )
            );
            
            return $response;
        } catch (\Exception $e) {
            // Registrar el error detallado
            error_log('Error en JwtCookieSuccessHandler: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            
            // Devolver respuesta más amigable
            return new Response(json_encode([
                'message' => 'Error interno durante la autenticación',
                'error' => $e->getMessage()
            ]), Response::HTTP_INTERNAL_SERVER_ERROR, [
                'Content-Type' => 'application/json'
            ]);
        }
    }
}
