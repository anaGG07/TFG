<?php

namespace App\Service;

use App\Entity\User;
use App\Entity\Content;
use App\Entity\CycleDay;
use App\Enum\ContentType;
use App\Enum\CyclePhase;
use App\Repository\ContentRepository;
use App\Repository\CycleDayRepository;
use App\Repository\UserConditionRepository;

class ContentRecommendationService
{
    public function __construct(
        private ContentRepository $contentRepository,
        private CycleDayRepository $cycleDayRepository,
        private UserConditionRepository $userConditionRepository
    ) {}

    /**
     * Obtener recomendaciones personalizadas para el usuario basadas en su fase actual
     */
    public function getPersonalizedRecommendations(User $user, ?ContentType $type = null, int $limit = 5): array
    {
        // Obtener el día actual del ciclo
        $currentDay = $this->cycleDayRepository->findCurrentForUser($user);
        if (!$currentDay) {
            return [
                'success' => false,
                'message' => 'No se encontró información sobre tu ciclo actual',
                'recommendations' => []
            ];
        }

        // Obtener condiciones del usuario
        $userConditions = $this->userConditionRepository->findActiveByUser($user->getId());
        $conditionIds = array_map(function ($userCondition) {
            return $userCondition->getCondition()->getId();
        }, $userConditions);

        // Obtener recomendaciones basadas en la fase y tipo (opcional)
        $recommendations = $this->getRecommendationsByPhase($currentDay, $type, $limit);

        // Si hay condiciones relevantes, añadir contenido específico para esas condiciones
        if (!empty($conditionIds)) {
            $conditionBasedContent = $this->getConditionBasedRecommendations($conditionIds, $currentDay->getPhase(), $type, ceil($limit / 2));

            // Combinar y limitar al número solicitado
            $recommendations = array_merge($recommendations, $conditionBasedContent);
            $recommendations = array_slice($recommendations, 0, $limit);
        }

        return [
            'success' => true,
            'currentPhase' => $currentDay->getPhase(),
            'cycleDay' => $currentDay->getDayNumber(),
            'recommendations' => $recommendations
        ];
    }

    /**
     * Obtener recomendaciones para una fase específica
     */
    private function getRecommendationsByPhase(CycleDay $cycleDay, ?ContentType $type = null, int $limit = 5): array
    {
        // ! 25/05/2025 - Corregido para convertir string a enum CyclePhase
        $phaseString = $cycleDay->getPhase();

        try {
            // Intentar convertir el string a un enum CyclePhase
            $phaseEnum = CyclePhase::from($phaseString);

            if ($type) {
                return $this->contentRepository->findByTypeAndPhase($type, $phaseEnum, $limit);
            } else {
                return $this->contentRepository->findByPhase($phaseEnum, $limit);
            }
        } catch (\ValueError $e) {
            // Si no se puede convertir, devolver un array vacío
            return [];
        }
    }

    /**
     * Obtener recomendaciones basadas en condiciones médicas
     */
    private function getConditionBasedRecommendations(array $conditionIds, $phase, ?ContentType $type = null, int $limit = 3): array
    {
        // ! 25/05/2025 - Mejorado para manejar tanto strings como enums de CyclePhase
        $phaseValue = null;

        if (is_string($phase)) {
            try {
                // Intentar convertir el string a un enum CyclePhase
                $phaseValue = CyclePhase::from($phase)->value;
            } catch (\ValueError $e) {
                // Si no se puede convertir, usar el string tal cual
                $phaseValue = $phase;
            }
        } elseif ($phase instanceof CyclePhase) {
            $phaseValue = $phase->value;
        }

        $queryBuilder = $this->contentRepository->createQueryBuilder('c')
            ->join('c.relatedConditions', 'rc')
            ->andWhere('rc.id IN (:conditionIds)')
            ->setParameter('conditionIds', $conditionIds);

        if ($phaseValue) {
            $queryBuilder
                ->andWhere('c.targetPhase = :phase OR c.targetPhase IS NULL')
                ->setParameter('phase', $phaseValue);
        }

        if ($type) {
            $queryBuilder
                ->andWhere('c.type = :type')
                ->setParameter('type', $type);
        }

        return $queryBuilder
            ->orderBy('c.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Obtener todos los tipos de contenido disponibles
     */
    public function getAvailableContentTypes(): array
    {
        $types = [];
        foreach (ContentType::cases() as $case) {
            $types[] = [
                'code' => $case->value,
                'name' => $this->getContentTypeName($case)
            ];
        }
        return $types;
    }

    /**
     * Obtener nombre amigable del tipo de contenido
     */
    private function getContentTypeName(ContentType $type): string
    {
        return match ($type) {
            ContentType::EXERCISE => 'Ejercicios',
            ContentType::ARTICLE => 'Artículos',
            ContentType::SELFCARE => 'Autocuidado',
            ContentType::RECOMMENDATION => 'Recomendaciones generales',
            // ! 21/05/2025 - Añadido soporte para el tipo de contenido NUTRITION
            ContentType::NUTRITION => 'Nutrición',
        };
    }
}
