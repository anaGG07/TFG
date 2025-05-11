import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useForm, SubmitHandler,} from "react-hook-form";

import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../router/paths";
import Step1Context from "../components/onboarding/Step1Context";
import Step2LifeStage from "../components/onboarding/Step2LifeStage";
import Step3Preferences from "../components/onboarding/Step3Preferences";
import Step4Symptoms from "../components/onboarding/Step4Sympoms";
import Step5Health from "../components/onboarding/Step5HealthConcerns";
import { OnboardingFormData } from "../types/forms/OnboardingFormData";

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, completeOnboarding, refreshSession } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<OnboardingFormData>({
    defaultValues: {
      isPersonal: true,
      genderIdentity: "",
      pronouns: "",
      stageOfLife: "",
      lastPeriodDate: "",
      averageCycleLength: 28,
      averagePeriodLength: 5,
      receiveAlerts: true,
      receiveRecommendations: true,
      receiveCyclePhaseTips: true,
      receiveWorkoutSuggestions: true,
      receiveNutritionAdvice: true,
      shareCycleWithPartner: false,
      wantAICompanion: true,
      healthConcerns: [],
      accessCode: "",
      allowParentalMonitoring: false,
      commonSymptoms: [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user?.onboardingCompleted) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [user, navigate]);

  const saveOnboarding: SubmitHandler<OnboardingFormData> = async (data) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const sessionRefreshed = await refreshSession();
      if (!sessionRefreshed) {
        setError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        setTimeout(() => {
          navigate(ROUTES.LOGIN, { replace: true });
        }, 2000);
        return;
      }

      const finalData = step === 5 ? { ...data, completed: true } : data;
      const updatedUser = await completeOnboarding(finalData);

      if (step < 5) {
        setStep((prev) => prev + 1);
      } else if (updatedUser?.onboardingCompleted) {
        setTimeout(() => {
          navigate(ROUTES.DASHBOARD, { replace: true });
        }, 50);
      } else {
        setError(
          "Tu perfil se guardó pero ocurrió un error al completar el proceso."
        );
      }
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al guardar tus datos. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onSubmit = handleSubmit(saveOnboarding);

  const formProps = {
    step,
    setStep,
    isSubmitting,
    isValid,
    error,
    register,
    control,
    watch,
    setValue,
    errors,
    saveOnboarding,
    onSubmit,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8e9ea] to-[#f5dfc4] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-xl">
        {step === 1 && <Step1Context {...formProps} />}
        {step === 2 && <Step2LifeStage {...formProps} />}
        {step === 3 && <Step3Preferences {...formProps} />}
        {step === 4 && <Step4Symptoms {...formProps} />}
        {step === 5 && <Step5Health {...formProps} onSubmit={onSubmit} />}
      </div>
    </div>
  );
};

export default OnboardingPage;
