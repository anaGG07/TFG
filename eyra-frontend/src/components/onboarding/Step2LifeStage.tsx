import React from "react";
import { StepProps } from "../../types/components/StepProps";
import {
  NeomorphicCard,
  NeomorphicInput,
  NeomorphicSelect,
  ErrorMessage,
  InfoMessage,
  StepHeader,
  NavigationButtons,
} from "../ui/NeomorphicComponents";

const Step2LifeStage: React.FC<StepProps> = ({
  isSubmitting,
  register,
  errors,
  watch,
  onNextStep,
  onPreviousStep,
}) => {
  const stageOfLife = watch("stageOfLife");
  const hormoneType = watch("hormoneType");
  const hormoneStartDate = watch("hormoneStartDate");
  const hormoneFrequencyDays = watch("hormoneFrequencyDays");

  const hormoneIncomplete =
    stageOfLife === "transition" &&
    (hormoneType || hormoneStartDate || hormoneFrequencyDays) &&
    (!hormoneType || !hormoneStartDate || !hormoneFrequencyDays);

  const getStageDescription = (stage: string) => {
    switch (stage) {
      case "menstrual":
        return "Podrás registrar síntomas, duración del ciclo y obtener predicciones.";
      case "transition":
        return "Adaptaremos el seguimiento a tu proceso de hormonación.";
      case "pregnancy":
        return "EYRA te acompañará durante tu embarazo o preparación.";
      case "trackingOthers":
        return "Podrás visualizar y apoyar el seguimiento de otra persona.";
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-4">
      <StepHeader
        title="Tu etapa de vida"
        subtitle="Cuéntanos en qué etapa estás o en qué necesitas que EYRA te ayude."
      />

      {/* Selector de etapa */}
      <NeomorphicCard compact>
        <div className="text-center mb-3">
          <label className="text-[#5b0108] text-sm font-medium">
            Selecciona tu situación actual:
          </label>
        </div>
        <NeomorphicSelect
          {...register("stageOfLife", {
            required: "Selecciona una opción para continuar",
          })}
          hasError={!!errors.stageOfLife}
        >
          <option value="">-- Elige una opción --</option>
          <option value="menstrual">Tengo ciclos menstruales activos</option>
          <option value="transition">
            Estoy en un proceso de transición hormonal
          </option>
          <option value="pregnancy">
            Estoy embarazada o buscando embarazo
          </option>
          <option value="trackingOthers">
            Solo quiero acompañar a alguien más
          </option>
        </NeomorphicSelect>
        {errors.stageOfLife && (
          <ErrorMessage
            message={errors.stageOfLife.message || "Campo requerido"}
          />
        )}
      </NeomorphicCard>

      {/* Descripción de la etapa */}
      {stageOfLife && (
        <InfoMessage message={getStageDescription(stageOfLife) || ""} />
      )}

      {/* Campos específicos para ciclos menstruales */}
      {stageOfLife === "menstrual" && (
        <NeomorphicCard compact>
          <p className="text-xs text-[#5b0108] italic text-center mb-3">
            Para el seguimiento de tu ciclo, completa estos datos:
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-[#5b0108] mb-1 text-sm font-medium">
                Fecha de tu último periodo{" "}
                <span className="text-red-500">*</span>
              </label>
              <NeomorphicInput
                type="date"
                {...register("lastPeriodDate", {
                  required: "La fecha del último periodo es obligatoria",
                })}
                hasError={!!errors.lastPeriodDate}
              />
              {errors.lastPeriodDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastPeriodDate.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#5b0108] mb-1 text-sm font-medium">
                  Duración periodo <span className="text-red-500">*</span>
                </label>
                <NeomorphicInput
                  type="number"
                  {...register("averagePeriodLength", {
                    required: "Campo requerido",
                    min: { value: 1, message: "Mín. 1 día" },
                    max: { value: 14, message: "Máx. 14 días" },
                  })}
                  placeholder="Ej: 5"
                  hasError={!!errors.averagePeriodLength}
                />
                {errors.averagePeriodLength && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.averagePeriodLength.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[#5b0108] mb-1 text-sm font-medium">
                  Duración ciclo
                </label>
                <NeomorphicInput
                  type="number"
                  {...register("averageCycleLength", {
                    min: { value: 21, message: "Mín. 21 días" },
                    max: { value: 35, message: "Máx. 35 días" },
                  })}
                  placeholder="28"
                  hasError={!!errors.averageCycleLength}
                />
                {errors.averageCycleLength && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.averageCycleLength.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </NeomorphicCard>
      )}

      {/* Campos específicos para transición hormonal */}
      {stageOfLife === "transition" && (
        <NeomorphicCard compact>
          <p className="text-xs text-[#5b0108] italic text-center mb-3">
            Para adaptar EYRA a tu transición (opcional):
          </p>
          <div className="space-y-3">
            <NeomorphicSelect {...register("hormoneType")}>
              <option value="">Tipo de hormona</option>
              <option value="estrogen">Estrógeno</option>
              <option value="progesterone">Progesterona</option>
              <option value="testosterone">Testosterona</option>
              <option value="luteinizing_hormone">LH</option>
              <option value="follicle_stimulating_hormone">FSH</option>
            </NeomorphicSelect>

            <div className="grid grid-cols-2 gap-3">
              <NeomorphicInput
                type="date"
                {...register("hormoneStartDate")}
                placeholder="Fecha inicio"
              />
              <NeomorphicInput
                type="number"
                {...register("hormoneFrequencyDays")}
                placeholder="Frecuencia (días)"
              />
            </div>
          </div>

          {hormoneIncomplete && (
            <ErrorMessage message="Completa los tres campos o deja todos vacíos." />
          )}
        </NeomorphicCard>
      )}

      {/* Campos específicos para embarazo */}
      {stageOfLife === "pregnancy" && (
        <NeomorphicCard compact>
          <div className="text-center mb-3">
            <p className="text-sm text-[#5b0108] font-semibold">
              ¡Felicidades por tu embarazo!
            </p>
            <p className="text-xs text-[#5b0108] italic">
              EYRA te acompañará en cada etapa.
            </p>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-[#5b0108] mb-1 text-sm font-medium">
                Fecha inicio embarazo <span className="text-red-500">*</span>
              </label>
              <NeomorphicInput
                type="date"
                {...register("pregnancyStartDate", {
                  required: "La fecha de inicio es obligatoria",
                  setValueAs: (v) => v || null,
                })}
                hasError={!!errors.pregnancyStartDate}
              />
              {errors.pregnancyStartDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.pregnancyStartDate.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#5b0108] mb-1 text-sm font-medium">
                  Fecha parto <span className="text-red-500">*</span>
                </label>
                <NeomorphicInput
                  type="date"
                  {...register("pregnancyDueDate", {
                    required: "Campo requerido",
                    setValueAs: (v) => v || null,
                  })}
                  hasError={!!errors.pregnancyDueDate}
                />
                {errors.pregnancyDueDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.pregnancyDueDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[#5b0108] mb-1 text-sm font-medium">
                  Semana actual
                </label>
                <NeomorphicInput
                  type="number"
                  min={1}
                  max={42}
                  {...register("pregnancyWeek", {
                    setValueAs: (v) => (v === "" ? null : Number(v)),
                  })}
                  placeholder="Ej: 12"
                />
              </div>
            </div>
          </div>
        </NeomorphicCard>
      )}

      <NavigationButtons
        onPrevious={onPreviousStep}
        onNext={onNextStep}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Step2LifeStage;
