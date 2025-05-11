<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Onboarding;
use App\Enum\ProfileType;
use App\Enum\HormoneType;
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

        // Log para verificar la autenticación
        error_log('Onboarding: Estado de autenticación - Usuario: ' . ($user ? $user->getEmail() : 'no autenticado'));
        error_log('Onboarding: Cookies presentes: ' . json_encode($request->cookies->all()));

        if (!$user instanceof User) {
            // Intentar recuperar el usuario usando cualquier cookie JWT que exista
            $jwtCookie = $request->cookies->get('jwt_token');
            
            if ($jwtCookie) {
                // Si tenemos la cookie pero no el usuario, hay un problema en la sesión
                error_log('Onboarding: Cookie JWT existe pero usuario no disponible. Investigar SecurityContext');
                return $this->json([
                    'message' => 'No autenticado - Problema con la sesión de usuario',
                    'retryAfterLogin' => true,
                ], 401);
            }
            
            return $this->json(['message' => 'No autenticado'], 401);
        }

        $data = json_decode($request->getContent(), true);

        // Buscar si el usuario ya tiene un onboarding asociado
        $onboarding = $em->getRepository(Onboarding::class)->findOneBy(['user' => $user]);

        // Si no existe, crear uno nuevo
        if (!$onboarding) {
            $onboarding = new Onboarding();
            $onboarding->setUser($user);
        }

        // Actualizar los datos del onboarding
        if (isset($data['profileType'])) {
            $profileType = ProfileType::from($data['profileType']);
            $onboarding->setProfileType($profileType);
        }

        if (isset($data['genderIdentity'])) {
            $onboarding->setGenderIdentity($data['genderIdentity']);
        }

        if (isset($data['pronouns'])) {
            $onboarding->setPronouns($data['pronouns']);
        }

        if (isset($data['isPersonal'])) {
            $onboarding->setIsPersonal((bool) $data['isPersonal']);
        }

        if (isset($data['stageOfLife'])) {
            $onboarding->setStageOfLife($data['stageOfLife']);
        }

        if (isset($data['lastPeriodDate']) && !empty($data['lastPeriodDate'])) {
            $onboarding->setLastPeriodDate(new \DateTime($data['lastPeriodDate']));
        }

        if (isset($data['averageCycleLength'])) {
            $onboarding->setAverageCycleLength((int) $data['averageCycleLength']);
        }

        if (isset($data['averagePeriodLength'])) {
            $onboarding->setAveragePeriodLength((int) $data['averagePeriodLength']);
        }

        if (isset($data['hormoneType']) && !empty($data['hormoneType'])) {
            $hormoneType = HormoneType::from($data['hormoneType']);
            $onboarding->setHormoneType($hormoneType);
        }

        if (isset($data['hormoneStartDate']) && !empty($data['hormoneStartDate'])) {
            $onboarding->setHormoneStartDate(new \DateTime($data['hormoneStartDate']));
        }

        if (isset($data['hormoneFrequencyDays'])) {
            $onboarding->setHormoneFrequencyDays((int) $data['hormoneFrequencyDays']);
        }

        // Preferencias
        if (isset($data['receiveAlerts'])) {
            $onboarding->setReceiveAlerts((bool) $data['receiveAlerts']);
        }

        if (isset($data['receiveRecommendations'])) {
            $onboarding->setReceiveRecommendations((bool) $data['receiveRecommendations']);
        }

        if (isset($data['receiveCyclePhaseTips'])) {
            $onboarding->setReceiveCyclePhaseTips((bool) $data['receiveCyclePhaseTips']);
        }

        if (isset($data['receiveWorkoutSuggestions'])) {
            $onboarding->setReceiveWorkoutSuggestions((bool) $data['receiveWorkoutSuggestions']);
        }

        if (isset($data['receiveNutritionAdvice'])) {
            $onboarding->setReceiveNutritionAdvice((bool) $data['receiveNutritionAdvice']);
        }

        if (isset($data['shareCycleWithPartner'])) {
            $onboarding->setShareCycleWithPartner((bool) $data['shareCycleWithPartner']);
        }

        if (isset($data['wantAICompanion'])) {
            $onboarding->setWantAICompanion((bool) $data['wantAICompanion']);
        }

        // Otros
        if (isset($data['healthConcerns'])) {
            $onboarding->setHealthConcerns($data['healthConcerns']);
        }

        if (isset($data['accessCode'])) {
            $onboarding->setAccessCode($data['accessCode']);
        }

        if (isset($data['allowParentalMonitoring'])) {
            $onboarding->setAllowParentalMonitoring((bool) $data['allowParentalMonitoring']);
        }

        if (isset($data['commonSymptoms'])) {
            $onboarding->setCommonSymptoms($data['commonSymptoms']);
        }

        // Marcar como completado si viene en los datos
        if (isset($data['completed'])) {
            $onboarding->setCompleted((bool) $data['completed']);
            
            // También actualizar el estado en el usuario
            $user->setOnboardingCompleted((bool) $data['completed']);
        }

        // Guardar los cambios en la base de datos
        $em->persist($onboarding);
        $em->persist($user);
        $em->flush();

        return $this->json(
            [
                'message' => 'Onboarding completado correctamente',
                'user' => $user,
                'onboarding' => $onboarding
            ],
            200,
            [],
            ['groups' => ['user:read', 'onboarding:read']]
        );
    }
}
