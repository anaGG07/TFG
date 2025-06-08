<?php

namespace App\Service;

use App\Entity\User;
use App\Entity\GuestAccess;
use App\Repository\UserRepository;
use App\Repository\GuestAccessRepository;
use App\Service\InvitationCodeService;
use App\Service\EmailService;
use Doctrine\ORM\EntityManagerInterface;

// ! 08/06/2025 - Servicio para búsqueda de usuarios y gestión de invitaciones directas

class UserSearchService
{
    public function __construct(
        private UserRepository $userRepository,
        private GuestAccessRepository $guestAccessRepository,
        private InvitationCodeService $invitationCodeService,
        private EmailService $emailService,
        private EntityManagerInterface $entityManager
    ) {
    }

    /**
     * Busca un usuario por email
     * Verifica si existe, si permite ser encontrado y si ya hay conexión
     */
    public function searchByEmail(string $email, User $searcher): array
    {
        // Buscar usuario por email
        $user = $this->userRepository->findOneBy(['email' => $email]);

        if (!$user) {
            return [
                'exists' => false,
                'canInvite' => true, // Para emails no registrados, siempre se puede invitar
                'message' => 'Usuario no registrado en EYRA'
            ];
        }

        // Verificar si es el mismo usuario
        if ($user->getId() === $searcher->getId()) {
            return [
                'exists' => true,
                'canInvite' => false,
                'message' => 'No puedes invitarte a ti mismo'
            ];
        }

        // Verificar si ya hay una conexión existente
        $existingConnection = $this->checkExistingConnection($user, $searcher);
        if ($existingConnection) {
            return [
                'exists' => true,
                'canInvite' => false,
                'message' => $existingConnection['message'],
                'isAlreadyConnected' => true
            ];
        }

        // Verificar configuración de privacidad
        if (!$user->isAllowSearchable()) {
            return [
                'exists' => true,
                'canInvite' => false,
                'message' => 'Este usuario no permite ser encontrado'
            ];
        }

        return [
            'exists' => true,
            'canInvite' => true,
            'displayName' => $user->getName(),
            'username' => $user->getUsername(),
            'message' => 'Usuario encontrado y disponible para invitar'
        ];
    }

    /**
     * Busca un usuario por username
     * Respeta la configuración de privacidad del usuario
     */
    public function searchByUsername(string $username, User $searcher): array
    {
        // Limpiar @ si viene incluido
        $cleanUsername = ltrim($username, '@');

        // Buscar usuario por username
        $user = $this->userRepository->findOneBy(['username' => $cleanUsername]);

        if (!$user) {
            return [
                'found' => false,
                'canInvite' => false,
                'message' => 'Usuario no encontrado'
            ];
        }

        // Verificar si es el mismo usuario
        if ($user->getId() === $searcher->getId()) {
            return [
                'found' => true,
                'canInvite' => false,
                'message' => 'No puedes invitarte a ti mismo'
            ];
        }

        // Verificar configuración de privacidad ANTES de verificar conexiones
        if (!$user->isAllowSearchable()) {
            return [
                'found' => false,
                'canInvite' => false,
                'message' => 'Solo puedes buscar usuarios que permiten ser encontrados'
            ];
        }

        // Verificar si ya hay una conexión existente
        $existingConnection = $this->checkExistingConnection($user, $searcher);
        if ($existingConnection) {
            return [
                'found' => true,
                'canInvite' => false,
                'displayName' => $user->getName(),
                'username' => $user->getUsername(),
                'message' => $existingConnection['message'],
                'isAlreadyConnected' => true
            ];
        }

        return [
            'found' => true,
            'canInvite' => true,
            'displayName' => $user->getName(),
            'username' => $user->getUsername(),
            'message' => 'Usuario encontrado y disponible para invitar'
        ];
    }

    /**
     * Invita a un usuario encontrado directamente
     * Genera un código y se lo envía por email
     */
    public function inviteFoundUser(array $invitationData, User $inviter): array
    {
        $searchType = $invitationData['searchType'];
        $searchQuery = $invitationData['searchQuery'];
        $guestType = $invitationData['guestType'];
        $accessPermissions = $invitationData['accessPermissions'];
        $expirationHours = $invitationData['expirationHours'] ?? 48;

        // Buscar usuario según el tipo de búsqueda
        if ($searchType === 'email') {
            $searchResult = $this->searchByEmail($searchQuery, $inviter);
            if (!$searchResult['exists'] || !$searchResult['canInvite']) {
                throw new \InvalidArgumentException($searchResult['message']);
            }
            $targetUser = $this->userRepository->findOneBy(['email' => $searchQuery]);
            $targetEmail = $searchQuery;
        } else {
            $searchResult = $this->searchByUsername($searchQuery, $inviter);
            if (!$searchResult['found'] || !$searchResult['canInvite']) {
                throw new \InvalidArgumentException($searchResult['message']);
            }
            $cleanUsername = ltrim($searchQuery, '@');
            $targetUser = $this->userRepository->findOneBy(['username' => $cleanUsername]);
            $targetEmail = $targetUser->getEmail();
        }

        // Generar código de invitación
        $invitationCode = $this->invitationCodeService->generateCode(
            $inviter,
            $guestType,
            $accessPermissions,
            $expirationHours
        );

        // Enviar emails de notificación
        $inviterEmailSent = $this->emailService->sendInvitationSentEmail(
            $inviter->getEmail(),
            $inviter->getName(),
            $targetEmail,
            $invitationCode->getCode(),
            $guestType,
            $accessPermissions,
            $invitationCode->getExpiresAt()
        );

        $invitedEmailSent = $this->emailService->sendInvitationReceivedEmail(
            $targetEmail,
            $inviter->getName(),
            $invitationCode->getCode(),
            $guestType,
            $accessPermissions,
            $invitationCode->getExpiresAt()
        );

        return [
            'success' => true,
            'invitation' => [
                'id' => $invitationCode->getId(),
                'code' => $invitationCode->getCode(),
                'type' => $invitationCode->getGuestType(),
                'targetUser' => [
                    'name' => $targetUser->getName(),
                    'username' => $targetUser->getUsername(),
                    'email' => $targetEmail
                ]
            ],
            'emails' => [
                'inviterNotified' => $inviterEmailSent,
                'invitedNotified' => $invitedEmailSent
            ],
            'message' => 'Invitación enviada exitosamente'
        ];
    }

    /**
     * Verifica si ya existe una conexión entre dos usuarios
     * Retorna información sobre la conexión existente o null si no hay
     */
    private function checkExistingConnection(User $targetUser, User $searcher): ?array
    {
        // Verificar si el searcher ya es companion del targetUser
        $existingAsCompanion = $this->guestAccessRepository->findOneBy([
            'owner' => $targetUser,
            'guest' => $searcher,
            'state' => true
        ]);

        if ($existingAsCompanion) {
            return [
                'type' => 'companion',
                'message' => 'Ya tienes acceso a los datos de este usuario'
            ];
        }

        // Verificar si el targetUser ya es companion del searcher
        $existingAsOwner = $this->guestAccessRepository->findOneBy([
            'owner' => $searcher,
            'guest' => $targetUser,
            'state' => true
        ]);

        if ($existingAsOwner) {
            return [
                'type' => 'owner',
                'message' => 'Este usuario ya tiene acceso a tus datos'
            ];
        }

        return null;
    }
}
