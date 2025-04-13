<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\PregnancyLog;
use App\Repository\PregnancyLogRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Doctrine\ORM\EntityManagerInterface;

#[Route('/api/pregnancy')]
class PregnancyController extends AbstractController
{
    public function __construct(
        private PregnancyLogRepository $pregnancyLogRepository,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator,
        private EntityManagerInterface $entityManager
    ) {
    }

    #[Route('', name: 'api_pregnancy_list', methods: ['GET'])]
    public function getPregnancyLogs(): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Obtener todos los registros de embarazo del usuario usando el método optimizado
        $pregnancyLogs = $this->pregnancyLogRepository->findByUser($user, ['createdAt' => 'DESC']);
        
        return $this->json($pregnancyLogs, 200, [], ['groups' => 'pregnancy:read']);
    }

    #[Route('/{id}', name: 'api_pregnancy_get', methods: ['GET'])]
    public function getPregnancyLog(int $id): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Buscar el registro de embarazo
        $pregnancyLog = $this->pregnancyLogRepository->find($id);
        
        if (!$pregnancyLog) {
            return $this->json(['message' => 'Pregnancy log not found'], 404);
        }
        
        // Verificar que el registro pertenece al usuario autenticado
        if ($pregnancyLog->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('Cannot access pregnancy log from another user');
        }
        
        return $this->json($pregnancyLog, 200, [], ['groups' => 'pregnancy:read']);
    }

    #[Route('', name: 'api_pregnancy_create', methods: ['POST'])]
    public function createPregnancyLog(Request $request): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Parsear datos
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['startDate']) || !isset($data['dueDate'])) {
            return $this->json(['message' => 'Missing required fields: startDate, dueDate'], 400);
        }
        
        // Crear un nuevo registro de embarazo
        $pregnancyLog = new PregnancyLog();
        $pregnancyLog->setUser($user);
        $pregnancyLog->setStartDate(new \DateTime($data['startDate']));
        $pregnancyLog->setDueDate(new \DateTime($data['dueDate']));
        
        // Establecer campos opcionales si existen
        if (isset($data['week'])) {
            $pregnancyLog->setWeek($data['week']);
        }
        
        if (isset($data['symptoms'])) {
            $pregnancyLog->setSymptoms($data['symptoms']);
        }
        
        if (isset($data['fetalMovements'])) {
            $pregnancyLog->setFetalMovements($data['fetalMovements']);
        }
        
        if (isset($data['ultrasoundDate'])) {
            $pregnancyLog->setUltrasoundDate(new \DateTime($data['ultrasoundDate']));
        }
        
        if (isset($data['notes'])) {
            $pregnancyLog->setNotes($data['notes']);
        }
        
        // Validar
        $errors = $this->validator->validate($pregnancyLog);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['message' => 'Validation failed', 'errors' => $errorMessages], 400);
        }
        
        // Guardar
        $this->pregnancyLogRepository->save($pregnancyLog, true);
        
        return $this->json($pregnancyLog, 201, [], ['groups' => 'pregnancy:read']);
    }

    #[Route('/{id}', name: 'api_pregnancy_update', methods: ['PUT'])]
    public function updatePregnancyLog(int $id, Request $request): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }
        
        // Buscar el registro de embarazo
        $pregnancyLog = $this->pregnancyLogRepository->find($id);
        if (!$pregnancyLog) {
            return $this->json(['message' => 'Pregnancy log not found'], 404);
        }
        
        // Verificar que el registro pertenece al usuario autenticado
        if ($pregnancyLog->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('Cannot modify pregnancy log from another user');
        }
        
        // Parsear datos
        $data = json_decode($request->getContent(), true);
        
        // Actualizar campos permitidos
        if (isset($data['startDate'])) {
            $pregnancyLog->setStartDate(new \DateTime($data['startDate']));
        }
        
        if (isset($data['dueDate'])) {
            $pregnancyLog->setDueDate(new \DateTime($data['dueDate']));
        }
        
        if (isset($data['week'])) {
            $pregnancyLog->setWeek($data['week']);
        }
        
        if (isset($data['symptoms'])) {
            $pregnancyLog->setSymptoms($data['symptoms']);
        }
        
        if (isset($data['fetalMovements'])) {
            $pregnancyLog->setFetalMovements($data['fetalMovements']);
        }
        
        if (isset($data['ultrasoundDate'])) {
            $pregnancyLog->setUltrasoundDate(new \DateTime($data['ultrasoundDate']));
        }
        
        if (isset($data['notes'])) {
            $pregnancyLog->setNotes($data['notes']);
        }
        
        // Validar
        $errors = $this->validator->validate($pregnancyLog);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['message' => 'Validation failed', 'errors' => $errorMessages], 400);
        }
        
        // Guardar
        $this->pregnancyLogRepository->save($pregnancyLog, true);
        
        return $this->json($pregnancyLog, 200, [], ['groups' => 'pregnancy:read']);
    }

    #[Route('/{id}', name: 'api_pregnancy_delete', methods: ['DELETE'])]
    public function deletePregnancyLog(int $id): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }
        
        // Buscar el registro de embarazo
        $pregnancyLog = $this->pregnancyLogRepository->find($id);
        if (!$pregnancyLog) {
            return $this->json(['message' => 'Pregnancy log not found'], 404);
        }
        
        // Verificar que el registro pertenece al usuario autenticado
        if ($pregnancyLog->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('Cannot delete pregnancy log from another user');
        }
        
        // Eliminar
        $this->pregnancyLogRepository->remove($pregnancyLog, true);
        
        return $this->json(['message' => 'Pregnancy log deleted successfully'], 200);
    }

    #[Route('/weekly/{week}', name: 'api_pregnancy_weekly', methods: ['GET'])]
    public function getWeeklyInfo(int $week): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }
        
        // Validar semana
        if ($week < 1 || $week > 42) {
            return $this->json(['message' => 'Invalid week number. Must be between 1 and 42'], 400);
        }
        
        // Aquí se podrían obtener datos informativos sobre la semana específica del embarazo
        // Para este ejemplo, crearemos información estática
        $weeklyInfo = [
            'week' => $week,
            'babySize' => $this->getBabySizeForWeek($week),
            'development' => $this->getDevelopmentForWeek($week),
            'motherChanges' => $this->getMotherChangesForWeek($week),
            'tips' => $this->getTipsForWeek($week),
            'nextSteps' => $this->getNextStepsForWeek($week)
        ];
        
        return $this->json($weeklyInfo);
    }

    #[Route('/calculate-due-date', name: 'api_pregnancy_calculate_due_date', methods: ['POST'])]
    public function calculateDueDate(Request $request): JsonResponse
    {
        // Verificar autenticación
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }
        
        // Parsear datos
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['lastPeriodDate'])) {
            return $this->json(['message' => 'Missing required field: lastPeriodDate'], 400);
        }
        
        // Calcular fecha probable de parto (40 semanas después del último período)
        $lastPeriod = new \DateTime($data['lastPeriodDate']);
        $dueDate = clone $lastPeriod;
        $dueDate->modify('+280 days'); // 40 semanas
        
        return $this->json([
            'lastPeriodDate' => $lastPeriod->format('Y-m-d'),
            'dueDate' => $dueDate->format('Y-m-d'),
            'currentWeek' => $this->calculateCurrentWeek($lastPeriod)
        ]);
    }

    /**
     * Calcula la semana actual del embarazo basado en la fecha del último período
     */
    private function calculateCurrentWeek(\DateTime $lastPeriod): int
    {
        $today = new \DateTime();
        $daysDifference = $today->diff($lastPeriod)->days;
        $weekNumber = floor($daysDifference / 7) + 1;
        
        return min(42, max(1, $weekNumber)); // Entre 1 y 42 semanas
    }

    /**
     * Métodos auxiliares para proporcionar información por semana
     * Nota: En una implementación real, estos datos podrían venir de una base de datos o servicio externo
     */
    private function getBabySizeForWeek(int $week): string
    {
        $sizes = [
            1 => 'Microscópico',
            2 => 'Grano de semilla de amapola',
            3 => 'Semilla de sésamo',
            4 => 'Semilla de adormidera',
            5 => 'Semilla de naranja',
            6 => 'Lenteja',
            7 => 'Mirtilo',
            8 => 'Frambuesa',
            9 => 'Uva',
            10 => 'Fresa',
            11 => 'Higo',
            12 => 'Lima',
            13 => 'Limón',
            14 => 'Melocotón',
            15 => 'Naranja',
            16 => 'Aguacate',
            17 => 'Mango',
            18 => 'Pepino',
            19 => 'Tomate',
            20 => 'Plátano',
            21 => 'Zanahoria',
            22 => 'Berenjena',
            23 => 'Mazorca de maíz',
            24 => 'Oreja de maíz',
            25 => 'Coliflor',
            26 => 'Col',
            27 => 'Coliflor',
            28 => 'Berenjena',
            29 => 'Calabaza',
            30 => 'Repollo',
            31 => 'Coco',
            32 => 'Melón',
            33 => 'Piña',
            34 => 'Melón cantalupo',
            35 => 'Melón',
            36 => 'Lechuga romana',
            37 => 'Apio',
            38 => 'Calabaza de invierno',
            39 => 'Sandía pequeña',
            40 => 'Pequeña calabaza',
            41 => 'Calabaza mediana',
            42 => 'Sandía'
        ];
        
        return $sizes[$week] ?? 'Tamaño desconocido';
    }
    
    private function getDevelopmentForWeek(int $week): string
    {
        $developments = [
            1 => 'La fertilización ha ocurrido, pero la implantación aún no.',
            2 => 'El embrión se implanta en el útero.',
            3 => 'Se forman las primeras células sanguíneas y el tubo neural.',
            4 => 'Comienza a formarse el corazón y se desarrollan los brotes que formarán brazos y piernas.',
            5 => 'El corazón empieza a latir y se desarrollan los ojos, oídos y espina dorsal.',
            6 => 'Se forman las fosas nasales y se desarrollan las manos y pies.',
            7 => 'Comienzan a formarse los párpados y el bebé empieza a moverse.',
            8 => 'Se desarrollan todos los órganos principales.',
            9 => 'Se forman los dedos de manos y pies.',
            10 => 'El bebé ahora se considera un feto. Los órganos vitales comienzan a funcionar.',
            11 => 'Se empiezan a formar los genitales.',
            12 => 'Se forman las uñas y el bebé puede hacer gestos faciales.',
            13 => 'El bebé puede chuparse el pulgar y sus huellas dactilares se están formando.',
            14 => 'Se desarrollan los ojos y oídos.',
            15 => 'El bebé desarrolla cabello y puede percibir la luz.',
            16 => 'El bebé puede mover las piernas y brazos con más fuerza.',
            17 => 'El cuerpo del bebé se cubre de lanugo (vello fino).',
            18 => 'Las huellas dactilares son únicas y permanentes.',
            19 => 'Se desarrollan los sentidos (gusto, olfato, vista, audición y tacto).',
            20 => 'El bebé desarrolla un patrón regular de sueño y vigilia.',
            21 => 'Se desarrolla el sentido del equilibrio.',
            22 => 'Se forma la capa de vérnix que protege la piel.',
            23 => 'Los pulmones continúan desarrollándose.',
            24 => 'Las huellas de pies y manos están bien definidas.',
            25 => 'Los pulmones comienzan a producir surfactante.',
            26 => 'Los ojos se abren y se cierran.',
            27 => 'El cerebro está muy activo.',
            28 => 'Los pulmones maduran para respirar aire.',
            29 => 'El bebé puede regular su temperatura corporal.',
            30 => 'El cerebro crece rápidamente.',
            31 => 'Todos los sentidos están desarrollados.',
            32 => 'El bebé practica la respiración.',
            33 => 'Los huesos se endurecen, pero el cráneo sigue siendo suave.',
            34 => 'Las pupilas pueden dilatarse y contraerse.',
            35 => 'La mayoría de los sistemas están bien desarrollados.',
            36 => 'El bebé ha aumentado significativamente de peso.',
            37 => 'Se considera que el bebé ya está a término.',
            38 => 'El bebé sigue ganando peso.',
            39 => 'El desarrollo está prácticamente completo.',
            40 => 'El bebé está listo para nacer.',
            41 => 'El bebé sigue creciendo.',
            42 => 'El bebé está completamente desarrollado.'
        ];
        
        return $developments[$week] ?? 'Desarrollo desconocido para esta semana';
    }

    private function getMotherChangesForWeek(int $week): string
    {
        if ($week <= 12) {
            return 'Primer trimestre: náuseas matutinas, fatiga, cambios hormonales, posible sensibilidad en los senos.';
        } elseif ($week <= 27) {
            return 'Segundo trimestre: aumento del apetito, mayor energía, crecimiento visible del abdomen, posibles movimientos fetales.';
        } else {
            return 'Tercer trimestre: aumento de peso, posible dificultad para dormir, presión en la pelvis, contracciones de Braxton Hicks.';
        }
    }

    private function getTipsForWeek(int $week): array
    {
        if ($week <= 12) {
            return [
                'Tomar ácido fólico diariamente',
                'Descansar lo suficiente',
                'Evitar el alcohol, tabaco y drogas',
                'Mantener una alimentación equilibrada'
            ];
        } elseif ($week <= 27) {
            return [
                'Empezar clases de preparación al parto',
                'Hacer ejercicio suave regularmente',
                'Planificar la baja por maternidad',
                'Considerar opciones de lactancia'
            ];
        } else {
            return [
                'Preparar el hogar para la llegada del bebé',
                'Finalizar el plan de parto',
                'Descansar frecuentemente',
                'Familiarizarse con las señales de parto'
            ];
        }
    }

    private function getNextStepsForWeek(int $week): array
    {
        if ($week <= 12) {
            return [
                'Primera ecografía',
                'Análisis de sangre iniciales',
                'Seleccionar obstetra o matrona'
            ];
        } elseif ($week <= 27) {
            return [
                'Ecografía morfológica',
                'Test de glucosa',
                'Clases prenatales'
            ];
        } else {
            return [
                'Visitas médicas más frecuentes',
                'Monitorización del bebé',
                'Preparar la bolsa para el hospital'
            ];
        }
    }
}
