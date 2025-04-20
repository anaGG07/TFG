<?php

namespace App\Controller;

use App\Entity\User;
use App\Enum\ProfileType;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use App\Service\TokenService;
use DateTime;
use Exception;
use ValueError;

#[Route('/api')]
class AuthController extends AbstractController
{
    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
        private ValidatorInterface $validator,
        private TokenService $tokenService
    ) {
    }

    #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Verificar datos requeridos
        if (!isset($data['email'], $data['password'], $data['username'], $data['name'], $data['lastName'])) {
            return $this->json([
                'message' => 'Faltan campos requeridos',
                'required' => ['email', 'password', 'username', 'name', 'lastName']
            ], 400);
        }

        // Verificar si el email ya existe
        $existingUser = $this->userRepository->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            return $this->json(['message' => 'El email ya está registrado'], 400);
        }

        // Crear nuevo usuario
        $user = new User();
        
        // Establecer campos obligatorios
        $user->setEmail((string)$data['email']);
        $user->setUsername((string)$data['username']);
        $user->setName((string)$data['name']);
        $user->setLastName((string)$data['lastName']);
        
        // Hashear la contraseña
        $hashedPassword = $this->passwordHasher->hashPassword($user, (string)$data['password']);
        $user->setPassword($hashedPassword);
        
        // Configurar campos adicionales
        if (isset($data['genderIdentity']) && is_string($data['genderIdentity'])) {
            $user->setGenderIdentity($data['genderIdentity']);
        }
        
        if (isset($data['birthDate']) && is_string($data['birthDate'])) {
            try {
                $birthDate = new DateTime($data['birthDate']);
                $user->setBirthDate($birthDate);
            } catch (Exception $e) {
                return $this->json([
                    'message' => 'Formato de fecha inválido',
                    'error' => $e->getMessage()
                ], 400);
            }
        }
        
        if (isset($data['profileType']) && is_string($data['profileType'])) {
            try {
                $profileType = ProfileType::from($data['profileType']);
                $user->setProfileType($profileType);
            } catch (ValueError $e) {
                return $this->json([
                    'message' => 'Tipo de perfil inválido',
                    'error' => $e->getMessage(),
                    'allowed' => array_map(fn($case) => $case->value, ProfileType::cases())
                ], 400);
            }
        }

        // Validar el usuario
        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['message' => 'Errores de validación', 'errors' => $errorMessages], 400);
        }

        // Guardar en base de datos
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $this->json([
            'message' => 'Usuario registrado con éxito',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername()
            ]
        ], 201);
    }

    /**
     * Este método ya no es necesario porque es gestionado por el servicio JwtCookieSuccessHandler
     * Lo mantenemos comentado como referencia pero ya no se ejecutará
     * La ruta está renombrada para evitar conflictos
     */
    #[Route('/login-handler', name: 'api_login_legacy', methods: ['POST'])]
    public function loginLegacy(Request $request): JsonResponse
    {
        try {
            // Este método sería manejado por Lexik JWT Bundle
            // Pero lo implementamos aquí para incluir refresh tokens
            $data = json_decode($request->getContent(), true);

            if (!isset($data['email']) || !isset($data['password'])) {
                return $this->json(['message' => 'Credenciales incompletas'], 400);
            }

            /** @var User|null $user */
            $user = $this->userRepository->findOneBy(['email' => (string)$data['email']]);
            
            if (!$user instanceof User || !$this->passwordHasher->isPasswordValid($user, (string)$data['password'])) {
                return $this->json(['message' => 'Credenciales inválidas'], 401);
            }

            // Generar tokens
            $jwtToken = $this->tokenService->createJwtToken($user);
            $refreshToken = $this->tokenService->createRefreshToken($user, $request);

            // Crear una respuesta con cookies HTTP-only
            $response = new JsonResponse([
                'message' => 'Login exitoso',
                'expiresAt' => $refreshToken->getExpiresAt()->format('c')
            ]);
            
            // Establecer cookie JWT HTTP-only con seguridad mejorada
            $response->headers->setCookie(
                new Cookie(
                    'jwt_token',       // Nombre de la cookie
                    $jwtToken,         // Valor (el token JWT)
                    time() + 3600,     // Expiración (1 hora)
                    '/',              // Path
                    null,              // Domain (null = current domain)
                    true,              // Secure (HTTPS only) - Imprescindible para seguridad
                    true,              // HTTPOnly - Previene acceso desde JavaScript
                    false,             // Raw
                    'Strict'           // SameSite=Strict - Mayor seguridad contra CSRF
                )
            );
            
            // Establecer cookie de refresh token HTTP-only con máxima seguridad
            $response->headers->setCookie(
                new Cookie(
                    'refresh_token',               // Nombre de la cookie
                    $refreshToken->getToken(),     // Valor (el refresh token)
                    $refreshToken->getExpiresAt()->getTimestamp(), // Expiración
                    '/',                          // Path
                    null,                          // Domain (null = current domain)
                    true,                          // Secure (HTTPS only) - Requerido para cookies de autenticación
                    true,                          // HTTPOnly - Crucínl para prevenir robo por XSS
                    false,                         // Raw
                    'Strict'                       // SameSite=Strict - Máxima protección contra CSRF
                )
            );
            
            return $response;
        } catch (\Exception $e) {
            // Log del error para depuración
            error_log('Error en login: ' . $e->getMessage());
            return $this->json(['message' => 'Error interno del servidor: ' . $e->getMessage()], 500);
        }
    }

    #[Route('/refresh-token', name: 'api_refresh_token', methods: ['POST'])]
    public function refreshToken(Request $request): JsonResponse
    {
        try {
            // Intentamos leer el refresh token de la cookie primero (más seguro)
            $refreshTokenStr = $request->cookies->get('refresh_token');

            // Si no hay token en la cookie, intentamos leerlo del body (compatibilidad)
            if (!$refreshTokenStr) {
                $data = json_decode($request->getContent(), true);
                if (!isset($data['refreshToken']) || !is_string($data['refreshToken'])) {
                    return $this->json(['message' => 'Refresh token requerido'], 400);
                }
                $refreshTokenStr = $data['refreshToken'];
            }

            // Validar el refresh token (incluyendo verificación de browser fingerprint)
            /** @var User|null $user */
            $user = $this->tokenService->validateRefreshToken($refreshTokenStr, $request);
            
            if (!$user instanceof User) {
                return $this->json(['message' => 'Refresh token inválido o expirado'], 401);
            }

            // Invalidar el token anterior
            $this->tokenService->revokeRefreshToken($refreshTokenStr);

            // Generar nuevos tokens
            $jwtToken = $this->tokenService->createJwtToken($user);
            $refreshToken = $this->tokenService->createRefreshToken($user, $request);

            // Crear respuesta con cookies HTTP-only actualizadas
            $response = new JsonResponse([
                'message' => 'Tokens renovados con éxito',
                'expiresAt' => $refreshToken->getExpiresAt()->format('c')
            ]);
            
            // Establecer nueva cookie JWT
            $response->headers->setCookie(
                new Cookie(
                    'jwt_token',
                    $jwtToken,
                    time() + 3600,
                    '/',
                    null,
                    true,
                    true,
                    false,
                    'Strict'
                )
            );
            
            // Establecer nueva cookie de refresh token
            $response->headers->setCookie(
                new Cookie(
                    'refresh_token',
                    $refreshToken->getToken(),
                    $refreshToken->getExpiresAt()->getTimestamp(),
                    '/',
                    null,
                    true,
                    true,
                    false,
                    'Strict'
                )
            );
            
            return $response;
        } catch (\Exception $e) {
            // Log del error para depuración
            error_log('Error en refresh-token: ' . $e->getMessage());
            return $this->json(['message' => 'Error al renovar tokens: ' . $e->getMessage()], 500);
        }
    }

    #[Route('/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(Request $request): JsonResponse
    {
        // Crear respuesta
        $response = new JsonResponse(['message' => 'Sesión cerrada con éxito']);
        
        // Eliminar cookie JWT con los mismos parámetros que al crearla
        $response->headers->setCookie(
            new Cookie(
                'jwt_token',       // Nombre de la cookie
                '',               // Valor vacío para eliminar
                1,                // Tiempo en el pasado (expira inmediatamente)
                '/',              // Path debe coincidir con el original
                null,              // Domain (null = current domain)
                true,              // Secure
                true,              // HTTPOnly
                false,             // Raw
                'Strict'           // SameSite policy
            )
        );
        
        // Eliminar cookie refresh token con los mismos parámetros
        $response->headers->setCookie(
            new Cookie(
                'refresh_token',    // Nombre de la cookie
                '',                // Valor vacío
                1,                 // Tiempo en el pasado
                '/',               // Path
                null,               // Domain
                true,               // Secure
                true,               // HTTPOnly
                false,              // Raw
                'Strict'            // SameSite policy
            )
        );
        
        // Intentar revocar el refresh token de la base de datos si está disponible
        $refreshToken = $request->cookies->get('refresh_token');
        if ($refreshToken && is_string($refreshToken)) {
            $this->tokenService->revokeRefreshToken($refreshToken);
        }
        
        return $response;
    }

    #[Route('/logout-all', name: 'api_logout_all', methods: ['POST'])]
    public function logoutAll(): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->json(['message' => 'Usuario no autenticado'], 401);
        }

        // Revocar todos los refresh tokens del usuario
        $tokensRevoked = $this->tokenService->revokeAllUserTokens($user);

        return $this->json([
            'message' => 'Se han cerrado todas las sesiones',
            'sessionsRevoked' => $tokensRevoked
        ]);
    }

    #[Route('/profile', name: 'api_profile', methods: ['GET'])]
    public function getProfile(): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->json(['message' => 'Usuario no autenticado'], 401);
        }

        return $this->json($user, 200, [], ['groups' => 'user:read']);
    }

    #[Route('/profile', name: 'api_profile_update', methods: ['PUT'])]
    public function updateProfile(Request $request): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->json(['message' => 'Usuario no autenticado'], 401);
        }

        $data = json_decode($request->getContent(), true);

        // Actualizar campos permitidos
        if (isset($data['username']) && is_string($data['username'])) {
            $user->setUsername($data['username']);
        }
        
        if (isset($data['name']) && is_string($data['name'])) {
            $user->setName($data['name']);
        }
        
        if (isset($data['lastName']) && is_string($data['lastName'])) {
            $user->setLastName($data['lastName']);
        }
        
        if (isset($data['genderIdentity']) && is_string($data['genderIdentity'])) {
            $user->setGenderIdentity($data['genderIdentity']);
        }
        
        if (isset($data['birthDate']) && is_string($data['birthDate'])) {
            try {
                $birthDate = new DateTime($data['birthDate']);
                $user->setBirthDate($birthDate);
            } catch (Exception $e) {
                return $this->json([
                    'message' => 'Formato de fecha inválido',
                    'error' => $e->getMessage()
                ], 400);
            }
        }

        // Validar cambios
        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['message' => 'Errores de validación', 'errors' => $errorMessages], 400);
        }

        $this->entityManager->flush();

        return $this->json(['message' => 'Perfil actualizado con éxito'], 200);
    }

    #[Route('/password-change', name: 'api_password_change', methods: ['POST'])]
    public function changePassword(Request $request): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->json(['message' => 'Usuario no autenticado'], 401);
        }

        $data = json_decode($request->getContent(), true);

        // Verificar campos requeridos
        if (!isset($data['currentPassword'], $data['newPassword'])) {
            return $this->json([
                'message' => 'Faltan campos requeridos',
                'required' => ['currentPassword', 'newPassword']
            ], 400);
        }

        // Verificar contraseña actual
        if (!$this->passwordHasher->isPasswordValid($user, (string)$data['currentPassword'])) {
            return $this->json(['message' => 'Contraseña actual incorrecta'], 400);
        }

        // Actualizar contraseña
        $newHashedPassword = $this->passwordHasher->hashPassword($user, (string)$data['newPassword']);
        $user->setPassword($newHashedPassword);

        $this->entityManager->flush();

        // Opcionalmente, revocar todos los refresh tokens para obligar a reconectarse
        if (isset($data['revokeAllSessions']) && $data['revokeAllSessions']) {
            $this->tokenService->revokeAllUserTokens($user);
        }

        return $this->json(['message' => 'Contraseña actualizada con éxito'], 200);
    }

    #[Route('/password-reset', name: 'api_request_password_reset', methods: ['POST'])]
    public function requestPasswordReset(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email'])) {
            return $this->json(['message' => 'Email requerido'], 400);
        }

        $user = $this->userRepository->findOneBy(['email' => $data['email']]);
        if (!$user) {
            // Por seguridad, no revelar si el email existe o no
            return $this->json(['message' => 'Si la dirección existe, recibirás un email con instrucciones'], 200);
        }

        // Aquí implementarías el envío de email con un token
        // Por ahora, solo devolvemos una respuesta de éxito
        
        return $this->json(['message' => 'Si la dirección existe, recibirás un email con instrucciones'], 200);
    }

    #[Route('/active-sessions', name: 'api_active_sessions', methods: ['GET'])]
    public function getActiveSessions(): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->json(['message' => 'Usuario no autenticado'], 401);
        }

        // Obtener todos los tokens activos
        $activeTokens = $this->tokenService->getUserActiveTokens($user);
        
        $sessions = [];
        foreach ($activeTokens as $token) {
            $sessions[] = [
                'id' => $token->getId(),
                'createdAt' => $token->getCreatedAt()->format('c'),
                'expiresAt' => $token->getExpiresAt()->format('c'),
                'ipAddress' => $token->getIpAddress(),
                'userAgent' => $token->getUserAgent()
            ];
        }

        return $this->json(['sessions' => $sessions]);
    }
}
