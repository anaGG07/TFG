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

class OnboardingController extends AbstractController
{
    private $jwtEncoder;
    private $jwtManager;
    private $tokenStorage;
    
    public function __construct(
        JWTEncoderInterface $jwtEncoder = null, 
        JWTTokenManagerInterface $jwtManager = null,
        \Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface $tokenStorage = null
    ) {
        $this->jwtEncoder = $jwtEncoder;
        $this->jwtManager = $jwtManager;
        $this->tokenStorage = $tokenStorage;
    }
    
    #[Route('/onboarding', name: 'api_onboarding', methods: ['POST'])]
    public function completeOnboarding(Request $request, EntityManagerInterface $em, ValidatorInterface $validator): JsonResponse
    {
        // Log para verificar todos los headers de la petición
        error_log('Onboarding: Headers presentes: ' . json_encode($request->headers->all()));
        
        /** @var User|null $user */
        $user = $this->getUser();
        
        // Log detallado sobre el estado de autenticación
        error_log('Onboarding: Estado de autenticación - Usuario: ' . ($user ? $user->getEmail() : 'no autenticado'));
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
        
        // Si el usuario no está autenticado, intentamos obtener manualmente
        if (!$user instanceof User) {
            // Intentar recuperar el usuario usando la cookie JWT
            $jwtCookie = $request->cookies->get('jwt_token');
            
            if ($jwtCookie) {
                error_log('Onboarding: Cookie JWT existe. Intentando decodificar manualmente.');
                
                try {
                    // Intentar decodificar el token manualmente
                    if ($this->jwtEncoder) {
                        try {
                            // Decodificar el token para obtener el payload
                            $payload = $this->jwtEncoder->decode($jwtCookie);
                            error_log('Onboarding: Token decodificado: ' . json_encode($payload));
                            
                            // Verificar el contenido completo del token
                            $tokenParts = explode('.', $jwtCookie);
                            if (count($tokenParts) === 3) {
                                $header = json_decode(base64_decode(str_replace('_', '/', str_replace('-','+', $tokenParts[0]))), true);
                                $payload2 = json_decode(base64_decode(str_replace('_', '/', str_replace('-','+', $tokenParts[1]))), true);
                                error_log('Onboarding: Header del token: ' . json_encode($header));
                                error_log('Onboarding: Payload decodificado manualmente: ' . json_encode($payload2));
                                
                                // Verificar si el token ha expirado
                                if (isset($payload2['exp'])) {
                                    $now = new \DateTime();
                                    $expiration = new \DateTime('@' . $payload2['exp']);
                                    $isExpired = $now > $expiration;
                                    $expireMessage = 'Onboarding: Token exp: ' . $payload2['exp'] . ', ahora: ' . $now->getTimestamp() . ', ¿expirado?: ' . ($isExpired ? 'SÍ' : 'NO');
                                    error_log($expireMessage);
                                    
                                    // Si está expirado, mostrarlo en pantalla
                                    if ($isExpired) {
                                        return $this->json([
                                            'message' => 'Token JWT Expirado - Por favor, inicie sesión nuevamente',
                                            'error' => $expireMessage,
                                            'currentTime' => $now->getTimestamp(),
                                            'expirationTime' => $payload2['exp'],
                                            'timeDifference' => $now->getTimestamp() - $payload2['exp'] . ' segundos',
                                            'retryAfterLogin' => true,
                                        ], 401);
                                    } else {
                            error_log('Onboarding: El token no tiene el formato esperado de 3 partes');
                            return $this->json([
                                'message' => 'Token JWT inválido - Formato incorrecto',
                                'token_parts_count' => count($tokenParts),
                                'retryAfterLogin' => true,
                            ], 401);
                        }
                                }
                            } else {
                                error_log('Onboarding: El token no tiene el formato esperado de 3 partes');
                                return $this->json([
                                    'message' => 'Token JWT inválido - Formato incorrecto',
                                    'token_parts_count' => count($tokenParts),
                                    'retryAfterLogin' => true,
                                ], 401);
                            }
                            
                            // Usar el username del payload para buscar al usuario
                            if (isset($payload['username'])) {
                                $userRepo = $em->getRepository(User::class);
                                $user = $userRepo->findOneBy(['email' => $payload['username']]);
                                
                                if ($user) {
                                    error_log('Onboarding: Usuario recuperado manualmente: ' . $user->getEmail());
                                } else {
                                    error_log('Onboarding: No se pudo encontrar el usuario con email: ' . $payload['username']);
                                    return $this->json([
                                        'message' => 'No se pudo encontrar el usuario asociado al token',
                                        'retryAfterLogin' => true,
                                    ], 401);
                                }
                            } else {
                                error_log('Onboarding: El payload del token no contiene username');
                                return $this->json([
                                    'message' => 'Token JWT inválido - No contiene username',
                                    'retryAfterLogin' => true,
                                ], 401);
                            }
                        } catch (\Exception $e) {
                            error_log('Onboarding: Error al decodificar el token: ' . $e->getMessage());
                            return $this->json([
                                'message' => 'Error al decodificar el token JWT',
                                'error' => $e->getMessage(),
                                'tokenFirstChars' => substr($jwtCookie, 0, 20) . '...',
                                'retryAfterLogin' => true,
                            ], 401);
                        }
                    } else {
                        error_log('Onboarding: JWTEncoder no disponible');
                        
                        // Intentar decodificar manualmente el token sin el encoder
                        $tokenParts = explode('.', $jwtCookie);
                        if (count($tokenParts) === 3) {
                            try {
                                $payload = json_decode(base64_decode(str_replace('_', '/', str_replace('-','+', $tokenParts[1]))), true);
                                error_log('Onboarding: Decodificación manual, payload: ' . json_encode($payload));
                                
                                // Verificar si el token ha expirado manualmente
                                if (isset($payload['exp'])) {
                                    $now = new \DateTime();
                                    $expiration = new \DateTime('@' . $payload['exp']);
                                    $isExpired = $now > $expiration;
                                    $expireMessage = 'Onboarding: Token exp: ' . $payload['exp'] . ', ahora: ' . $now->getTimestamp() . ', ¿expirado?: ' . ($isExpired ? 'SÍ' : 'NO');
                                    error_log($expireMessage);
                                    
                                    // Si está expirado, mostrarlo en pantalla
                                    if ($isExpired) {
                                        return $this->json([
                                            'message' => 'Token JWT Expirado - Por favor, inicie sesión nuevamente',
                                            'error' => $expireMessage,
                                            'currentTime' => $now->getTimestamp(),
                                            'expirationTime' => $payload['exp'],
                                            'timeDifference' => $now->getTimestamp() - $payload['exp'] . ' segundos',
                                            'retryAfterLogin' => true,
                                        ], 401);
                                    }
                                }
                                
                                if (isset($payload['username'])) {
                                    $userRepo = $em->getRepository(User::class);
                                    $user = $userRepo->findOneBy(['email' => $payload['username']]);
                                    
                                    if ($user) {
                                        error_log('Onboarding: Usuario recuperado manualmente sin encoder: ' . $user->getEmail());
                                    } else {
                                        error_log('Onboarding: No se pudo encontrar el usuario con email (fallback): ' . $payload['username']);
                                        return $this->json([
                                            'message' => 'No se pudo encontrar el usuario con email',
                                            'email' => $payload['username'],
                                            'retryAfterLogin' => true,
                                        ], 401);
                                    }
                                } else {
                                    return $this->json([
                                        'message' => 'Token JWT inválido - No contiene username',
                                        'payload' => $payload,
                                        'retryAfterLogin' => true,
                                    ], 401);
                                }
                            } catch (\Exception $e) {
                                error_log('Onboarding: Error en la decodificación manual: ' . $e->getMessage());
                                return $this->json([
                                    'message' => 'Error en la decodificación manual del token',
                                    'error' => $e->getMessage(),
                                    'token_parts' => count($tokenParts),
                                    'token_part1_length' => strlen($tokenParts[0]),
                                    'token_part2_length' => strlen($tokenParts[1]),
                                    'token_part3_length' => strlen($tokenParts[2]),
                                    'retryAfterLogin' => true,
                                ], 401);
                            }
                        }
                        
                        // Si aún no tenemos usuario, establecemos el header manualmente para ver si el sistema lo procesa
                        if (!$user instanceof User) {
                            $request->headers->set('Authorization', 'Bearer ' . $jwtCookie);
                            error_log('Onboarding: Se ha establecido manualmente el header Authorization');
                        }
                        
                        // Intentar obtener el usuario nuevamente
                        $user = $this->getUser();
                        
                        if (!$user instanceof User) {
                            error_log('Onboarding: Aún no se puede obtener el usuario después de establecer el header');
                            return $this->json([
                                'message' => 'No autenticado - Problema con la sesión de usuario',
                                'note' => 'La cookie JWT existe pero no se puede procesar correctamente',
                                'retryAfterLogin' => true
                            ], 401);
                        } else {
                            error_log('Onboarding: Usuario recuperado después de establecer el header: ' . $user->getEmail());
                        }
                    }
                } catch (\Exception $e) {
                    error_log('Onboarding: Excepción general: ' . $e->getMessage());
                    return $this->json([
                        'message' => 'Error en la autenticación',
                        'error' => $e->getMessage(),
                        'retryAfterLogin' => true
                    ], 401);
                }
            } else {
                error_log('Onboarding: No se encontró la cookie JWT');
                return $this->json(['message' => 'No autenticado - Cookie JWT no encontrada'], 401);
            }
        }
        
        // Si después de todos los intentos seguimos sin usuario, retornamos error
        if (!$user instanceof User) {
            return $this->json(['message' => 'No autenticado después de múltiples intentos'], 401);
        }

        $data = json_decode($request->getContent(), true);
        
        // Agregar logs para depuración
        error_log('Onboarding: Datos recibidos: ' . json_encode($data));
        error_log('Onboarding: \u00BFonboardingCompleted presente?: ' . (isset($data['onboardingCompleted']) ? 'S\u00CD - Valor: ' . ($data['onboardingCompleted'] ? 'true' : 'false') : 'NO'));

        // Buscar si el usuario ya tiene un onboarding asociado
        $onboarding = $em->getRepository(Onboarding::class)->findOneBy(['user' => $user]);

        // Si no existe, crear uno nuevo
        if (!$onboarding) {
            $onboarding = new Onboarding();
            $onboarding->setUser($user);
        }

        // Actualizar los datos del onboarding
        if (isset($data['profileType'])) {
            $profileType = ProfileType::from($data['profileType']);
            $onboarding->setProfileType($profileType);
        }

        if (isset($data['genderIdentity'])) {
            $value = trim($data['genderIdentity'] ?? '');
            $onboarding->setGenderIdentity($value !== '' ? $value : null);
        }

        if (isset($data['pronouns'])) {
            $onboarding->setPronouns($data['pronouns']);
        }

        if (isset($data['isPersonal'])) {
            $onboarding->setIsPersonal((bool) $data['isPersonal']);
        }

        if (isset($data['stageOfLife'])) {
            $onboarding->setStageOfLife($data['stageOfLife']);
        }

        if (isset($data['lastPeriodDate']) && !empty($data['lastPeriodDate'])) {
            $onboarding->setLastPeriodDate(new \DateTime($data['lastPeriodDate']));
        }

        if (isset($data['averageCycleLength'])) {
            $onboarding->setAverageCycleLength((int) $data['averageCycleLength']);
        }

        if (isset($data['averagePeriodLength'])) {
            $onboarding->setAveragePeriodLength((int) $data['averagePeriodLength']);
        }

        if (isset($data['hormoneType']) && !empty($data['hormoneType'])) {
            $hormoneType = HormoneType::from($data['hormoneType']);
            $onboarding->setHormoneType($hormoneType);
        }

        if (isset($data['hormoneStartDate']) && !empty($data['hormoneStartDate'])) {
            $onboarding->setHormoneStartDate(new \DateTime($data['hormoneStartDate']));
        }

        if (isset($data['hormoneFrequencyDays'])) {
            $onboarding->setHormoneFrequencyDays((int) $data['hormoneFrequencyDays']);
        }

        // Preferencias
        if (isset($data['receiveAlerts'])) {
            $onboarding->setReceiveAlerts((bool) $data['receiveAlerts']);
        }

        if (isset($data['receiveRecommendations'])) {
            $onboarding->setReceiveRecommendations((bool) $data['receiveRecommendations']);
        }

        if (isset($data['receiveCyclePhaseTips'])) {
            $onboarding->setReceiveCyclePhaseTips((bool) $data['receiveCyclePhaseTips']);
        }

        if (isset($data['receiveWorkoutSuggestions'])) {
            $onboarding->setReceiveWorkoutSuggestions((bool) $data['receiveWorkoutSuggestions']);
        }

        if (isset($data['receiveNutritionAdvice'])) {
            $onboarding->setReceiveNutritionAdvice((bool) $data['receiveNutritionAdvice']);
        }

        if (isset($data['shareCycleWithPartner'])) {
            $onboarding->setShareCycleWithPartner((bool) $data['shareCycleWithPartner']);
        }

        if (isset($data['wantAICompanion'])) {
            $onboarding->setWantAICompanion((bool) $data['wantAICompanion']);
        }

        // Otros
        if (isset($data['healthConcerns'])) {
            $onboarding->setHealthConcerns($data['healthConcerns']);
        }

        if (isset($data['accessCode'])) {
            $onboarding->setAccessCode($data['accessCode']);
        }

        if (isset($data['allowParentalMonitoring'])) {
            $onboarding->setAllowParentalMonitoring((bool) $data['allowParentalMonitoring']);
        }

        if (isset($data['commonSymptoms'])) {
            $onboarding->setCommonSymptoms($data['commonSymptoms']);
        }

        // Marcar como completado si viene en los datos
        if (isset($data['onboardingCompleted'])) {
            $onboarding->setCompleted((bool) $data['onboardingCompleted']);
            
            // También actualizar el estado en el usuario
            $user->setOnboardingCompleted((bool) $data['onboardingCompleted']);
        }

        // Guardar los cambios en la base de datos
        $errors = $validator->validate($onboarding);

        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }

            return $this->json([
                'message' => 'Error de validación en los datos enviados',
                'errors' => $errorMessages,
            ], 400);
        }

        $em->persist($onboarding);
        $em->persist($user);
        $em->flush();

        // Verificar que se haya actualizado correctamente
        error_log('Onboarding: Estado después de guardar - Usuario: ' . ($user->isOnboardingCompleted() ? 'Completado' : 'No completado'));
        error_log('Onboarding: Estado después de guardar - Onboarding: ' . ($onboarding->isCompleted() ? 'Completado' : 'No completado'));


        return $this->json(
            [
                'message' => 'Onboarding completado correctamente',
                'user' => $user,
                'onboarding' => $onboarding
            ],
            200,
            [],
            ['groups' => ['user:read', 'onboarding:read']]
        );
    }
}
