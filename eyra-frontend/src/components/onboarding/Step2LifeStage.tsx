import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StepProps } from "../../types/components/StepProps";

const Step2LifeStage: React.FC<StepProps> = ({
  isSubmitting,
  register,
  errors,
  watch,
  onNextStep,
  onPreviousStep,
  setValue,
}) => {
  const stageOfLife = watch("stageOfLife");
  const accessCode = watch("accessCode");
  const averageCycleLength = watch("averageCycleLength");
  const lastPeriodDate = watch("lastPeriodDate");
  const isPersonal = watch("isPersonal");

  // Validación de fecha - límite de 1 año hacia atrás
  const validatePeriodDate = (date: string | undefined) => {
    if (!date) return true;
    
    const selectedDate = new Date(date);
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    if (selectedDate > today) {
      return "La fecha no puede ser posterior a hoy";
    }
    
    if (selectedDate < oneYearAgo) {
      return "La fecha no puede ser anterior a un año";
    }
    
    return true;
  };

  // Verificar si hay error de fecha
  const hasDateError = lastPeriodDate && validatePeriodDate(lastPeriodDate) !== true;

  const getStageDescription = (stage: string) => {
    switch (stage) {
      case "menstrual":
        return "Podrás registrar síntomas, duración del ciclo y obtener predicciones.";
      case "transition":
        return "Funcionalidad pendiente de desarrollo, disponible próximamente.";
      case "pregnancy":
        return "Funcionalidad pendiente de desarrollo, disponible próximamente.";
      case "trackingOthers":
        return "Podrás visualizar y apoyar el seguimiento de otra persona.";
      default:
        return null;
    }
  };

  // Validar si el botón debe estar deshabilitado
  const isNextDisabled =
    !stageOfLife ||
    stageOfLife === "transition" ||
    stageOfLife === "pregnancy" ||
    (stageOfLife === "trackingOthers" && !accessCode?.trim()) ||
    (stageOfLife === "menstrual" && (!lastPeriodDate || hasDateError));

  // Auto-seleccionar opción si es acompañante
  useEffect(() => {
    console.log("Step2 useEffect triggered:", { 
      isPersonal, 
      stageOfLife, 
      typeof_isPersonal: typeof isPersonal 
    });
    
    if (isPersonal === false && !stageOfLife) {
      console.log("Auto-selecting trackingOthers for companion");
      setValue("stageOfLife", "trackingOthers", { shouldValidate: true });
    }
  }, [isPersonal, stageOfLife, setValue]);

  // Debug en el render
  console.log("Step2 Render Debug:", { 
    isPersonal, 
    stageOfLife,
    typeof_isPersonal: typeof isPersonal,
    isPersonal_strict_false: isPersonal === false,
    isPersonal_loose_false: isPersonal == false
  });

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#7a2323] mb-2 text-center drop-shadow-sm animate-fade-in">
          Bienvenida a EYRA
        </h2>
        <p className="text-lg text-[#3a1a1a] mb-6 text-center animate-fade-in">
          Un espacio para ti, tu ciclo y tu bienestar.{" "}
          <span className="block text-base text-[#a62c2c] mt-2">
            Cuéntanos en qué etapa de tu vida estás o en qué necesitas que EYRA
            te ayude.
          </span>
        </p>

        <div
          className={`grid transition-all duration-500 ease-in-out w-full ${
            stageOfLife
              ? "lg:grid-cols-2 gap-8"
              : "grid-cols-1 place-items-center"
          }`}
        >
          <motion.div
            className="space-y-4"
            layout
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
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
              <label className="block text-[#300808] mb-4 font-medium text-base">
                Selecciona tu situación actual:
              </label>
              <select
                {...register("stageOfLife", {
                  required: "Selecciona una opción para continuar",
                })}
                className="w-full border-0 bg-transparent rounded-lg py-3 px-4 text-[#5b0108] text-base focus:ring-2 focus:ring-[#C62328]/20"
                style={{
                  background: "transparent",
                  boxShadow:
                    "inset 4px 4px 8px rgba(91, 1, 8, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.8)",
                  outline: "none",
                }}
              >
                <option value="">-- Elige una opción --</option>
                
                {/* Debug: Mostrar valor actual de isPersonal */}
                {/* isPersonal actual: {JSON.stringify(isPersonal)} */}
                
                {(isPersonal === true) ? (
                  // Si eligió "Para mí" - mostrar todas las opciones
                  <>
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
                  </>
                ) : (isPersonal === false) ? (
                  // Si eligió "Para acompañar" - solo mostrar opción de acompañante
                  <option value="trackingOthers">
                    Solo quiero acompañar a alguien más
                  </option>
                ) : (
                  // Fallback si isPersonal es undefined
                  <>
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
                  </>
                )}
              </select>
              {errors.stageOfLife && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.stageOfLife.message}
                </p>
              )}
            </div>

            <AnimatePresence>
              {stageOfLife && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
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
                    <p className="text-sm text-[#300808]">
                      {getStageDescription(stageOfLife)}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="space-y-4">
            {stageOfLife === "menstrual" && (
              <div
                className="p-6 rounded-2xl space-y-4"
                style={{
                  background: "#e7e0d5",
                  boxShadow: `
                    inset 4px 4px 8px rgba(91, 1, 8, 0.1),
                    inset -4px -4px 8px rgba(255, 255, 255, 0.8)
                  `,
                }}
              >
                <p className="text-sm text-[#5b0108] italic mb-4">
                  Para ayudarte a hacer un mejor seguimiento de tu ciclo,
                  completa estos datos.
                </p>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[#300808] mb-2 font-medium text-sm">
                      Fecha de tu último período{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      {...register("lastPeriodDate", {
                        required: "La fecha del último período es obligatoria",
                        validate: validatePeriodDate
                      })}
                      max={new Date().toISOString().split('T')[0]}
                      min={(() => {
                        const oneYearAgo = new Date();
                        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                        return oneYearAgo.toISOString().split('T')[0];
                      })()}
                      className="w-full border-0 bg-transparent rounded-lg py-3 px-4 text-[#5b0108] text-base focus:ring-2 focus:ring-[#C62328]/20 outline-none"
                      style={{
                        background: "transparent",
                        boxShadow:
                          "inset 4px 4px 8px rgba(91, 1, 8, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.8)",
                      }}
                    />
                    {errors.lastPeriodDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastPeriodDate.message}
                      </p>
                    )}
                    {hasDateError && (
                      <p className="text-amber-600 text-sm mt-1">
                        ⚠️ Verifica que la fecha esté en un rango válido (máximo 1 año atrás)
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#300808] mb-2 font-medium text-sm">
                        Duración período (días){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        {...register("averagePeriodLength", {
                          required: "Campo obligatorio",
                          min: { value: 1, message: "Mínimo 1 día" },
                          max: { value: 14, message: "Máximo 14 días" },
                          valueAsNumber: true
                        })}
                        min="1"
                        max="14"
                        className="w-full border-0 bg-transparent rounded-lg py-3 px-4 text-[#5b0108] text-base focus:ring-2 focus:ring-[#C62328]/20"
                        style={{
                          background: "transparent",
                          boxShadow:
                            "inset 4px 4px 8px rgba(91, 1, 8, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.8)",
                          outline: "none",
                        }}
                        placeholder="5"
                      />
                      {errors.averagePeriodLength && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.averagePeriodLength.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#300808] mb-2 font-medium text-sm">
                        Duración ciclo (días)
                      </label>
                      <input
                        type="number"
                        {...register("averageCycleLength", {
                          min: { value: 21, message: "Mínimo 21 días" },
                          max: { value: 35, message: "Máximo 35 días" },
                          valueAsNumber: true
                        })}
                        min="21"
                        max="35"
                        className="w-full border-0 bg-transparent rounded-lg py-3 px-4 text-[#5b0108] text-base focus:ring-2 focus:ring-[#C62328]/20"
                        style={{
                          background: "transparent",
                          boxShadow:
                            "inset 4px 4px 8px rgba(91, 1, 8, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.8)",
                          outline: "none",
                        }}
                        placeholder="28"
                      />
                      {!averageCycleLength && (
                        <p className="text-sm text-gray-500 mt-1">
                          Por defecto: 28 días
                        </p>
                      )}
                      {errors.averageCycleLength && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.averageCycleLength.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {stageOfLife === "trackingOthers" && (
              <div
                className="p-6 rounded-2xl space-y-4"
                style={{
                  background: "#e7e0d5",
                  boxShadow: `
                    inset 4px 4px 8px rgba(91, 1, 8, 0.1),
                    inset -4px -4px 8px rgba(255, 255, 255, 0.8)
                  `,
                }}
              >
                <p className="text-sm text-[#5b0108] italic mb-4">
                  Para acompañar a otra persona, necesitas el código de
                  invitación que ha recibido por email.
                </p>

                <div>
                  <label className="block text-[#300808] mb-2 font-medium text-sm">
                    Código de invitado <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("accessCode", {
                      required:
                        stageOfLife === "trackingOthers"
                          ? "El código de invitado es obligatorio"
                          : false,
                    })}
                    className="w-full border-0 bg-transparent rounded-lg py-3 px-4 text-[#5b0108] text-base focus:ring-2 focus:ring-[#C62328]/20"
                    style={{
                      background: "transparent",
                      boxShadow:
                        "inset 4px 4px 8px rgba(91, 1, 8, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.8)",
                      outline: "none",
                    }}
                    placeholder="Introduce el código recibido por email"
                  />
                  {errors.accessCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.accessCode.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {(stageOfLife === "transition" || stageOfLife === "pregnancy") && (
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
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold text-[#5b0108] mb-2">
                    🚧 Funcionalidad en desarrollo
                  </h3>
                  <p className="text-base text-[#7a2323]">
                    Esta funcionalidad estará disponible próximamente.
                  </p>
                  <p className="text-sm text-[#a62c2c] mt-2">
                    Por ahora, puedes crear tu perfil para ciclos menstruales
                    activos o como acompañante.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-8 w-full max-w-sm">
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
            disabled={Boolean(isSubmitting || isNextDisabled)}
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

export default Step2LifeStage;

