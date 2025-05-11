import React from "react";
import { UseFormWatch, UseFormSetValue } from "react-hook-form";
import { OnboardingFormData } from "../../types/forms/OnboardingFormData";

interface Props {
  isSubmitting: boolean;
  watch: UseFormWatch<OnboardingFormData>;
  setValue: UseFormSetValue<OnboardingFormData>;
  setStep: (step: number) => void;
}

const symptomOptions = [
  "Dolor de cabeza",
  "Cansancio",
  "Dolor abdominal",
  "Cambios de humor",
  "Sensibilidad en los senos",
  "Acné",
  "Antojos",
  "Hinchazón",
  "Insomnio",
  "Náuseas",
  "Mareos",
  "Ansiedad",
];

const Step4Symptoms: React.FC<Props> = ({
  isSubmitting,
  watch,
  setValue,
  setStep,
}) => {
  const selected = watch("commonSymptoms") || [];

  const toggleSymptom = (symptom: string) => {
    const updated = selected.includes(symptom)
      ? selected.filter((s) => s !== symptom)
      : [...selected, symptom];

    setValue("commonSymptoms", updated, { shouldValidate: true });
  };

  const hasSelected = selected.length > 0;

  return (
    <div className="space-y-6">
      <p className="text-[#300808] mb-8 text-center">
        ¿Qué síntomas experimentas con más frecuencia? Puedes seleccionar
        varios.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {symptomOptions.map((symptom) => (
          <label
            key={symptom}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
              selected.includes(symptom)
                ? "bg-[#fceced] border-[#5b0108]/60"
                : "hover:bg-[#5b010810] hover:border-[#5b0108]/30"
            }`}
            onClick={() => toggleSymptom(symptom)}
          >
            <input
              type="checkbox"
              checked={selected.includes(symptom)}
              readOnly
              className="mr-3"
            />
            <span>{symptom}</span>
          </label>
        ))}
      </div>

      {!hasSelected && (
        <p className="text-sm text-[#5b0108] mt-4">
          Puedes dejar este paso vacío si no reconoces síntomas frecuentes aún.
        </p>
      )}

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => setStep(3)}
          className="px-6 py-3 bg-gray-300 text-[#300808] rounded-lg font-medium hover:bg-gray-400"
        >
          Atrás
        </button>

        <button
          type="button"
          onClick={() => setStep(5)}
          disabled={isSubmitting}
          className="px-8 py-3 bg-[#5b0108] text-white rounded-lg font-medium transition-all hover:bg-[#9d0d0b] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Guardando..." : "Siguiente"}
        </button>
      </div>
    </div>
  );
};

export default Step4Symptoms;
