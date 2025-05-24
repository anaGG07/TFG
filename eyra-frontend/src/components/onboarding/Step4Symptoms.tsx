import React from "react";
import { StepProps } from "../../types/components/StepProps";
import {
  NeomorphicCard,
  NeomorphicCheckbox,
  NeomorphicInput,
  InfoMessage,
  StepHeader,
  NavigationButtons,
} from "../ui/NeomorphicComponents";

const commonSymptoms = [
  "Cólicos menstruales",
  "Dolor de cabeza",
  "Cambios de humor",
  "Fatiga",
  "Sensibilidad en senos",
  "Acné",
  "Insomnio",
  "Ansiedad",
  "Hinchazón",
  "Náuseas",
  "Irritabilidad",
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
      ? selected.filter((s: string) => s !== item)
      : [...selected, item];
    setValue("commonSymptoms", updated, { shouldValidate: true });
  };

  return (
    <div className="w-full space-y-4">
      <StepHeader
        title="Síntomas y sensaciones"
        subtitle="¿Qué síntomas o sensaciones sueles experimentar?"
        description="Conocer tu cuerpo es el primer paso para cuidarlo."
      />

      {/* Grid de síntomas */}
      <NeomorphicCard compact>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {commonSymptoms.map((item) => (
            <NeomorphicCheckbox
              key={item}
              checked={selected.includes(item)}
              onChange={() => toggleSymptom(item)}
              label={item}
              compact
            />
          ))}
        </div>
      </NeomorphicCard>

      {selected.length === 0 && (
        <InfoMessage message="No hay problema si no experimentas ninguno de estos síntomas. Cada cuerpo es único." />
      )}

      {/* Campo adicional */}
      <NeomorphicCard compact>
        <label className="block text-[#5b0108] mb-2 text-sm font-medium text-center">
          ¿Otros síntomas? (opcional)
        </label>
        <div
          style={{
            background: "linear-gradient(145deg, #f0e8dc, #ddd5c9)",
            borderRadius: "12px",
            boxShadow: `
              inset 4px 4px 8px rgba(91, 1, 8, 0.05),
              inset -4px -4px 8px rgba(255, 255, 255, 0.8)
            `,
          }}
        >
          <textarea
            {...register("otherSymptoms")}
            className="w-full bg-transparent border-none rounded-xl py-3 px-4 text-[#5b0108] placeholder-[#9d0d0b]/60 focus:outline-none focus:ring-2 focus:ring-[#C62328]/30 transition-all resize-none"
            rows={2}
            placeholder="Describe cualquier otro síntoma..."
          />
        </div>
      </NeomorphicCard>

      <NavigationButtons
        onPrevious={onPreviousStep}
        onNext={onNextStep}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Step4Symptoms;
