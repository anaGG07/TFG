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
        /** @var User $user */
        $user = $token->getUser();
        
        // Generar JWT token
        $jwtToken = $this->jwtManager->create($user);
        
        // Generar refresh token
        $refreshToken = $this->tokenService->createRefreshToken($user, $request);
        
        // Crear evento de autenticación exitosa
        $event = new AuthenticationSuccessEvent(
            ['message' => 'Login exitoso', 'expiresAt' => $refreshToken->getExpiresAt()->format('c')], 
            $user, 
            new JWTAuthenticationSuccessResponse($jwtToken)
        );
        
        // Despachar evento
        $this->eventDispatcher->dispatch($event);
        
        // Obtener la respuesta y configurar cookies
        $response = $event->getResponse();
        
        // Establecer cookie JWT
        $response->headers->setCookie(
            new Cookie(
                'jwt_token',       // Nombre de la cookie
                $jwtToken,         // Valor (el token JWT)
                time() + 3600,     // Expiración (1 hora)
                '/',              // Path
                null,              // Domain (null = current domain)
                $this->cookieSecure, // Secure - HTTPS only
                true,              // HTTPOnly - Previene acceso desde JavaScript
                false,             // Raw
                'Strict'           // SameSite=Strict - Mayor seguridad contra CSRF
            )
        );
        
        // Establecer cookie de refresh token
        $response->headers->setCookie(
            new Cookie(
                'refresh_token',               // Nombre de la cookie
                $refreshToken->getToken(),     // Valor (el refresh token)
                $refreshToken->getExpiresAt()->getTimestamp(), // Expiración
                '/',                          // Path
                null,                          // Domain (null = current domain)
                $this->cookieSecure,           // Secure - HTTPS only
                true,                          // HTTPOnly
                false,                         // Raw
                'Strict'                       // SameSite=Strict
            )
        );
        
        return $response;
    }
}
