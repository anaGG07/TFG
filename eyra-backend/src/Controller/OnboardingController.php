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
            // Log para verificar todos los headers de la petición
            $this->logger->info('Onboarding: Headers presentes: ' . json_encode($request->headers->all()));
            
            /** @var User|null $user */
            $user = $this->getUser();
            
            // Log detallado sobre el estado de autenticación
            $this->logger->info('Onboarding: Estado de autenticación - Usuario: ' . ($user ? $user->getEmail() : 'no autenticado'));
            error_log('Onboarding: Cookies presentes: ' . json_encode($request->cookies->all()));
            error_log('Onboarding: getUser() devolvió: ' . ($user === null ? 'NULL' : get_class($user)));
            
            // Información detallada sobre $this->getUser()
            ob_start();
            var_dump($this->getUser());
            $userDump = ob_get_clean();
            error_log('Onboarding: Dump completo de $this->getUser(): ' . $userDump);
            
            // También inspeccionar el token de seguridad
            if ($this->tokenStorage) {
                ob_start();
                var_dump($this->tokenStorage->getToken());
                $tokenDump = ob_get_clean();
                error_log('Onboarding: Dump del token de seguridad: ' . $tokenDump);
            } else {
                error_log('Onboarding: TokenStorage no disponible');
            }
            
            if (!$user instanceof User) {
                $this->logger->error('Onboarding: Usuario no autenticado');
                return $this->json([
                    'message' => 'No autenticado',
                    'retryAfterLogin' => true
                ], 401);
            }

            // Obtener y validar los datos del request
            $data = json_decode($request->getContent(), true);
            $this->logger->info('Onboarding: Datos recibidos: ' . json_encode($data));

            if (!$data) {
                $this->logger->error('Onboarding: Datos JSON inválidos');
                return $this->json([
                    'message' => 'Datos JSON inválidos',
                    'error' => json_last_error_msg()
                ], 400);
            }

            // Validar campos obligatorios
            $requiredFields = ['profileType', 'genderIdentity', 'stageOfLife'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || empty($data[$field])) {
                    $this->logger->error("Onboarding: Campo obligatorio faltante: {$field}");
                    return $this->json([
                        'message' => "El campo {$field} es obligatorio",
                        'field' => $field
                    ], 400);
                }
            }

            // Validar campos específicos para etapa menstrual
            if ($data['stageOfLife'] === 'menstrual') {
                if (!isset($data['lastPeriodDate']) || empty($data['lastPeriodDate'])) {
                    $this->logger->error('Onboarding: Fecha del último periodo faltante');
                    return $this->json([
                        'message' => 'La fecha del último periodo es obligatoria para usuarios con ciclo menstrual activo',
                        'field' => 'lastPeriodDate'
                    ], 400);
                }

                if (!isset($data['averagePeriodLength']) || empty($data['averagePeriodLength'])) {
                    $this->logger->error('Onboarding: Duración del periodo faltante');
                    return $this->json([
                        'message' => 'La duración del periodo es obligatoria para usuarios con ciclo menstrual activo',
                        'field' => 'averagePeriodLength'
                    ], 400);
                }

                // Validar formato de fecha
                try {
                    $lastPeriodDate = new \DateTime($data['lastPeriodDate']);
                } catch (\Exception $e) {
                    $this->logger->error('Onboarding: Formato de fecha inválido: ' . $e->getMessage());
                    return $this->json([
                        'message' => 'Formato de fecha inválido para el último periodo',
                        'error' => $e->getMessage()
                    ], 400);
                }

                // Validar duración del periodo
                if ($data['averagePeriodLength'] < 1 || $data['averagePeriodLength'] > 14) {
                    $this->logger->error('Onboarding: Duración del periodo fuera de rango');
                    return $this->json([
                        'message' => 'La duración del periodo debe estar entre 1 y 14 días',
                        'field' => 'averagePeriodLength'
                    ], 400);
                }

                // Validar duración del ciclo si se proporciona
                if (isset($data['averageCycleLength'])) {
                    if ($data['averageCycleLength'] < 21 || $data['averageCycleLength'] > 35) {
                        $this->logger->error('Onboarding: Duración del ciclo fuera de rango');
                        return $this->json([
                            'message' => 'La duración del ciclo debe estar entre 21 y 35 días',
                            'field' => 'averageCycleLength'
                        ], 400);
                    }
                } else {
                    // Establecer valor por defecto
                    $data['averageCycleLength'] = 28;
                    $this->logger->info('Onboarding: Usando duración de ciclo por defecto (28 días)');
                }
            }

            // Crear o actualizar la entidad Onboarding
            $onboarding = $em->getRepository(Onboarding::class)->findOneBy(['user' => $user]) ?? new Onboarding();
            
            // Establecer los datos básicos
            $onboarding->setUser($user);
            $onboarding->setProfileType(ProfileType::from($data['profileType']));
            $onboarding->setGenderIdentity($data['genderIdentity']);
            $onboarding->setStageOfLife($data['stageOfLife']);
            
            // Establecer campos opcionales si existen
            if (isset($data['pronouns'])) {
                $onboarding->setPronouns($data['pronouns']);
            }
            
            // Establecer campos específicos para etapa menstrual
            if ($data['stageOfLife'] === 'menstrual') {
                $onboarding->setLastPeriodDate(new \DateTime($data['lastPeriodDate']));
                $onboarding->setAveragePeriodLength($data['averagePeriodLength']);
                $onboarding->setAverageCycleLength($data['averageCycleLength']);
            }

            // Validar la entidad
            $errors = $validator->validate($onboarding);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[] = $error->getMessage();
                }
                $this->logger->error('Onboarding: Errores de validación: ' . json_encode($errorMessages));
                return $this->json([
                    'message' => 'Errores de validación',
                    'errors' => $errorMessages
                ], 400);
            }

            // Persistir los cambios
            $em->persist($onboarding);
            $em->flush();

            $this->logger->info('Onboarding completado exitosamente para usuario: ' . $user->getEmail());

            return $this->json([
                'message' => 'Onboarding completado exitosamente',
                'onboarding' => [
                    'id' => $onboarding->getId(),
                    'profileType' => $onboarding->getProfileType()->value,
                    'stageOfLife' => $onboarding->getStageOfLife(),
                    'lastPeriodDate' => $onboarding->getLastPeriodDate() ? $onboarding->getLastPeriodDate()->format('Y-m-d') : null,
                    'averageCycleLength' => $onboarding->getAverageCycleLength(),
                    'averagePeriodLength' => $onboarding->getAveragePeriodLength()
                ]
            ]);

        } catch (\Exception $e) {
            $this->logger->error('Onboarding: Error inesperado: ' . $e->getMessage());
            $this->logger->error('Onboarding: Stack trace: ' . $e->getTraceAsString());
            
            return $this->json([
                'message' => 'Error al procesar el onboarding',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
