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

const Step2LifeStage: React.FC<Props> = ({
  isSubmitting,
  isValid,
  register,
  errors,
  watch,
  setStep,
}) => {
  const stageOfLife = watch("stageOfLife");

  const getStageDescription = (stage: string) => {
    switch (stage) {
      case "menstrual":
        return "Podrás registrar síntomas, duración del ciclo y obtener predicciones.";
      case "transition":
        return "Adaptaremos el seguimiento a tu proceso de hormonación.";
      case "pregnancy":
        return "EYRA te acompañará durante tu embarazo o preparación.";
      case "menopause":
        return "Recibirás recomendaciones sobre bienestar y salud hormonal.";
      case "underage":
        return "El seguimiento estará guiado con control parental.";
      case "trackingOthers":
        return "Podrás visualizar y apoyar el seguimiento de otra persona.";
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-[#300808] mb-8 text-center">
        Cuéntanos en qué etapa de tu vida estás o en qué necesitas que EYRA te
        ayude.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-[#300808] mb-2 font-medium">
            Selecciona tu situación actual:
          </label>
          <select
            {...register("stageOfLife", {
              required: "Selecciona una opción para continuar",
            })}
            className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
          >
            <option value="">-- Elige una opción --</option>
            <option value="menstrual">Tengo ciclos menstruales activos</option>
            <option value="transition">
              Estoy en un proceso de transición hormonal
            </option>
            <option value="pregnancy">
              Estoy embarazada o buscando embarazo
            </option>
            <option value="menopause">
              Estoy en menopausia o perimenopausia
            </option>
            <option value="underage">Soy menor y necesito seguimiento</option>
            <option value="trackingOthers">
              Solo quiero acompañar a alguien más
            </option>
          </select>
          {errors.stageOfLife && (
            <p className="text-red-500 text-sm mt-1">
              {errors.stageOfLife.message}
            </p>
          )}
        </div>

        {stageOfLife && (
          <p className="text-sm text-[#300808] bg-[#f8f4f2] p-4 rounded-md border border-[#300808]/10">
            {getStageDescription(stageOfLife)}
          </p>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="px-6 py-3 bg-gray-300 text-[#300808] rounded-lg font-medium hover:bg-gray-400"
        >
          Atrás
        </button>

        <button
          type="button"
          onClick={() => setStep(3)}
          disabled={!isValid || isSubmitting}
          className="px-8 py-3 bg-[#5b0108] text-white rounded-lg font-medium transition-all hover:bg-[#9d0d0b] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Guardando..." : "Siguiente"}
        </button>
      </div>
    </div>
  );
};

export default Step2LifeStage;
