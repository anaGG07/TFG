<?php

namespace App\Controller;

use App\Entity\Content;
use App\Enum\ContentType;
use App\Enum\CyclePhase;
use App\Repository\ContentRepository;
use App\Repository\ConditionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

#[Route('//content')]
class ContentController extends AbstractController
{
    public function __construct(
        private ContentRepository $contentRepository,
        private ConditionRepository $conditionRepository,
        private EntityManagerInterface $entityManager
    ) {
    }

    #[Route('', name: 'api_content_list', methods: ['GET'])]
    public function listContent(Request $request): JsonResponse
    {
        // Filtros opcionales
        $type = $request->query->get('type');
        $phase = $request->query->get('phase');
        $condition = $request->query->get('condition');
        $limit = $request->query->getInt('limit', 10);

        $queryBuilder = $this->contentRepository->createQueryBuilder('c');

        // Aplicar filtros
        if ($type) {
            $queryBuilder
                ->andWhere('c.type = :type')
                ->setParameter('type', ContentType::from($type));
        }

        if ($phase) {
            $queryBuilder
                ->andWhere('c.targetPhase = :phase')
                ->setParameter('phase', CyclePhase::from($phase));
        }

        if ($condition) {
            $queryBuilder
                ->join('c.relatedConditions', 'rc')
                ->andWhere('rc.id = :conditionId')
                ->setParameter('conditionId', $condition);
        }

        // Ejecutar consulta
        $content = $queryBuilder
            ->orderBy('c.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();

        return $this->json($content, 200, [], ['groups' => 'content:read']);
    }

    #[Route('/{id}', name: 'api_content_get', methods: ['GET'])]
    public function getContent(int $id): JsonResponse
    {
        $content = $this->contentRepository->find($id);
        
        if (!$content) {
            return $this->json(['message' => 'Contenido no encontrado'], 404);
        }

        return $this->json($content, 200, [], ['groups' => 'content:read']);
    }

    #[Route('/phase/{phase}', name: 'api_content_by_phase', methods: ['GET'])]
    public function getContentByPhase(string $phase, Request $request): JsonResponse
    {
        $limit = $request->query->getInt('limit', 10);
        $type = $request->query->get('type');

        try {
            $cyclePhase = CyclePhase::from($phase);
            
            // Si se especifica un tipo
            if ($type) {
                $contentType = ContentType::from($type);
                $content = $this->contentRepository->findByTypeAndPhase($contentType, $cyclePhase, $limit);
            } else {
                // Si no se especifica un tipo (implementamos el método faltante)
                $content = $this->contentRepository->findByPhase($cyclePhase, $limit);
            }
            
            return $this->json($content, 200, [], ['groups' => 'content:read']);
        } catch (\ValueError $e) {
            return $this->json(['message' => 'Fase del ciclo no válida'], 400);
        }
    }

    #[Route('', name: 'api_content_create', methods: ['POST'])]
    public function createContent(Request $request): JsonResponse
    {
        // Verificar permisos (solo admin puede crear contenido)
        if (!$this->isGranted('ROLE_ADMIN')) {
            throw new AccessDeniedException('No tienes permisos para crear contenido');
        }

        $data = json_decode($request->getContent(), true);

        // Verificar datos requeridos
        if (!isset($data['title'], $data['description'], $data['content'], $data['type'])) {
            return $this->json([
                'message' => 'Faltan campos requeridos',
                'required' => ['title', 'description', 'content', 'type']
            ], 400);
        }

        // Crear contenido
        $content = new Content();
        $content->setTitle($data['title']);
        $content->setDescription($data['description']);
        $content->setContent($data['content']);
        
        try {
            $content->setType(ContentType::from($data['type']));
        } catch (\ValueError $e) {
            return $this->json(['message' => 'Tipo de contenido no válido'], 400);
        }

        // Configurar fase objetivo (opcional)
        if (isset($data['targetPhase'])) {
            try {
                $content->setTargetPhase(CyclePhase::from($data['targetPhase']));
            } catch (\ValueError $e) {
                return $this->json(['message' => 'Fase objetivo no válida'], 400);
            }
        }

        // Configurar campos opcionales
        if (isset($data['tags'])) {
            $content->setTags($data['tags']);
        }

        if (isset($data['imageUrl'])) {
            $content->setImageUrl($data['imageUrl']);
        }

        // Relacionar con condiciones si se especifican
        if (isset($data['relatedConditions']) && is_array($data['relatedConditions'])) {
            foreach ($data['relatedConditions'] as $conditionId) {
                $condition = $this->conditionRepository->find($conditionId);
                if ($condition) {
                    $content->addRelatedCondition($condition);
                }
            }
        }

        // Guardar en base de datos
        $this->entityManager->persist($content);
        $this->entityManager->flush();

        return $this->json($content, 201, [], ['groups' => 'content:read']);
    }

    #[Route('/{id}', name: 'api_content_update', methods: ['PUT'])]
    public function updateContent(int $id, Request $request): JsonResponse
    {
        // Verificar permisos (solo admin puede actualizar contenido)
        if (!$this->isGranted('ROLE_ADMIN')) {
            throw new AccessDeniedException('No tienes permisos para actualizar contenido');
        }

        $content = $this->contentRepository->find($id);
        
        if (!$content) {
            return $this->json(['message' => 'Contenido no encontrado'], 404);
        }

        $data = json_decode($request->getContent(), true);

        // Actualizar campos permitidos
        if (isset($data['title'])) {
            $content->setTitle($data['title']);
        }
        
        if (isset($data['description'])) {
            $content->setDescription($data['description']);
        }
        
        if (isset($data['content'])) {
            $content->setContent($data['content']);
        }
        
        if (isset($data['type'])) {
            try {
                $content->setType(ContentType::from($data['type']));
            } catch (\ValueError $e) {
                return $this->json(['message' => 'Tipo de contenido no válido'], 400);
            }
        }
        
        if (isset($data['targetPhase'])) {
            try {
                $content->setTargetPhase(CyclePhase::from($data['targetPhase']));
            } catch (\ValueError $e) {
                return $this->json(['message' => 'Fase objetivo no válida'], 400);
            }
        }
        
        if (isset($data['tags'])) {
            $content->setTags($data['tags']);
        }
        
        if (isset($data['imageUrl'])) {
            $content->setImageUrl($data['imageUrl']);
        }

        // Actualizar en base de datos
        $this->entityManager->flush();

        return $this->json($content, 200, [], ['groups' => 'content:read']);
    }

    #[Route('/{id}', name: 'api_content_delete', methods: ['DELETE'])]
    public function deleteContent(int $id): JsonResponse
    {
        // Verificar permisos (solo admin puede eliminar contenido)
        if (!$this->isGranted('ROLE_ADMIN')) {
            throw new AccessDeniedException('No tienes permisos para eliminar contenido');
        }

        $content = $this->contentRepository->find($id);
        
        if (!$content) {
            return $this->json(['message' => 'Contenido no encontrado'], 404);
        }

        $this->entityManager->remove($content);
        $this->entityManager->flush();

        return $this->json(['message' => 'Contenido eliminado con éxito']);
    }
}
