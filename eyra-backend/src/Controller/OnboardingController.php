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
        try {
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
        
        // Validación explícita de campos obligatorios
        $requiredFields = ['profileType', 'genderIdentity', 'stageOfLife'];
        $missingFields = [];
        
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || (is_string($data[$field]) && trim($data[$field]) === '')) {
                $missingFields[] = $field;
                error_log("Onboarding: Campo obligatorio faltante o vacío: {$field}");
            }
        }
        
        if (!empty($missingFields)) {
            error_log('Onboarding: Faltan campos obligatorios: ' . implode(', ', $missingFields));
            return $this->json([
                'message' => 'Faltan campos obligatorios',
                'missingFields' => $missingFields,
            ], 400);
        }
        
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

        // Validar profileType
        if (isset($data['profileType'])) {
            try {
                // Verificar que el valor sea válido para la enumeración
                $validProfileTypes = array_map(fn($case) => $case->value, ProfileType::cases());
                error_log("Onboarding: Valores válidos para ProfileType: " . json_encode($validProfileTypes));
                error_log("Onboarding: Valor recibido para profileType: {$data['profileType']}");
                
                if (!in_array($data['profileType'], $validProfileTypes)) {
                    error_log("Onboarding: Valor no válido para ProfileType, intentando usar uno por defecto");
                    // Intentar determinar un valor predeterminado basado en otros campos
                    if (isset($data['isPersonal']) && $data['isPersonal'] === false) {
                        $data['profileType'] = 'profile_guest';
                    } else {
                        $data['profileType'] = 'profile_women'; // Valor predeterminado
                    }
                    error_log("Onboarding: ProfileType establecido a valor predeterminado: {$data['profileType']}");
                }
                
                $profileType = ProfileType::from($data['profileType']);
                $onboarding->setProfileType($profileType);
                error_log("Onboarding: ProfileType establecido correctamente como: {$profileType->value}");
            } catch (\ValueError $e) {
                error_log("Onboarding: Error al procesar profileType: {$e->getMessage()}");
                // Establecer un valor predeterminado en caso de error
                $profileType = ProfileType::WOMEN; // Valor seguro predeterminado
                $onboarding->setProfileType($profileType);
                error_log("Onboarding: ProfileType establecido a valor seguro: {$profileType->value}");
            }
        } else {
            // Si no se proporciona, establecer un valor predeterminado
            $profileType = ProfileType::WOMEN; // Valor predeterminado
            $onboarding->setProfileType($profileType);
            error_log("Onboarding: ProfileType no proporcionado, establecido a predeterminado: {$profileType->value}");
        }

        if (isset($data['genderIdentity'])) {
            $value = trim($data['genderIdentity'] ?? '');
            if ($value === '') {
                error_log("Onboarding: genderIdentity está vacío después del trim");
                return $this->json([
                    'message' => 'El campo de identidad de género no puede estar vacío',
                    'field' => 'genderIdentity'
                ], 400);
            }
            $onboarding->setGenderIdentity($value);
        }

        if (isset($data['pronouns'])) {
            $onboarding->setPronouns($data['pronouns']);
        }

        if (isset($data['isPersonal'])) {
            // Asegurar que se convierta correctamente a booleano
            if (is_string($data['isPersonal'])) {
                // Convertir cadenas "true"/"false" a booleanos
                $isPersonal = strtolower($data['isPersonal']) === 'true';
                error_log("Onboarding: isPersonal convertido de string '{$data['isPersonal']}' a boolean " . ($isPersonal ? 'true' : 'false'));
            } else {
                $isPersonal = (bool) $data['isPersonal'];
                error_log("Onboarding: isPersonal convertido a boolean: " . ($isPersonal ? 'true' : 'false'));
            }
            $onboarding->setIsPersonal($isPersonal);
        }

        if (isset($data['stageOfLife'])) {
            $value = trim($data['stageOfLife'] ?? '');
            if ($value === '') {
                error_log("Onboarding: stageOfLife está vacío después del trim");
                return $this->json([
                    'message' => 'El campo de etapa de vida no puede estar vacío',
                    'field' => 'stageOfLife'
                ], 400);
            }
            $onboarding->setStageOfLife($value);
        }

        if (isset($data['lastPeriodDate'])) {
            if (!empty($data['lastPeriodDate'])) {
                try {
                    $onboarding->setLastPeriodDate(new \DateTime($data['lastPeriodDate']));
                    error_log("Onboarding: lastPeriodDate establecido: {$data['lastPeriodDate']}");
                } catch (\Exception $e) {
                    error_log("Onboarding: Error al convertir lastPeriodDate: {$e->getMessage()}");
                    // Si hay error, establecer explícitamente a null
                    $onboarding->setLastPeriodDate(null);
                }
            } else {
                // Si está vacío, establecer explícitamente a null
                $onboarding->setLastPeriodDate(null);
                error_log("Onboarding: lastPeriodDate establecido a null (valor vacío)");
            }
        }

        if (isset($data['averageCycleLength'])) {
            $onboarding->setAverageCycleLength((int) $data['averageCycleLength']);
        }

        if (isset($data['averagePeriodLength'])) {
            $onboarding->setAveragePeriodLength((int) $data['averagePeriodLength']);
        }

        if (isset($data['hormoneType']) && !empty($data['hormoneType'])) {
            try {
                $hormoneType = HormoneType::from($data['hormoneType']);
                $onboarding->setHormoneType($hormoneType);
                error_log("Onboarding: HormoneType establecido correctamente como: {$hormoneType->value}");
            } catch (\ValueError $e) {
                error_log("Onboarding: Error al procesar hormoneType: {$e->getMessage()}");
                // En lugar de fallar, simplemente establecemos a null
                $onboarding->setHormoneType(null);
                error_log("Onboarding: HormoneType inválido, establecido a null");
            }
        } else {
            // Si no se proporciona o está vacío, establecer a null
            $onboarding->setHormoneType(null);
            error_log("Onboarding: hormoneType no proporcionado o vacío, establecido a null");
        }

        if (isset($data['hormoneStartDate'])) {
            if (!empty($data['hormoneStartDate'])) {
                try {
                    $onboarding->setHormoneStartDate(new \DateTime($data['hormoneStartDate']));
                    error_log("Onboarding: hormoneStartDate establecido: {$data['hormoneStartDate']}");
                } catch (\Exception $e) {
                    error_log("Onboarding: Error al convertir hormoneStartDate: {$e->getMessage()}");
                    // Si hay error, establecer explícitamente a null
                    $onboarding->setHormoneStartDate(null);
                }
            } else {
                // Si está vacío, establecer explícitamente a null
                $onboarding->setHormoneStartDate(null);
                error_log("Onboarding: hormoneStartDate establecido a null (valor vacío)");
            }
        }

        if (isset($data['hormoneFrequencyDays'])) {
            $onboarding->setHormoneFrequencyDays((int) $data['hormoneFrequencyDays']);
        }

        // Función auxiliar para convertir valores a booleanos
        $toBool = function($value) use (&$data) {
            if (is_string($value)) {
                return strtolower($value) === 'true';
            }
            return (bool) $value;
        };

        // Preferencias - usar la función auxiliar para todos los booleanos
        if (isset($data['receiveAlerts'])) {
            $onboarding->setReceiveAlerts($toBool($data['receiveAlerts']));
        }

        if (isset($data['receiveRecommendations'])) {
            $onboarding->setReceiveRecommendations($toBool($data['receiveRecommendations']));
        }

        if (isset($data['receiveCyclePhaseTips'])) {
            $onboarding->setReceiveCyclePhaseTips($toBool($data['receiveCyclePhaseTips']));
        }

        if (isset($data['receiveWorkoutSuggestions'])) {
            $onboarding->setReceiveWorkoutSuggestions($toBool($data['receiveWorkoutSuggestions']));
        }

        if (isset($data['receiveNutritionAdvice'])) {
            $onboarding->setReceiveNutritionAdvice($toBool($data['receiveNutritionAdvice']));
        }

        if (isset($data['shareCycleWithPartner'])) {
            $onboarding->setShareCycleWithPartner($toBool($data['shareCycleWithPartner']));
        }

        if (isset($data['wantAICompanion'])) {
            // Corregir la diferencia entre wantAICompanion (frontend) y wantAiCompanion (entidad)
            $onboarding->setWantAiCompanion($toBool($data['wantAICompanion']));
        } else if (isset($data['wantAiCompanion'])) {
            // Alternativa si viene con el nombre exacto de la entidad
            $onboarding->setWantAiCompanion($toBool($data['wantAiCompanion']));
        }

        // Otros
        if (isset($data['healthConcerns'])) {
            // Asegurar que sea un array
            if (!is_array($data['healthConcerns'])) {
                if (is_string($data['healthConcerns'])) {
                    // Intentar convertir de JSON si es un string
                    try {
                        $healthConcerns = json_decode($data['healthConcerns'], true);
                        if (is_array($healthConcerns)) {
                            $onboarding->setHealthConcerns($healthConcerns);
                            error_log("Onboarding: healthConcerns convertido de JSON string a array");
                        } else {
                            // Si no es un JSON válido, crear array con el string
                            $onboarding->setHealthConcerns([$data['healthConcerns']]);
                            error_log("Onboarding: healthConcerns convertido de string a array singular");
                        }
                    } catch (\Exception $e) {
                        // Si hay error en la conversión, crear array con el string
                        $onboarding->setHealthConcerns([$data['healthConcerns']]);
                        error_log("Onboarding: healthConcerns fallido al convertir JSON, usando array simple");
                    }
                } else {
                    // Valor no string ni array, usar array vacío
                    $onboarding->setHealthConcerns([]);
                    error_log("Onboarding: healthConcerns no válido, establecido como array vacío");
                }
            } else {
                // Ya es un array, usarlo directamente
                $onboarding->setHealthConcerns($data['healthConcerns']);
                error_log("Onboarding: healthConcerns establecido como array: " . count($data['healthConcerns']) . " elementos");
            }
        } else {
            // No presente, establecer array vacío
            $onboarding->setHealthConcerns([]);
            error_log("Onboarding: healthConcerns no proporcionado, establecido como array vacío");
        }

        if (isset($data['accessCode'])) {
            $onboarding->setAccessCode($data['accessCode']);
        }

        if (isset($data['allowParentalMonitoring'])) {
            $onboarding->setAllowParentalMonitoring($toBool($data['allowParentalMonitoring']));
        }

        if (isset($data['commonSymptoms'])) {
            // Asegurar que sea un array
            if (!is_array($data['commonSymptoms'])) {
                if (is_string($data['commonSymptoms'])) {
                    // Intentar convertir de JSON si es un string
                    try {
                        $commonSymptoms = json_decode($data['commonSymptoms'], true);
                        if (is_array($commonSymptoms)) {
                            $onboarding->setCommonSymptoms($commonSymptoms);
                            error_log("Onboarding: commonSymptoms convertido de JSON string a array");
                        } else {
                            // Si no es un JSON válido, crear array con el string
                            $onboarding->setCommonSymptoms([$data['commonSymptoms']]);
                            error_log("Onboarding: commonSymptoms convertido de string a array singular");
                        }
                    } catch (\Exception $e) {
                        // Si hay error en la conversión, crear array con el string
                        $onboarding->setCommonSymptoms([$data['commonSymptoms']]);
                        error_log("Onboarding: commonSymptoms fallido al convertir JSON, usando array simple");
                    }
                } else {
                    // Valor no string ni array, usar array vacío
                    $onboarding->setCommonSymptoms([]);
                    error_log("Onboarding: commonSymptoms no válido, establecido como array vacío");
                }
            } else {
                // Ya es un array, usarlo directamente
                $onboarding->setCommonSymptoms($data['commonSymptoms']);
                error_log("Onboarding: commonSymptoms establecido como array: " . count($data['commonSymptoms']) . " elementos");
            }
        } else {
            // No presente, establecer array vacío
            $onboarding->setCommonSymptoms([]);
            error_log("Onboarding: commonSymptoms no proporcionado, establecido como array vacío");
        }

        // Marcar como completado si viene en los datos
        if (isset($data['completed'])) {
            $onboarding->setCompleted($toBool($data['completed']));
            error_log("Onboarding: Campo 'completed' establecido a: " . ($toBool($data['completed']) ? 'true' : 'false'));
        }
        
        if (isset($data['onboardingCompleted'])) {
            $completed = $toBool($data['onboardingCompleted']);
            error_log("Onboarding: Campo 'onboardingCompleted' establecido a: " . ($completed ? 'true' : 'false'));
            
            // Establecer ambos campos para asegurar consistencia
            $onboarding->setCompleted($completed);
            $user->setOnboardingCompleted($completed);
            
            error_log("Onboarding: Estado de completado actualizado en ambas entidades");
        } else if (isset($data['completed'])) {
            // Si solo se estableció 'completed', usarlo para 'onboardingCompleted' también
            $completed = $toBool($data['completed']);
            $user->setOnboardingCompleted($completed);
            error_log("Onboarding: Usando 'completed' para actualizar User.onboardingCompleted");
        } else {
            // Establecer valor por defecto
            $onboarding->setCompleted(true);
            $user->setOnboardingCompleted(true);
            error_log("Onboarding: No se proporcionó estado de completado, estableciendo ambos a 'true' por defecto");
        }

        // Guardar los cambios en la base de datos con manejo más detallado de errores
        try {
            $errors = $validator->validate($onboarding);

            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[$error->getPropertyPath()] = $error->getMessage();
                }

                error_log('Onboarding: Errores de validación: ' . json_encode($errorMessages));
                return $this->json([
                    'message' => 'Error de validación en los datos enviados',
                    'errors' => $errorMessages,
                ], 400);
            }

            error_log('Onboarding: Intentando persistir la entidad Onboarding...');
            $em->persist($onboarding);

            error_log('Onboarding: Intentando persistir el usuario...');
            $em->persist($user);

            error_log('Onboarding: Ejecutando flush...');
            $em->flush();

            error_log('Onboarding: Entidades guardadas con éxito');
        } catch (\Exception $e) {
            error_log('Onboarding: Error al guardar en la base de datos: ' . $e->getMessage());
            error_log('Onboarding: Stack trace: ' . $e->getTraceAsString());
            
            return $this->json([
                'message' => 'Error al guardar los datos en la base de datos',
                'error' => $e->getMessage(),
                'class' => get_class($e)
            ], 500);
        }

        // Verificar que se haya actualizado correctamente
        error_log('Onboarding: Estado después de guardar - Usuario: ' . ($user->isOnboardingCompleted() ? 'Completado' : 'No completado'));
        error_log('Onboarding: Estado después de guardar - Onboarding: ' . ($onboarding->isCompleted() ? 'Completado' : 'No completado'));

            // Crear una respuesta serializada evitando problemas de referencias circulares
        // Configurar un contexto de serialización para evitar problemas de referencias circulares
        $userData = [
        'id' => $user->getId(),
        'email' => $user->getEmail(),
        'username' => $user->getUsername(),
        'name' => $user->getName(),
        'lastName' => $user->getLastName(),
        'profileType' => $user->getProfileType() ? $user->getProfileType()->value : null,
        'genderIdentity' => $user->getGenderIdentity(),
            'onboardingCompleted' => $user->isOnboardingCompleted(),
            ];

            $onboardingData = [
                'id' => $onboarding->getId(),
                'profileType' => $onboarding->getProfileType() ? $onboarding->getProfileType()->value : null,
                'genderIdentity' => $onboarding->getGenderIdentity(),
                'stageOfLife' => $onboarding->getStageOfLife(),
                'completed' => $onboarding->isCompleted(),
            ];

            error_log('Onboarding: Preparando respuesta manual serializada');

            return $this->json(
                [
                    'message' => 'Onboarding completado correctamente',
                    'user' => $userData,
                    'onboarding' => $onboardingData
                ],
                200
            );
        } catch (\Exception $generalException) {
            // Capturar cualquier otra excepción no controlada
            error_log('Onboarding: Error general no controlado: ' . $generalException->getMessage());
            error_log('Onboarding: Stack trace: ' . $generalException->getTraceAsString());
            
            return $this->json([
                'message' => 'Error interno del servidor',
                'error' => $generalException->getMessage(),
                'class' => get_class($generalException)
            ], 500);
        }
    }
}
