import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../router/paths";
import Step1Context from "../components/onboarding/Step1Context";
import Step2LifeStage from "../components/onboarding/Step2LifeStage";
import Step3Preferences from "../components/onboarding/Step3Preferences";
import Step4Symptoms from "../components/onboarding/Step4Symptoms";
import Step5HealthConcerns from "../components/onboarding/Step5HealthConcerns";
import { OnboardingFormData } from "../types/forms/OnboardingFormData";
import { StepProps } from "../types/components/StepProps";

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, completeOnboarding, isLoading, isAuthenticated, checkAuth } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompletedMessage, setShowCompletedMessage] = useState(false);

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
    mode: "onSubmit",
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
      wantAiCompanion: true,
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
    if (!isAuthenticated || !user) {
      const verifyAuth = async () => {
        try {
          const isAuth = await checkAuth();
          if (!isAuth) {
            navigate(ROUTES.LOGIN, { replace: true });
          }
        } catch (err) {
          navigate(ROUTES.LOGIN, { replace: true });
        }
      };
      verifyAuth();
    }
  }, [isAuthenticated, user, checkAuth, navigate]);

  useEffect(() => {
    if (!isLoading && user) {
      const directComplete = user.onboardingCompleted === true;
      const nestedComplete = user.onboarding?.completed === true;
      const isComplete =
        directComplete && (user.onboarding ? nestedComplete : true);

      console.log("OnboardingPage: Verificando estado de onboarding:", {
        userId: user.id,
        directComplete,
        nestedComplete,
        isComplete,
      });

      if (isComplete) {
        console.log(
          "OnboardingPage: Onboarding ya completado, redirigiendo a dashboard"
        );
        navigate(ROUTES.DASHBOARD, { replace: true });
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-[#f8e9ea] to-[#e7e0d5] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 shadow-xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5b0108] mx-auto"></div>
          <p className="mt-4 text-[#5b0108]">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.error('OnboardingPage: No hay usuario autenticado');
    navigate(ROUTES.LOGIN, { replace: true });
    return null;
  }

  const validateStep = async (currentStep: number): Promise<boolean> => {
    setError(null);

    if (currentStep === 1) {
      const genderValue = getValues("genderIdentity");
      console.log("El valor de genderValue es: ", genderValue);            

      if (genderValue && genderValue.trim() !== "") {
        return true;
      } else {
        setError("El campo de identidad de género es obligatorio");
        return false;
      }
    } else if (currentStep === 2) {
      let isValid = await trigger("stageOfLife");

      if (isValid) {
        const stage = watch("stageOfLife");
        const hormoneType = watch("hormoneType");
        const hormoneStartDate = watch("hormoneStartDate");
        const hormoneFrequencyDays = watch("hormoneFrequencyDays");
        const lastPeriodDate = watch("lastPeriodDate");

        // Validación para transición hormonal
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

        // Validación para fechas de período menstrual
        if (stage === "menstrual" && lastPeriodDate) {
          const selectedDate = new Date(lastPeriodDate);
          const today = new Date();
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(today.getFullYear() - 1);
          
          if (selectedDate > today) {
            setError("La fecha del último período no puede ser posterior a hoy");
            isValid = false;
          }
          
          if (selectedDate < oneYearAgo) {
            setError("La fecha del último período no puede ser anterior a un año");
            isValid = false;
          }
        }
      }

      return isValid;
    }
    
    return true;
  };

  const handleNextStep = async () => {
    try {
      if (await validateStep(step)) {
        const stage = watch("stageOfLife");
        const accessCode = watch("accessCode");
        
        // Si es acompañante con código válido, terminar onboarding
        if (step === 2 && stage === "trackingOthers" && accessCode?.trim()) {
          return handleFinalSubmit();
        }
        
        // Si es acompañante sin código, no avanzar
        if (step === 2 && stage === "trackingOthers" && !accessCode?.trim()) {
          setError("Necesitas introducir el código de invitado para continuar.");
          return;
        }
        
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
      if (!isAuthenticated || !user) {
        console.error('OnboardingPage: No hay usuario autenticado al guardar');
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
        genderIdentity: data.genderIdentity?.trim() || '',
        stageOfLife: data.stageOfLife?.trim() || '',
        lastPeriodDate: data.lastPeriodDate?.trim() || undefined,
      };

      console.log("OnboardingPage: Enviando datos al backend:", JSON.stringify(finalData, null, 2));

      try {
        const updatedUser = await completeOnboarding(finalData);
        console.log("OnboardingPage: Respuesta del servidor:", updatedUser);

        if (updatedUser?.onboardingCompleted) {
          // Mostrar mensaje de éxito
          setShowCompletedMessage(true);
          setIsSubmitting(false);
          
          // Redirigir después de 2 segundos
          setTimeout(() => {
            navigate(ROUTES.DASHBOARD, { replace: true });
          }, 2000);
        } else {
          setError(
            "Tu perfil se guardó pero ocurrió un error al completar el proceso."
          );
          setIsSubmitting(false);
        }
      } catch (error: any) {
        console.error("OnboardingPage: Error al completar onboarding:", error);
        setIsSubmitting(false);
        if (error.message === "No hay usuario autenticado" || error.message === "La sesión ha expirado") {
          setError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
          setTimeout(() => {
            navigate(ROUTES.LOGIN, { replace: true });
          }, 2000);
        } else if (error.message && error.message.includes("500")) {
          setError(
            "Ha ocurrido un error en el servidor. Nuestro equipo técnico ha sido notificado. Por favor, intenta nuevamente más tarde."
          );
        } else {
          setError(
            error.message || "Ocurrió un error al guardar tus datos. Intenta de nuevo."
          );
        }
      }
    } catch (err) {
      console.error("OnboardingPage: Error general:", err);
      setError("Ocurrió un error al guardar tus datos. Intenta de nuevo.");
      setIsSubmitting(false);
    }
  };

  const handleFinalSubmit = async () => {
    try {
      const valid = await validateStep(step);
      if (valid) {
        handleSubmit(saveOnboarding)();
      }
    } catch (err) {
      console.error("Error en la validación final:", err);
      setError("Ha ocurrido un error al validar el formulario.");
    }
  };

  const handleGenderBlur = () => {
    // Funcionalidad legacy para compatibilidad
  };

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
    setStep,
    onGenderBlur: handleGenderBlur,
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#f5ede6] relative overflow-hidden">
      {/* Barra de progreso superior optimizada */}
      <div className="absolute top-0 left-0 w-full flex justify-center z-10 pt-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className={`h-1.5 w-8 rounded-full transition-all duration-500 ${
                step >= n ? "bg-[#C62328]" : "bg-[#e7e0d5]"
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Contenido principal con altura optimizada */}
      <div className="flex-1 flex items-center justify-center px-4 pt-8 pb-4">
        <div
          className="bg-white rounded-3xl shadow-xl w-full h-full max-w-6xl flex flex-col animate-fade-in border border-[#e7e0d5] overflow-hidden"
          style={{
            background: "#e7e0d5",
            boxShadow: `
              20px 20px 40px rgba(91, 1, 8, 0.08),
              -20px -20px 40px rgba(255, 255, 255, 0.25),
              inset 0 1px 0 rgba(255, 255, 255, 0.15)
            `,
            maxHeight: "calc(100vh - 80px)",
          }}
        >
          {/* Contenido de steps con scroll interno si es necesario */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {step === 1 && (
              <Step1Context {...commonStepProps} />
            )}
            {step === 2 && (
              <Step2LifeStage {...commonStepProps} />
            )}
            {step === 3 && watch("stageOfLife") !== "trackingOthers" && (
              <Step3Preferences {...commonStepProps} />
            )}
            {step === 4 && watch("stageOfLife") !== "trackingOthers" && (
              <Step4Symptoms {...commonStepProps} />
            )}
            {step === 5 && watch("stageOfLife") !== "trackingOthers" && (
              <Step5HealthConcerns {...commonStepProps} onSubmit={handleFinalSubmit} />
            )}
          </div>

          {/* Error y mensaje final optimizados */}
          {error && (
            <div className="px-6 pb-2">
              <p className="text-red-500 text-sm text-center animate-fade-in">{error}</p>
            </div>
          )}

          {/* Mensaje de completado SOLO cuando showCompletedMessage es true */}
          {showCompletedMessage && (
            <div className="px-6 pb-4 text-center animate-fade-in">
              <h3 className="text-2xl font-serif text-[#C62328] font-bold mb-2">¡Onboarding completado!</h3>
              <p className="text-[#7a2323] text-base">Estás lista para descubrir, conectar y evolucionar con EYRA.<br/>Recuerda: <span className="font-semibold">tu ciclo, tu poder</span>.</p>
            </div>
          )}

          {/* Si es acompañante y se está enviando el formulario */}
          {isSubmitting && watch("stageOfLife") === "trackingOthers" && (
            <div className="px-6 pb-4 text-center animate-fade-in">
              <h3 className="text-2xl font-serif text-[#C62328] font-bold mb-2">¡Registro completado!</h3>
              <p className="text-[#7a2323] text-base">Te hemos vinculado como acompañante.<br/>Redirigiendo al dashboard...</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(24px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 1.2s cubic-bezier(.4,0,.2,1) both;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(91, 1, 8, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(91, 1, 8, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(91, 1, 8, 0.3);
        }
      `}</style>
    </div>
  );
};

export default OnboardingPage;