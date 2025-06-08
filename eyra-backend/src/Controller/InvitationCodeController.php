<?php

namespace App\Controller;

use App\Entity\InvitationCode;
use App\Entity\User;
use App\Service\InvitationCodeService;
use App\Repository\InvitationCodeRepository;
use App\Service\EmailService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Http\Attribute\IsGranted;

// ! 28/05/2025 - Controlador creado para gestionar endpoints de códigos de invitación

#[Route('/invitation-codes')]
class InvitationCodeController extends AbstractController
{
    private InvitationCodeService $invitationCodeService;
    private InvitationCodeRepository $invitationCodeRepository;
    private EmailService $emailService;

    public function __construct(
        InvitationCodeService $invitationCodeService,
        InvitationCodeRepository $invitationCodeRepository,
        EmailService $emailService
    ) {
        $this->invitationCodeService = $invitationCodeService;
        $this->invitationCodeRepository = $invitationCodeRepository;
        $this->emailService = $emailService;
    }

    // ! 28/05/2025 - Endpoint para generar un nuevo código de invitación
    #[Route('/generate', name: 'invitation_code_generate', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function generateCode(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validar datos de la solicitud (NO requiere invitedEmail)
        $violations = $this->validateGenerateRequest($data);
        if (count($violations) > 0) {
            return $this->json(['errors' => $violations], Response::HTTP_BAD_REQUEST);
        }

        /** @var User|null $user */
        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->json(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $guestType = $data['guestType'];
        $accessPermissions = $data['accessPermissions'] ?? [];
        $expirationHours = $data['expirationHours'] ?? 48;

        $code = $this->invitationCodeService->generateCode(
            $user,
            $guestType,
            $accessPermissions,
            $expirationHours
        );

        return $this->json([
            'id' => $code->getId(),
            'code' => $code->getCode(),
            'type' => $code->getGuestType(), // Usar 'type' en lugar de 'guestType'
            'status' => 'active',
            'createdAt' => $code->getCreatedAt()->format('c'),
            'accessPermissions' => $code->getAccessPermissions(),
            'expiresAt' => $code->getExpiresAt()->format('c'),
        ], Response::HTTP_CREATED);
    }

    // ! 28/05/2025 - Endpoint para listar códigos del usuario
    #[Route('', name: 'invitation_code_list', methods: ['GET'], priority: 1)]
    #[IsGranted('ROLE_USER')]
    public function listCodes(Request $request): JsonResponse
    {
        try {
            $status = $request->query->get('status');
            
            /** @var User|null $user */
            $user = $this->getUser();
            if (!$user instanceof User) {
                return $this->json(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
            }

            $codes = $this->invitationCodeRepository->findByCreatorAndStatus($user, $status);

            return $this->json([
                'codes' => array_map(function ($code) {
                    return [
                        'id' => $code->getId(),
                        'code' => $code->getCode(),
                        'type' => $code->getGuestType(), // Cambiar 'guestType' por 'type' para coincidir con el frontend
                        'status' => $code->getStatus(),
                        'createdAt' => $code->getCreatedAt()->format('c'),
                        'expiresAt' => $code->getExpiresAt()->format('c'),
                        'accessPermissions' => $code->getAccessPermissions(),
                        'redeemedBy' => $code->getRedeemedBy() ? [
                            'id' => $code->getRedeemedBy()->getId(),
                            'username' => $code->getRedeemedBy()->getUsername()
                        ] : null,
                        'redeemedAt' => $code->getRedeemedAt() ? $code->getRedeemedAt()->format('c') : null
                    ];
                }, $codes)
            ]);
        } catch (\Exception $e) {
            error_log("InvitationCodeController::listCodes error: " . $e->getMessage());
            return $this->json([
                'codes' => [],
                'error' => 'Error loading invitation codes',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // ! 28/05/2025 - Endpoint para verificar si un código es válido
    #[Route('/verify/{code}', name: 'invitation_code_verify', methods: ['GET'])]
    public function verifyCode(string $code): JsonResponse
    {
        $invitationCode = $this->invitationCodeService->verifyCode($code);

        if (!$invitationCode) {
            return $this->json([
                'valid' => false,
                'message' => 'Invalid or expired invitation code'
            ], Response::HTTP_OK);
        }

        return $this->json([
            'valid' => true,
            'creator' => [
                'id' => $invitationCode->getCreator()->getId(),
                'username' => $invitationCode->getCreator()->getUsername(),
                'name' => $invitationCode->getCreator()->getName(),
            ],
            'guestType' => $invitationCode->getGuestType(),
            'accessPermissions' => $invitationCode->getAccessPermissions(),
            'expiresAt' => $invitationCode->getExpiresAt()->format('c')
        ]);
    }

    // ! 28/05/2025 - Endpoint para canjear un código
    #[Route('/redeem/{code}', name: 'invitation_code_redeem', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function redeemCode(string $code): JsonResponse
    {
        try {
            /** @var User|null $user */
            $user = $this->getUser();
            if (!$user instanceof User) {
                return $this->json(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
            }

            $guestAccess = $this->invitationCodeService->redeemCode($code, $user);

            return $this->json([
                'success' => true,
                'access' => [
                    'id' => $guestAccess->getId(),
                    'hostUser' => [
                        'id' => $guestAccess->getOwner()->getId(),
                        'username' => $guestAccess->getOwner()->getUsername(),
                        'name' => $guestAccess->getOwner()->getName(),
                    ],
                    'guestType' => $guestAccess->getGuestType()->value,
                    'accessPermissions' => $guestAccess->getAccessTo()
                ]
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    // ! 28/05/2025 - Endpoint para revocar un código
    #[Route('/{id}', name: 'invitation_code_revoke', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    public function revokeCode(int $id): JsonResponse
    {
        try {
            /** @var User|null $user */
            $user = $this->getUser();
            if (!$user instanceof User) {
                return $this->json(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
            }

            $this->invitationCodeService->revokeCode($id, $user);

            return $this->json([
                'success' => true,
                'message' => 'Invitation code revoked successfully'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e instanceof AccessDeniedException ? Response::HTTP_FORBIDDEN : Response::HTTP_BAD_REQUEST);
        }
    }

    // ! 28/05/2025 - Validación de la solicitud para generar código
    private function validateGenerateRequest(array $data): array
    {
        $violations = [];

        if (!isset($data['guestType'])) {
            $violations[] = 'guestType is required';
        } elseif (!in_array($data['guestType'], InvitationCode::getValidGuestTypes())) {
            $violations[] = 'Invalid guestType value';
        }

        if (isset($data['expirationHours']) && (!is_int($data['expirationHours']) || $data['expirationHours'] < 1 || $data['expirationHours'] > 168)) {
            $violations[] = 'expirationHours must be between 1 and 168';
        }

        if (isset($data['accessPermissions']) && !is_array($data['accessPermissions'])) {
            $violations[] = 'accessPermissions must be an array';
        }

        return $violations;
    }

    // ! 07/06/2025 - Nuevo endpoint para generar código y enviar emails
    #[Route('/generate-and-send', name: 'invitation_code_generate_and_send', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function generateAndSendCode(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validar datos de la solicitud (incluyendo email del invitado)
        $violations = $this->validateGenerateAndSendRequest($data);
        if (count($violations) > 0) {
            return $this->json(['errors' => $violations], Response::HTTP_BAD_REQUEST);
        }

        /** @var User|null $user */
        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->json(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $invitedEmail = $data['invitedEmail'];
        $guestType = $data['guestType'];
        $accessPermissions = $data['accessPermissions'] ?? [];
        $expirationHours = $data['expirationHours'] ?? 48;

        // Generar código de invitación
        $code = $this->invitationCodeService->generateCode(
            $user,
            $guestType,
            $accessPermissions,
            $expirationHours
        );

        // Enviar emails
        $inviterEmailSent = $this->emailService->sendInvitationSentEmail(
            $user->getEmail(),
            $user->getName(),
            $invitedEmail,
            $code->getCode(),
            $guestType,
            $accessPermissions,
            $code->getExpiresAt()
        );

        $invitedEmailSent = $this->emailService->sendInvitationReceivedEmail(
            $invitedEmail,
            $user->getName(),
            $code->getCode(),
            $guestType,
            $accessPermissions,
            $code->getExpiresAt()
        );

        return $this->json([
            'success' => true,
            'invitation' => [
                'id' => $code->getId(),
                'code' => $code->getCode(),
                'type' => $code->getGuestType(),
                'status' => 'active',
                'createdAt' => $code->getCreatedAt()->format('c'),
                'accessPermissions' => $code->getAccessPermissions(),
                'expiresAt' => $code->getExpiresAt()->format('c'),
                'invitedEmail' => $invitedEmail
            ],
            'emails' => [
                'inviterNotified' => $inviterEmailSent,
                'invitedNotified' => $invitedEmailSent
            ]
        ], Response::HTTP_CREATED);
    }

    // ! 07/06/2025 - Validación para generar y enviar invitación
    private function validateGenerateAndSendRequest(array $data): array
    {
        $violations = [];

        // Validaciones existentes
        if (!isset($data['guestType'])) {
            $violations[] = 'guestType is required';
        } elseif (!in_array($data['guestType'], InvitationCode::getValidGuestTypes())) {
            $violations[] = 'Invalid guestType value';
        }

        if (isset($data['expirationHours']) && (!is_int($data['expirationHours']) || $data['expirationHours'] < 1 || $data['expirationHours'] > 168)) {
            $violations[] = 'expirationHours must be between 1 and 168';
        }

        if (isset($data['accessPermissions']) && !is_array($data['accessPermissions'])) {
            $violations[] = 'accessPermissions must be an array';
        }

        // Nueva validación para email del invitado
        if (!isset($data['invitedEmail'])) {
            $violations[] = 'invitedEmail is required';
        } elseif (!filter_var($data['invitedEmail'], FILTER_VALIDATE_EMAIL)) {
            $violations[] = 'invitedEmail must be a valid email address';
        }

        return $violations;
    }
}
