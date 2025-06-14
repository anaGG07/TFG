<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\PasswordResetToken;
use App\Enum\ProfileType;
use App\Repository\UserRepository;
use App\Repository\PasswordResetTokenRepository;
use App\Service\EmailService;
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
    private PasswordResetTokenRepository $passwordResetTokenRepository;

    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
        private ValidatorInterface $validator,
        private TokenService $tokenService,
        private EmailService $emailService,
        LoggerInterface $logger
    ) {
        $this->logger = $logger;
        $this->passwordResetTokenRepository = $entityManager->getRepository(PasswordResetToken::class);
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

            // ! 21/05/2025 - Eliminada configuración del campo genderIdentity

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

            // ! 28/05/2025 - Inicializar avatar con plantilla vacía si no se proporciona
            if (isset($data['avatar'])) {
                try {
                    // Si es un string JSON, convertirlo a array primero
                    if (is_string($data['avatar']) && !empty($data['avatar'])) {
                        $avatarData = json_decode($data['avatar'], true);
                        if (json_last_error() === JSON_ERROR_NONE) {
                            $user->setAvatar($avatarData);
                        } else {
                            $this->logger->error('Error al decodificar JSON del avatar', [
                                'error' => json_last_error_msg(),
                                'avatar_string' => $data['avatar']
                            ]);
                            return $this->json([
                                'message' => 'Formato de avatar inválido (JSON malformado)',
                                'error' => json_last_error_msg()
                            ], 400);
                        }
                    }
                    // Si ya es un array, usarlo directamente
                    else if (is_array($data['avatar'])) {
                        $user->setAvatar($data['avatar']);
                    } else {
                        $this->logger->error('Tipo de dato incorrecto para avatar', [
                            'tipo' => gettype($data['avatar'])
                        ]);
                        return $this->json([
                            'message' => 'El avatar debe ser un objeto JSON o un string JSON válido'
                        ], 400);
                    }
                } catch (Exception $e) {
                    $this->logger->error('Error al procesar el avatar en registro', [
                        'error' => $e->getMessage(),
                        'avatar_proporcionado' => is_string($data['avatar']) ? $data['avatar'] : json_encode($data['avatar'])
                    ]);
                    return $this->json([
                        'message' => 'Error al procesar el avatar',
                        'error' => $e->getMessage()
                    ], 400);
                }
            } else {
                // Establecer el avatar predeterminado vacío
                $user->setAvatar([
                    "skinColor" => "",
                    "eyes" => "",
                    "eyebrows" => "",
                    "mouth" => "",
                    "hairStyle" => "",
                    "hairColor" => "",
                    "facialHair" => "",
                    "clothes" => "",
                    "fabricColor" => "",
                    "glasses" => "",
                    "glassOpacity" => "",
                    "accessories" => "",
                    "tattoos" => "",
                    "backgroundColor" => ""
                ]);
            }

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

            // ! 29/05/2025 - Enviar email de bienvenida al registrarse
            $this->emailService->sendWelcomeEmail(
                $user->getEmail(),
                $user->getName()
            );

            $this->logger->info('Usuario registrado exitosamente', [
                'userId' => $user->getId(),
                'email' => $user->getEmail()
            ]);

            return $this->json([
                'message' => 'Usuario registrado con éxito',
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'username' => $user->getUsername(),
                    // ! 28/05/2025 - Añadido avatar a la respuesta del registro
                    'avatar' => $user->getAvatar()
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
        $start = microtime(true);
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

            $this->logger->info('AuthController::getProfile - Estado de autenticación', [
                'user_authenticated' => $user !== null,
                'user_id' => $user ? $user->getId() : 'null',
                'user_email' => $user ? $user->getEmail() : 'null'
            ]);

            if (!$user instanceof User) {
                $this->logger->warning('AuthController::getProfile - Usuario no autenticado');
                $elapsed = round((microtime(true) - $start) * 1000);
                $this->logger->info('AuthController::getProfile - Tiempo total (ms): ' . $elapsed);
                return $this->json(['message' => 'Usuario no autenticado'], 401);
            }

            $this->logger->info('AuthController::getProfile - Devolviendo perfil usuario: ' . $user->getEmail());

            $onboarding = $user->getOnboarding();
            $onboardingData = null;
            if ($onboarding) {
                $onboardingData = [
                    'id' => $onboarding->getId(),
                    'profileType' => $onboarding->getProfileType() ? $onboarding->getProfileType()->value : null,
                    'stageOfLife' => $onboarding->getStageOfLife(),
                    'lastPeriodDate' => $onboarding->getLastPeriodDate() ? $onboarding->getLastPeriodDate()->format('Y-m-d') : null,
                    'averageCycleLength' => $onboarding->getAverageCycleLength(),
                    'averagePeriodLength' => $onboarding->getAveragePeriodLength(),
                    'completed' => $onboarding->isCompleted()
                ];
            } else {
                $onboardingData = ['completed' => false];
            }
            $response = $this->json([
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'username' => $user->getUsername(),
                    'name' => $user->getName(),
                    'lastName' => $user->getLastName(),
                    'roles' => $user->getRoles(),
                    'profileType' => $user->getProfileType()->value,
                    // ! 21/05/2025 - Eliminado campo genderIdentity del perfil
                    'birthDate' => $user->getBirthDate()->format('Y-m-d'),
                    'createdAt' => $user->getCreatedAt()->format('c'),
                    'updatedAt' => $user->getUpdatedAt() ? $user->getUpdatedAt()->format('c') : null,
                    'state' => $user->getState(),
                    'onboardingCompleted' => $user->isOnboardingCompleted(),
                    // ! 28/05/2025 - Añadido campo avatar al perfil de usuario
                    'avatar' => $user->getAvatar(),
                    'onboarding' => $onboardingData
                ]
            ]);
            $elapsed = round((microtime(true) - $start) * 1000);
            $this->logger->info('AuthController::getProfile - Tiempo total (ms): ' . $elapsed);
            return $response;
        } catch (Exception $e) {
            $this->logger->error('Error al obtener perfil: ' . $e->getMessage(), [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            $elapsed = round((microtime(true) - $start) * 1000);
            $this->logger->info('AuthController::getProfile - Tiempo total (ms): ' . $elapsed);
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

            // ! 21/05/2025 - Eliminada actualización del campo genderIdentity

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

            // ! 28/05/2025 - Añadido manejo del campo avatar en actualización de perfil
            if (isset($data['avatar'])) {
                try {
                    // Si es un string JSON, convertirlo a array primero
                    if (is_string($data['avatar']) && !empty($data['avatar'])) {
                        $avatarData = json_decode($data['avatar'], true);
                        if (json_last_error() === JSON_ERROR_NONE) {
                            $user->setAvatar($avatarData);
                        } else {
                            $this->logger->error('Error al decodificar JSON del avatar en actualización', [
                                'error' => json_last_error_msg(),
                                'avatar_string' => $data['avatar']
                            ]);
                            return $this->json([
                                'message' => 'Formato de avatar inválido (JSON malformado)',
                                'error' => json_last_error_msg()
                            ], 400);
                        }
                    }
                    // Si ya es un array, usarlo directamente
                    else if (is_array($data['avatar'])) {
                        $user->setAvatar($data['avatar']);
                    } else {
                        $this->logger->error('Tipo de dato incorrecto para avatar en actualización', [
                            'tipo' => gettype($data['avatar'])
                        ]);
                        return $this->json([
                            'message' => 'El avatar debe ser un objeto JSON o un string JSON válido'
                        ], 400);
                    }
                } catch (Exception $e) {
                    $this->logger->error('Error al procesar el avatar en actualización', [
                        'error' => $e->getMessage(),
                        'avatar_proporcionado' => is_string($data['avatar']) ? $data['avatar'] : json_encode($data['avatar'])
                    ]);
                    return $this->json([
                        'message' => 'Error al procesar el avatar',
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

    // ! 29/05/2025 - Implementación completa del endpoint de solicitud de reset de contraseña
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

            // Por seguridad, siempre devolvemos la misma respuesta
            if ($user) {
                // Invalidar tokens anteriores del usuario
                $this->passwordResetTokenRepository->invalidateTokensByUser($user);

                // Crear nuevo token
                $resetToken = new PasswordResetToken();
                $resetToken->setUser($user);
                $resetToken->setToken(bin2hex(random_bytes(32))); // Token seguro de 64 caracteres

                $this->entityManager->persist($resetToken);
                $this->entityManager->flush();

                // Enviar email con el token
                $emailSent = $this->emailService->sendPasswordResetEmail(
                    $user->getEmail(),
                    $user->getName(),
                    $resetToken->getToken()
                );

                $this->logger->info('Token de reset de contraseña creado', [
                    'email' => $data['email'],
                    'userId' => $user->getId(),
                    'tokenId' => $resetToken->getId(),
                    'emailSent' => $emailSent
                ]);
            } else {
                $this->logger->info('Solicitud de reset para email no existente', [
                    'email' => $data['email']
                ]);
            }

            return $this->json([
                'message' => 'Si la dirección existe, recibirás un email con instrucciones para restablecer tu contraseña'
            ], 200);
        } catch (Exception $e) {
            $this->logger->error('Error en solicitud de reset de contraseña: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return $this->json(['message' => 'Error al procesar la solicitud'], 500);
        }
    }

    // ! 29/05/2025 - Nuevo endpoint para confirmar el reset de contraseña
    #[Route('/password-reset/confirm', name: 'api_confirm_password_reset', methods: ['POST'])]
    public function confirmPasswordReset(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            // Verificar campos requeridos
            if (!isset($data['token'], $data['newPassword'])) {
                $this->logger->warning('Intento de confirmación de reset con datos incompletos');
                return $this->json([
                    'message' => 'Faltan campos requeridos',
                    'required' => ['token', 'newPassword']
                ], 400);
            }

            // Buscar token válido
            $resetToken = $this->passwordResetTokenRepository->findValidTokenByToken($data['token']);

            if (!$resetToken) {
                $this->logger->warning('Intento de usar token inválido o expirado', [
                    'token' => substr($data['token'], 0, 8) . '...'
                ]);
                return $this->json([
                    'message' => 'Token inválido o expirado'
                ], 400);
            }

            $user = $resetToken->getUser();

            // Validar longitud mínima de contraseña
            if (strlen($data['newPassword']) < 6) {
                return $this->json([
                    'message' => 'La contraseña debe tener al menos 6 caracteres'
                ], 400);
            }

            // Actualizar contraseña
            $newHashedPassword = $this->passwordHasher->hashPassword($user, (string)$data['newPassword']);
            $user->setPassword($newHashedPassword);

            // Marcar token como usado
            $resetToken->setUsed(true);

            // Invalidar todos los demás tokens del usuario
            $this->passwordResetTokenRepository->invalidateTokensByUser($user);

            $this->entityManager->flush();

            $this->logger->info('Contraseña restablecida con éxito', [
                'userId' => $user->getId(),
                'tokenId' => $resetToken->getId()
            ]);

            return $this->json([
                'message' => 'Contraseña restablecida con éxito. Ya puedes iniciar sesión con tu nueva contraseña.'
            ], 200);
        } catch (Exception $e) {
            $this->logger->error('Error al confirmar reset de contraseña: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return $this->json(['message' => 'Error al restablecer la contraseña'], 500);
        }
    }
}
