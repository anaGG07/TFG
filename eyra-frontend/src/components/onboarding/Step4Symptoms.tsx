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
    <div className="w-full flex flex-col items-center gap-4 animate-fade-in max-w-4xl mx-auto py-2">
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#7a2323] mb-1 text-center drop-shadow-sm animate-fade-in">
        Bienvenida a EYRA
      </h2>
      <p className="text-base text-[#3a1a1a] mb-4 text-center animate-fade-in">
        Cuéntanos qué síntomas sueles experimentar.{" "}
        <span className="block text-sm text-[#a62c2c] mt-1">
          Esto nos ayudará a personalizar tu experiencia.
        </span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <div
          className="p-4 rounded-2xl"
          style={{
            background: "#e7e0d5",
            boxShadow: `
              inset 4px 4px 8px rgba(91, 1, 8, 0.1),
              inset -4px -4px 8px rgba(255, 255, 255, 0.8)
            `,
          }}
        >
          <h3 className="text-sm text-[#300808] font-medium mb-3">
            Síntomas frecuentes
          </h3>

          <div className="grid grid-cols-2 gap-1 max-h-60 overflow-y-auto custom-scrollbar">
            {commonSymptoms.map((symptom) => (
              <label
                key={symptom}
                className="flex items-center p-2 rounded-lg hover:bg-white/50 transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  {...register("commonSymptoms")}
                  value={symptom}
                  checked={selected.includes(symptom)}
                  onChange={() => toggleSymptom(symptom)}
                  className="mr-2 w-4 h-4 accent-[#C62328] rounded"
                />
                <span className="text-[#300808] text-xs">{symptom}</span>
              </label>
            ))}
          </div>
        </div>

        <div
          className="p-4 rounded-2xl"
          style={{
            background: "#e7e0d5",
            boxShadow: `
              inset 4px 4px 8px rgba(91, 1, 8, 0.1),
              inset -4px -4px 8px rgba(255, 255, 255, 0.8)
            `,
          }}
        >
          <h3 className="text-sm text-[#300808] font-medium mb-3">
            Otros síntomas o condiciones
          </h3>

          <textarea
            {...register("otherSymptoms")}
            placeholder="Cuéntanos si hay algo más que quieras que sepamos..."
            className="w-full p-3 rounded-lg bg-white/50 border border-[#5b0108]/20 focus:border-[#5b0108] focus:ring-1 focus:ring-[#5b0108] outline-none transition-all text-sm resize-none"
            rows={6}
          />
          
          <p className="text-xs text-gray-500 mt-2">
            Opcional: Describe cualquier síntoma particular o patrón que hayas notado.
          </p>
        </div>
      </div>

      <p className="text-xs text-[#5b0108] text-center mt-2">
        Puedes actualizar esta información en cualquier momento desde tu perfil.
      </p>

      <div className="flex justify-between mt-4 w-full max-w-sm">
        <button
          type="button"
          onClick={onPreviousStep}
          className="px-5 py-2.5 bg-gray-300 text-[#300808] rounded-lg font-medium hover:bg-gray-400 text-sm"
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
          className="px-6 py-2.5 bg-[#5b0108] text-white rounded-lg font-medium transition-all hover:bg-[#9d0d0b] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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