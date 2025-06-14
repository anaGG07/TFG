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
use App\Entity\Content;
use App\Repository\ContentRepository;
use App\Enum\ContentType;
use App\Enum\CyclePhase;

use DateTime;
use Exception;
use ValueError;

#[Route('/admin')]
#[IsGranted('ROLE_ADMIN')]
class AdminController extends AbstractController
{
    private LoggerInterface $logger;

    /* ! 01/06/2025 - Añadido ContentRepository al constructor para solucionar error 500 */
    public function __construct(
        private UserRepository $userRepository,
        private ContentRepository $contentRepository,
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
     * ! 31/05/2025 - Endpoint simplificado y optimizado para evitar errores 500
     */
    #[Route('/users', name: 'admin_list_users', methods: ['GET'])]
    public function listUsers(Request $request): JsonResponse
    {
        try {
            // Obtener parámetros de paginación y filtrado
            $page = max(1, $request->query->getInt('page', 1));
            $limit = min(100, max(1, $request->query->getInt('limit', 20)));
            $role = $request->query->get('role');
            $profileType = $request->query->get('profileType');
            $search = $request->query->get('search');

            // Calcular offset para paginación
            $offset = ($page - 1) * $limit;

            // Procesar filtro de tipo de perfil
            $profileTypeEnum = null;
            if ($profileType) {
                try {
                    $profileTypeEnum = ProfileType::from($profileType);
                } catch (ValueError $e) {
                    // Ignorar filtro inválido
                    $profileTypeEnum = null;
                }
            }

            // Obtener total y usuarios
            $total = $this->userRepository->countUsersWithFilters($search, $role, $profileTypeEnum);
            $users = $this->userRepository->findUsersWithFilters($search, $role, $profileTypeEnum, $limit, $offset);

            // Transformar usuarios en formato JSON
            $usersData = [];
            foreach ($users as $user) {
                $usersData[] = [
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
                    'avatar' => $user->getAvatar()
                ];
            }

            // Calcular total de páginas
            $totalPages = ceil($total / $limit);

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
            $this->logger->error('Error al listar usuarios', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);

            return $this->json([
                'message' => 'Error interno del servidor',
                'error' => 'No se pudieron cargar los usuarios'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
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

    // --- CRUD de Contenido ---

    /**
     * Listar todo el contenido
     * 
     * ! 01/06/2025 - Corregido método para usar el repositorio inyectado correctamente
     * ! 01/06/2025 - Mejorado manejo de errores y robustez
     */
    #[Route('/content', name: 'admin_list_content', methods: ['GET'])]
    public function listContent(): JsonResponse
    {
        try {
            // Verificar que el repositorio esté disponible
            if (!$this->contentRepository) {
                $this->logger->error('ContentRepository no disponible');
                return $this->json([
                    'message' => 'Error de configuración',
                    'error' => 'Repositorio de contenido no disponible'
                ], Response::HTTP_INTERNAL_SERVER_ERROR);
            }

            $contents = $this->contentRepository->findAll();
            $data = [];

            if (empty($contents)) {
                $this->logger->info('No hay contenido disponible');
                return $this->json([]);
            }

            foreach ($contents as $content) {
                try {
                    $serializedContent = $this->serializeContent($content);
                    $data[] = $serializedContent;
                } catch (Exception $serializeException) {
                    // Log el error pero continúa con otros contenidos
                    $this->logger->warning('Error al serializar contenido individual', [
                        'contentId' => $content->getId(),
                        'error' => $serializeException->getMessage()
                    ]);
                    // Añadir un contenido de error para mantener la consistencia
                    $data[] = [
                        'id' => $content->getId(),
                        'title' => 'Error al cargar contenido',
                        'description' => 'No se pudo cargar la información completa',
                        'content' => '',
                        'type' => null,
                        'target_phase' => null,
                        'tags' => [],
                        'image_url' => null,
                        'created_at' => null,
                        'updated_at' => null,
                    ];
                }
            }

            $this->logger->info('Contenido listado exitosamente por administrador', [
                'total_items' => count($data),
                'successful_items' => count($data)
            ]);

            return $this->json($data);
        } catch (Exception $e) {
            $this->logger->error('Error crítico al listar contenido: ' . $e->getMessage(), [
                'exception' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return $this->json([
                'message' => 'Error interno del servidor',
                'error' => 'No se pudo cargar el contenido',
                'debug' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtener un contenido por ID
     * 
     * ! 01/06/2025 - Mejorado manejo de errores
     */
    #[Route('/content/{id}', name: 'admin_get_content', methods: ['GET'])]
    public function getContent(int $id): JsonResponse
    {
        try {
            $content = $this->contentRepository->find($id);

            if (!$content) {
                return $this->json(['message' => 'Contenido no encontrado'], Response::HTTP_NOT_FOUND);
            }

            return $this->json($this->serializeContent($content));
        } catch (Exception $e) {
            $this->logger->error('Error al obtener contenido: ' . $e->getMessage(), [
                'contentId' => $id,
                'exception' => $e->getMessage()
            ]);

            return $this->json([
                'message' => 'Error al obtener contenido',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Crear nuevo contenido
     * 
     * ! 01/06/2025 - Mejorado validación y manejo de enums
     */
    #[Route('/content', name: 'admin_create_content', methods: ['POST'])]
    public function createContent(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            if (!$data) {
                return $this->json(['message' => 'Datos inválidos'], Response::HTTP_BAD_REQUEST);
            }

            $content = new Content();
            $this->updateContentFromData($content, $data);

            // Validar la entidad
            $errors = $this->validator->validate($content);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[$error->getPropertyPath()] = $error->getMessage();
                }
                return $this->json(['message' => 'Errores de validación', 'errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
            }

            $this->entityManager->persist($content);
            $this->entityManager->flush();

            $this->logger->info('Contenido creado exitosamente', [
                'contentId' => $content->getId(),
                'title' => $content->getTitle()
            ]);

            return $this->json($this->serializeContent($content), Response::HTTP_CREATED);
        } catch (Exception $e) {
            $this->logger->error('Error al crear contenido: ' . $e->getMessage(), [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return $this->json([
                'message' => 'Error al crear contenido',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Actualizar contenido existente
     * 
     * ! 01/06/2025 - Mejorado manejo de errores y validación
     */
    #[Route('/content/{id}', name: 'admin_update_content', methods: ['PUT', 'PATCH'])]
    public function updateContent(int $id, Request $request): JsonResponse
    {
        try {
            $content = $this->contentRepository->find($id);

            if (!$content) {
                return $this->json(['message' => 'Contenido no encontrado'], Response::HTTP_NOT_FOUND);
            }

            $data = json_decode($request->getContent(), true);
            if (!$data) {
                return $this->json(['message' => 'Datos inválidos'], Response::HTTP_BAD_REQUEST);
            }

            $this->updateContentFromData($content, $data);

            // Validar la entidad
            $errors = $this->validator->validate($content);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[$error->getPropertyPath()] = $error->getMessage();
                }
                return $this->json(['message' => 'Errores de validación', 'errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
            }

            $this->entityManager->flush();

            $this->logger->info('Contenido actualizado exitosamente', [
                'contentId' => $content->getId(),
                'title' => $content->getTitle()
            ]);

            return $this->json($this->serializeContent($content));
        } catch (Exception $e) {
            $this->logger->error('Error al actualizar contenido: ' . $e->getMessage(), [
                'contentId' => $id,
                'exception' => $e->getMessage()
            ]);

            return $this->json([
                'message' => 'Error al actualizar contenido',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Eliminar contenido
     * 
     * ! 01/06/2025 - Mejorado manejo de errores
     */
    #[Route('/content/{id}', name: 'admin_delete_content', methods: ['DELETE'])]
    public function deleteContent(int $id): JsonResponse
    {
        try {
            $content = $this->contentRepository->find($id);

            if (!$content) {
                return $this->json(['message' => 'Contenido no encontrado'], Response::HTTP_NOT_FOUND);
            }

            $contentTitle = $content->getTitle(); // Guardar para log
            $this->entityManager->remove($content);
            $this->entityManager->flush();

            $this->logger->info('Contenido eliminado exitosamente', [
                'contentId' => $id,
                'title' => $contentTitle
            ]);

            return $this->json(['message' => 'Contenido eliminado correctamente']);
        } catch (Exception $e) {
            $this->logger->error('Error al eliminar contenido: ' . $e->getMessage(), [
                'contentId' => $id,
                'exception' => $e->getMessage()
            ]);

            return $this->json([
                'message' => 'Error al eliminar contenido',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // --- Métodos auxiliares para serializar y actualizar ---

    /**
     * ! 01/06/2025 - Corregido método de serialización para manejar enums correctamente
     * ! 01/06/2025 - Añadida protección contra errores de serialización
     */
    private function serializeContent(Content $content): array
    {
        try {
            return [
                'id' => $content->getId(),
                'title' => $content->getTitle() ?? '',
                'description' => $content->getDescription() ?? '',
                'content' => $content->getContent() ?? '',
                'type' => $content->getType() ? $content->getType()->value : null,
                'target_phase' => $content->getTargetPhase() ? $content->getTargetPhase()->value : null,
                'tags' => $content->getTags() ?? [],
                'image_url' => $content->getImageUrl(),
                'created_at' => $content->getCreatedAt()?->format('c'),
                'updated_at' => $content->getUpdatedAt()?->format('c'),
            ];
        } catch (Exception $e) {
            $this->logger->error('Error al serializar contenido', [
                'contentId' => $content->getId(),
                'error' => $e->getMessage()
            ]);
            // Retornar datos básicos en caso de error
            return [
                'id' => $content->getId(),
                'title' => 'Error al cargar título',
                'description' => 'Error al cargar descripción',
                'content' => 'Error al cargar contenido',
                'type' => null,
                'target_phase' => null,
                'tags' => [],
                'image_url' => null,
                'created_at' => null,
                'updated_at' => null,
            ];
        }
    }

    /**
     * ! 01/06/2025 - Corregido método para manejar enums correctamente y evitar errores
     */
    private function updateContentFromData(Content $content, array $data): void
    {
        if (isset($data['title'])) {
            $content->setTitle($data['title']);
        }

        if (isset($data['description'])) {
            $content->setDescription($data['description']);
        }

        if (isset($data['content'])) {
            $content->setContent($data['content']);
        }

        if (isset($data['type'])) {
            try {
                $contentType = ContentType::from($data['type']);
                $content->setType($contentType);
            } catch (ValueError $e) {
                $this->logger->warning('Tipo de contenido inválido proporcionado', [
                    'tipo_proporcionado' => $data['type'],
                    'tipos_validos' => array_map(fn($case) => $case->value, ContentType::cases())
                ]);
                // Si el tipo es inválido, mantener el actual
            }
        }

        if (isset($data['target_phase'])) {
            try {
                $cyclePhase = CyclePhase::from($data['target_phase']);
                $content->setTargetPhase($cyclePhase);
            } catch (ValueError $e) {
                $this->logger->warning('Fase de ciclo inválida proporcionada', [
                    'fase_proporcionada' => $data['target_phase'],
                    'fases_validas' => array_map(fn($case) => $case->value, CyclePhase::cases())
                ]);
                // Si la fase es inválida, mantener la actual
            }
        }

        if (isset($data['tags'])) {
            $content->setTags(is_array($data['tags']) ? $data['tags'] : []);
        }

        if (isset($data['image_url'])) {
            $content->setImageUrl($data['image_url']);
        }
    }
}
