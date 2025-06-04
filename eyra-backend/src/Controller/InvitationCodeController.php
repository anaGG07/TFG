<?php

namespace App\Controller;

use App\Entity\InvitationCode;
use App\Service\InvitationCodeService;
use App\Repository\InvitationCodeRepository;
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

    public function __construct(
        InvitationCodeService $invitationCodeService,
        InvitationCodeRepository $invitationCodeRepository
    ) {
        $this->invitationCodeService = $invitationCodeService;
        $this->invitationCodeRepository = $invitationCodeRepository;
    }

    // ! 28/05/2025 - Endpoint para generar un nuevo código de invitación
    #[Route('/generate', name: 'invitation_code_generate', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function generateCode(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validar datos de la solicitud
        $violations = $this->validateGenerateRequest($data);
        if (count($violations) > 0) {
            return $this->json(['errors' => $violations], Response::HTTP_BAD_REQUEST);
        }

        $user = $this->getUser();
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
            'status' => 'active', // Agregar status
            'createdAt' => $code->getCreatedAt()->format('c'), // Agregar createdAt
            'accessPermissions' => $code->getAccessPermissions(),
            'expiresAt' => $code->getExpiresAt()->format('c'),
        ], Response::HTTP_CREATED);
    }

    // ! 28/05/2025 - Endpoint para listar códigos del usuario
    #[Route('', name: 'invitation_code_list', methods: ['GET'], priority: 1)]
    #[IsGranted('ROLE_USER')]
    public function listCodes(Request $request): JsonResponse
    {
        $status = $request->query->get('status');
        $user = $this->getUser();

        try {
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
            return $this->json([
                'codes' => [],
                'error' => $e->getMessage()
            ]);
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
            $guestAccess = $this->invitationCodeService->redeemCode($code, $this->getUser());

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
            $this->invitationCodeService->revokeCode($id, $this->getUser());

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
}
