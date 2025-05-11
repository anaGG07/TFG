import React from "react";
import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { OnboardingFormData } from "../../types/forms/OnboardingFormData";

interface Props {
  isSubmitting: boolean;
  isValid: boolean;
  register: UseFormRegister<OnboardingFormData>;
  errors: FieldErrors<OnboardingFormData>;
  watch: UseFormWatch<OnboardingFormData>;
  setStep: (step: number) => void;
}

const Step3Preferences: React.FC<Props> = ({
  isSubmitting,
  isValid,
  register,
  watch,
  setStep,
}) => {
  const wantsAI = watch("wantAICompanion");
  const wantsPartner = watch("shareCycleWithPartner");

  return (
    <div className="space-y-6">
      <p className="text-[#300808] mb-8 text-center">
        ¿Cómo quieres que EYRA te acompañe durante tu experiencia?
      </p>

      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            {...register("receiveAlerts")}
            className="mr-2"
          />
          Recibir alertas relacionadas con mi ciclo o seguimiento
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            {...register("receiveRecommendations")}
            className="mr-2"
          />
          Recibir recomendaciones personalizadas
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            {...register("receiveCyclePhaseTips")}
            className="mr-2"
          />
          Consejos según cada fase del ciclo
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            {...register("receiveWorkoutSuggestions")}
            className="mr-2"
          />
          Sugerencias de actividad física
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            {...register("receiveNutritionAdvice")}
            className="mr-2"
          />
          Consejos de alimentación
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            {...register("shareCycleWithPartner")}
            className="mr-2"
          />
          Compartir el seguimiento con otra persona (pareja, tutor, acompañante)
        </label>

        {wantsPartner && (
          <p className="text-sm text-[#5b0108] ml-6">
            Podrás invitar a una persona para que te acompañe y reciba
            actualizaciones de tu estado.
          </p>
        )}

        <label className="flex items-center">
          <input
            type="checkbox"
            {...register("wantAICompanion")}
            className="mr-2"
          />
          Usar asistente IA para resolver dudas y acompañar procesos
        </label>

        {wantsAI && (
          <p className="text-sm text-[#5b0108] ml-6">
            EYRA incluirá un asistente de IA con respaldo científico para
            resolver tus dudas.
          </p>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="px-6 py-3 bg-gray-300 text-[#300808] rounded-lg font-medium hover:bg-gray-400"
        >
          Atrás
        </button>

        <button
          type="button"
          onClick={() => setStep(4)}
          disabled={!isValid || isSubmitting}
          className="px-8 py-3 bg-[#5b0108] text-white rounded-lg font-medium transition-all hover:bg-[#9d0d0b] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Guardando..." : "Siguiente"}
        </button>
      </div>
    </div>
  );
};

export default Step3Preferences;
