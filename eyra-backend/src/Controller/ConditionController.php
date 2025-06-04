<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Condition;
use App\Entity\UserCondition;
use App\Repository\ConditionRepository;
use App\Repository\UserConditionRepository;
use App\Service\NotificationService;
use App\Enum\ConditionCategory;
use App\Enum\ConditionSeverity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Doctrine\ORM\EntityManagerInterface;

#[Route('/conditions')]
class ConditionController extends AbstractController
{
    public function __construct(
        private ConditionRepository $conditionRepository,
        private UserConditionRepository $userConditionRepository,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator,
        private EntityManagerInterface $entityManager,
        private NotificationService $notificationService
    ) {
    }

    #[Route('', name: 'api_conditions_list', methods: ['GET'])]
    public function getConditions(): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Obtener todas las condiciones
        $conditions = $this->conditionRepository->findAll();
        // Serializar manualmente para evitar hydra
        $data = [];
        foreach ($conditions as $condition) {
            $data[] = [
                'id' => $condition->getId(),
                'name' => $condition->getName(),
                'description' => $condition->getDescription(),
                'isChronic' => $condition->getIsChronic(),
                'category' => $condition->getCategory(),
                'severity' => $condition->getSeverity(),
                'state' => $condition->getState(),
                'createdAt' => $condition->getCreatedAt()?->format('c'),
                'updatedAt' => $condition->getUpdatedAt()?->format('c'),
            ];
        }
        return $this->json($data);
    }

    #[Route('/active', name: 'api_conditions_active', methods: ['GET'])]
    public function getActiveConditions(): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // ! 28/05/2025 - Implementado endpoint para obtener solo condiciones activas
        // Obtener todas las condiciones con state=true
        $conditions = $this->conditionRepository->findBy(['state' => true]);
        
        return $this->json($conditions, 200, [], ['groups' => 'condition:read']);
    }

    #[Route('/{id}', name: 'api_conditions_get', methods: ['GET'])]
    public function getCondition(int $id): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Buscar la condición
        $condition = $this->conditionRepository->find($id);
        
        if (!$condition) {
            return $this->json(['message' => 'Condition not found'], 404);
        }
        
        return $this->json($condition, 200, [], ['groups' => 'condition:read']);
    }

    #[Route('/user', name: 'api_user_conditions', methods: ['GET'])]
    public function getUserConditions(): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Obtener condiciones activas del usuario
        $userConditions = $this->userConditionRepository->findActiveByUser($user->getId());
        
        return $this->json($userConditions, 200, [], [
            'groups' => ['user_condition:read', 'condition:read']
        ]);
    }

    #[Route('/user/add', name: 'api_user_conditions_add', methods: ['POST'])]
    public function addUserCondition(Request $request): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Parsear datos
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['conditionId']) || !isset($data['startDate'])) {
            return $this->json(['message' => 'Missing required fields: conditionId, startDate'], 400);
        }
        
        // Buscar la condición
        $condition = $this->conditionRepository->find($data['conditionId']);
        if (!$condition) {
            return $this->json(['message' => 'Condition not found'], 404);
        }
        
        // Crear una nueva relación UserCondition
        $userCondition = new UserCondition();
        $userCondition->setUser($user);
        $userCondition->setCondition($condition);
        $userCondition->setStartDate(new \DateTime($data['startDate']));
        
        // Establecer fecha de fin si existe
        if (isset($data['endDate'])) {
            $userCondition->setEndDate(new \DateTime($data['endDate']));
        }
        
        // Establecer notas si existen
        if (isset($data['notes'])) {
            $userCondition->setNotes($data['notes']);
        }
        
        // Validar
        $errors = $this->validator->validate($userCondition);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['message' => 'Validation failed', 'errors' => $errorMessages], 400);
        }
        
        // Guardar
        $this->userConditionRepository->save($userCondition, true);
        
        // Crear notificación sobre la nueva condición
        $this->notificationService->createMedicalNotification(
            $user,
            $condition,
            'Nueva condición registrada',
            "Se ha registrado la condición {$condition->getName()} en tu perfil.",
            NotificationService::PRIORITY_NORMAL
        );
        
        return $this->json($userCondition, 201, [], [
            'groups' => ['user_condition:read', 'condition:read']
        ]);
    }

    #[Route('/user/{id}', name: 'api_user_conditions_update', methods: ['PUT'])]
    public function updateUserCondition(int $id, Request $request): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }
        
        // Buscar la relación UserCondition
        $userCondition = $this->userConditionRepository->find($id);
        if (!$userCondition) {
            return $this->json(['message' => 'User condition not found'], 404);
        }
        
        // Verificar que pertenece al usuario autenticado
        if ($userCondition->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('Cannot modify condition from another user');
        }
        
        // Parsear datos
        $data = json_decode($request->getContent(), true);
        
        // Actualizar campos permitidos
        if (isset($data['endDate'])) {
            $userCondition->setEndDate(new \DateTime($data['endDate']));
        }
        
        if (isset($data['notes'])) {
            $userCondition->setNotes($data['notes']);
        }
        
        // No permitimos cambiar la condición o el usuario, solo los detalles
        
        // Validar
        $errors = $this->validator->validate($userCondition);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['message' => 'Validation failed', 'errors' => $errorMessages], 400);
        }
        
        // Guardar
        $this->userConditionRepository->save($userCondition, true);
        
        return $this->json($userCondition, 200, [], [
            'groups' => ['user_condition:read', 'condition:read']
        ]);
    }

    #[Route('/user/{id}', name: 'api_user_conditions_delete', methods: ['DELETE'])]
    public function removeUserCondition(int $id): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }
        
        // Buscar la relación UserCondition
        $userCondition = $this->userConditionRepository->find($id);
        if (!$userCondition) {
            return $this->json(['message' => 'User condition not found'], 404);
        }
        
        // Verificar que pertenece al usuario autenticado
        if ($userCondition->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('Cannot delete condition from another user');
        }
        
        // En lugar de eliminar físicamente, marcamos como inactivo
        $userCondition->setState(false);
        $this->userConditionRepository->save($userCondition, true);
        
        return $this->json(['message' => 'User condition removed successfully'], 200);
    }

    #[Route('/user/active', name: 'api_user_conditions_active', methods: ['GET'])]
    public function getActiveUserConditions(): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Obtener solo las condiciones activas (sin fecha de fin o con fecha futura)
        $activeConditions = $this->userConditionRepository->findActiveByUser($user->getId());
        
        return $this->json($activeConditions, 200, [], [
            'groups' => ['user_condition:read', 'condition:read']
        ]);
    }

    #[Route('/content/{id}', name: 'api_conditions_content', methods: ['GET'])]
    public function getRelatedContent(int $id): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Buscar la condición
        $condition = $this->conditionRepository->find($id);
        
        if (!$condition) {
            return $this->json(['message' => 'Condition not found'], 404);
        }
        
        // Obtener contenido relacionado
        $content = $condition->getRelatedContent()->toArray();
        
        return $this->json($content, 200, [], ['groups' => 'content:read']);
    }
    
    #[Route('/notifications/{id}', name: 'api_conditions_notifications', methods: ['GET'])]
    public function getRelatedNotifications(int $id): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Buscar la condición
        $condition = $this->conditionRepository->find($id);
        
        if (!$condition) {
            return $this->json(['message' => 'Condition not found'], 404);
        }
        
        // Obtener notificaciones relacionadas
        $notifications = $this->entityManager->createQueryBuilder()
            ->select('n')
            ->from('App\\Entity\\Notification', 'n')
            ->where('n.relatedCondition = :condition')
            ->andWhere('n.user = :user')
            ->setParameter('condition', $condition)
            ->setParameter('user', $user)
            ->orderBy('n.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
        
        return $this->json($notifications, 200, [], ['groups' => 'notification:read']);
    }

    /* ! 31/05/2025 - Endpoints de administración para condiciones médicas (solo ROLE_ADMIN) */

    #[Route('', name: 'api_conditions_create', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function createCondition(Request $request): JsonResponse
    {
        // Parsear datos
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['name']) || !isset($data['description'])) {
            return $this->json(['message' => 'Missing required fields: name, description'], 400);
        }
        
        // Crear nueva condición
        $condition = new Condition();
        $condition->setName($data['name']);
        $condition->setDescription($data['description']);
        
        // Campos opcionales
        if (isset($data['isChronic'])) {
            $condition->setIsChronic((bool) $data['isChronic']);
        }
        
        if (isset($data['category'])) {
            $condition->setCategory($data['category']);
        }
        
        if (isset($data['severity'])) {
            $condition->setSeverity($data['severity']);
        }
        
        if (isset($data['state'])) {
            $condition->setState((bool) $data['state']);
        }
        
        // Validar
        $errors = $this->validator->validate($condition);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['message' => 'Validation failed', 'errors' => $errorMessages], 400);
        }
        
        // Guardar
        $this->conditionRepository->save($condition, true);
        
        return $this->json([
            'message' => 'Condition created successfully',
            'condition' => $condition
        ], 201, [], ['groups' => 'condition:read']);
    }

    #[Route('/{id}', name: 'api_conditions_update', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function updateCondition(int $id, Request $request): JsonResponse
    {
        // Buscar la condición
        $condition = $this->conditionRepository->find($id);
        if (!$condition) {
            return $this->json(['message' => 'Condition not found'], 404);
        }
        
        // Parsear datos
        $data = json_decode($request->getContent(), true);
        
        // Actualizar campos
        if (isset($data['name'])) {
            $condition->setName($data['name']);
        }
        
        if (isset($data['description'])) {
            $condition->setDescription($data['description']);
        }
        
        if (isset($data['isChronic'])) {
            $condition->setIsChronic((bool) $data['isChronic']);
        }
        
        if (isset($data['category'])) {
            $condition->setCategory($data['category']);
        }
        
        if (isset($data['severity'])) {
            $condition->setSeverity($data['severity']);
        }
        
        if (isset($data['state'])) {
            $condition->setState((bool) $data['state']);
        }
        
        // Validar
        $errors = $this->validator->validate($condition);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['message' => 'Validation failed', 'errors' => $errorMessages], 400);
        }
        
        // Guardar
        $this->conditionRepository->save($condition, true);
        
        return $this->json([
            'message' => 'Condition updated successfully',
            'condition' => $condition
        ], 200, [], ['groups' => 'condition:read']);
    }

    #[Route('/{id}', name: 'api_conditions_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function deleteCondition(int $id): JsonResponse
    {
        // Buscar la condición
        $condition = $this->conditionRepository->find($id);
        if (!$condition) {
            return $this->json(['message' => 'Condition not found'], 404);
        }
        
        // Verificar si hay usuarios con esta condición activa
        $activeUserConditions = $this->userConditionRepository->findBy([
            'condition' => $condition,
            'state' => true
        ]);
        
        if (!empty($activeUserConditions)) {
            // En lugar de eliminar físicamente, desactivamos la condición
            $condition->setState(false);
            $this->conditionRepository->save($condition, true);
            
            return $this->json([
                'message' => 'Condition deactivated successfully (was in use by users)',
                'action' => 'deactivated'
            ], 200);
        }
        
        // Si no hay usuarios que la usen, eliminar físicamente
        $this->conditionRepository->remove($condition, true);
        
        return $this->json([
            'message' => 'Condition deleted successfully',
            'action' => 'deleted'
        ], 200);
    }

    #[Route('/search', name: 'api_conditions_search', methods: ['GET'])]
    public function searchConditions(Request $request): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        $query = $request->query->get('query');
        if (!$query) {
            return $this->json(['message' => 'Query parameter is required'], 400);
        }
        
        $category = $request->query->get('category');
        $state = $request->query->get('state');
        
        // Convertir state a boolean si se proporciona
        if ($state !== null) {
            $state = filter_var($state, FILTER_VALIDATE_BOOLEAN);
        }
        
        $conditions = $this->conditionRepository->search($query, $category, $state);
        
        return $this->json([
            'query' => $query,
            'category' => $category,
            'state' => $state,
            'results' => $conditions,
            'count' => count($conditions)
        ], 200, [], ['groups' => 'condition:read']);
    }

    #[Route('/categories', name: 'api_conditions_categories', methods: ['GET'])]
    public function getCategories(): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Obtener categorías del enum
        $enumCategories = [];
        foreach (ConditionCategory::cases() as $category) {
            $enumCategories[] = [
                'value' => $category->value,
                'label' => $category->getLabel(),
                'description' => $category->getDescription()
            ];
        }
        
        // Obtener categorías que realmente se usan en la BD
        $usedCategories = $this->conditionRepository->getUniqueCategories();
        
        // Obtener severidades del enum
        $enumSeverities = [];
        foreach (ConditionSeverity::cases() as $severity) {
            $enumSeverities[] = [
                'value' => $severity->value,
                'label' => $severity->getLabel(),
                'description' => $severity->getDescription()
            ];
        }
        
        return $this->json([
            'availableCategories' => $enumCategories,
            'usedCategories' => $usedCategories,
            'availableSeverities' => $enumSeverities
        ], 200);
    }
}