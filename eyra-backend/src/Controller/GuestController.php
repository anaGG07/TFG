<?php

namespace App\Controller;

use App\Entity\GuestAccess;
use App\Entity\User;
use App\Enum\GuestType;
use App\Repository\GuestAccessRepository;
use App\Repository\UserRepository;
use App\Service\CalendarAccessService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

#[Route('/guests')]
class GuestController extends AbstractController
{
    public function __construct(
        private GuestAccessRepository $guestAccessRepository,
        private UserRepository $userRepository,
        private CalendarAccessService $calendarAccessService,
        private EntityManagerInterface $entityManager
    ) {
    }

    #[Route('/companions', name: 'api_guests_companions', methods: ['GET'])]
    public function getCompanions(): JsonResponse
    {
        try {
            /** @var User $user */
            $user = $this->getUser();
            if (!$user) {
                return $this->json(['error' => 'User not authenticated'], 401);
            }

            // Obtener personas que siguen a este usuario (companions)
            $companions = $this->guestAccessRepository->findBy([
                'owner' => $user->getId(),
                'state' => true
            ]);
            
            $result = array_map(function($guestAccess) {
                return [
                    'id' => $guestAccess->getId(),
                    'name' => $guestAccess->getGuest()->getName(),
                    'username' => $guestAccess->getGuest()->getUsername(),
                    'role' => $guestAccess->getGuestType()->value,
                    'status' => 'active',
                    'lastActivity' => $guestAccess->getUpdatedAt() ? $guestAccess->getUpdatedAt()->format('c') : $guestAccess->getCreatedAt()->format('c'),
                    'permissions' => $guestAccess->getAccessTo(),
                    'expiresAt' => $guestAccess->getExpiresAt() ? $guestAccess->getExpiresAt()->format('c') : null,
                    'guestPreferences' => $guestAccess->getGuestPreferences() ?? []
                ];
            }, $companions);
            
            return $this->json($result);
        } catch (\Exception $e) {
            error_log("GuestController::getCompanions error: " . $e->getMessage());
            return $this->json([
                'error' => 'Error loading companions',
                'message' => $e->getMessage(),
                'companions' => []
            ], 500);
        }
    }

    #[Route('/following', name: 'api_guests_following', methods: ['GET'])]
    public function getFollowing(): JsonResponse
    {
        try {
            /** @var User $user */
            $user = $this->getUser();
            if (!$user) {
                return $this->json(['error' => 'User not authenticated'], 401);
            }

            // Obtener usuarios a los que este usuario sigue (following)
            $following = $this->guestAccessRepository->findBy([
                'guest' => $user->getId(),
                'state' => true
            ]);
            
            $result = array_map(function($guestAccess) {
                return [
                    'id' => $guestAccess->getId(),
                    'ownerName' => $guestAccess->getOwner()->getName(),
                    'ownerUsername' => $guestAccess->getOwner()->getUsername(),
                    'role' => $guestAccess->getGuestType()->value,
                    'lastActivity' => $guestAccess->getUpdatedAt() ? $guestAccess->getUpdatedAt()->format('c') : $guestAccess->getCreatedAt()->format('c'),
                    'permissions' => $guestAccess->getAccessTo(),
                    'guestPreferences' => $guestAccess->getGuestPreferences() ?? []
                ];
            }, $following);
            
            return $this->json($result);
        } catch (\Exception $e) {
            error_log("GuestController::getFollowing error: " . $e->getMessage());
            return $this->json([
                'error' => 'Error loading following',
                'message' => $e->getMessage(),
                'following' => []
            ], 500);
        }
    }

    #[Route('', name: 'api_guests_create', methods: ['POST'])]
    public function createGuestAccess(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }
        
        $data = json_decode($request->getContent(), true);
        
        // Verificar datos requeridos
        if (!isset($data['guestId'], $data['guestType'], $data['accessTo'])) {
            return $this->json(['message' => 'Missing required fields'], 400);
        }
        
        // Buscar usuario invitado
        $guest = $this->userRepository->find($data['guestId']);
        if (!$guest) {
            return $this->json(['message' => 'Guest user not found'], 404);
        }
        
        // Verificar que no exista ya un acceso activo para este invitado
        $existingAccess = $this->guestAccessRepository->findOneBy([
            'owner' => $user->getId(),
            'guest' => $guest->getId(),
            'state' => true
        ]);
        
        if ($existingAccess) {
            return $this->json(['message' => 'Guest access already exists'], 409);
        }
        
        // Crear nuevo acceso
        $guestAccess = new GuestAccess();
        $guestAccess->setOwner($user);
        $guestAccess->setGuest($guest);
        $guestAccess->setGuestType(GuestType::from($data['guestType']));
        $guestAccess->setAccessTo($data['accessTo']);
        
        // Configurar fecha de expiración si se proporciona
        if (isset($data['expiresAt'])) {
            $guestAccess->setExpiresAt(new \DateTime($data['expiresAt']));
        } else {
            // Por defecto, acceso de 1 año
            $guestAccess->setExpiresAt(new \DateTime('+1 year'));
        }
        
        $this->entityManager->persist($guestAccess);
        $this->entityManager->flush();
        
        return $this->json($guestAccess, 201, [], ['groups' => 'guest_access:read']);
    }

    #[Route('/{id}', name: 'api_guests_revoke', methods: ['DELETE'])]
    public function revokeGuestAccess(int $id): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }
        
        $guestAccess = $this->guestAccessRepository->find($id);
        if (!$guestAccess) {
            return $this->json(['message' => 'Guest access not found'], 404);
        }
        
        // Verificar que el usuario sea el propietario
        if ($guestAccess->getOwner()->getId() !== $user->getId()) {
            throw new AccessDeniedException('Not authorized to modify this guest access');
        }
        
        // Revocar acceso (marcar como inactivo en lugar de eliminar)
        $guestAccess->setState(false);
        $this->entityManager->flush();
        
        return $this->json(['message' => 'Guest access revoked']);
    }

    #[Route('/{id}/modify', name: 'api_guests_modify', methods: ['PUT'])]
    public function modifyGuestAccess(int $id, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }
        
        $guestAccess = $this->guestAccessRepository->find($id);
        if (!$guestAccess) {
            return $this->json(['message' => 'Guest access not found'], 404);
        }
        
        // Verificar que el usuario sea el propietario
        if ($guestAccess->getOwner()->getId() !== $user->getId()) {
            throw new AccessDeniedException('Not authorized to modify this guest access');
        }
        
        $data = json_decode($request->getContent(), true);
        
        // Actualizar permisos de acceso
        if (isset($data['accessTo'])) {
            $guestAccess->setAccessTo($data['accessTo']);
        }
        
        // Actualizar tipo de invitado
        if (isset($data['guestType'])) {
            $guestAccess->setGuestType(GuestType::from($data['guestType']));
        }
        
        // Actualizar fecha de expiración
        if (isset($data['expiresAt'])) {
            $guestAccess->setExpiresAt(new \DateTime($data['expiresAt']));
        }
        
        $this->entityManager->flush();
        
        return $this->json($guestAccess, 200, [], ['groups' => 'guest_access:read']);
    }

    #[Route('/invitations', name: 'api_guests_invitations', methods: ['GET'])]
    public function getInvitations(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }
        
        // Obtener accesos donde el usuario es invitado
        $invitations = $this->guestAccessRepository->findBy([
            'guest' => $user->getId(),
            'state' => true
        ]);
        
        return $this->json($invitations, 200, [], ['groups' => 'guest_access:read']);
    }

    // ! 31/05/2025 - Nuevos endpoints para gestión de preferencias del invitado
    #[Route('/{id}/preferences', name: 'api_guests_preferences_get', methods: ['GET'])]
    public function getGuestPreferences(int $id): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        $guestAccess = $this->guestAccessRepository->find($id);
        if (!$guestAccess) {
            return $this->json(['message' => 'Guest access not found'], 404);
        }

        // Verificar que el usuario sea el invitado (guest)
        if ($guestAccess->getGuest()->getId() !== $user->getId()) {
            throw new AccessDeniedException('Not authorized to view these preferences');
        }

        return $this->json([
            'id' => $guestAccess->getId(),
            'guestPreferences' => $guestAccess->getGuestPreferences(),
            'availablePermissions' => $this->calendarAccessService->getAvailablePermissions(),
            'hostPermissions' => $guestAccess->getAccessTo()
        ]);
    }

    #[Route('/{id}/preferences', name: 'api_guests_preferences_update', methods: ['PUT'])]
    public function updateGuestPreferences(int $id, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        $guestAccess = $this->guestAccessRepository->find($id);
        if (!$guestAccess) {
            return $this->json(['message' => 'Guest access not found'], 404);
        }

        // Verificar que el usuario sea el invitado (guest)
        if ($guestAccess->getGuest()->getId() !== $user->getId()) {
            throw new AccessDeniedException('Not authorized to modify these preferences');
        }

        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['guestPreferences'])) {
            return $this->json(['message' => 'Missing guestPreferences field'], 400);
        }

        // Validar que las preferencias estén dentro de los permisos del anfitrión
        $hostPermissions = $guestAccess->getAccessTo();
        $requestedPreferences = $data['guestPreferences'];
        
        $invalidPreferences = array_diff($requestedPreferences, $hostPermissions);
        if (!empty($invalidPreferences)) {
            return $this->json([
                'message' => 'Some preferences are not allowed by the host',
                'invalidPreferences' => $invalidPreferences,
                'allowedPermissions' => $hostPermissions
            ], 400);
        }

        $guestAccess->setGuestPreferences($requestedPreferences);
        $this->entityManager->flush();

        return $this->json([
            'message' => 'Guest preferences updated successfully',
            'guestAccess' => $guestAccess
        ], 200, [], ['groups' => 'guest_access:read']);
    }

    // ! 31/05/2025 - Endpoint para que el anfitrión gestione permisos
    #[Route('/{id}/permissions', name: 'api_guests_permissions_update', methods: ['PUT'])]
    public function updateGuestPermissions(int $id, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        $guestAccess = $this->guestAccessRepository->find($id);
        if (!$guestAccess) {
            return $this->json(['message' => 'Guest access not found'], 404);
        }

        // Verificar que el usuario sea el propietario (owner)
        if ($guestAccess->getOwner()->getId() !== $user->getId()) {
            throw new AccessDeniedException('Not authorized to modify permissions for this guest access');
        }

        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['accessTo'])) {
            return $this->json(['message' => 'Missing accessTo field'], 400);
        }

        $newPermissions = $data['accessTo'];
        $currentPreferences = $guestAccess->getGuestPreferences();

        // Actualizar permisos
        $guestAccess->setAccessTo($newPermissions);

        // Si hay preferencias del invitado, filtrarlas para mantener solo las válidas
        if ($currentPreferences) {
            $validPreferences = array_intersect($currentPreferences, $newPermissions);
            $guestAccess->setGuestPreferences($validPreferences);
        }

        $this->entityManager->flush();

        return $this->json([
            'message' => 'Guest permissions updated successfully',
            'guestAccess' => $guestAccess,
            'adjustedPreferences' => $currentPreferences !== $guestAccess->getGuestPreferences()
        ], 200, [], ['groups' => 'guest_access:read']);
    }

    // ! 31/05/2025 - Endpoint para obtener permisos disponibles
    #[Route('/available-permissions', name: 'api_guests_available_permissions', methods: ['GET'])]
    public function getAvailablePermissions(): JsonResponse
    {
        return $this->json([
            'permissions' => $this->calendarAccessService->getAvailablePermissions()
        ]);
    }

    #[Route('/test-endpoints', name: 'api_guests_test_endpoints', methods: ['GET'])]
    public function testEndpoints(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        return $this->json([
            'message' => 'Guest endpoints are working',
            'user' => [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
                'email' => $user->getEmail()
            ],
            'endpoints_available' => [
                '/api/guests/companions',
                '/api/guests/following',
                '/api/guests/test-endpoints'
            ]
        ]);
    }
}
