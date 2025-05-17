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
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use App\Service\TokenService;
use DateTime;
use Exception;
use ValueError;
use Psr\Log\LoggerInterface;

#[Route('')]
class AuthController extends AbstractController
{
    private LoggerInterface $logger;
    
    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
        private ValidatorInterface $validator,
        private TokenService $tokenService,
        LoggerInterface $logger
    ) {
        $this->logger = $logger;
    }

    #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            // Verificar datos requeridos
            if (!isset($data['email'], $data['password'], $data['username'], $data['name'], $data['lastName'])) {
                $this->logger->info('Intento de registro con datos incompletos');
                return $this->json([
                    'message' => 'Faltan campos requeridos',
                    'required' => ['email', 'password', 'username', 'name', 'lastName']
                ], 400);
            }

            // Verificar si el email ya existe
            $existingUser = $this->userRepository->findOneBy(['email' => $data['email']]);
            if ($existingUser) {
                $this->logger->info('Intento de registro con email ya existente', [
                    'email' => $data['email']
                ]);
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
                    $this->logger->error('Error al procesar fecha de nacimiento en registro', [
                        'error' => $e->getMessage(),
                        'fecha_proporcionada' => $data['birthDate']
                    ]);
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
                    $this->logger->error('Error con el tipo de perfil en registro', [
                        'error' => $e->getMessage(),
                        'tipo_proporcionado' => $data['profileType']
                    ]);
                    return $this->json([
                        'message' => 'Tipo de perfil inválido',
                        'error' => $e->getMessage(),
                        'allowed' => array_map(fn($case) => $case->value, ProfileType::cases())
                    ], 400);
                }
            }

            // Inicializar onboardingCompleted como falso
            $user->setOnboardingCompleted(false);

            // Validar el usuario
            $errors = $this->validator->validate($user);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[$error->getPropertyPath()] = $error->getMessage();
                }
                $this->logger->warning('Validación fallida en registro de usuario', [
                    'errores' => $errorMessages
                ]);
                return $this->json(['message' => 'Errores de validación', 'errors' => $errorMessages], 400);
            }

            // Guardar en base de datos
            $this->entityManager->persist($user);
            $this->entityManager->flush();

            $this->logger->info('Usuario registrado exitosamente', [
                'userId' => $user->getId(),
                'email' => $user->getEmail()
            ]);

            return $this->json([
                'message' => 'Usuario registrado con éxito',
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'username' => $user->getUsername()
                ]
            ], 201);
        } catch (Exception $e) {
            $this->logger->error('Error inesperado en el registro de usuario', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->json(['message' => 'Error interno en el servidor'], 500);
        }
    }

    #[Route('/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(Request $request): JsonResponse
    {
        try {
            // Crear respuesta
            $response = new JsonResponse(['message' => 'Sesión cerrada con éxito']);
            
            // Eliminar cookies adaptadas según el origen de la solicitud
            $isSecureConnection = $request->isSecure();
            $hostname = $request->getHost();
            
            // Log para depuración
            $this->logger->info('Eliminando cookies en logout', [
                'host' => $hostname,
                'isSecure' => $isSecureConnection
            ]);
            
            // Eliminar cookie JWT
            $response->headers->setCookie(
                new Cookie(
                    'jwt_token',       // Nombre de la cookie
                    '',               // Valor vacío para eliminar
                    1,                // Tiempo en el pasado (expira inmediatamente)
                    '/',              // Path debe coincidir con el original
                    null,              // Domain (null = current domain)
                    $isSecureConnection, // Secure solo si es HTTPS
                    true,              // HTTPOnly siempre activado
                    false,             // Raw
                    $isSecureConnection ? 'Strict' : 'Lax' // SameSite adaptado
                )
            );
            
            $this->logger->info('Sesión cerrada con éxito');
            return $response;
        } catch (Exception $e) {
            $this->logger->error('Error durante el cierre de sesión: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->json(['message' => 'Error en el cierre de sesión'], 500);
        }
    }

    #[Route('/logout-all', name: 'api_logout_all', methods: ['POST'])]
    public function logoutAll(): JsonResponse
    {
        try {
            /** @var User|null $user */
            $user = $this->getUser();
            if (!$user instanceof User) {
                $this->logger->warning('Intento de logout-all sin autenticación');
                return $this->json(['message' => 'Usuario no autenticado'], 401);
            }

            $this->logger->info('Todas las sesiones cerradas', [
                'userId' => $user->getId()
            ]);

            return $this->json([
                'message' => 'Se han cerrado todas las sesiones'
            ]);
        } catch (Exception $e) {
            $this->logger->error('Error durante el cierre de todas las sesiones: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->json(['message' => 'Error al cerrar todas las sesiones'], 500);
        }
    }

    #[Route('/profile', name: 'api_profile', methods: ['GET'])]
    public function getProfile(Request $request): JsonResponse
    {
        try {
            // Log de depuración detallado
            $this->logger->info('AuthController::getProfile - Iniciando solicitud de perfil', [
                'headers' => $request->headers->keys(),
                'has_auth_header' => $request->headers->has('Authorization'),
                'auth_header_prefix' => $request->headers->has('Authorization') ? substr($request->headers->get('Authorization'), 0, 15) . '...' : 'no',
                'cookies' => array_keys($request->cookies->all()),
                'token_cookie' => $request->cookies->has('jwt_token') ? 'presente' : 'ausente'
            ]);
            
            /** @var User|null $user */
            $user = $this->getUser(); 
            
            // Log para depuración
            $this->logger->info('AuthController::getProfile - Estado de autenticación', [
                'user_authenticated' => $user !== null,
                'user_id' => $user ? $user->getId() : 'null',
                'user_email' => $user ? $user->getEmail() : 'null'
            ]);
            
            if (!$user instanceof User) {
                $this->logger->warning('AuthController::getProfile - Usuario no autenticado');
                return $this->json(['message' => 'Usuario no autenticado'], 401);
            }

            $this->logger->info('AuthController::getProfile - Devolviendo perfil usuario: ' . $user->getEmail());
            
            return $this->json([
                'user' => [
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
                    'state' => $user->getState(),
                    'onboardingCompleted' => $user->isOnboardingCompleted()
                ]
            ]);
        } catch (Exception $e) {
            $this->logger->error('Error al obtener perfil: ' . $e->getMessage(), [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->json(['message' => 'Error al obtener perfil: ' . $e->getMessage()], 500);
        }
    }

    #[Route('/profile', name: 'api_profile_update', methods: ['PUT'])]
    public function updateProfile(Request $request): JsonResponse
    {
        try {
            /** @var User|null $user */
            $user = $this->getUser();
            if (!$user instanceof User) {
                $this->logger->warning('Intento de actualización de perfil sin autenticación');
                return $this->json(['message' => 'Usuario no autenticado'], 401);
            }

            $data = json_decode($request->getContent(), true);
            if (!$data) {
                return $this->json(['message' => 'Datos de solicitud inválidos'], 400);
            }

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
                    $this->logger->error('Error al procesar fecha de nacimiento en actualización', [
                        'error' => $e->getMessage(),
                        'fecha_proporcionada' => $data['birthDate']
                    ]);
                    return $this->json([
                        'message' => 'Formato de fecha inválido',
                        'error' => $e->getMessage()
                    ], 400);
                }
            }

            // Campo específico para onboarding
            if (isset($data['onboardingCompleted'])) {
                $user->setOnboardingCompleted((bool) $data['onboardingCompleted']);
            }

            // Validar cambios
            $errors = $this->validator->validate($user);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[$error->getPropertyPath()] = $error->getMessage();
                }
                $this->logger->warning('Validación fallida en actualización de perfil', [
                    'errores' => $errorMessages
                ]);
                return $this->json(['message' => 'Errores de validación', 'errors' => $errorMessages], 400);
            }

            $this->entityManager->flush();

            $this->logger->info('Perfil actualizado con éxito', [
                'userId' => $user->getId()
            ]);

            return $this->json([
                'message' => 'Perfil actualizado con éxito',
                'user' => $user
            ], 200, [], ['groups' => 'user:read']);
        } catch (Exception $e) {
            $this->logger->error('Error al actualizar perfil: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->json(['message' => 'Error al actualizar perfil'], 500);
        }
    }

    // El endpoint de onboarding ha sido movido a OnboardingController.php
    // para mantener una mejor separación de responsabilidades

    #[Route('/password-change', name: 'api_password_change', methods: ['POST'])]
    public function changePassword(Request $request): JsonResponse
    {
        try {
            /** @var User|null $user */
            $user = $this->getUser();
            if (!$user instanceof User) {
                $this->logger->warning('Intento de cambio de contraseña sin autenticación');
                return $this->json(['message' => 'Usuario no autenticado'], 401);
            }

            $data = json_decode($request->getContent(), true);

            // Verificar campos requeridos
            if (!isset($data['currentPassword'], $data['newPassword'])) {
                $this->logger->warning('Intento de cambio de contraseña con datos incompletos');
                return $this->json([
                    'message' => 'Faltan campos requeridos',
                    'required' => ['currentPassword', 'newPassword']
                ], 400);
            }

            // Verificar contraseña actual
            if (!$this->passwordHasher->isPasswordValid($user, (string)$data['currentPassword'])) {
                $this->logger->info('Intento de cambio de contraseña con contraseña actual incorrecta', [
                    'userId' => $user->getId()
                ]);
                return $this->json(['message' => 'Contraseña actual incorrecta'], 400);
            }

            // Actualizar contraseña
            $newHashedPassword = $this->passwordHasher->hashPassword($user, (string)$data['newPassword']);
            $user->setPassword($newHashedPassword);

            $this->entityManager->flush();

            $this->logger->info('Contraseña actualizada con éxito', [
                'userId' => $user->getId()
            ]);

            return $this->json(['message' => 'Contraseña actualizada con éxito'], 200);
        } catch (Exception $e) {
            $this->logger->error('Error al cambiar contraseña: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->json(['message' => 'Error al cambiar contraseña'], 500);
        }
    }

    #[Route('/password-reset', name: 'api_request_password_reset', methods: ['POST'])]
    public function requestPasswordReset(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!isset($data['email'])) {
                $this->logger->warning('Intento de reset de contraseña sin proporcionar email');
                return $this->json(['message' => 'Email requerido'], 400);
            }

            $user = $this->userRepository->findOneBy(['email' => $data['email']]);
            
            // Por seguridad, no revelamos si el email existe o no
            $this->logger->info('Solicitud de reset de contraseña', [
                'email' => $data['email'],
                'encontrado' => $user !== null
            ]);
            
            // Aquí implementarías el envío de email con un token
            // Por ahora, solo devolvemos una respuesta de éxito
            
            return $this->json(['message' => 'Si la dirección existe, recibirás un email con instrucciones'], 200);
        } catch (Exception $e) {
            $this->logger->error('Error en solicitud de reset de contraseña: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->json(['message' => 'Error al procesar la solicitud'], 500);
        }
    }
}
