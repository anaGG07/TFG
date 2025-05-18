import React from "react";
import { StepProps } from "../../types/components/StepProps";

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
  const averageCycleLength = watch("averageCycleLength");

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
      case "menopause":
        return "Recibirás recomendaciones sobre bienestar y salud hormonal.";
      case "underage":
        return "El seguimiento estará guiado con control parental.";
      case "trackingOthers":
        return "Podrás visualizar y apoyar el seguimiento de otra persona.";
      default:
        return null;
    }
  };

  // Ya no necesitamos validar aquí, la validación se maneja en el componente padre
  // a través de la función onNextStep

  return (
    <div className="space-y-6">
      <p className="text-[#300808] mb-8 text-center">
        Cuéntanos en qué etapa de tu vida estás o en qué necesitas que EYRA te
        ayude.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-[#300808] mb-2 font-medium">
            Selecciona tu situación actual:
          </label>
          <select
            {...register("stageOfLife", {
              required: "Selecciona una opción para continuar",
            })}
            className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
          >
            <option value="">-- Elige una opción --</option>
            <option value="menstrual">Tengo ciclos menstruales activos</option>
            <option value="transition">
              Estoy en un proceso de transición hormonal
            </option>
            <option value="pregnancy">
              Estoy embarazada o buscando embarazo
            </option>
            <option value="menopause">
              Estoy en menopausia o perimenopausia
            </option>
            <option value="underage">Soy menor y necesito seguimiento</option>
            <option value="trackingOthers">
              Solo quiero acompañar a alguien más
            </option>
          </select>
          {errors.stageOfLife && (
            <p className="text-red-500 text-sm mt-1">
              {errors.stageOfLife.message}
            </p>
          )}
        </div>

        {stageOfLife && (
          <p className="text-sm text-[#300808] bg-[#f8f4f2] p-4 rounded-md border border-[#300808]/10">
            {getStageDescription(stageOfLife)}
          </p>
        )}

        {stageOfLife === "menstrual" && (
          <div className="space-y-4 mt-6 border-t pt-6">
            <p className="text-sm text-[#5b0108] italic">
              Para ayudarte a hacer un mejor seguimiento de tu ciclo, completa estos datos.
            </p>

            <div>
              <label className="block text-[#300808] mb-2 font-medium">
                Fecha de tu último periodo{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("lastPeriodDate", {
                  required: "La fecha del último periodo es obligatoria",
                })}
                className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
              />
              {errors.lastPeriodDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastPeriodDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#300808] mb-2 font-medium">
                Duración de tu periodo (en días){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register("averagePeriodLength", {
                  required: "La duración del periodo es obligatoria",
                  min: {
                    value: 1,
                    message: "La duración debe ser al menos 1 día"
                  },
                  max: {
                    value: 14,
                    message: "La duración no puede ser mayor a 14 días"
                  }
                })}
                className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
                placeholder="Ej: 5"
              />
              {errors.averagePeriodLength && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.averagePeriodLength.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#300808] mb-2 font-medium">
                Duración de tu ciclo (en días)
              </label>
              <input
                type="number"
                {...register("averageCycleLength", {
                  min: {
                    value: 21,
                    message: "El ciclo debe ser al menos de 21 días"
                  },
                  max: {
                    value: 35,
                    message: "El ciclo no puede ser mayor a 35 días"
                  }
                })}
                className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
                placeholder="Ej: 28"
              />
              {!averageCycleLength && (
                <p className="text-sm text-gray-500 mt-1">
                  Si no lo especificas, usaremos el valor estándar de 28 días
                </p>
              )}
              {errors.averageCycleLength && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.averageCycleLength.message}
                </p>
              )}
            </div>
          </div>
        )}

        {stageOfLife === "transition" && (
          <div className="space-y-4 mt-6 border-t pt-6">
            <p className="text-sm text-[#5b0108] italic">
              Para adaptar EYRA a tu transición hormonal, puedes completar estos
              datos.
            </p>

            <div>
              <label className="block text-[#300808] mb-2 font-medium">
                Tipo de hormona{" "}
                <span className="text-sm text-gray-500">(opcional)</span>
              </label>
              <select
                {...register("hormoneType")}
                className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
              >
                <option value="">-- Selecciona --</option>
                <option value="estrogen">Estrógeno</option>
                <option value="progesterone">Progesterona</option>
                <option value="testosterone">Testosterona</option>
                <option value="luteinizing_hormone">LH</option>
                <option value="follicle_stimulating_hormone">FSH</option>
              </select>
            </div>

            <div>
              <label className="block text-[#300808] mb-2 font-medium">
                Fecha de inicio de la terapia hormonal{" "}
                <span className="text-sm text-gray-500">(opcional)</span>
              </label>
              <input
                type="date"
                {...register("hormoneStartDate")}
                className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
                placeholder="Selecciona una fecha"
              />
            </div>

            <div>
              <label className="block text-[#300808] mb-2 font-medium">
                Frecuencia de administración (en días){" "}
                <span className="text-sm text-gray-500">(opcional)</span>
              </label>
              <input
                type="number"
                {...register("hormoneFrequencyDays")}
                className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
                placeholder="Ej: 30"
              />
            </div>

            {hormoneIncomplete && (
              <p className="text-red-500 text-sm mt-2">
                Para registrar tu tratamiento hormonal, completa los tres campos
                o deja todos vacíos.
              </p>
            )}
          </div>
        )}
      </div>

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

export default Step2LifeStage;
