<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Onboarding;
use App\Entity\Condition;
use App\Entity\UserCondition;
use App\Entity\SymptomLog;
use App\Entity\MenstrualCycle;
use App\Enum\ProfileType;
use App\Enum\HormoneType;
use App\Repository\OnboardingRepository;
use App\Service\CycleCalculatorService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Component\Security\Core\Exception\TokenNotFoundException;
use Symfony\Component\Serializer\SerializerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class OnboardingController extends AbstractController
{
    private $jwtEncoder;
    private $jwtManager;
    private $tokenStorage;
    private LoggerInterface $logger;
    private CycleCalculatorService $cycleCalculatorService;
    private OnboardingRepository $onboardingRepository;
    private SerializerInterface $serializer;
    // private ContainerInterface $container;

    public function __construct(
        LoggerInterface $logger,
        CycleCalculatorService $cycleCalculatorService,
        OnboardingRepository $onboardingRepository,
        SerializerInterface $serializer,
        // ContainerInterface $container,
        JWTEncoderInterface $jwtEncoder = null,
        JWTTokenManagerInterface $jwtManager = null,
        \Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface $tokenStorage = null
    ) {
        $this->logger = $logger;
        $this->cycleCalculatorService = $cycleCalculatorService;
        $this->onboardingRepository = $onboardingRepository;
        $this->serializer = $serializer;
        // $this->container = $container;
        $this->jwtEncoder = $jwtEncoder;
        $this->jwtManager = $jwtManager;
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * Obtener datos de onboarding del usuario autenticado
     * 
     * ! 28/05/2025 - Implementado nuevo endpoint para obtener datos de onboarding
     */
    #[Route('/onboarding', name: 'api_onboarding_get', methods: ['GET'])]
    public function getOnboardingData(EntityManagerInterface $em): JsonResponse
    {
        try {
            /** @var User|null $user */
            $user = $this->getUser();

            if (!$user instanceof User) {
                $this->logger->error('Onboarding GET: Usuario no autenticado');
                return $this->json([
                    'message' => 'No autenticado',
                ], 401);
            }

            // Buscar el onboarding del usuario
            $onboarding = $this->onboardingRepository->findOneBy(['user' => $user]);

            if (!$onboarding) {
                return $this->json([
                    'message' => 'No se ha encontrado información de onboarding para este usuario',
                    'data' => [
                        'onboardingCompleted' => false,
                        'user' => [
                            'id' => $user->getId(),
                            'email' => $user->getEmail(),
                            'profileType' => $user->getProfileType() ? $user->getProfileType()->value : null,
                        ]
                    ]
                ], 404);
            }

            // Preparar los datos para la respuesta
            $onboardingData = [
                'id' => $onboarding->getId(),
                'profileType' => $onboarding->getProfileType() ? $onboarding->getProfileType()->value : null,
                'genderIdentity' => $onboarding->getGenderIdentity(),
                'pronouns' => $onboarding->getPronouns(),
                'isPersonal' => $onboarding->isIsPersonal(),
                'stageOfLife' => $onboarding->getStageOfLife(),
                'lastPeriodDate' => $onboarding->getLastPeriodDate() ? $onboarding->getLastPeriodDate()->format('Y-m-d') : null,
                'averageCycleLength' => $onboarding->getAverageCycleLength(),
                'averagePeriodLength' => $onboarding->getAveragePeriodLength(),
                'hormoneType' => $onboarding->getHormoneType() ? $onboarding->getHormoneType()->value : null,
                'hormoneStartDate' => $onboarding->getHormoneStartDate() ? $onboarding->getHormoneStartDate()->format('Y-m-d') : null,
                'hormoneFrequencyDays' => $onboarding->getHormoneFrequencyDays(),
                'receiveAlerts' => $onboarding->isReceiveAlerts(),
                'receiveRecommendations' => $onboarding->isReceiveRecommendations(),
                'receiveCyclePhaseTips' => $onboarding->isReceiveCyclePhaseTips(),
                'receiveWorkoutSuggestions' => $onboarding->isReceiveWorkoutSuggestions(),
                'receiveNutritionAdvice' => $onboarding->isReceiveNutritionAdvice(),
                'shareCycleWithPartner' => $onboarding->isShareCycleWithPartner(),
                'wantAiCompanion' => $onboarding->isWantAiCompanion(),
                'healthConcerns' => $onboarding->getHealthConcerns(),
                'accessCode' => $onboarding->getAccessCode(),
                'allowParentalMonitoring' => $onboarding->isAllowParentalMonitoring(),
                'commonSymptoms' => $onboarding->getCommonSymptoms(),
                'createdAt' => $onboarding->getCreatedAt() ? $onboarding->getCreatedAt()->format('Y-m-d H:i:s') : null,
                'updatedAt' => $onboarding->getUpdatedAt() ? $onboarding->getUpdatedAt()->format('Y-m-d H:i:s') : null,
                'completed' => $onboarding->isCompleted()
            ];

            // Obtener información adicional relacionada con el onboarding
            $additionalData = [];

            // 1. Verificar si tiene ciclo menstrual activo
            if ($onboarding->getStageOfLife() === 'menstrual') {
                $currentCyclePhase = $em->getRepository(MenstrualCycle::class)->findCurrentForUser($user->getId());
                if ($currentCyclePhase) {
                    $additionalData['currentCycle'] = [
                        'cycleId' => $currentCyclePhase->getCycleId(),
                        'phase' => $currentCyclePhase->getPhase()->value,
                        'startDate' => $currentCyclePhase->getStartDate()->format('Y-m-d'),
                        'endDate' => $currentCyclePhase->getEndDate() ? $currentCyclePhase->getEndDate()->format('Y-m-d') : null,
                    ];
                }
            }

            // 2. Obtener condiciones médicas registradas
            $userConditions = $em->getRepository(UserCondition::class)->findActiveByUser($user->getId());
            if (count($userConditions) > 0) {
                $conditionsData = [];
                foreach ($userConditions as $userCondition) {
                    $conditionsData[] = [
                        'id' => $userCondition->getId(),
                        'name' => $userCondition->getCondition()->getName(),
                        'startDate' => $userCondition->getStartDate()->format('Y-m-d'),
                        'endDate' => $userCondition->getEndDate() ? $userCondition->getEndDate()->format('Y-m-d') : null,
                    ];
                }
                $additionalData['registeredConditions'] = $conditionsData;
            }

            // Preparar la respuesta completa
            $response = [
                'onboarding' => $onboardingData,
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'username' => $user->getUsername(),
                    'name' => $user->getName(),
                    'lastName' => $user->getLastName(),
                    'onboardingCompleted' => $user->isOnboardingCompleted(),
                ],
            ];

            // Añadir datos adicionales si existen
            if (!empty($additionalData)) {
                $response['additionalData'] = $additionalData;
            }

            $this->logger->info('Onboarding GET: Datos recuperados correctamente para el usuario ' . $user->getId());
            return $this->json($response);
        } catch (\Exception $e) {
            $this->logger->error('Onboarding GET: Error inesperado: ' . $e->getMessage());
            $this->logger->error('Onboarding GET: Stacktrace: ' . $e->getTraceAsString());
            return $this->json([
                'message' => 'Error al recuperar datos de onboarding',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Completar el proceso de onboarding
     */
    #[Route('/onboarding', name: 'api_onboarding_post', methods: ['POST'])]
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

            // Establecer preferencias de notificaciones si se proporcionan
            // ! 27/05/2025 - Añadido procesamiento del campo isPersonal
            if (isset($data['isPersonal'])) {
                $onboarding->setIsPersonal(filter_var($data['isPersonal'], FILTER_VALIDATE_BOOLEAN));
            }

            if (isset($data['receiveAlerts'])) {
                $onboarding->setReceiveAlerts($data['receiveAlerts']);
            }

            if (isset($data['receiveRecommendations'])) {
                $onboarding->setReceiveRecommendations($data['receiveRecommendations']);
            }

            if (isset($data['receiveCyclePhaseTips'])) {
                $onboarding->setReceiveCyclePhaseTips($data['receiveCyclePhaseTips']);
            }

            if (isset($data['receiveWorkoutSuggestions'])) {
                $onboarding->setReceiveWorkoutSuggestions($data['receiveWorkoutSuggestions']);
            }

            if (isset($data['receiveNutritionAdvice'])) {
                $onboarding->setReceiveNutritionAdvice($data['receiveNutritionAdvice']);
            }

            if (isset($data['shareCycleWithPartner'])) {
                $onboarding->setShareCycleWithPartner($data['shareCycleWithPartner']);
            }

            if (isset($data['wantAiCompanion'])) {
                $onboarding->setWantAiCompanion($data['wantAiCompanion']);
            }

            // Establecer preferencias específicas para etapa menstrual
            if ($data['stageOfLife'] === 'menstrual') {
                $onboarding->setLastPeriodDate(new \DateTime($data['lastPeriodDate']));
                $onboarding->setAveragePeriodLength($data['averagePeriodLength']);
                $onboarding->setAverageCycleLength($data['averageCycleLength']);
            }

            // Guardar los health concerns y common symptoms si se proporcionan
            if (isset($data['healthConcerns'])) {
                $onboarding->setHealthConcerns($data['healthConcerns']);
            }

            if (isset($data['commonSymptoms'])) {
                $onboarding->setCommonSymptoms($data['commonSymptoms']);
            }

            // Marcar el onboarding como completado
            $onboarding->setCompleted(true);
            $user->setOnboardingCompleted(true);

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

            // Persistir los cambios de onboarding y usuario
            $em->persist($onboarding);
            $em->persist($user);

            // ! 19-05-2025 Insertar aquí el código para crear el ciclo menstrual y registrar condiciones médicas y síntomas comunes

            // 1. Crear un ciclo menstrual si el usuario está en etapa menstrual
            $menstrualCycleCreated = false;
            $newCycle = null; // ! 24/05/2025 - Inicializar variable para que esté disponible fuera del try-catch
            if ($data['stageOfLife'] === 'menstrual') {
                $lastPeriodDate = new \DateTime($data['lastPeriodDate']);
                $this->logger->info('Onboarding: Iniciando nuevo ciclo menstrual para el usuario ' . $user->getId());

                try {
                    // Verificar si ya existe un ciclo para este usuario
                    $existingCycle = $em->getRepository(MenstrualCycle::class)->findOneBy(
                        ['user' => $user],
                        ['startDate' => 'DESC']
                    );

                    if (!$existingCycle) {
                        // Crear un nuevo ciclo menstrual usando el servicio
                        // ! 24/05/2025 - Corregido para manejar el array devuelto por startNewCycle
                        $newCycle = $this->cycleCalculatorService->startNewCycle($user, $lastPeriodDate);
                        $menstrualCycleCreated = true;
                        $this->logger->info('Onboarding: Ciclo menstrual creado exitosamente con ID ' . $newCycle['cycleId']);
                    } else {
                        $this->logger->info('Onboarding: El usuario ya tiene un ciclo menstrual registrado con ID ' . $existingCycle->getId());
                    }
                } catch (\Exception $e) {
                    $this->logger->error('Onboarding: Error al crear ciclo menstrual: ' . $e->getMessage());
                    // No fallamos el onboarding por errores en la creación del ciclo
                }
            }

            // 2. Registrar condiciones médicas
            $conditionsRegistered = [];
            if (!empty($data['healthConcerns'])) {
                $conditionRepository = $em->getRepository(Condition::class);

                foreach ($data['healthConcerns'] as $concernName) {
                    // Buscar la condición por nombre
                    $condition = $conditionRepository->findOneBy(['name' => $concernName]);

                    if ($condition) {
                        // Verificar si ya existe esta condición para el usuario
                        $existingUserCondition = $em->getRepository(UserCondition::class)->findOneBy([
                            'user' => $user,
                            'condition' => $condition,
                            'state' => true
                        ]);

                        if (!$existingUserCondition) {
                            $userCondition = new UserCondition();
                            $userCondition->setUser($user);
                            $userCondition->setCondition($condition);
                            $userCondition->setStartDate(new \DateTime());
                            $userCondition->setNotes('Registrada durante onboarding');
                            $userCondition->setState(true);

                            $em->persist($userCondition);
                            $conditionsRegistered[] = $concernName;
                            $this->logger->info('Onboarding: Condición registrada: ' . $concernName);
                        } else {
                            $this->logger->info('Onboarding: La condición ya existe para el usuario: ' . $concernName);
                        }
                    } else {
                        $this->logger->warning('Onboarding: Condición no encontrada en la base de datos: ' . $concernName);
                    }
                }
            }

            // 3. Registrar síntomas comunes
            $symptomsRegistered = [];
            if (!empty($data['commonSymptoms'])) {
                $today = new \DateTime();

                foreach ($data['commonSymptoms'] as $symptomName) {
                    $symptomLog = new SymptomLog();
                    $symptomLog->setUser($user);
                    $symptomLog->setDate($today);
                    $symptomLog->setSymptom($symptomName);
                    $symptomLog->setIntensity(3); // Intensidad media por defecto
                    $symptomLog->setNotes('Registrado durante onboarding');
                    $symptomLog->setState(true);

                    $em->persist($symptomLog);
                    $symptomsRegistered[] = $symptomName;
                    $this->logger->info('Onboarding: Síntoma registrado: ' . $symptomName);
                }
            }

            // Guardar todos los cambios en una sola transacción
            $em->flush();

            // ! 19-05-2025 Insertar aquí el código para crear el ciclo menstrual y registrar condiciones médicas y síntomas comunes        

            // Serializar el usuario actualizado
            $userData = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'onboardingCompleted' => $onboarding->isCompleted(),
                // Agrega aquí otros campos relevantes del usuario
            ];

            $response = [
                'message' => 'Onboarding completado exitosamente',
                'user' => $userData,
                'onboarding' => [
                    'id' => $onboarding->getId(),
                    'profileType' => $onboarding->getProfileType()->value,
                    'stageOfLife' => $onboarding->getStageOfLife(),
                    'lastPeriodDate' => $onboarding->getLastPeriodDate() ? $onboarding->getLastPeriodDate()->format('Y-m-d') : null,
                    'averageCycleLength' => $onboarding->getAverageCycleLength(),
                    'averagePeriodLength' => $onboarding->getAveragePeriodLength(),
                    'completed' => $onboarding->isCompleted(),
                    'isPersonal' => $onboarding->isIsPersonal() // ! 27/05/2025 - Añadido isPersonal en la respuesta
                ]
            ];

            // Agregar información sobre las operaciones adicionales realizadas
            // ! 24/05/2025 - Añadido cycleId en la respuesta para mejor seguimiento
            if ($menstrualCycleCreated) {
                $response['additionalData'] = [
                    'menstrualCycleCreated' => true,
                    'cycleId' => $newCycle['cycleId'] ?? null
                ];
            }

            if (!empty($conditionsRegistered)) {
                $response['additionalData']['conditionsRegistered'] = $conditionsRegistered;
            }

            if (!empty($symptomsRegistered)) {
                $response['additionalData']['symptomsRegistered'] = $symptomsRegistered;
            }

            return $this->json($response);
        } catch (\Exception $e) {
            $this->logger->error('Onboarding: Error inesperado: ' . $e->getMessage());
            $this->logger->error('Onboarding: Stacktrace: ' . $e->getTraceAsString());
            return $this->json([
                'message' => 'Error al procesar el onboarding',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
