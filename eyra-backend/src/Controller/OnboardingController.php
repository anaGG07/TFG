<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class OnboardingController extends AbstractController
{
    #[Route('/api/onboarding', name: 'api_onboarding', methods: ['POST'])]
    public function completeOnboarding(Request $request, EntityManagerInterface $em): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(['message' => 'No autenticado'], 401);
        }

        $data = json_decode($request->getContent(), true);

        // Aquí asignas los valores recibidos al usuario (ajusta según tus campos)
        if (isset($data['onboardingCompleted'])) {
            $user->setOnboardingCompleted((bool) $data['onboardingCompleted']);
        }

        // Puedes agregar aquí otras actualizaciones como género, síntomas, etc.

        $em->flush();

        return $this->json(['message' => 'Onboarding completado', 'user' => $user], 200, [], ['groups' => 'user:read']);
    }
}
