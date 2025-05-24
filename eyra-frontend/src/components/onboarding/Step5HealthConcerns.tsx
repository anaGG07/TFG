import React from "react";
import { StepProps } from "../../types/components/StepProps";
import {
  NeomorphicCard,
  NeomorphicCheckbox,
  InfoMessage,
  StepHeader,
  NavigationButtons,
} from "../ui/NeomorphicComponents";

const healthOptions = [
  "Síndrome ovario poliquístico",
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

interface Step5HealthConcernsProps extends StepProps {
  onSubmit: () => void;
}

const Step5HealthConcerns: React.FC<Step5HealthConcernsProps> = ({
  isSubmitting,
  watch,
  setValue,
  register,
  onSubmit,
  onPreviousStep,
}) => {
  const selected = watch("healthConcerns") || [];

  const toggleConcern = (item: string) => {
    const updated = selected.includes(item)
      ? selected.filter((c: string) => c !== item)
      : [...selected, item];
    setValue("healthConcerns", updated, { shouldValidate: true });
  };

  return (
    <div className="w-full space-y-4">
      <StepHeader
        title="Salud y bienestar"
        subtitle="¿Hay algo de tu salud que quieras que tengamos en cuenta?"
        description="Tu bienestar es nuestra prioridad."
      />

      {/* Grid de condiciones */}
      <NeomorphicCard compact>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
          {healthOptions.map((item) => (
            <NeomorphicCheckbox
              key={item}
              checked={selected.includes(item)}
              onChange={() => toggleConcern(item)}
              label={item}
              compact
            />
          ))}
        </div>
      </NeomorphicCard>

      {selected.length === 0 && (
        <InfoMessage message="Este paso es completamente opcional. Si no aplican estas condiciones, puedes continuar sin seleccionar nada." />
      )}

      {/* Campo adicional */}
      <NeomorphicCard compact>
        <label className="block text-[#5b0108] mb-2 text-sm font-medium text-center">
          ¿Otros detalles? (opcional)
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
            {...register("accessCode")}
            className="w-full bg-transparent border-none rounded-xl py-3 px-4 text-[#5b0108] placeholder-[#9d0d0b]/60 focus:outline-none focus:ring-2 focus:ring-[#C62328]/30 transition-all resize-none"
            rows={2}
            placeholder="Especifica cualquier otra cosa importante..."
          />
        </div>
      </NeomorphicCard>

      <NavigationButtons
        onPrevious={onPreviousStep}
        onNext={onSubmit}
        isSubmitting={isSubmitting}
        isLastStep
        nextLabel="Finalizar"
      />
    </div>
  );
};

export default Step5HealthConcerns;
