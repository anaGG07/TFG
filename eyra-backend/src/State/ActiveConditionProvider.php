<?php

namespace App\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\ConditionRepository;

// ! 28/05/2025 - Proveedor personalizado para condiciones activas
class ActiveConditionProvider implements ProviderInterface
{
    public function __construct(
        private ConditionRepository $conditionRepository
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        // Devuelve solo condiciones con state = true
        return $this->conditionRepository->findBy(['state' => true]);
    }
}
