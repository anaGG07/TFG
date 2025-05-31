<?php

namespace App\Service;

use App\Entity\User;
use App\Entity\GuestAccess;
use App\Entity\MenstrualCycle;
use App\Repository\GuestAccessRepository;
use App\Repository\MenstrualCycleRepository;
use App\Repository\CycleDayRepository;
use Doctrine\ORM\EntityManagerInterface;

// ! 31/05/2025 - Nuevo servicio para gestionar acceso al calendario compartido con sistema de doble filtrado
class CalendarAccessService
{
    public function __construct(
        private GuestAccessRepository $guestAccessRepository,
        private MenstrualCycleRepository $cycleRepository,
        private CycleDayRepository $cycleDayRepository,
        private EntityManagerInterface $entityManager
    ) {
    }

    /**
     * Obtiene los datos de calendario de los anfitriones a los que tiene acceso el usuario invitado
     * 
     * @param User $guestUser Usuario invitado
     * @param \DateTime $startDate Fecha de inicio del rango
     * @param \DateTime $endDate Fecha de fin del rango
     * @return array Datos filtrados de calendario de anfitriones
     */
    public function getAccessibleHostData(User $guestUser, \DateTime $startDate, \DateTime $endDate): array
    {
        // 1. Obtener todos los accesos donde el usuario es invitado
        $guestAccesses = $this->guestAccessRepository->findBy([
            'guest' => $guestUser,
            'state' => true
        ]);

        // Filtrar accesos no expirados
        $activeAccesses = array_filter($guestAccesses, function(GuestAccess $access) {
            return $access->getExpiresAt() === null || $access->getExpiresAt() > new \DateTime();
        });

        $hostCycles = [];

        foreach ($activeAccesses as $access) {
            $hostUser = $access->getOwner();
            if (!$hostUser) {
                continue;
            }

            // 2. Obtener ciclos del anfitrión en el rango de fechas
            $cycles = $this->cycleRepository->findByDateRange($hostUser, $startDate, $endDate);

            // 3. Aplicar filtrado de doble nivel
            $filteredCycles = $this->applyDoubleFiltering($cycles, $access, $startDate, $endDate);

            if (!empty($filteredCycles)) {
                $hostCycles[] = [
                    'hostId' => $hostUser->getId(),
                    'hostName' => trim($hostUser->getName() . ' ' . $hostUser->getLastName()),
                    'hostUsername' => $hostUser->getUsername(),
                    'guestType' => $access->getGuestType()->value,
                    'accessPermissions' => $access->getAccessTo(),
                    'guestPreferences' => $access->getGuestPreferences(),
                    'cycles' => $filteredCycles,
                    'currentPhase' => $this->getCurrentPhase($hostUser)
                ];
            }
        }

        return $hostCycles;
    }

    /**
     * Aplica el sistema de doble filtrado: permisos del anfitrión ∩ preferencias del invitado
     * 
     * @param array $cycles Ciclos del anfitrión
     * @param GuestAccess $access Acceso del invitado
     * @param \DateTime $startDate Fecha de inicio
     * @param \DateTime $endDate Fecha de fin
     * @return array Ciclos filtrados
     */
    private function applyDoubleFiltering(array $cycles, GuestAccess $access, \DateTime $startDate, \DateTime $endDate): array
    {
        $hostPermissions = $access->getAccessTo() ?? [];
        $guestPreferences = $access->getGuestPreferences() ?? [];

        // Si no hay preferencias del invitado, usar todos los permisos del anfitrión
        if (empty($guestPreferences)) {
            $effectivePermissions = $hostPermissions;
        } else {
            // Aplicar intersección: solo mostrar lo que el anfitrión permite Y el invitado quiere ver
            $effectivePermissions = array_intersect($hostPermissions, $guestPreferences);
        }

        $filteredCycles = [];

        foreach ($cycles as $cycle) {
            $filteredCycle = $this->filterCycleData($cycle, $effectivePermissions, $startDate, $endDate);
            if ($filteredCycle) {
                $filteredCycles[] = $filteredCycle;
            }
        }

        return $filteredCycles;
    }

    /**
     * Filtra los datos de un ciclo específico según los permisos efectivos
     * 
     * @param MenstrualCycle $cycle Ciclo a filtrar
     * @param array $effectivePermissions Permisos efectivos (intersección)
     * @param \DateTime $startDate Fecha de inicio
     * @param \DateTime $endDate Fecha de fin
     * @return array|null Datos filtrados del ciclo o null si no hay permisos
     */
    private function filterCycleData(MenstrualCycle $cycle, array $effectivePermissions, \DateTime $startDate, \DateTime $endDate): ?array
    {
        if (empty($effectivePermissions)) {
            return null;
        }

        // Verificar si se permite ver esta fase
        $phasePermission = 'phase_' . $cycle->getPhase()->value;
        if (!in_array($phasePermission, $effectivePermissions)) {
            return null;
        }

        $filteredData = [
            'id' => $cycle->getId(),
            'phase' => $cycle->getPhase()->value,
            'cycleId' => $cycle->getCycleId(),
            'startDate' => $cycle->getStartDate()->format('Y-m-d'),
            'endDate' => $cycle->getEndDate()?->format('Y-m-d'),
        ];

        // Información básica (siempre incluida si se permite la fase)
        if (in_array('basic_info', $effectivePermissions)) {
            $filteredData['averageCycleLength'] = $cycle->getAverageCycleLength();
            $filteredData['averageDuration'] = $cycle->getAverageDuration();
            $filteredData['estimatedNextStart'] = $cycle->getEstimatedNextStart()?->format('Y-m-d');
        }

        // Detalles del flujo
        if (in_array('flow_details', $effectivePermissions)) {
            $filteredData['flowAmount'] = $cycle->getFlowAmount();
            $filteredData['flowColor'] = $cycle->getFlowColor();
            $filteredData['flowOdor'] = $cycle->getFlowOdor();
        }

        // Niveles de dolor
        if (in_array('pain_levels', $effectivePermissions)) {
            $filteredData['painLevel'] = $cycle->getPainLevel();
        }

        // Notas
        if (in_array('notes', $effectivePermissions)) {
            $filteredData['notes'] = $cycle->getNotes();
        }

        // Obtener días del ciclo filtrados
        if (in_array('symptoms', $effectivePermissions) || in_array('mood_tracking', $effectivePermissions)) {
            $cycleDays = $this->cycleDayRepository->findByCyclePhaseAndDateRange($cycle, $startDate, $endDate);
            $filteredData['filteredCycleDays'] = $this->filterCycleDays($cycleDays, $effectivePermissions);
        }

        return $filteredData;
    }

    /**
     * Filtra los días del ciclo según los permisos
     * 
     * @param array $cycleDays Días del ciclo
     * @param array $effectivePermissions Permisos efectivos
     * @return array Días filtrados
     */
    private function filterCycleDays(array $cycleDays, array $effectivePermissions): array
    {
        $filteredDays = [];

        foreach ($cycleDays as $day) {
            $filteredDay = [
                'id' => $day->getId(),
                'date' => $day->getDate()->format('Y-m-d'),
                'dayNumber' => $day->getDayNumber(),
            ];

            // Síntomas
            if (in_array('symptoms', $effectivePermissions)) {
                $filteredDay['symptoms'] = $day->getSymptoms() ?? [];
            }

            // Estado de ánimo
            if (in_array('mood_tracking', $effectivePermissions)) {
                $filteredDay['mood'] = $day->getMood() ?? [];
            }

            // Intensidad del flujo
            if (in_array('flow_details', $effectivePermissions)) {
                $filteredDay['flowIntensity'] = $day->getFlowIntensity();
            }

            // Notas
            if (in_array('notes', $effectivePermissions)) {
                $filteredDay['notes'] = $day->getNotes() ?? [];
            }

            $filteredDays[] = $filteredDay;
        }

        return $filteredDays;
    }

    /**
     * Obtiene la fase actual del ciclo de un usuario
     * 
     * @param User $user Usuario
     * @return string|null Fase actual o null
     */
    private function getCurrentPhase(User $user): ?string
    {
        $currentPhases = $this->cycleRepository->findCurrentPhasesForUser($user->getId());
        
        if (empty($currentPhases)) {
            return null;
        }

        // Determinar la fase actual basado en la fecha
        $today = new \DateTime();
        $currentPhase = null;

        // Ordenar fases por fecha de inicio (más reciente primero)
        usort($currentPhases, function ($a, $b) {
            return $b->getStartDate() <=> $a->getStartDate();
        });

        // La fase actual es la última que comenzó antes de hoy
        foreach ($currentPhases as $phase) {
            if ($phase->getStartDate() <= $today) {
                $currentPhase = $phase->getPhase()->value;
                break;
            }
        }

        return $currentPhase;
    }

    /**
     * Obtiene los permisos disponibles para el sistema de calendario compartido
     * 
     * @return array Permisos disponibles organizados por categoría
     */
    public function getAvailablePermissions(): array
    {
        return [
            'phases' => [
                'phase_menstrual' => 'Fase Menstrual',
                'phase_follicular' => 'Fase Folicular', 
                'phase_ovulation' => 'Ovulación',
                'phase_luteal' => 'Fase Lútea'
            ],
            'details' => [
                'basic_info' => 'Información Básica',
                'symptoms' => 'Síntomas',
                'notes' => 'Notas',
                'flow_details' => 'Detalles del Flujo',
                'pain_levels' => 'Niveles de Dolor',
                'mood_tracking' => 'Seguimiento del Estado de Ánimo'
            ],
            'features' => [
                'predictions' => 'Predicciones',
                'recommendations' => 'Recomendaciones',
                'statistics' => 'Estadísticas'
            ]
        ];
    }
}
