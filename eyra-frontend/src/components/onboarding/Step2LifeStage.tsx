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
    <div className="w-full space-y-8">
      {/* Título del paso */}
      <div className="text-center">
        <h3 className="font-serif text-2xl font-light text-[#5b0108] mb-3">
          Tu etapa de vida
        </h3>
        <p className="text-[#300808] text-base leading-relaxed max-w-md mx-auto">
          Cuéntanos en qué etapa de tu vida estás o en qué necesitas que EYRA te
          ayude.
        </p>
      </div>

      {/* Contenido del formulario */}
      <div className="space-y-6 max-w-lg mx-auto">
        {/* Selector de etapa */}
        <div
          className="p-6 rounded-2xl"
          style={{
            background: "linear-gradient(145deg, #e7e0d5, #d4c7bb)",
            boxShadow: `
              inset 8px 8px 16px rgba(91, 1, 8, 0.05),
              inset -8px -8px 16px rgba(255, 255, 255, 0.3)
            `,
          }}
        >
          <label className="block text-[#5b0108] mb-4 font-medium text-center">
            Selecciona tu situación actual:
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
            <select
              {...register("stageOfLife", {
                required: "Selecciona una opción para continuar",
              })}
              className={`w-full bg-transparent border-none rounded-xl py-3 px-4 text-[#5b0108] focus:outline-none focus:ring-2 focus:ring-[#C62328]/30 transition-all ${
                errors.stageOfLife ? "ring-2 ring-red-400" : ""
              }`}
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
          </div>
          {errors.stageOfLife && (
            <div
              className="mt-3 p-2 rounded-lg text-center"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              <p className="text-red-600 text-sm font-medium">
                {errors.stageOfLife.message}
              </p>
            </div>
          )}
        </div>

        {/* Descripción de la etapa seleccionada */}
        {stageOfLife && (
          <div
            className="p-4 rounded-xl text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(198, 35, 40, 0.05), rgba(157, 13, 11, 0.03))",
              border: "1px solid rgba(198, 35, 40, 0.1)",
              boxShadow: `
                inset 2px 2px 4px rgba(198, 35, 40, 0.03),
                inset -2px -2px 4px rgba(255, 255, 255, 0.8)
              `,
            }}
          >
            <p className="text-sm text-[#5b0108] italic">
              {getStageDescription(stageOfLife)}
            </p>
          </div>
        )}

        {/* Campos específicos para ciclos menstruales */}
        {stageOfLife === "menstrual" && (
          <div
            className="p-6 rounded-2xl space-y-4"
            style={{
              background: "linear-gradient(145deg, #e7e0d5, #d4c7bb)",
              boxShadow: `
                inset 8px 8px 16px rgba(91, 1, 8, 0.05),
                inset -8px -8px 16px rgba(255, 255, 255, 0.3)
              `,
            }}
          >
            <p className="text-sm text-[#5b0108] italic text-center mb-4">
              Para ayudarte a hacer un mejor seguimiento de tu ciclo, completa
              estos datos.
            </p>

            {/* Fecha del último periodo */}
            <div>
              <label className="block text-[#5b0108] mb-2 font-medium">
                Fecha de tu último periodo{" "}
                <span className="text-red-500">*</span>
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
                <input
                  type="date"
                  {...register("lastPeriodDate", {
                    required: "La fecha del último periodo es obligatoria",
                  })}
                  className={`w-full bg-transparent border-none rounded-xl py-3 px-4 text-[#5b0108] focus:outline-none focus:ring-2 focus:ring-[#C62328]/30 transition-all ${
                    errors.lastPeriodDate ? "ring-2 ring-red-400" : ""
                  }`}
                />
              </div>
              {errors.lastPeriodDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastPeriodDate.message}
                </p>
              )}
            </div>

            {/* Duración del periodo */}
            <div>
              <label className="block text-[#5b0108] mb-2 font-medium">
                Duración de tu periodo (en días){" "}
                <span className="text-red-500">*</span>
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
                <input
                  type="number"
                  {...register("averagePeriodLength", {
                    required: "La duración del periodo es obligatoria",
                    min: {
                      value: 1,
                      message: "La duración debe ser al menos 1 día",
                    },
                    max: {
                      value: 14,
                      message: "La duración no puede ser mayor a 14 días",
                    },
                  })}
                  className={`w-full bg-transparent border-none rounded-xl py-3 px-4 text-[#5b0108] placeholder-[#9d0d0b]/60 focus:outline-none focus:ring-2 focus:ring-[#C62328]/30 transition-all ${
                    errors.averagePeriodLength ? "ring-2 ring-red-400" : ""
                  }`}
                  placeholder="Ej: 5"
                />
              </div>
              {errors.averagePeriodLength && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.averagePeriodLength.message}
                </p>
              )}
            </div>

            {/* Duración del ciclo */}
            <div>
              <label className="block text-[#5b0108] mb-2 font-medium">
                Duración de tu ciclo (en días)
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
                <input
                  type="number"
                  {...register("averageCycleLength", {
                    min: {
                      value: 21,
                      message: "El ciclo debe ser al menos de 21 días",
                    },
                    max: {
                      value: 35,
                      message: "El ciclo no puede ser mayor a 35 días",
                    },
                  })}
                  className={`w-full bg-transparent border-none rounded-xl py-3 px-4 text-[#5b0108] placeholder-[#9d0d0b]/60 focus:outline-none focus:ring-2 focus:ring-[#C62328]/30 transition-all ${
                    errors.averageCycleLength ? "ring-2 ring-red-400" : ""
                  }`}
                  placeholder="Ej: 28"
                />
              </div>
              {!averageCycleLength && (
                <p className="text-sm text-[#9d0d0b]/80 mt-1">
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

        {/* Campos específicos para transición hormonal */}
        {stageOfLife === "transition" && (
          <div
            className="p-6 rounded-2xl space-y-4"
            style={{
              background: "linear-gradient(145deg, #e7e0d5, #d4c7bb)",
              boxShadow: `
                inset 8px 8px 16px rgba(91, 1, 8, 0.05),
                inset -8px -8px 16px rgba(255, 255, 255, 0.3)
              `,
            }}
          >
            <p className="text-sm text-[#5b0108] italic text-center mb-4">
              Para adaptar EYRA a tu transición hormonal, puedes completar estos
              datos.
            </p>

            {/* Tipo de hormona */}
            <div>
              <label className="block text-[#5b0108] mb-2 font-medium">
                Tipo de hormona{" "}
                <span className="text-sm text-[#9d0d0b]/80">(opcional)</span>
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
                <select
                  {...register("hormoneType")}
                  className="w-full bg-transparent border-none rounded-xl py-3 px-4 text-[#5b0108] focus:outline-none focus:ring-2 focus:ring-[#C62328]/30 transition-all"
                >
                  <option value="">-- Selecciona --</option>
                  <option value="estrogen">Estrógeno</option>
                  <option value="progesterone">Progesterona</option>
                  <option value="testosterone">Testosterona</option>
                  <option value="luteinizing_hormone">LH</option>
                  <option value="follicle_stimulating_hormone">FSH</option>
                </select>
              </div>
            </div>

            {/* Fecha de inicio */}
            <div>
              <label className="block text-[#5b0108] mb-2 font-medium">
                Fecha de inicio de la terapia hormonal{" "}
                <span className="text-sm text-[#9d0d0b]/80">(opcional)</span>
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
                <input
                  type="date"
                  {...register("hormoneStartDate")}
                  className="w-full bg-transparent border-none rounded-xl py-3 px-4 text-[#5b0108] focus:outline-none focus:ring-2 focus:ring-[#C62328]/30 transition-all"
                />
              </div>
            </div>

            {/* Frecuencia */}
            <div>
              <label className="block text-[#5b0108] mb-2 font-medium">
                Frecuencia de administración (en días){" "}
                <span className="text-sm text-[#9d0d0b]/80">(opcional)</span>
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
                <input
                  type="number"
                  {...register("hormoneFrequencyDays")}
                  className="w-full bg-transparent border-none rounded-xl py-3 px-4 text-[#5b0108] placeholder-[#9d0d0b]/60 focus:outline-none focus:ring-2 focus:ring-[#C62328]/30 transition-all"
                  placeholder="Ej: 30"
                />
              </div>
            </div>

            {hormoneIncomplete && (
              <div
                className="p-3 rounded-lg text-center"
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                <p className="text-red-600 text-sm font-medium">
                  Para registrar tu tratamiento hormonal, completa los tres
                  campos o deja todos vacíos.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Campos específicos para embarazo */}
        {stageOfLife === "pregnancy" && (
          <div
            className="p-6 rounded-2xl space-y-4"
            style={{
              background: "linear-gradient(145deg, #e7e0d5, #d4c7bb)",
              boxShadow: `
                inset 8px 8px 16px rgba(91, 1, 8, 0.05),
                inset -8px -8px 16px rgba(255, 255, 255, 0.3)
              `,
            }}
          >
            <div className="text-center mb-4">
              <p className="text-lg text-[#5b0108] font-semibold mb-2">
                ¡Felicidades por tu embarazo!
              </p>
              <p className="text-sm text-[#5b0108] italic">
                EYRA te acompañará en cada etapa. Para personalizar tu
                experiencia, necesitamos algunos datos clave.
              </p>
            </div>

            {/* Fecha de inicio del embarazo */}
            <div>
              <label className="block text-[#5b0108] mb-2 font-medium">
                Fecha de inicio del embarazo{" "}
                <span className="text-red-500">*</span>
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
                <input
                  type="date"
                  {...register("pregnancyStartDate", {
                    required: "La fecha de inicio es obligatoria",
                    setValueAs: (v) => v || null,
                  })}
                  className={`w-full bg-transparent border-none rounded-xl py-3 px-4 text-[#5b0108] focus:outline-none focus:ring-2 focus:ring-[#C62328]/30 transition-all ${
                    errors.pregnancyStartDate ? "ring-2 ring-red-400" : ""
                  }`}
                />
              </div>
              {errors.pregnancyStartDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.pregnancyStartDate.message}
                </p>
              )}
            </div>

            {/* Fecha estimada de parto */}
            <div>
              <label className="block text-[#5b0108] mb-2 font-medium">
                Fecha estimada de parto <span className="text-red-500">*</span>
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
                <input
                  type="date"
                  {...register("pregnancyDueDate", {
                    required: "La fecha estimada de parto es obligatoria",
                    setValueAs: (v) => v || null,
                  })}
                  className={`w-full bg-transparent border-none rounded-xl py-3 px-4 text-[#5b0108] focus:outline-none focus:ring-2 focus:ring-[#C62328]/30 transition-all ${
                    errors.pregnancyDueDate ? "ring-2 ring-red-400" : ""
                  }`}
                />
              </div>
              {errors.pregnancyDueDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.pregnancyDueDate.message}
                </p>
              )}
            </div>

            {/* Semana actual */}
            <div>
              <label className="block text-[#5b0108] mb-2 font-medium">
                Semana actual de embarazo (opcional)
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
                <input
                  type="number"
                  min={1}
                  max={42}
                  {...register("pregnancyWeek", {
                    setValueAs: (v) => (v === "" ? null : Number(v)),
                  })}
                  className="w-full bg-transparent border-none rounded-xl py-3 px-4 text-[#5b0108] placeholder-[#9d0d0b]/60 focus:outline-none focus:ring-2 focus:ring-[#C62328]/30 transition-all"
                  placeholder="Ej: 12"
                />
              </div>
            </div>

            <div
              className="mt-4 p-3 rounded-xl text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(198, 35, 40, 0.05), rgba(157, 13, 11, 0.03))",
                border: "1px solid rgba(198, 35, 40, 0.1)",
              }}
            >
              <p className="text-[#C62328] text-sm italic">
                Recuerda: podrás registrar síntomas, ecografías y otros detalles
                en tu día a día desde el panel de embarazo.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between items-center mt-8 max-w-lg mx-auto">
        <button
          type="button"
          onClick={onPreviousStep}
          className="relative overflow-hidden rounded-xl px-6 py-3 font-medium text-[#5b0108] transition-all duration-200 hover:scale-105"
          style={{
            background: "linear-gradient(145deg, #f0e8dc, #ddd5c9)",
            boxShadow: `
              8px 8px 16px rgba(91, 1, 8, 0.08),
              -8px -8px 16px rgba(255, 255, 255, 0.25)
            `,
          }}
        >
          Atrás
        </button>

        <button
          type="button"
          onClick={onNextStep}
          disabled={isSubmitting}
          className="relative overflow-hidden rounded-xl px-8 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: "linear-gradient(135deg, #C62328, #9d0d0b)",
            boxShadow: `
              8px 8px 16px rgba(91, 1, 8, 0.15),
              -8px -8px 16px rgba(255, 108, 92, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
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
