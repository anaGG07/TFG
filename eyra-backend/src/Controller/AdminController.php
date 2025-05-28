<?php

namespace App\Controller;

use App\Entity\User;
use App\Enum\ProfileType;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use DateTime;
use Exception;
use ValueError;

#[Route('/api/admin')]
#[IsGranted('ROLE_ADMIN')]
class AdminController extends AbstractController
{
    private LoggerInterface $logger;

    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
        private ValidatorInterface $validator,
        LoggerInterface $logger
    ) {
        $this->logger = $logger;
    }

    /**
     * Endpoint para que un administrador edite a cualquier usuario
     * 
     * @param int $id ID del usuario a editar
     * @param Request $request Datos de la petición
     * @return JsonResponse Respuesta con el usuario actualizado
     * 
     * ! 28/05/2025 - Implementado endpoint para que los administradores puedan editar cualquier usuario
     */
    #[Route('/users/{id}', name: 'admin_edit_user', methods: ['PUT'])]
    public function editUser(int $id, Request $request): JsonResponse
    {
        try {
            // Verificar que el usuario actual es un administrador
            /** @var User|null $currentUser */
            $currentUser = $this->getUser();
            if (!$currentUser || !in_array('ROLE_ADMIN', $currentUser->getRoles())) {
                $this->logger->warning('Intento de acceso no autorizado al endpoint de edición de usuario (admin)', [
                    'userId' => $currentUser ? $currentUser->getId() : 'anónimo',
                    'ip' => $request->getClientIp()
                ]);
                return $this->json(['message' => 'Acceso denegado. Se requiere rol de administrador.'], Response::HTTP_FORBIDDEN);
            }

            $adminId = ($currentUser instanceof \App\Entity\User) ? $currentUser->getId() : null;

            // Buscar el usuario a editar
            $user = $this->userRepository->find($id);
            if (!$user) {
                $this->logger->warning('Intento de editar un usuario que no existe', [
                    'targetUserId' => $id,
                    'adminId' => $adminId
                ]);
                return $this->json(['message' => 'Usuario no encontrado'], Response::HTTP_NOT_FOUND);
            }

            $data = json_decode($request->getContent(), true);
            if (!$data) {
                return $this->json(['message' => 'Datos de solicitud inválidos'], Response::HTTP_BAD_REQUEST);
            }

            // Actualizar campos permitidos
            if (isset($data['email']) && is_string($data['email'])) {
                // Verificar si el nuevo email ya está en uso
                $existingUser = $this->userRepository->findOneBy(['email' => $data['email']]);
                if ($existingUser && $existingUser->getId() !== $user->getId()) {
                    return $this->json(['message' => 'El email ya está registrado por otro usuario'], Response::HTTP_CONFLICT);
                }
                $user->setEmail($data['email']);
            }

            if (isset($data['username']) && is_string($data['username'])) {
                $user->setUsername($data['username']);
            }

            if (isset($data['name']) && is_string($data['name'])) {
                $user->setName($data['name']);
            }

            if (isset($data['lastName']) && is_string($data['lastName'])) {
                $user->setLastName($data['lastName']);
            }

            if (isset($data['profileType']) && is_string($data['profileType'])) {
                try {
                    $profileType = ProfileType::from($data['profileType']);
                    $user->setProfileType($profileType);
                } catch (ValueError $e) {
                    $this->logger->error('Error con el tipo de perfil en actualización de usuario', [
                        'error' => $e->getMessage(),
                        'tipo_proporcionado' => $data['profileType']
                    ]);
                    return $this->json([
                        'message' => 'Tipo de perfil inválido',
                        'error' => $e->getMessage(),
                        'allowed' => array_map(fn($case) => $case->value, ProfileType::cases())
                    ], Response::HTTP_BAD_REQUEST);
                }
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
                    ], Response::HTTP_BAD_REQUEST);
                }
            }

            // Cambiar roles (solo si se proporciona)
            if (isset($data['roles']) && is_array($data['roles'])) {
                // Asegurarse que siempre tenga ROLE_USER
                if (!in_array('ROLE_USER', $data['roles'])) {
                    $data['roles'][] = 'ROLE_USER';
                }
                $user->setRoles($data['roles']);
            }

            // Cambiar estado (activo/inactivo)
            if (isset($data['state'])) {
                $user->setState((bool) $data['state']);
            }

            // Cambiar onboardingCompleted
            if (isset($data['onboardingCompleted'])) {
                $user->setOnboardingCompleted((bool) $data['onboardingCompleted']);
            }

            // ! 28/05/2025 - Añadido soporte para actualizar el avatar desde el panel de administración
            if (isset($data['avatar'])) {
                try {
                    // Si es un string JSON, convertirlo a array primero
                    if (is_string($data['avatar']) && !empty($data['avatar'])) {
                        $avatarData = json_decode($data['avatar'], true);
                        if (json_last_error() === JSON_ERROR_NONE) {
                            $user->setAvatar($avatarData);
                        } else {
                            $this->logger->error('Error al decodificar JSON del avatar en actualización por administrador', [
                                'error' => json_last_error_msg(),
                                'avatar_string' => $data['avatar']
                            ]);
                            return $this->json([
                                'message' => 'Formato de avatar inválido (JSON malformado)',
                                'error' => json_last_error_msg()
                            ], Response::HTTP_BAD_REQUEST);
                        }
                    }
                    // Si ya es un array, usarlo directamente
                    else if (is_array($data['avatar'])) {
                        $user->setAvatar($data['avatar']);
                    } else {
                        $this->logger->error('Tipo de dato incorrecto para avatar en actualización por administrador', [
                            'tipo' => gettype($data['avatar'])
                        ]);
                        return $this->json([
                            'message' => 'El avatar debe ser un objeto JSON o un string JSON válido'
                        ], Response::HTTP_BAD_REQUEST);
                    }
                } catch (Exception $e) {
                    $this->logger->error('Error al procesar el avatar en actualización por administrador', [
                        'error' => $e->getMessage(),
                        'avatar_proporcionado' => is_string($data['avatar']) ? $data['avatar'] : json_encode($data['avatar'])
                    ]);
                    return $this->json([
                        'message' => 'Error al procesar el avatar',
                        'error' => $e->getMessage()
                    ], Response::HTTP_BAD_REQUEST);
                }
            }

            // Cambiar contraseña (si se proporciona)
            if (isset($data['password']) && is_string($data['password']) && !empty($data['password'])) {
                $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
                $user->setPassword($hashedPassword);
            }

            // Validar cambios
            $errors = $this->validator->validate($user);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[$error->getPropertyPath()] = $error->getMessage();
                }
                $this->logger->warning('Validación fallida en actualización de usuario por admin', [
                    'errores' => $errorMessages
                ]);
                return $this->json(['message' => 'Errores de validación', 'errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
            }

            $this->entityManager->flush();

            $this->logger->info('Usuario actualizado con éxito por administrador', [
                'targetUserId' => $user->getId(),
                'adminId' => $adminId,
                'campos_actualizados' => array_keys($data)
            ]);

            return $this->json([
                'message' => 'Usuario actualizado con éxito',
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'username' => $user->getUsername(),
                    'name' => $user->getName(),
                    'lastName' => $user->getLastName(),
                    'roles' => $user->getRoles(),
                    'profileType' => $user->getProfileType()->value,
                    'birthDate' => $user->getBirthDate()->format('Y-m-d'),
                    'createdAt' => $user->getCreatedAt()->format('c'),
                    'updatedAt' => $user->getUpdatedAt() ? $user->getUpdatedAt()->format('c') : null,
                    'state' => $user->getState(),
                    'onboardingCompleted' => $user->isOnboardingCompleted(),
                    // ! 28/05/2025 - Añadido campo avatar a la respuesta de actualización
                    'avatar' => $user->getAvatar()
                ]
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            $this->logger->error('Error al actualizar usuario por administrador: ' . $e->getMessage(), [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return $this->json(['message' => 'Error al actualizar usuario: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Endpoint para listar todos los usuarios (solo administradores)
     * 
     * @param Request $request Datos de la petición con posibles filtros
     * @return JsonResponse Lista paginada de usuarios
     * 
     * ! 28/05/2025 - Implementado endpoint para listar usuarios con filtros para administradores
     */
    #[Route('/users', name: 'admin_list_users', methods: ['GET'])]
    public function listUsers(Request $request): JsonResponse
    {
        try {
            /** @var User|null $currentUser */
            $currentUser = $this->getUser();
            $adminId = ($currentUser instanceof \App\Entity\User) ? $currentUser->getId() : null;

            // Obtener parámetros de paginación y filtrado
            $page = max(1, $request->query->getInt('page', 1));
            $limit = min(100, max(1, $request->query->getInt('limit', 20))); // Entre 1 y 100, default 20
            $role = $request->query->get('role');
            $profileType = $request->query->get('profileType');
            $search = $request->query->get('search');

            // Calcular offset para paginación
            $offset = ($page - 1) * $limit;

            // Crear criterios de filtrado
            $criteria = [];

            // Si se proporciona un rol específico
            if ($role) {
                // No se puede filtrar directamente por rol en DQL simple, se manejará en PHP
            }

            // Si se proporciona un tipo de perfil
            if ($profileType) {
                try {
                    $profileTypeEnum = ProfileType::from($profileType);
                    $criteria['profileType'] = $profileTypeEnum;
                } catch (ValueError $e) {
                    // Ignorar filtro de profileType si es inválido
                    $this->logger->warning('Filtro de profileType inválido', [
                        'valor_proporcionado' => $profileType
                    ]);
                }
            }

            // Obtener total de usuarios que coinciden con los criterios
            $total = $this->userRepository->count($criteria);

            // Obtener usuarios paginados
            $users = $this->userRepository->findBy(
                $criteria,
                ['id' => 'ASC'],
                $limit,
                $offset
            );

            // Filtrar por rol si es necesario (no se puede hacer en la consulta directa)
            if ($role) {
                $users = array_filter($users, function (User $user) use ($role) {
                    return in_array($role, $user->getRoles());
                });
            }

            // Filtrar por búsqueda si se proporciona
            if ($search) {
                $search = strtolower($search);
                $users = array_filter($users, function (User $user) use ($search) {
                    return (
                        str_contains(strtolower($user->getEmail()), $search) ||
                        str_contains(strtolower($user->getUsername()), $search) ||
                        str_contains(strtolower($user->getName()), $search) ||
                        str_contains(strtolower($user->getLastName()), $search)
                    );
                });
            }

            // Transformar usuarios en formato JSON
            $usersData = array_map(function (User $user) {
                return [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'username' => $user->getUsername(),
                    'name' => $user->getName(),
                    'lastName' => $user->getLastName(),
                    'roles' => $user->getRoles(),
                    'profileType' => $user->getProfileType()->value,
                    'birthDate' => $user->getBirthDate()->format('Y-m-d'),
                    'createdAt' => $user->getCreatedAt()->format('c'),
                    'updatedAt' => $user->getUpdatedAt() ? $user->getUpdatedAt()->format('c') : null,
                    'state' => $user->getState(),
                    'onboardingCompleted' => $user->isOnboardingCompleted(),
                    // ! 28/05/2025 - Añadido campo avatar al listado de usuarios
                    'avatar' => $user->getAvatar()
                ];
            }, $users);

            // Calcular total de páginas
            $totalPages = ceil($total / $limit);

            $this->logger->info('Listado de usuarios solicitado por administrador', [
                'adminId' => $adminId,
                'page' => $page,
                'limit' => $limit,
                'totalUsers' => $total,
                'filteredUsers' => count($usersData)
            ]);

            return $this->json([
                'users' => $usersData,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $total,
                    'totalPages' => $totalPages
                ]
            ]);
        } catch (Exception $e) {
            $this->logger->error('Error al listar usuarios: ' . $e->getMessage(), [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return $this->json(['message' => 'Error al listar usuarios: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Endpoint para obtener un usuario específico por ID (solo administradores)
     * 
     * @param int $id ID del usuario a obtener
     * @return JsonResponse Datos del usuario
     * 
     * ! 28/05/2025 - Implementado endpoint para obtener datos de un usuario específico por ID
     */
    #[Route('/users/{id}', name: 'admin_get_user', methods: ['GET'])]
    public function getUserById(int $id): JsonResponse
    {
        try {
            /** @var User|null $currentUser */
            $currentUser = $this->getUser();
            $adminId = ($currentUser instanceof \App\Entity\User) ? $currentUser->getId() : null;

            $user = $this->userRepository->find($id);
            if (!$user) {
                $this->logger->warning('Intento de obtener un usuario que no existe', [
                    'targetUserId' => $id,
                    'adminId' => $adminId
                ]);
                return $this->json(['message' => 'Usuario no encontrado'], Response::HTTP_NOT_FOUND);
            }

            $userData = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
                'name' => $user->getName(),
                'lastName' => $user->getLastName(),
                'roles' => $user->getRoles(),
                'profileType' => $user->getProfileType()->value,
                'birthDate' => $user->getBirthDate()->format('Y-m-d'),
                'createdAt' => $user->getCreatedAt()->format('c'),
                'updatedAt' => $user->getUpdatedAt() ? $user->getUpdatedAt()->format('c') : null,
                'state' => $user->getState(),
                'onboardingCompleted' => $user->isOnboardingCompleted(),
                // ! 28/05/2025 - Añadido campo avatar al endpoint de usuario por ID
                'avatar' => $user->getAvatar()
            ];

            // Incluir información del onboarding si existe
            $onboarding = $user->getOnboarding();
            if ($onboarding) {
                $userData['onboarding'] = [
                    'id' => $onboarding->getId(),
                    'profileType' => $onboarding->getProfileType() ? $onboarding->getProfileType()->value : null,
                    'stageOfLife' => $onboarding->getStageOfLife(),
                    'lastPeriodDate' => $onboarding->getLastPeriodDate() ? $onboarding->getLastPeriodDate()->format('Y-m-d') : null,
                    'averageCycleLength' => $onboarding->getAverageCycleLength(),
                    'averagePeriodLength' => $onboarding->getAveragePeriodLength(),
                    'completed' => $onboarding->isCompleted()
                ];
            }

            $this->logger->info('Datos de usuario obtenidos por administrador', [
                'targetUserId' => $id,
                'adminId' => $adminId
            ]);

            return $this->json(['user' => $userData]);
        } catch (Exception $e) {
            $this->logger->error('Error al obtener datos de usuario: ' . $e->getMessage(), [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'userId' => $id
            ]);

            return $this->json(['message' => 'Error al obtener datos de usuario: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Endpoint para desactivar un usuario (solo administradores)
     * 
     * @param int $id ID del usuario a desactivar
     * @return JsonResponse Mensaje de confirmación
     * 
     * ! 28/05/2025 - Implementado endpoint para desactivar usuarios por ID
     */
    #[Route('/users/{id}', name: 'admin_delete_user', methods: ['DELETE'])]
    public function deleteUser(int $id): JsonResponse
    {
        try {
            /** @var User|null $currentUser */
            $currentUser = $this->getUser();

            $adminId = ($currentUser instanceof \App\Entity\User) ? $currentUser->getId() : null;

            // Verificar que no intenta eliminarse a sí mismo
            if ($currentUser->getId() === $id) {
                $this->logger->warning('Intento de administrador de eliminarse a sí mismo', [
                    'adminId' => $adminId
                ]);
                return $this->json([
                    'message' => 'No puedes desactivar tu propia cuenta de administrador'
                ], Response::HTTP_BAD_REQUEST);
            }

            $user = $this->userRepository->find($id);
            if (!$user) {
                $this->logger->warning('Intento de eliminar un usuario que no existe', [
                    'targetUserId' => $id,
                    'adminId' => $adminId
                ]);
                return $this->json(['message' => 'Usuario no encontrado'], Response::HTTP_NOT_FOUND);
            }

            // Verificar que no intenta eliminar a otro administrador
            if (in_array('ROLE_ADMIN', $user->getRoles()) && $adminId !== $user->getId()) {
                $this->logger->warning('Intento de eliminar a otro administrador', [
                    'targetAdminId' => $id,
                    'requestingAdminId' => $adminId
                ]);
                return $this->json([
                    'message' => 'No tienes permisos para desactivar a otros administradores'
                ], Response::HTTP_FORBIDDEN);
            }

            // En lugar de eliminar, desactivar el usuario
            $user->setState(false);
            $this->entityManager->flush();

            $this->logger->info('Usuario desactivado por administrador', [
                'targetUserId' => $id,
                'adminId' => $adminId
            ]);

            return $this->json([
                'message' => 'Usuario desactivado correctamente'
            ]);
        } catch (Exception $e) {
            $this->logger->error('Error al desactivar usuario: ' . $e->getMessage(), [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'userId' => $id
            ]);

            return $this->json(['message' => 'Error al desactivar usuario: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
