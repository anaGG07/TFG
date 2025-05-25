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

  return (
    <div className="w-full max-w-5xl mx-auto py-2 flex flex-col items-center">
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#7a2323] mb-1 text-center drop-shadow-sm animate-fade-in">
        Bienvenida a EYRA
      </h2>
      <p className="text-base text-[#3a1a1a] mb-4 text-center animate-fade-in">
        Un espacio para ti, tu ciclo y tu bienestar.{" "}
        <span className="block text-sm text-[#a62c2c] mt-1">
          Cuéntanos en qué etapa de tu vida estás o en qué necesitas que EYRA te ayude.
        </span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <div className="space-y-3">
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
            <label className="block text-[#300808] mb-3 font-medium text-sm">
              Selecciona tu situación actual:
            </label>
            <select
              {...register("stageOfLife", {
                required: "Selecciona una opción para continuar",
              })}
              className="w-full bg-white border border-[#300808]/20 rounded-lg py-2.5 px-3 text-[#5b0108] text-sm"
            >
              <option value="">-- Elige una opción --</option>
              <option value="menstrual">
                Tengo ciclos menstruales activos
              </option>
              <option value="transition">
                Estoy en un proceso de transición hormonal
              </option>
              <option value="pregnancy">
                Estoy embarazada o buscando embarazo
              </option>
              <option value="trackingOthers">
                Solo quiero acompañar a alguien más
              </option>
            </select>
            {errors.stageOfLife && (
              <p className="text-red-500 text-xs mt-1">
                {errors.stageOfLife.message}
              </p>
            )}
          </div>

          {stageOfLife && (
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
              <p className="text-xs text-[#300808]">
                {getStageDescription(stageOfLife)}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {stageOfLife === "menstrual" && (
            <div
              className="p-4 rounded-2xl space-y-3"
              style={{
                background: "#e7e0d5",
                boxShadow: `
                  inset 4px 4px 8px rgba(91, 1, 8, 0.1),
                  inset -4px -4px 8px rgba(255, 255, 255, 0.8)
                `,
              }}
            >
              <p className="text-xs text-[#5b0108] italic mb-3">
                Para ayudarte a hacer un mejor seguimiento de tu ciclo, completa estos datos.
              </p>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-[#300808] mb-1 font-medium text-xs">
                    Fecha de tu último período <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("lastPeriodDate", {
                      required: "La fecha del último período es obligatoria",
                    })}
                    className="w-full bg-white border border-[#300808]/20 rounded-lg py-2 px-3 text-[#5b0108] text-sm"
                  />
                  {errors.lastPeriodDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lastPeriodDate.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#300808] mb-1 font-medium text-xs">
                      Duración período (días) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      {...register("averagePeriodLength", {
                        required: "Campo obligatorio",
                        min: { value: 1, message: "Mínimo 1 día" },
                        max: { value: 14, message: "Máximo 14 días" },
                      })}
                      className="w-full bg-white border border-[#300808]/20 rounded-lg py-2 px-3 text-[#5b0108] text-sm"
                      placeholder="5"
                    />
                    {errors.averagePeriodLength && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.averagePeriodLength.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#300808] mb-1 font-medium text-xs">
                      Duración ciclo (días)
                    </label>
                    <input
                      type="number"
                      {...register("averageCycleLength", {
                        min: { value: 21, message: "Mínimo 21 días" },
                        max: { value: 35, message: "Máximo 35 días" },
                      })}
                      className="w-full bg-white border border-[#300808]/20 rounded-lg py-2 px-3 text-[#5b0108] text-sm"
                      placeholder="28"
                    />
                    {!averageCycleLength && (
                      <p className="text-xs text-gray-500 mt-1">
                        Por defecto: 28 días
                      </p>
                    )}
                    {errors.averageCycleLength && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.averageCycleLength.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {stageOfLife === "transition" && (
            <div
              className="p-4 rounded-2xl space-y-3"
              style={{
                background: "#e7e0d5",
                boxShadow: `
                  inset 4px 4px 8px rgba(91, 1, 8, 0.1),
                  inset -4px -4px 8px rgba(255, 255, 255, 0.8)
                `,
              }}
            >
              <p className="text-xs text-[#5b0108] italic mb-3">
                Para adaptar EYRA a tu transición hormonal, puedes completar estos datos.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-[#300808] mb-1 font-medium text-xs">
                    Tipo de hormona <span className="text-xs text-gray-500">(opcional)</span>
                  </label>
                  <select
                    {...register("hormoneType")}
                    className="w-full bg-white border border-[#300808]/20 rounded-lg py-2 px-3 text-[#5b0108] text-sm"
                  >
                    <option value="">-- Selecciona --</option>
                    <option value="estrogen">Estrógeno</option>
                    <option value="progesterone">Progesterona</option>
                    <option value="testosterone">Testosterona</option>
                    <option value="luteinizing_hormone">LH</option>
                    <option value="follicle_stimulating_hormone">FSH</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#300808] mb-1 font-medium text-xs">
                      Fecha inicio terapia
                    </label>
                    <input
                      type="date"
                      {...register("hormoneStartDate")}
                      className="w-full bg-white border border-[#300808]/20 rounded-lg py-2 px-3 text-[#5b0108] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[#300808] mb-1 font-medium text-xs">
                      Frecuencia (días)
                    </label>
                    <input
                      type="number"
                      {...register("hormoneFrequencyDays")}
                      className="w-full bg-white border border-[#300808]/20 rounded-lg py-2 px-3 text-[#5b0108] text-sm"
                      placeholder="30"
                    />
                  </div>
                </div>

                {hormoneIncomplete && (
                  <p className="text-red-500 text-xs mt-2">
                    Para registrar tu tratamiento hormonal, completa los tres campos o deja todos vacíos.
                  </p>
                )}
              </div>
            </div>
          )}

          {stageOfLife === "pregnancy" && (
            <div
              className="p-4 rounded-2xl space-y-3"
              style={{
                background: "#e7e0d5",
                boxShadow: `
                  inset 4px 4px 8px rgba(91, 1, 8, 0.1),
                  inset -4px -4px 8px rgba(255, 255, 255, 0.8)
                `,
              }}
            >
              <p className="text-sm text-[#5b0108] font-semibold mb-2 text-center">
                ¡Felicidades por tu embarazo!
              </p>
              <p className="text-xs text-[#5b0108] mb-3 text-center">
                EYRA te acompañará en cada etapa. Para personalizar tu experiencia, necesitamos algunos datos clave.
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[#300808] mb-1 font-medium text-xs">
                    Fecha de inicio del embarazo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("pregnancyStartDate", {
                      required: "La fecha de inicio es obligatoria",
                      setValueAs: (v) => v || null,
                    })}
                    className="w-full bg-white border border-[#300808]/20 rounded-lg py-2 px-3 text-[#5b0108] text-sm"
                  />
                  {errors.pregnancyStartDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.pregnancyStartDate.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#300808] mb-1 font-medium text-xs">
                      Fecha estimada de parto <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      {...register("pregnancyDueDate", {
                        required: "Campo obligatorio",
                        setValueAs: (v) => v || null,
                      })}
                      className="w-full bg-white border border-[#300808]/20 rounded-lg py-2 px-3 text-[#5b0108] text-sm"
                    />
                    {errors.pregnancyDueDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.pregnancyDueDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#300808] mb-1 font-medium text-xs">
                      Semana actual (opcional)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={42}
                      {...register("pregnancyWeek", {
                        setValueAs: (v) => (v === "" ? null : Number(v)),
                      })}
                      className="w-full bg-white border border-[#300808]/20 rounded-lg py-2 px-3 text-[#5b0108] text-sm"
                      placeholder="12"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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

export default Step2LifeStage;