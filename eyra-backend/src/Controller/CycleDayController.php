<?php

namespace App\Controller;

use App\Entity\CycleDay;
use App\Entity\MenstrualCycle;
use App\Entity\User;
use App\Enum\CyclePhase;
use App\Repository\CycleDayRepository;
use App\Repository\MenstrualCycleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

// ! 20/05/2025 - Creación de controlador para endpoints de días del ciclo menstrual
// ! 23/05/2025 - Actualizado para trabajar con el nuevo modelo basado en fases
// ! 25/05/2025 - Añadida funcionalidad para determinar automáticamente la fase del ciclo por fecha

#[Route('/cycle-days')]
class CycleDayController extends AbstractController
{
    public function __construct(
        private CycleDayRepository $cycleDayRepository,
        private MenstrualCycleRepository $cycleRepository,
        private EntityManagerInterface $entityManager
    ) {}

    // ! 20/05/2025 - Endpoint para listar días de ciclo con filtrado
    // ! 23/05/2025 - Actualizado para trabajar con fases en lugar de ciclos
    #[Route('', name: 'api_cycledays_list', methods: ['GET'])]
    public function listCycleDays(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Parámetros de filtrado
        $cycleId = $request->query->get('cycleId');
        $phaseId = $request->query->getInt('phaseId', 0);
        $startDateStr = $request->query->get('startDate');
        $endDateStr = $request->query->get('endDate');

        $startDate = $startDateStr ? new \DateTime($startDateStr) : null;
        $endDate = $endDateStr ? new \DateTime($endDateStr) : null;

        // Crear query builder base
        $qb = $this->cycleDayRepository->createQueryBuilder('cd')
            ->join('cd.cyclePhase', 'p')
            ->andWhere('p.user = :user')
            ->setParameter('user', $user);

        // Aplicar filtros si están presentes
        if ($phaseId > 0) {
            $qb->andWhere('cd.cyclePhase = :phaseId')
                ->setParameter('phaseId', $phaseId);
        }

        if ($cycleId) {
            $qb->andWhere('p.cycleId = :cycleId')
                ->setParameter('cycleId', $cycleId);
        }

        if ($startDate) {
            $qb->andWhere('cd.date >= :startDate')
                ->setParameter('startDate', $startDate);
        }

        if ($endDate) {
            $qb->andWhere('cd.date <= :endDate')
                ->setParameter('endDate', $endDate);
        }

        // Obtener los días ordenados por fecha
        $cycleDays = $qb->orderBy('cd.date', 'DESC')
            ->getQuery()
            ->getResult();

        return $this->json($cycleDays, 200, [], ['groups' => 'cycle_day:read']);
    }

    // ! 20/05/2025 - Endpoint para obtener un día específico por ID
    // ! 23/05/2025 - Actualizado para trabajar con el modelo basado en fases
    #[Route('/{id}', name: 'api_cycledays_get', methods: ['GET'])]
    public function getCycleDay(int $id): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        $cycleDay = $this->cycleDayRepository->find($id);

        if (!$cycleDay) {
            return $this->json(['message' => 'Cycle day not found'], 404);
        }

        // Verificar que el día pertenece al usuario actual
        if ($cycleDay->getCyclePhase()->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('You do not have permission to access this cycle day');
        }

        return $this->json($cycleDay, 200, [], ['groups' => 'cycle_day:read']);
    }

    // ! 25/05/2025 - Método para encontrar la fase del ciclo por fecha
    private function findCyclePhaseByDate(User $user, \DateTimeInterface $date): ?MenstrualCycle
    {
        // Obtener todas las fases del ciclo actual
        $cycles = $this->cycleRepository->createQueryBuilder('mc')
            ->andWhere('mc.user = :user')
            ->andWhere('mc.startDate <= :date')
            ->andWhere('mc.endDate >= :date')
            ->setParameter('user', $user)
            ->setParameter('date', $date)
            ->getQuery()
            ->getResult();

        if (empty($cycles)) {
            return null;
        }

        // Si hay más de una fase que coincide (poco probable pero posible),
        // usamos la más reciente
        usort($cycles, function (MenstrualCycle $a, MenstrualCycle $b) {
            return $b->getStartDate() <=> $a->getStartDate();
        });

        return $cycles[0];
    }

    // ! 20/05/2025 - Endpoint para crear un nuevo día de ciclo
    // ! 23/05/2025 - Actualizado para trabajar con fases en lugar de ciclos
    // ! 25/05/2025 - Modificado para determinar automáticamente la fase por fecha
    #[Route('', name: 'api_cycledays_create', methods: ['POST'])]
    public function createCycleDay(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        $data = json_decode($request->getContent(), true);

        // Validar fecha requerida
        if (!isset($data['date'])) {
            return $this->json(['message' => 'Missing required field: date'], 400);
        }

        // Crear fecha
        $date = new \DateTime($data['date']);

        // Determinar la fase del ciclo
        $phase = null;
        if (isset($data['phaseId'])) {
            // Si se proporciona phaseId, usamos esa fase
            $phase = $this->cycleRepository->find($data['phaseId']);

            if (!$phase) {
                return $this->json(['message' => 'Cycle phase not found'], 404);
            }

            // Verificar que la fase pertenece al usuario actual
            if ($phase->getUser()->getId() !== $user->getId()) {
                throw new AccessDeniedException('You do not have permission to access this cycle phase');
            }
        } else {
            // Si no se proporciona phaseId, intentamos determinar la fase automáticamente
            $phase = $this->findCyclePhaseByDate($user, $date);

            if (!$phase) {
                return $this->json([
                    'message' => 'No cycle phase found for this date. Please provide a phaseId or create a cycle phase for this date range first.'
                ], 404);
            }
        }

        // Verificar si ya existe un día para esta fecha y fase
        $existingDay = $this->cycleDayRepository->findOneBy([
            'cyclePhase' => $phase,
            'date' => $date
        ]);

        if ($existingDay) {
            return $this->json(['message' => 'A cycle day already exists for this date and phase'], 409);
        }

        // Calcular el número de día (días desde el inicio de la fase)
        $dayNumber = $date->diff($phase->getStartDate())->days + 1;

        // Crear nuevo día de ciclo
        $cycleDay = new CycleDay();
        $cycleDay->setCyclePhase($phase);
        // Solución temporal: Establecer cycle_id para compatibilidad con BD
        $cycleDay->setCycleId($phase->getId());
        // Solución temporal: Establecer phase para compatibilidad con BD
        $cycleDay->setPhase($phase->getPhase() ? $phase->getPhase()->value : 'UNKNOWN');
        $cycleDay->setDate($date);
        $cycleDay->setDayNumber($dayNumber);

        // Establecer síntomas, estado de ánimo y flujo si se proporcionan
        if (isset($data['symptoms'])) {
            $cycleDay->setSymptoms($data['symptoms']);
        }

        if (isset($data['mood'])) {
            $cycleDay->setMood($data['mood']);
        }

        if (isset($data['flowIntensity'])) {
            $cycleDay->setFlowIntensity($data['flowIntensity']);
        }

        if (isset($data['notes'])) {
            $cycleDay->setNotes($data['notes']);
        }

        // Persistir el nuevo día de ciclo
        $this->entityManager->persist($cycleDay);
        $this->entityManager->flush();

        return $this->json($cycleDay, 201, [], ['groups' => 'cycle_day:read']);
    }

    // ! 20/05/2025 - Endpoint para actualizar un día de ciclo existente
    // ! 23/05/2025 - Actualizado para trabajar con fases en lugar de ciclos
    #[Route('/{id}', name: 'api_cycledays_update', methods: ['PUT'])]
    public function updateCycleDay(int $id, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        $cycleDay = $this->cycleDayRepository->find($id);

        if (!$cycleDay) {
            return $this->json(['message' => 'Cycle day not found'], 404);
        }

        // Verificar que el día pertenece al usuario actual
        if ($cycleDay->getCyclePhase()->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('You do not have permission to update this cycle day');
        }

        $data = json_decode($request->getContent(), true);

        // Actualizar la fase si se proporciona
        if (isset($data['phaseId'])) {
            $phase = $this->cycleRepository->find($data['phaseId']);

            if (!$phase) {
                return $this->json(['message' => 'Cycle phase not found'], 404);
            }

            // Verificar que la fase pertenece al usuario actual
            if ($phase->getUser()->getId() !== $user->getId()) {
                throw new AccessDeniedException('You do not have permission to access this cycle phase');
            }

            $cycleDay->setCyclePhase($phase);
            // Actualizar cycle_id también para mantener sincronización con la fase
            $cycleDay->setCycleId($phase->getId());
            // Actualizar phase también para mantener sincronización con la fase
            $cycleDay->setPhase($phase->getPhase() ? $phase->getPhase()->value : 'UNKNOWN');
        }

        // Actualizar campos si se proporcionan
        if (isset($data['date'])) {
            $date = new \DateTime($data['date']);
            $cycleDay->setDate($date);

            // Recalcular el número de día
            $dayNumber = $date->diff($cycleDay->getCyclePhase()->getStartDate())->days + 1;
            $cycleDay->setDayNumber($dayNumber);
        }

        if (isset($data['symptoms'])) {
            $cycleDay->setSymptoms($data['symptoms']);
        }

        if (isset($data['mood'])) {
            $cycleDay->setMood($data['mood']);
        }

        if (isset($data['flowIntensity'])) {
            $cycleDay->setFlowIntensity($data['flowIntensity']);
        }

        if (isset($data['notes'])) {
            $cycleDay->setNotes($data['notes']);
        }

        // Persistir los cambios
        $this->entityManager->flush();

        return $this->json($cycleDay, 200, [], ['groups' => 'cycle_day:read']);
    }

    // ! 20/05/2025 - Endpoint para eliminar un día de ciclo
    // ! 23/05/2025 - Actualizado para trabajar con fases en lugar de ciclos
    #[Route('/{id}', name: 'api_cycledays_delete', methods: ['DELETE'])]
    public function deleteCycleDay(int $id): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        $cycleDay = $this->cycleDayRepository->find($id);

        if (!$cycleDay) {
            return $this->json(['message' => 'Cycle day not found'], 404);
        }

        // Verificar que el día pertenece al usuario actual
        if ($cycleDay->getCyclePhase()->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('You do not have permission to delete this cycle day');
        }

        // Eliminar el día de ciclo
        $this->entityManager->remove($cycleDay);
        $this->entityManager->flush();

        return $this->json(['message' => 'Cycle day deleted successfully']);
    }

    // ! 20/05/2025 - Endpoint para obtener un día de ciclo por fecha
    // ! 23/05/2025 - Actualizado para trabajar con fases en lugar de ciclos
    #[Route('/date/{date}', name: 'api_cycledays_by_date', methods: ['GET'])]
    public function getCycleDayByDate(string $date): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        $dateObj = new \DateTime($date);

        // Buscar días de ciclo para esta fecha que pertenezcan al usuario
        $cycleDays = $this->cycleDayRepository->createQueryBuilder('cd')
            ->join('cd.cyclePhase', 'p')
            ->andWhere('p.user = :user')
            ->andWhere('cd.date = :date')
            ->setParameter('user', $user)
            ->setParameter('date', $dateObj)
            ->getQuery()
            ->getResult();

        if (empty($cycleDays)) {
            return $this->json(['message' => 'No cycle day found for this date'], 404);
        }

        return $this->json($cycleDays, 200, [], ['groups' => 'cycle_day:read']);
    }
}
