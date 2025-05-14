import React from "react";
import { StepProps } from "../../types/components/StepProps";

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

const Step4Symptoms: React.FC<StepProps> = ({
  isSubmitting,
  watch,
  setValue,
  onNextStep,
  onPreviousStep,
}) => {
  const selected = watch("commonSymptoms") || [];

  const toggleSymptom = (symptom: string) => {
    const updated = selected.includes(symptom)
      ? selected.filter((s) => s !== symptom)
      : [...selected, symptom];

    setValue("commonSymptoms", updated, { shouldValidate: true });
  };

  const hasSelected = selected.length > 0;

  // La validación se maneja a través de la función onNextStep del componente padre

  return (
    <div className="space-y-6">
      <p className="text-[#300808] mb-8 text-center text-lg">
        Elige los síntomas que sueles experimentar en tu ciclo. Esto nos ayudará
        a darte mejores recomendaciones.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {symptomOptions.map((symptom) => {
          const isChecked = selected.includes(symptom);
          return (
            <label
              key={symptom}
              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                isChecked
                  ? "bg-[#fceced] border-[#5b0108]/60"
                  : "hover:bg-[#5b010810] hover:border-[#5b0108]/30"
              }`}
              onClick={() => toggleSymptom(symptom)}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isChecked}
                  readOnly
                  className="mr-3"
                />
                <span>{symptom}</span>
              </div>
              {isChecked && <span className="text-[#5b0108] text-lg">✓</span>}
            </label>
          );
        })}
      </div>

      {!hasSelected && (
        <p className="text-sm text-[#5b0108] mt-4 text-center">
          Puedes dejar este paso vacío si aún no identificas patrones en tus
          síntomas.
        </p>
      )}

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onPreviousStep}
          className="px-6 py-3 bg-gray-300 text-[#300808] rounded-lg font-medium hover:bg-gray-400"
        >
          Atrás
        </button>

        <button
          type="button"
          onClick={onNextStep}
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
