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
    <div className="h-full flex items-center justify-center">
      <div className="w-full flex flex-col items-center gap-6 animate-fade-in max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#7a2323] mb-2 text-center drop-shadow-sm animate-fade-in">
          Bienvenida a EYRA
        </h2>
        <p className="text-lg text-[#3a1a1a] mb-6 text-center animate-fade-in">
          Cuéntanos qué síntomas sueles experimentar.{" "}
          <span className="block text-base text-[#a62c2c] mt-2">
            Esto nos ayudará a personalizar tu experiencia.
          </span>
        </p>

        <div className="flex justify-center w-full">
          <div
            className="p-6 rounded-2xl w-full max-w-lg"
            style={{
              background: "#e7e0d5",
              boxShadow: `
                inset 4px 4px 8px rgba(91, 1, 8, 0.1),
                inset -4px -4px 8px rgba(255, 255, 255, 0.8)
              `,
            }}
          >
            <h3 className="text-lg text-[#300808] font-medium mb-4">
              Síntomas frecuentes
            </h3>

            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto custom-scrollbar">
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
                    className="mr-2 w-5 h-5 text-[#C62328] border-2 border-[#C62328]/40 focus:ring-2 focus:ring-[#C62328]/30 focus:ring-offset-0 rounded flex-shrink-0"
                    style={{
                      accentColor: "#C62328",
                      filter: "drop-shadow(2px 2px 4px rgba(91, 1, 8, 0.1))",
                      minWidth: "20px",
                      minHeight: "20px",
                    }}
                  />
                  <span className="text-[#300808] text-sm">{symptom}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <p className="text-sm text-[#5b0108] text-center mt-4">
          Puedes actualizar esta información en cualquier momento desde tu
          perfil.
        </p>

        <div className="flex justify-between mt-6 w-full max-w-sm">
          <button
            type="button"
            onClick={onPreviousStep}
            className="px-6 py-3 bg-[#C62328]/20 text-[#5b0108] rounded-lg font-medium hover:bg-[#C62328]/30 text-base border border-[#C62328]/30"
            style={{
              boxShadow: `
                4px 4px 8px rgba(91, 1, 8, 0.1),
                -4px -4px 8px rgba(255, 255, 255, 0.3)
              `,
            }}
          >
            Atrás
          </button>

          <button
            type="button"
            onClick={onNextStep}
            disabled={isSubmitting}
            className="px-8 py-3 bg-[#5b0108] text-white rounded-lg font-medium transition-all hover:bg-[#9d0d0b] disabled:opacity-50 disabled:cursor-not-allowed text-base"
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
    </div>
  );
};

export default Step4Symptoms;
