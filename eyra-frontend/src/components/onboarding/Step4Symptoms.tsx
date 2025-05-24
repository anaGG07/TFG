import React from "react";
import { StepProps } from "../../types/components/StepProps";

const commonSymptoms = [
  "Cólicos menstruales",
  "Dolor de cabeza",
  "Cambios de humor",
  "Fatiga",
  "Sensibilidad en los senos",
  "Acné",
  "Insomnio",
  "Ansiedad",
  "Hinchazón",
  "Náuseas",
  "Otro",
];

// Comentario de control
const Step4Symptoms: React.FC<StepProps> = ({
  isSubmitting,
  watch,
  setValue,
  register,
  onNextStep,
  onPreviousStep,
}) => {
  const selected = watch("commonSymptoms") || [];

  const toggleSymptom = (item: string) => {
    const updated = selected.includes(item)
      ? selected.filter((s) => s !== item)
      : [...selected, item];
    setValue("commonSymptoms", updated, { shouldValidate: true });
  };

  return (
    <div className="w-full flex flex-col items-center gap-8 animate-fade-in max-w-4xl mx-auto">
      <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#7a2323] mb-2 text-center drop-shadow-sm animate-fade-in">
        Bienvenida a EYRA
      </h2>
      <p className="text-lg text-[#3a1a1a] mb-8 text-center animate-fade-in">
        Cuéntanos qué síntomas sueles experimentar.{" "}
        <span className="block text-base text-[#a62c2c] mt-2">
          Esto nos ayudará a personalizar tu experiencia.
        </span>
      </p>
      

      <div className="grid grid-cols-2 gap-8 w-full">
        <div
          className="p-6 rounded-2xl"
          style={{
            background: "#e7e0d5",
            boxShadow: `
            inset 4px 4px 8px rgba(91, 1, 8, 0.1),
            inset -4px -4px 8px rgba(255, 255, 255, 0.8)
          `,
          }}
        >
          <h3 className="text-sm text-[#300808] font-medium mb-4">
            Síntomas físicos
          </h3>

          <div className="space-y-4">
            {commonSymptoms.map((symptom) => (
              <label
                key={symptom}
                className="flex items-center p-3 rounded-lg hover:bg-white/50 transition-colors"
              >
                <input
                  type="checkbox"
                  {...register("commonSymptoms")}
                  value={symptom}
                  checked={selected.includes(symptom)}
                  onChange={() => toggleSymptom(symptom)}
                  className="mr-3 w-5 h-5 accent-[#C62328] rounded"
                />
                <span className="text-[#300808]">{symptom}</span>
              </label>
            ))}
          </div>
        </div>

        <div
          className="p-6 rounded-2xl"
          style={{
            background: "#e7e0d5",
            boxShadow: `
            inset 4px 4px 8px rgba(91, 1, 8, 0.1),
            inset -4px -4px 8px rgba(255, 255, 255, 0.8)
          `,
          }}
        >
          <h3 className="text-sm text-[#300808] font-medium mb-4">
            Otros síntomas o condiciones
          </h3>

          <textarea
            {...register("otherSymptoms")}
            placeholder="Cuéntanos si hay algo más que quieras que sepamos..."
            className="w-full p-4 rounded-lg bg-white/50 border border-[#5b0108]/20 focus:border-[#5b0108] focus:ring-1 focus:ring-[#5b0108] outline-none transition-all"
            rows={4}
          />
        </div>
      </div>

      <p className="text-sm text-[#5b0108] text-center mt-4">
        Puedes actualizar esta información en cualquier momento desde tu perfil.
      </p>

      <div className="flex justify-between mt-8 w-full">
        <button
          type="button"
          onClick={onPreviousStep}
          className="px-6 py-3 bg-gray-300 text-[#300808] rounded-lg font-medium hover:bg-gray-400"
          style={{
            boxShadow: `
              4px 4px 8px rgba(91, 1, 8, 0.1),
              -4px -4px 8px rgba(255, 255, 255, 0.1)
            `,
          }}
        >
          Atrás
        </button>

        <button
          type="button"
          onClick={onNextStep}
          disabled={isSubmitting}
          className="px-8 py-3 bg-[#5b0108] text-white rounded-lg font-medium transition-all hover:bg-[#9d0d0b] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            boxShadow: `
              4px 4px 8px rgba(91, 1, 8, 0.2),
              -4px -4px 8px rgba(255, 255, 255, 0.1)
            `,
          }}
        >
          {isSubmitting ? "Guardando..." : "Siguiente"}
        </button>
      </div>
    </div>
  );
};

export default Step4Symptoms; 