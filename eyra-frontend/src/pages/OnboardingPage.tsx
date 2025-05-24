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
  const { user, completeOnboarding, isLoading, isAuthenticated, checkAuth } =
    useAuth();
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

      if (isComplete) {
        navigate(ROUTES.DASHBOARD, { replace: true });
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#e7e0d5] flex items-center justify-center p-4">
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background: "linear-gradient(145deg, #f0e8dc, #ddd5c9)",
            boxShadow: `
              20px 20px 40px rgba(91, 1, 8, 0.08),
              -20px -20px 40px rgba(255, 255, 255, 0.25)
            `,
          }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5b0108] mx-auto"></div>
          <p className="mt-4 text-[#5b0108] font-medium">
            Verificando sesión...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    navigate(ROUTES.LOGIN, { replace: true });
    return null;
  }

  const validateStep = async (currentStep: number): Promise<boolean> => {
    setError(null);

    if (currentStep === 1) {
      const genderValue = getValues("genderIdentity");
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
    return true;
  };

  const handleNextStep = async () => {
    try {
      if (await validateStep(step)) {
        setStep((prev) => prev + 1);
      }
    } catch (err) {
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
        genderIdentity: data.genderIdentity?.trim() || "",
        stageOfLife: data.stageOfLife?.trim() || "",
        lastPeriodDate: data.lastPeriodDate?.trim() || undefined,
      };

      try {
        const updatedUser = await completeOnboarding(finalData);
        if (updatedUser?.onboardingCompleted) {
          navigate(ROUTES.DASHBOARD, { replace: true });
        } else {
          setError(
            "Tu perfil se guardó pero ocurrió un error al completar el proceso."
          );
        }
      } catch (error: any) {
        if (
          error.message === "No hay usuario autenticado" ||
          error.message === "La sesión ha expirado"
        ) {
          setError(
            "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
          );
          setTimeout(() => {
            navigate(ROUTES.LOGIN, { replace: true });
          }, 2000);
        } else {
          setError(
            error.message ||
              "Ocurrió un error al guardar tus datos. Intenta de nuevo."
          );
        }
      }
    } catch (err) {
      setError("Ocurrió un error al guardar tus datos. Intenta de nuevo.");
    } finally {
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
      setError("Ha ocurrido un error al validar el formulario.");
    }
  };

  const handleGenderBlur = () => {};

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
    <div className="min-h-screen bg-[#e7e0d5] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Barra de progreso neomorphic */}
        <div className="mb-8 flex justify-center">
          <div
            className="flex gap-4 p-4 rounded-2xl"
            style={{
              background: "linear-gradient(145deg, #f0e8dc, #ddd5c9)",
              boxShadow: `
                inset 8px 8px 16px rgba(91, 1, 8, 0.05),
                inset -8px -8px 16px rgba(255, 255, 255, 0.3)
              `,
            }}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="h-3 w-16 rounded-full transition-all duration-500"
                style={{
                  background:
                    step >= n
                      ? "linear-gradient(135deg, #C62328, #9d0d0b)"
                      : "linear-gradient(145deg, #ddd5c9, #f0e8dc)",
                  boxShadow:
                    step >= n
                      ? `inset 2px 2px 4px rgba(91, 1, 8, 0.3), inset -2px -2px 4px rgba(255, 108, 92, 0.2)`
                      : `inset 2px 2px 4px rgba(91, 1, 8, 0.05), inset -2px -2px 4px rgba(255, 255, 255, 0.8)`,
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Contenedor principal neomorphic */}
        <div
          className="rounded-3xl p-8 relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #f0e8dc, #ddd5c9)",
            boxShadow: `
              25px 25px 50px rgba(91, 1, 8, 0.08),
              -25px -25px 50px rgba(255, 255, 255, 0.25),
              inset 0 1px 0 rgba(255, 255, 255, 0.15)
            `,
            minHeight: "600px",
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-light text-[#5b0108] mb-3">
              Bienvenida a EYRA
            </h1>
            <p className="text-lg text-[#300808] leading-relaxed">
              Un espacio para ti, tu ciclo y tu bienestar.
            </p>
            <p className="text-sm text-[#9d0d0b] mt-2 italic">
              Tómate tu tiempo, este espacio es solo para ti.
            </p>
          </div>

          {/* Contenido del paso */}
          <div
            className="flex flex-col justify-between"
            style={{ minHeight: "400px" }}
          >
            <div className="flex-1">
              {step === 1 && <Step1Context {...commonStepProps} />}
              {step === 2 && <Step2LifeStage {...commonStepProps} />}
              {step === 3 && <Step3Preferences {...commonStepProps} />}
              {step === 4 && <Step4Symptoms {...commonStepProps} />}
              {step === 5 && (
                <Step5HealthConcerns
                  {...commonStepProps}
                  onSubmit={handleFinalSubmit}
                />
              )}
            </div>

            {/* Error message */}
            {error && (
              <div
                className="mt-6 p-4 rounded-xl text-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(220, 38, 127, 0.05), rgba(239, 68, 68, 0.03))",
                  border: "1px solid rgba(239, 68, 68, 0.15)",
                  boxShadow: `
                    inset 2px 2px 4px rgba(239, 68, 68, 0.05),
                    inset -2px -2px 4px rgba(255, 255, 255, 0.8)
                  `,
                }}
              >
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Mensaje final */}
        {step === 5 && !isSubmitting && (
          <div className="mt-8 text-center">
            <div
              className="p-6 rounded-2xl"
              style={{
                background: "linear-gradient(145deg, #f0e8dc, #ddd5c9)",
                boxShadow: `
                  15px 15px 30px rgba(91, 1, 8, 0.08),
                  -15px -15px 30px rgba(255, 255, 255, 0.25)
                `,
              }}
            >
              <h3 className="text-2xl font-serif text-[#C62328] font-light mb-2">
                ¡Onboarding completado!
              </h3>
              <p className="text-[#5b0108] text-lg leading-relaxed">
                Estás lista para descubrir, conectar y evolucionar con EYRA.
                <br />
                <span className="font-semibold">Tu ciclo, tu poder</span>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
