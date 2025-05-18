<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Onboarding;
use App\Enum\ProfileType;
use App\Enum\HormoneType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Component\Security\Core\Exception\TokenNotFoundException;
use Psr\Log\LoggerInterface;

class OnboardingController extends AbstractController
{
    private $jwtEncoder;
    private $jwtManager;
    private $tokenStorage;
    private LoggerInterface $logger;
    
    public function __construct(
        LoggerInterface $logger,
        JWTEncoderInterface $jwtEncoder = null, 
        JWTTokenManagerInterface $jwtManager = null,
        \Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface $tokenStorage = null
    ) {
        $this->logger = $logger;
        $this->jwtEncoder = $jwtEncoder;
        $this->jwtManager = $jwtManager;
        $this->tokenStorage = $tokenStorage;
    }
    
    #[Route('/onboarding', name: 'api_onboarding', methods: ['POST'])]
    public function completeOnboarding(Request $request, EntityManagerInterface $em, ValidatorInterface $validator): JsonResponse
    {
        try {
            /** @var User|null $user */
            $user = $this->getUser();
            
            if (!$user instanceof User) {
                $this->logger->error('Onboarding: Usuario no autenticado');
                return $this->json([
                    'message' => 'No autenticado',
                    'retryAfterLogin' => true
                ], 401);
            }

            // Obtener y validar los datos del request
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return $this->json([
                    'message' => 'Datos JSON inválidos',
                    'error' => json_last_error_msg()
                ], 400);
            }

            // Validar campos obligatorios
            $requiredFields = ['profileType', 'genderIdentity', 'stageOfLife'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || empty($data[$field])) {
                    return $this->json([
                        'message' => "El campo {$field} es obligatorio",
                        'field' => $field
                    ], 400);
                }
            }

            // Validar campos específicos para etapa menstrual
            if ($data['stageOfLife'] === 'menstrual') {
                if (!isset($data['lastPeriodDate']) || empty($data['lastPeriodDate'])) {
                    return $this->json([
                        'message' => 'La fecha del último periodo es obligatoria para usuarios con ciclo menstrual activo',
                        'field' => 'lastPeriodDate'
                    ], 400);
                }

                if (!isset($data['averagePeriodLength']) || empty($data['averagePeriodLength'])) {
                    return $this->json([
                        'message' => 'La duración del periodo es obligatoria para usuarios con ciclo menstrual activo',
                        'field' => 'averagePeriodLength'
                    ], 400);
                }

                // Validar formato de fecha
                try {
                    $lastPeriodDate = new \DateTime($data['lastPeriodDate']);
                } catch (\Exception $e) {
                    return $this->json([
                        'message' => 'Formato de fecha inválido para el último periodo',
                        'error' => $e->getMessage()
                    ], 400);
                }

                // Validar duración del periodo
                if ($data['averagePeriodLength'] < 1 || $data['averagePeriodLength'] > 14) {
                    return $this->json([
                        'message' => 'La duración del periodo debe estar entre 1 y 14 días',
                        'field' => 'averagePeriodLength'
                    ], 400);
                }

                // Validar duración del ciclo si se proporciona
                if (isset($data['averageCycleLength'])) {
                    if ($data['averageCycleLength'] < 21 || $data['averageCycleLength'] > 35) {
                        return $this->json([
                            'message' => 'La duración del ciclo debe estar entre 21 y 35 días',
                            'field' => 'averageCycleLength'
                        ], 400);
                    }
                } else {
                    $data['averageCycleLength'] = 28;
                }
            }

            // Crear o actualizar la entidad Onboarding
            $onboarding = $em->getRepository(Onboarding::class)->findOneBy(['user' => $user]) ?? new Onboarding();
            
            // Establecer los datos básicos
            $onboarding->setUser($user);
            $onboarding->setProfileType(ProfileType::from($data['profileType']));
            $onboarding->setGenderIdentity($data['genderIdentity']);
            $onboarding->setStageOfLife($data['stageOfLife']);
            
            if (isset($data['pronouns'])) {
                $onboarding->setPronouns($data['pronouns']);
            }
            
            if ($data['stageOfLife'] === 'menstrual') {
                $onboarding->setLastPeriodDate(new \DateTime($data['lastPeriodDate']));
                $onboarding->setAveragePeriodLength($data['averagePeriodLength']);
                $onboarding->setAverageCycleLength($data['averageCycleLength']);
            }

            // Marcar el onboarding como completado
            $onboarding->setCompleted(true);

            // Validar la entidad
            $errors = $validator->validate($onboarding);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[] = $error->getMessage();
                }
                return $this->json([
                    'message' => 'Errores de validación',
                    'errors' => $errorMessages
                ], 400);
            }

            // Persistir los cambios
            $em->persist($onboarding);
            $em->flush();

            // Serializar el usuario actualizado
            $userData = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'onboardingCompleted' => $onboarding->isCompleted(),
                // Agrega aquí otros campos relevantes del usuario
            ];

            return $this->json([
                'message' => 'Onboarding completado exitosamente',
                'user' => $userData,
                'onboarding' => [
                    'id' => $onboarding->getId(),
                    'profileType' => $onboarding->getProfileType()->value,
                    'stageOfLife' => $onboarding->getStageOfLife(),
                    'lastPeriodDate' => $onboarding->getLastPeriodDate() ? $onboarding->getLastPeriodDate()->format('Y-m-d') : null,
                    'averageCycleLength' => $onboarding->getAverageCycleLength(),
                    'averagePeriodLength' => $onboarding->getAveragePeriodLength(),
                    'completed' => $onboarding->isCompleted()
                ]
            ]);

        } catch (\Exception $e) {
            $this->logger->error('Onboarding: Error inesperado: ' . $e->getMessage());
            return $this->json([
                'message' => 'Error al procesar el onboarding',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
