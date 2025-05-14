<?php

namespace App\Controller;

use App\Entity\GuestAccess;
use App\Entity\User;
use App\Enum\GuestType;
use App\Repository\GuestAccessRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

#[Route('/api/guests')]
class GuestController extends AbstractController
{
    public function __construct(
        private GuestAccessRepository $guestAccessRepository,
        private UserRepository $userRepository,
        private EntityManagerInterface $entityManager
    ) {
    }

    #[Route('', name: 'api_guests_list', methods: ['GET'])]
    public function getGuestAccesses(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        $guestAccesses = $this->guestAccessRepository->findActiveForUser($user->getId());
        
        return $this->json($guestAccesses, 200, [], ['groups' => 'guest_access:read']);
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

    #[Route('/test-route', name: 'api_test', methods: ['GET'])]
    public function testRoute(): JsonResponse
    {
        return $this->json(['message' => 'Test route works!']);
    }
}
