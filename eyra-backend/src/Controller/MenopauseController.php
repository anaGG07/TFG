<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\MenopauseLog;
use App\Repository\MenopauseLogRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Doctrine\ORM\EntityManagerInterface;

#[Route('//menopause')]
class MenopauseController extends AbstractController
{
    public function __construct(
        private MenopauseLogRepository $menopauseLogRepository,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator,
        private EntityManagerInterface $entityManager
    ) {
    }

    #[Route('', name: 'api_menopause_get', methods: ['GET'])]
    public function getMenopauseLog(): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Buscar el registro de menopausia del usuario usando el método optimizado
        $menopauseLog = $this->menopauseLogRepository->findByUserCached($user);
        
        if (!$menopauseLog) {
            return $this->json(['message' => 'No menopause log found for this user'], 404);
        }
        
        return $this->json($menopauseLog, 200, [], ['groups' => 'menopause:read']);
    }

    #[Route('', name: 'api_menopause_create', methods: ['POST'])]
    public function createOrUpdateMenopauseLog(Request $request): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Parsear datos
        $data = json_decode($request->getContent(), true);
        
        // Buscar si ya existe un registro
        $menopauseLog = $this->menopauseLogRepository->findOneBy(['user' => $user]);
        $isNew = false;
        
        // Si no existe, crear uno nuevo
        if (!$menopauseLog) {
            $menopauseLog = new MenopauseLog();
            $menopauseLog->setUser($user);
            $isNew = true;
        }
        
        // Actualizar campos según los datos recibidos
        if (isset($data['hotFlashes'])) {
            $menopauseLog->setHotFlashes($data['hotFlashes']);
        }
        
        if (isset($data['moodSwings'])) {
            $menopauseLog->setMoodSwings($data['moodSwings']);
        }
        
        if (isset($data['vaginalDryness'])) {
            $menopauseLog->setVaginalDryness($data['vaginalDryness']);
        }
        
        if (isset($data['insomnia'])) {
            $menopauseLog->setInsomnia($data['insomnia']);
        }
        
        if (isset($data['hormoneTherapy'])) {
            $menopauseLog->setHormoneTherapy($data['hormoneTherapy']);
        }
        
        if (isset($data['notes'])) {
            $menopauseLog->setNotes($data['notes']);
        }
        
        // Validar
        $errors = $this->validator->validate($menopauseLog);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['message' => 'Validation failed', 'errors' => $errorMessages], 400);
        }
        
        // Guardar
        $this->menopauseLogRepository->save($menopauseLog, true);
        
        return $this->json($menopauseLog, $isNew ? 201 : 200, [], ['groups' => 'menopause:read']);
    }

    #[Route('', name: 'api_menopause_update', methods: ['PUT'])]
    public function updateMenopauseLog(Request $request): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }
        
        // Buscar si ya existe un registro
        $menopauseLog = $this->menopauseLogRepository->findOneBy(['user' => $user]);
        
        if (!$menopauseLog) {
            return $this->json(['message' => 'No menopause log found for this user'], 404);
        }
        
        // Parsear datos
        $data = json_decode($request->getContent(), true);
        
        // Actualizar campos según los datos recibidos
        if (isset($data['hotFlashes'])) {
            $menopauseLog->setHotFlashes($data['hotFlashes']);
        }
        
        if (isset($data['moodSwings'])) {
            $menopauseLog->setMoodSwings($data['moodSwings']);
        }
        
        if (isset($data['vaginalDryness'])) {
            $menopauseLog->setVaginalDryness($data['vaginalDryness']);
        }
        
        if (isset($data['insomnia'])) {
            $menopauseLog->setInsomnia($data['insomnia']);
        }
        
        if (isset($data['hormoneTherapy'])) {
            $menopauseLog->setHormoneTherapy($data['hormoneTherapy']);
        }
        
        if (isset($data['notes'])) {
            $menopauseLog->setNotes($data['notes']);
        }
        
        // Validar
        $errors = $this->validator->validate($menopauseLog);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['message' => 'Validation failed', 'errors' => $errorMessages], 400);
        }
        
        // Guardar
        $this->menopauseLogRepository->save($menopauseLog, true);
        
        return $this->json($menopauseLog, 200, [], ['groups' => 'menopause:read']);
    }

    #[Route('/info', name: 'api_menopause_info', methods: ['GET'])]
    public function getMenopauseInfo(): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }
        
        // Información educativa sobre la menopausia
        $info = [
            'stages' => [
                [
                    'name' => 'Premenopausia',
                    'description' => 'Período antes de la menopausia donde los ciclos pueden volverse irregulares.',
                    'symptoms' => [
                        'Ciclos menstruales irregulares',
                        'Cambios en el flujo menstrual',
                        'Sofocos ocasionales',
                        'Cambios de humor'
                    ],
                    'recommendations' => [
                        'Mantener un registro de los ciclos',
                        'Ejercicio regular',
                        'Dieta equilibrada rica en calcio'
                    ]
                ],
                [
                    'name' => 'Perimenopausia',
                    'description' => 'Transición a la menopausia, generalmente comienza varios años antes de la menopausia.',
                    'symptoms' => [
                        'Sofocos frecuentes',
                        'Cambios de humor más intensos',
                        'Problemas para dormir',
                        'Sequedad vaginal',
                        'Disminución del deseo sexual'
                    ],
                    'recommendations' => [
                        'Técnicas de relajación para sofocos',
                        'Considerar opciones de terapia hormonal',
                        'Lubricantes vaginales',
                        'Suplementos para apoyar los cambios hormonales'
                    ]
                ],
                [
                    'name' => 'Menopausia',
                    'description' => 'Se diagnostica cuando han pasado 12 meses consecutivos sin períodos menstruales.',
                    'symptoms' => [
                        'Ausencia de menstruación',
                        'Sofocos intensos',
                        'Sudores nocturnos',
                        'Cambios en el sueño',
                        'Cambios en la salud ósea'
                    ],
                    'recommendations' => [
                        'Evaluación de la densidad ósea',
                        'Ejercicios de fortalecimiento',
                        'Suplementos de calcio y vitamina D',
                        'Terapia hormonal si es recomendada por el médico'
                    ]
                ],
                [
                    'name' => 'Postmenopausia',
                    'description' => 'El período después de la menopausia, que dura el resto de la vida.',
                    'symptoms' => [
                        'Disminución de los sofocos con el tiempo',
                        'Riesgos de osteoporosis',
                        'Riesgos cardiovasculares',
                        'Cambios en la piel y cabello'
                    ],
                    'recommendations' => [
                        'Chequeos médicos regulares',
                        'Mantener un estilo de vida activo',
                        'Dieta saludable para el corazón',
                        'Cuidado de la piel'
                    ]
                ]
            ],
            'treatments' => [
                [
                    'name' => 'Terapia Hormonal',
                    'description' => 'Reemplazo de hormonas para aliviar los síntomas.',
                    'benefits' => [
                        'Reduce los sofocos y sudores nocturnos',
                        'Mejora la sequedad vaginal',
                        'Puede prevenir la pérdida ósea'
                    ],
                    'risks' => [
                        'Posible aumento del riesgo de cáncer de mama',
                        'Posible aumento del riesgo de accidentes cerebrovasculares',
                        'Coágulos sanguíneos'
                    ]
                ],
                [
                    'name' => 'Medicamentos No Hormonales',
                    'description' => 'Opciones farmacológicas que no implican hormonas.',
                    'options' => [
                        'Antidepresivos para sofocos y cambios de humor',
                        'Gabapentina para sofocos',
                        'Medicamentos para prevenir la osteoporosis'
                    ]
                ],
                [
                    'name' => 'Enfoques Naturales',
                    'description' => 'Opciones complementarias para manejar los síntomas.',
                    'options' => [
                        'Fitoestrógenos (soja, trébol rojo)',
                        'Aceite de onagra',
                        'Técnicas de relajación y mindfulness',
                        'Acupuntura'
                    ]
                ]
            ],
            'lifestyle' => [
                'diet' => [
                    'Aumentar el consumo de calcio y vitamina D',
                    'Consumir alimentos ricos en fitoestrógenos',
                    'Limitar el alcohol y la cafeína',
                    'Mantener un peso saludable'
                ],
                'exercise' => [
                    'Ejercicio aeróbico regular',
                    'Entrenamiento de fuerza para la salud ósea',
                    'Yoga para reducir el estrés y mejorar el equilibrio',
                    'Caminar al menos 30 minutos diarios'
                ],
                'mental_health' => [
                    'Técnicas de manejo del estrés',
                    'Grupos de apoyo',
                    'Terapia cognitivo-conductual para los cambios de humor',
                    'Priorizar el sueño de calidad'
                ]
            ]
        ];
        
        return $this->json($info);
    }

    #[Route('/symptoms', name: 'api_menopause_symptoms', methods: ['GET'])]
    public function getSymptomManagement(): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }
        
        // Información sobre manejo de síntomas específicos de la menopausia
        $symptoms = [
            'hot_flashes' => [
                'description' => 'Sensación repentina de calor intenso, generalmente en la cara, cuello y pecho.',
                'management' => [
                    'Identificar desencadenantes (alcohol, cafeína, comidas picantes)',
                    'Usar ropa en capas fácil de quitar',
                    'Mantener la habitación fresca',
                    'Respiración profunda durante los episodios',
                    'Terapia cognitivo-conductual',
                    'Considerar opciones médicas si son severos'
                ]
            ],
            'mood_swings' => [
                'description' => 'Cambios rápidos e intensos en el estado de ánimo, irritabilidad o ansiedad.',
                'management' => [
                    'Ejercicio regular',
                    'Técnicas de relajación y mindfulness',
                    'Asegurar un sueño adecuado',
                    'Reducir el estrés',
                    'Considerar terapia o medicamentos si es necesario'
                ]
            ],
            'vaginal_dryness' => [
                'description' => 'Sequedad y posible irritación o dolor en la vagina debido a la disminución de estrógeno.',
                'management' => [
                    'Lubricantes vaginales de venta libre',
                    'Hidratantes vaginales',
                    'Terapia con estrógenos locales (cremas, anillos)',
                    'Mantener la actividad sexual',
                    'Evitar productos irritantes'
                ]
            ],
            'insomnia' => [
                'description' => 'Dificultad para conciliar o mantener el sueño, a menudo relacionada con sudores nocturnos.',
                'management' => [
                    'Mantener un horario regular de sueño',
                    'Crear un ambiente óptimo para dormir (fresco, oscuro, tranquilo)',
                    'Limitar la cafeína y el alcohol',
                    'Ejercicio regular, pero no justo antes de acostarse',
                    'Técnicas de relajación antes de dormir'
                ]
            ],
            'bone_health' => [
                'description' => 'Mayor riesgo de osteoporosis debido a la pérdida acelerada de masa ósea.',
                'management' => [
                    'Asegurar una ingesta adecuada de calcio (1200 mg/día)',
                    'Suplementos de vitamina D si es necesario',
                    'Ejercicios de carga y resistencia',
                    'Evitar el tabaco y limitar el alcohol',
                    'Considerar medicamentos para la osteoporosis si hay alto riesgo'
                ]
            ]
        ];
        
        return $this->json($symptoms);
    }
}
