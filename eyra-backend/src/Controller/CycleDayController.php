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

#[Route('/cycle-days')]
class CycleDayController extends AbstractController
{
    public function __construct(
        private CycleDayRepository $cycleDayRepository,
        private MenstrualCycleRepository $cycleRepository,
        private EntityManagerInterface $entityManager
    ) {
    }

    // ! 20/05/2025 - Endpoint para listar días de ciclo con filtrado
    #[Route('', name: 'api_cycledays_list', methods: ['GET'])]
    public function listCycleDays(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }

        // Parámetros de filtrado
        $cycleId = $request->query->getInt('cycleId', 0);
        $startDateStr = $request->query->get('startDate');
        $endDateStr = $request->query->get('endDate');
        
        $startDate = $startDateStr ? new \DateTime($startDateStr) : null;
        $endDate = $endDateStr ? new \DateTime($endDateStr) : null;
        
        // Crear query builder base
        $qb = $this->cycleDayRepository->createQueryBuilder('cd')
            ->join('cd.cycle', 'c')
            ->andWhere('c.user = :user')
            ->setParameter('user', $user);
        
        // Aplicar filtros si están presentes
        if ($cycleId > 0) {
            $qb->andWhere('cd.cycle = :cycleId')
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
        
        // Verificar que el ciclo pertenece al usuario actual
        if ($cycleDay->getCycle()->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('You do not have permission to access this cycle day');
        }
        
        return $this->json($cycleDay, 200, [], ['groups' => 'cycle_day:read']);
    }

    // ! 20/05/2025 - Endpoint para crear un nuevo día de ciclo
    #[Route('', name: 'api_cycledays_create', methods: ['POST'])]
    public function createCycleDay(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            throw new AccessDeniedException('User not authenticated');
        }
        
        $data = json_decode($request->getContent(), true);
        
        // Validar datos requeridos
        if (!isset($data['cycleId']) || !isset($data['date'])) {
            return $this->json(['message' => 'Missing required fields: cycleId, date'], 400);
        }
        
        // Obtener el ciclo menstrual
        $cycle = $this->cycleRepository->find($data['cycleId']);
        
        if (!$cycle) {
            return $this->json(['message' => 'Menstrual cycle not found'], 404);
        }
        
        // Verificar que el ciclo pertenece al usuario actual
        if ($cycle->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('You do not have permission to access this cycle');
        }
        
        // Crear fecha
        $date = new \DateTime($data['date']);
        
        // Verificar si ya existe un día para esta fecha y ciclo
        $existingDay = $this->cycleDayRepository->findOneBy([
            'cycle' => $cycle,
            'date' => $date
        ]);
        
        if ($existingDay) {
            return $this->json(['message' => 'A cycle day already exists for this date'], 409);
        }
        
        // Calcular el número de día (días desde el inicio del ciclo)
        $dayNumber = $date->diff($cycle->getStartDate())->days + 1;
        
        // Determinar la fase del ciclo basándonos en el día del ciclo
        $phase = $this->determineCyclePhase($cycle, $dayNumber);
        
        // Crear nuevo día de ciclo
        $cycleDay = new CycleDay();
        $cycleDay->setCycle($cycle);
        $cycleDay->setDate($date);
        $cycleDay->setDayNumber($dayNumber);
        $cycleDay->setPhase($phase);
        
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
        
        // Verificar que el ciclo pertenece al usuario actual
        if ($cycleDay->getCycle()->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('You do not have permission to update this cycle day');
        }
        
        $data = json_decode($request->getContent(), true);
        
        // Actualizar campos si se proporcionan
        if (isset($data['date'])) {
            $date = new \DateTime($data['date']);
            $cycleDay->setDate($date);
            
            // Recalcular el número de día
            $dayNumber = $date->diff($cycleDay->getCycle()->getStartDate())->days + 1;
            $cycleDay->setDayNumber($dayNumber);
            
            // Recalcular la fase
            $phase = $this->determineCyclePhase($cycleDay->getCycle(), $dayNumber);
            $cycleDay->setPhase($phase);
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
        
        // Si se proporciona una fase explícita, usarla en lugar de la calculada
        if (isset($data['phase'])) {
            $cycleDay->setPhase(CyclePhase::from($data['phase']));
        }
        
        // Persistir los cambios
        $this->entityManager->flush();
        
        return $this->json($cycleDay, 200, [], ['groups' => 'cycle_day:read']);
    }

    // ! 20/05/2025 - Endpoint para eliminar un día de ciclo
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
        
        // Verificar que el ciclo pertenece al usuario actual
        if ($cycleDay->getCycle()->getUser()->getId() !== $user->getId()) {
            throw new AccessDeniedException('You do not have permission to delete this cycle day');
        }
        
        // Eliminar el día de ciclo
        $this->entityManager->remove($cycleDay);
        $this->entityManager->flush();
        
        return $this->json(['message' => 'Cycle day deleted successfully']);
    }

    // ! 20/05/2025 - Endpoint para obtener un día de ciclo por fecha
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
            ->join('cd.cycle', 'c')
            ->andWhere('c.user = :user')
            ->andWhere('cd.date = :date')
            ->setParameter('user', $user)
            ->setParameter('date', $dateObj)
            ->getQuery()
            ->getResult();
        
        if (empty($cycleDays)) {
            return $this->json(['message' => 'No cycle day found for this date'], 404);
        }
        
        // Normalmente solo debería haber un día por fecha, pero devolvemos todos por si acaso
        return $this->json($cycleDays, 200, [], ['groups' => 'cycle_day:read']);
    }
    
    /**
     * Método auxiliar para determinar la fase del ciclo basándose en el día y la duración del ciclo
     */
    private function determineCyclePhase(MenstrualCycle $cycle, int $dayNumber): CyclePhase
    {
        $menstrualDuration = $cycle->getAverageDuration();
        $cycleLength = $cycle->getAverageCycleLength();
        
        // Determinar duración aproximada de cada fase
        $follicularStart = $menstrualDuration + 1;
        $ovulationStart = round($cycleLength / 2) - 1;
        $lutealStart = round($cycleLength / 2) + 1;
        
        // Asignar fase basada en el día del ciclo
        if ($dayNumber <= $menstrualDuration) {
            return CyclePhase::MENSTRUAL;
        } elseif ($dayNumber >= $follicularStart && $dayNumber < $ovulationStart) {
            return CyclePhase::FOLICULAR;
        } elseif ($dayNumber >= $ovulationStart && $dayNumber < $lutealStart) {
            return CyclePhase::OVULACION;
        } else {
            return CyclePhase::LUTEA;
        }
    }
}
