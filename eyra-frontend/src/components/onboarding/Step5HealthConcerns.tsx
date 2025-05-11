import React from "react";
import {
  UseFormWatch,
  UseFormSetValue,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import { OnboardingFormData } from "../../types/forms/OnboardingFormData";

interface Props {
  isSubmitting: boolean;
  isValid: boolean;
  watch: UseFormWatch<OnboardingFormData>;
  setValue: UseFormSetValue<OnboardingFormData>;
  register: UseFormRegister<OnboardingFormData>;
  errors: FieldErrors<OnboardingFormData>;
  onSubmit: () => void;
  setStep: (step: number) => void;
}

const healthOptions = [
  "Síndrome de ovario poliquístico",
  "Endometriosis",
  "Migrañas menstruales",
  "Anemia",
  "Diabetes",
  "Hipertensión",
  "Problemas tiroideos",
  "Fibromas",
  "Depresión",
  "Ansiedad",
  "Otro",
];

const Step5HealthConcerns: React.FC<Props> = ({
  isSubmitting,
  isValid,
  watch,
  setValue,
  register,
  errors,
  onSubmit,
  setStep,
}) => {
  const selected = watch("healthConcerns") || [];

  const toggleConcern = (item: string) => {
    const updated = selected.includes(item)
      ? selected.filter((c) => c !== item)
      : [...selected, item];
    setValue("healthConcerns", updated, { shouldValidate: true });
  };

  const hasSelected = selected.length > 0;

  return (
    <div className="space-y-6">
      <p className="text-[#300808] mb-8 text-center">
        ¿Hay alguna condición médica o preocupación de salud que quieras que
        EYRA tenga en cuenta?
      </p>

      <div className="grid grid-cols-2 gap-4">
        {healthOptions.map((item) => (
          <label
            key={item}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
              selected.includes(item)
                ? "bg-[#fceced] border-[#5b0108]/60"
                : "hover:bg-[#5b010810] hover:border-[#5b0108]/30"
            }`}
            onClick={() => toggleConcern(item)}
          >
            <input
              type="checkbox"
              checked={selected.includes(item)}
              readOnly
              className="mr-3"
            />
            <span>{item}</span>
          </label>
        ))}
      </div>

      {!hasSelected && (
        <p className="text-sm text-[#5b0108] mt-4">
          Puedes omitir este paso si no tienes condiciones médicas conocidas o
          prefieres no especificar.
        </p>
      )}

      <div className="mt-4">
        <label className="block text-[#300808] mb-2 font-medium">
          Otros detalles que quieras añadir (opcional):
        </label>
        <textarea
          {...register("accessCode")}
          className="w-full bg-white border border-[#300808]/20 rounded-lg py-2 px-3 text-[#5b0108]"
          rows={3}
          placeholder="Especifica cualquier otra cosa que creas importante..."
        />
        {errors.accessCode && (
          <p className="text-red-500 text-sm mt-1">
            {errors.accessCode.message}
          </p>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => setStep(4)}
          className="px-6 py-3 bg-gray-300 text-[#300808] rounded-lg font-medium hover:bg-gray-400"
        >
          Atrás
        </button>

        <button
          type="submit"
          onClick={onSubmit}
          disabled={!isValid || isSubmitting}
          className="px-8 py-3 bg-[#5b0108] text-white rounded-lg font-medium transition-all hover:bg-[#9d0d0b] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Enviando..." : "Finalizar"}
        </button>
      </div>
    </div>
  );
};

export default Step5HealthConcerns;
