import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../router/paths";
import Step1Context from "../components/onboarding/Step1Context";
import Step2LifeStage from "../components/onboarding/Step2LifeStage";
import Step3Preferences from "../components/onboarding/Step3Preferences";
import Step4Symptoms from "../components/onboarding/Step4Sympoms";
import Step5Health from "../components/onboarding/Step5HealthConcerns";
import { OnboardingFormData } from "../types/forms/OnboardingFormData";
import { StepProps } from "../types/components/StepProps";

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
    getValues,
    setValue,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    mode: "onSubmit", // Validamos solo al enviar
    reValidateMode: "onChange",
    defaultValues: {
      isPersonal: true,
      profileType: "profile_women",
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
      completed: false,
    },
  });

  const deriveProfileType = (): OnboardingFormData["profileType"] => {
    const isPersonal = watch("isPersonal");
    const stage = watch("stageOfLife");

    if (!isPersonal) return "profile_guest";
    if (stage === "transition") return "profile_trans";
    if (stage === "underage") return "profile_underage";
    return "profile_women";
  };
  

  useEffect(() => {
    if (user?.onboardingCompleted) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [user, navigate]);

  // 🧩 Validación por paso

  const validateStep = async (currentStep: number): Promise<boolean> => {
    setError(null);

    if (currentStep === 1) {
      const genderValue = getValues("genderIdentity");
      console.log("El valor de genderValue es: ", genderValue);
      
      const inputValue = document.querySelector(
        'input[name="genderIdentity"]'
      );
      console.log("El valor directo del input es: ", inputValue);

      if (genderValue && genderValue.trim() !== "") {
        return true;
      } else {
        setError("El campo de identidad de género es obligatorio");
        return false;
      }
    } else if (currentStep === 2) {
      // Paso 2: Validar stageOfLife y campos de transición hormonal si aplica
      let isValid = await trigger("stageOfLife");

      if (isValid) {
        const stage = watch("stageOfLife");
        const hormoneType = watch("hormoneType");
        const hormoneStartDate = watch("hormoneStartDate");
        const hormoneFrequencyDays = watch("hormoneFrequencyDays");

        // Si es transición y al menos un campo está completo, entonces los tres deben estarlo
        if (
          stage === "transition" &&
          (hormoneType || hormoneStartDate || hormoneFrequencyDays) &&
          (!hormoneType || !hormoneStartDate || !hormoneFrequencyDays)
        ) {
          setError(
            "Si estás en transición hormonal, debes completar los tres campos o dejarlos vacíos."
          );
          isValid = false;
        }
      }

      return isValid;
    }
    
    // Para otros pasos, simplemente permitimos avanzar
    return true;
  };

  const handleNextStep = async () => {
    try {
      // Validamos el paso actual
      if (await validateStep(step)) {
        // Si pasa la validación, avanzamos al siguiente paso
        setStep((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error en la validación:", err);
      setError("Ha ocurrido un error al validar el formulario.");
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };
  

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

      const profileType = deriveProfileType();
      const finalData: OnboardingFormData = {
        ...data,
        profileType,
        completed: true,
      };

      console.log("📦 Payload final enviado al backend:", finalData);

      const updatedUser = await completeOnboarding(finalData);

      if (updatedUser?.onboardingCompleted) {
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

  const handleFinalSubmit = async () => {
    try {
      const valid = await validateStep(step);
      if (valid) {
        // Si la validación es exitosa, enviamos el formulario
        handleSubmit(saveOnboarding)();
      }
    } catch (err) {
      console.error("Error en la validación final:", err);
      setError("Ha ocurrido un error al validar el formulario.");
    }
  };

  // Función para manejar el evento onBlur del campo gender
  const handleGenderBlur = () => {
    // No hacemos nada especial, simplemente dejamos que React Hook Form maneje la validación
  };

  // Props comunes para todos los componentes Step
  const commonStepProps: StepProps = {
    isSubmitting,
    error,
    register,
    control,
    watch,
    setValue,
    errors,
    trigger,
    onNextStep: handleNextStep,
    onPreviousStep: handlePreviousStep,
    setStep, // Props legacy para compatibilidad
    onGenderBlur: handleGenderBlur, // Función para limpiar espacios
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8e9ea] to-[#f5dfc4] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-xl">
        {step === 1 && (
          <Step1Context 
            {...commonStepProps} 
          />
        )}
        {step === 2 && (
          <Step2LifeStage 
            {...commonStepProps} 
          />
        )}
        {step === 3 && (
          <Step3Preferences 
            {...commonStepProps} 
          />
        )}
        {step === 4 && (
          <Step4Symptoms 
            {...commonStepProps} 
          />
        )}
        {step === 5 && (
          <Step5Health
            {...commonStepProps}
            onSubmit={handleFinalSubmit}
          />
        )}

        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
