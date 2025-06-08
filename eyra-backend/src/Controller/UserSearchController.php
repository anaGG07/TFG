<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\UserSearchService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

// ! 08/06/2025 - Controlador para búsqueda de usuarios y funcionalidades de invitación directa

#[Route('/users/search')]
class UserSearchController extends AbstractController
{
    public function __construct(
        private UserSearchService $userSearchService
    ) {
    }

    /**
     * Busca un usuario por email
     * Verifica existencia, disponibilidad y configuración de privacidad
     */
    #[Route('/email', name: 'api_users_search_email', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function searchByEmail(Request $request): JsonResponse
    {
        try {
            /** @var User|null $user */
            $user = $this->getUser();
            if (!$user instanceof User) {
                return $this->json(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
            }

            $data = json_decode($request->getContent(), true);

            // Validar entrada
            if (!isset($data['email']) || empty(trim($data['email']))) {
                return $this->json([
                    'error' => 'Email is required'
                ], Response::HTTP_BAD_REQUEST);
            }

            $email = trim($data['email']);

            // Validar formato de email
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return $this->json([
                    'error' => 'Invalid email format'
                ], Response::HTTP_BAD_REQUEST);
            }

            // Realizar búsqueda
            $result = $this->userSearchService->searchByEmail($email, $user);

            return $this->json($result);

        } catch (\Exception $e) {
            error_log("UserSearchController::searchByEmail error: " . $e->getMessage());
            return $this->json([
                'error' => 'Error searching user by email',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Busca un usuario por username
     * Respeta la configuración de privacidad del usuario
     */
    #[Route('/username', name: 'api_users_search_username', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function searchByUsername(Request $request): JsonResponse
    {
        try {
            /** @var User|null $user */
            $user = $this->getUser();
            if (!$user instanceof User) {
                return $this->json(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
            }

            $data = json_decode($request->getContent(), true);

            // Validar entrada
            if (!isset($data['username']) || empty(trim($data['username']))) {
                return $this->json([
                    'error' => 'Username is required'
                ], Response::HTTP_BAD_REQUEST);
            }

            $username = trim($data['username']);

            // Validar longitud mínima
            $cleanUsername = ltrim($username, '@');
            if (strlen($cleanUsername) < 3) {
                return $this->json([
                    'error' => 'Username must be at least 3 characters long'
                ], Response::HTTP_BAD_REQUEST);
            }

            // Realizar búsqueda
            $result = $this->userSearchService->searchByUsername($username, $user);

            return $this->json($result);

        } catch (\Exception $e) {
            error_log("UserSearchController::searchByUsername error: " . $e->getMessage());
            return $this->json([
                'error' => 'Error searching user by username',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Invita a un usuario encontrado
     * Genera código de invitación y envía emails
     */
    #[Route('/invite', name: 'api_users_search_invite', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function inviteFoundUser(Request $request): JsonResponse
    {
        try {
            /** @var User|null $user */
            $user = $this->getUser();
            if (!$user instanceof User) {
                return $this->json(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
            }

            $data = json_decode($request->getContent(), true);

            // Validar datos requeridos
            $violations = $this->validateInviteRequest($data);
            if (!empty($violations)) {
                return $this->json([
                    'error' => 'Validation failed',
                    'violations' => $violations
                ], Response::HTTP_BAD_REQUEST);
            }

            // Procesar invitación
            $result = $this->userSearchService->inviteFoundUser($data, $user);

            return $this->json($result, Response::HTTP_CREATED);

        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'error' => 'Invalid request',
                'message' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            error_log("UserSearchController::inviteFoundUser error: " . $e->getMessage());
            return $this->json([
                'error' => 'Error inviting user',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Valida los datos de la solicitud de invitación
     */
    private function validateInviteRequest(array $data): array
    {
        $violations = [];

        // Validar searchType
        if (!isset($data['searchType']) || !in_array($data['searchType'], ['email', 'username'])) {
            $violations[] = 'searchType must be either "email" or "username"';
        }

        // Validar searchQuery
        if (!isset($data['searchQuery']) || empty(trim($data['searchQuery']))) {
            $violations[] = 'searchQuery is required';
        }

        // Validar guestType
        if (!isset($data['guestType'])) {
            $violations[] = 'guestType is required';
        } elseif (!in_array($data['guestType'], ['partner', 'parental', 'friend', 'healthcare_provider'])) {
            $violations[] = 'Invalid guestType value';
        }

        // Validar accessPermissions
        if (!isset($data['accessPermissions']) || !is_array($data['accessPermissions'])) {
            $violations[] = 'accessPermissions must be an array';
        } elseif (empty($data['accessPermissions'])) {
            $violations[] = 'At least one access permission is required';
        }

        // Validar expirationHours si se proporciona
        if (isset($data['expirationHours'])) {
            if (!is_int($data['expirationHours']) || $data['expirationHours'] < 1 || $data['expirationHours'] > 168) {
                $violations[] = 'expirationHours must be between 1 and 168 hours';
            }
        }

        return $violations;
    }
}
