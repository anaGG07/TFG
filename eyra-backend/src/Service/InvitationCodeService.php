<?php

namespace App\Service;

use App\Entity\InvitationCode;
use App\Entity\GuestAccess;
use App\Entity\User;
use App\Repository\InvitationCodeRepository;
use App\Repository\GuestAccessRepository;
use App\Enum\GuestType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

// ! 28/05/2025 - Servicio creado para gestionar la lógica de negocio de códigos de invitación

class InvitationCodeService
{
    private EntityManagerInterface $entityManager;
    private InvitationCodeRepository $invitationCodeRepository;
    private GuestAccessRepository $guestAccessRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        InvitationCodeRepository $invitationCodeRepository,
        GuestAccessRepository $guestAccessRepository
    ) {
        $this->entityManager = $entityManager;
        $this->invitationCodeRepository = $invitationCodeRepository;
        $this->guestAccessRepository = $guestAccessRepository;
    }

    // ! 28/05/2025 - Genera un nuevo código de invitación
    public function generateCode(
        User $creator,
        string $guestType,
        array $accessPermissions,
        int $expirationHours = 48
    ): InvitationCode {
        // Generar tiempo de expiración
        $expiresAt = new \DateTime();
        $expiresAt->modify("+{$expirationHours} hours");

        // Crear código con cadena aleatoria
        $code = new InvitationCode($creator, $guestType, $accessPermissions, $expiresAt);
        $code->setCode($this->generateUniqueCode());

        // Guardar en la base de datos
        $this->entityManager->persist($code);
        $this->entityManager->flush();

        return $code;
    }

    // ! 28/05/2025 - Verifica si un código es válido y lo devuelve
    public function verifyCode(string $code): ?InvitationCode
    {
        // Limpiar códigos expirados primero
        $this->invitationCodeRepository->updateExpiredCodes();

        // Ahora buscar código válido
        return $this->invitationCodeRepository->findValidCode($code);
    }

    // ! 28/05/2025 - Canjea un código para crear un acceso de invitado
    public function redeemCode(string $code, User $guestUser): GuestAccess
    {
        $invitationCode = $this->verifyCode($code);

        if (!$invitationCode) {
            throw new \InvalidArgumentException('Invalid or expired invitation code');
        }

        // Prevenir auto-invitaciones
        if ($invitationCode->getCreator()->getId() === $guestUser->getId()) {
            throw new \LogicException('You cannot redeem your own invitation code');
        }

        // Verificar si el acceso ya existe
        $existingAccess = $this->guestAccessRepository->findOneBy([
            'owner' => $invitationCode->getCreator(),
            'guest' => $guestUser
        ]);

        if ($existingAccess) {
            throw new \LogicException('You already have access to this user\'s data');
        }

        // Marcar código como canjeado
        $invitationCode->redeem($guestUser);

        // Crear nuevo acceso de invitado
        $guestAccess = new GuestAccess();
        $guestAccess->setOwner($invitationCode->getCreator());
        $guestAccess->setGuest($guestUser);

        // Convertir string guestType a enum GuestType
        $guestTypeEnum = GuestType::from($invitationCode->getGuestType());
        $guestAccess->setGuestType($guestTypeEnum);

        $guestAccess->setAccessTo($invitationCode->getAccessPermissions());
        $guestAccess->setInvitationCode($invitationCode);

        // Establecer fecha de expiración (por defecto 1 año)
        $expiresAt = new \DateTime();
        $expiresAt->modify('+1 year');
        $guestAccess->setExpiresAt($expiresAt);

        // Guardar cambios
        $this->entityManager->persist($guestAccess);
        $this->entityManager->flush();

        return $guestAccess;
    }

    // ! 28/05/2025 - Revoca un código de invitación
    public function revokeCode(int $id, User $user): void
    {
        $code = $this->invitationCodeRepository->find($id);

        if (!$code) {
            throw new \InvalidArgumentException('Invitation code not found');
        }

        // Verificar propiedad
        if ($code->getCreator()->getId() !== $user->getId()) {
            throw new AccessDeniedException('You do not own this invitation code');
        }

        // Revocar código
        $code->revoke();
        $this->entityManager->flush();
    }

    // ! 28/05/2025 - Genera un código único aleatorio de 8 caracteres
    private function generateUniqueCode(): string
    {
        $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $length = 8;

        do {
            $code = '';
            for ($i = 0; $i < $length; $i++) {
                $code .= $characters[random_int(0, strlen($characters) - 1)];
            }

            // Verificar si el código ya existe
            $existing = $this->invitationCodeRepository->findOneBy(['code' => $code]);
        } while ($existing);

        return $code;
    }
}
