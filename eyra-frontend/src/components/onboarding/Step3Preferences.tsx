import React from "react";
import { StepProps } from "../../types/components/StepProps";
import {
  NeomorphicCard,
  NeomorphicCheckbox,
  InfoMessage,
  StepHeader,
  NavigationButtons,
} from "../ui/NeomorphicComponents";

const Step3Preferences: React.FC<StepProps> = ({
  isSubmitting,
  register,
  watch,
  setValue,
  onNextStep,
  onPreviousStep,
}) => {
  const watchedValues = watch();

  const notificationPreferences = [
    { key: "receiveAlerts", label: "Alertas del ciclo" },
    { key: "receiveRecommendations", label: "Recomendaciones personalizadas" },
    { key: "receiveCyclePhaseTips", label: "Consejos por fase del ciclo" },
    { key: "receiveWorkoutSuggestions", label: "Sugerencias de ejercicio" },
    { key: "receiveNutritionAdvice", label: "Consejos de alimentación" },
  ];

  const companionPreferences = [
    {
      key: "shareCycleWithPartner",
      label: "Compartir con pareja/tutor",
      description: "Podrás invitar a una persona para que te acompañe.",
    },
    {
      key: "wantAiCompanion",
      label: "Usar asistente IA",
      description: "EYRA incluirá un asistente con respaldo científico.",
    },
  ];

  const togglePreference = (key: keyof typeof watchedValues) => {
    setValue(key, !watchedValues[key]);
  };

  return (
    <div className="w-full space-y-4">
      <StepHeader
        title="Tus preferencias"
        subtitle="Elige cómo quieres que EYRA te acompañe."
        description="Tú decides el ritmo y la compañía."
      />

      {/* Notificaciones */}
      <NeomorphicCard compact>
        <h4 className="text-[#5b0108] text-sm font-medium mb-3 text-center">
          Notificaciones y seguimiento
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {notificationPreferences.map(({ key, label }) => {
            const fieldKey = key as keyof typeof watchedValues;
            return (
              <NeomorphicCheckbox
                key={key}
                checked={Boolean(watchedValues[fieldKey])}
                onChange={() => togglePreference(fieldKey)}
                label={label}
                compact
              />
            );
          })}
        </div>
      </NeomorphicCard>

      {/* Acompañamiento */}
      <NeomorphicCard compact>
        <h4 className="text-[#5b0108] text-sm font-medium mb-3 text-center">
          Acompañamiento y asistencia
        </h4>
        <div className="space-y-2">
          {companionPreferences.map(({ key, label, description }) => {
            const fieldKey = key as keyof typeof watchedValues;
            const isChecked = Boolean(watchedValues[fieldKey]);

            return (
              <div key={key}>
                <NeomorphicCheckbox
                  checked={isChecked}
                  onChange={() => togglePreference(fieldKey)}
                  label={label}
                  compact
                />
                {isChecked && (
                  <p className="text-xs text-[#5b0108] ml-8 mt-1 italic">
                    {description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </NeomorphicCard>

      <InfoMessage
        message="Todas estas preferencias son opcionales y podrás cambiarlas más adelante."
        className="text-center"
      />

      <NavigationButtons
        onPrevious={onPreviousStep}
        onNext={onNextStep}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Step3Preferences;
