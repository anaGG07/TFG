<?php

namespace App\Service;

use App\Entity\User;
use App\Entity\Content;
use App\Entity\CycleDay;
use App\Enum\ContentType;
use App\Repository\ContentRepository;
use App\Repository\CycleDayRepository;
use App\Repository\UserConditionRepository;

class ContentRecommendationService
{
    public function __construct(
        private ContentRepository $contentRepository,
        private CycleDayRepository $cycleDayRepository, 
        private UserConditionRepository $userConditionRepository
    ) {
    }

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
        $conditionIds = array_map(function($userCondition) {
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
            'currentPhase' => $currentDay->getPhase()->value,
            'cycleDay' => $currentDay->getDayNumber(),
            'recommendations' => $recommendations
        ];
    }

    /**
     * Obtener recomendaciones para una fase específica
     */
    private function getRecommendationsByPhase(CycleDay $cycleDay, ?ContentType $type = null, int $limit = 5): array
    {
        if ($type) {
            return $this->contentRepository->findByTypeAndPhase($type, $cycleDay->getPhase(), $limit);
        } else {
            return $this->contentRepository->findByPhase($cycleDay->getPhase(), $limit);
        }
    }

    /**
     * Obtener recomendaciones basadas en condiciones médicas
     */
    private function getConditionBasedRecommendations(array $conditionIds, $phase, ?ContentType $type = null, int $limit = 3): array
    {
        $queryBuilder = $this->contentRepository->createQueryBuilder('c')
            ->join('c.relatedConditions', 'rc')
            ->andWhere('rc.id IN (:conditionIds)')
            ->setParameter('conditionIds', $conditionIds);
        
        if ($phase) {
            $queryBuilder
                ->andWhere('c.targetPhase = :phase OR c.targetPhase IS NULL')
                ->setParameter('phase', $phase);
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
        return match($type) {
            ContentType::RECIPE => 'Recetas',
            ContentType::EXERCISE => 'Ejercicios',
            ContentType::ARTICLE => 'Artículos',
            ContentType::SELFCARE => 'Autocuidado',
            ContentType::RECOMMENDATION => 'Recomendaciones generales',
        };
    }
}
