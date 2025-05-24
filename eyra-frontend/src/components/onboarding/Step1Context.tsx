import React, { useEffect, useRef } from "react";
import { StepProps } from "../../types/components/StepProps";

const Step1Context: React.FC<StepProps> = ({
  isSubmitting,
  register,
  errors,
  watch,
  setValue,
  onNextStep,
}) => {
  const isPersonal = watch("isPersonal");
  const genderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    genderInputRef.current?.focus();
  }, []);

  return (
    <div className="w-full space-y-8">
      {/* Título del paso */}
      <div className="text-center">
        <h3 className="font-serif text-2xl font-light text-[#5b0108] mb-3">
          ¡Comencemos tu viaje!
        </h3>
        <p className="text-[#300808] text-base leading-relaxed">
          Cuéntanos un poco sobre ti para personalizar tu experiencia.
          <br />
          <span className="text-[#9d0d0b] text-sm italic">
            Cada historia es única, como tú.
          </span>
        </p>
      </div>

      {/* Contenido del formulario */}
      <div className="space-y-6 max-w-md mx-auto">
        {/* Pregunta personal/acompañante */}
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
          <fieldset>
            <legend className="block text-[#5b0108] mb-4 font-medium text-center">
              ¿Usarás EYRA para ti o para acompañar a alguien?
            </legend>
            <div className="flex gap-4 justify-center">
              <label className="flex items-center cursor-pointer">
                <div
                  className="relative w-6 h-6 rounded-full mr-3"
                  style={{
                    background:
                      isPersonal === true
                        ? "linear-gradient(135deg, #C62328, #9d0d0b)"
                        : "linear-gradient(145deg, #d4c7bb, #e7e0d5)",
                    boxShadow:
                      isPersonal === true
                        ? `inset 2px 2px 4px rgba(91, 1, 8, 0.3), inset -2px -2px 4px rgba(255, 108, 92, 0.2)`
                        : `inset 2px 2px 4px rgba(91, 1, 8, 0.05), inset -2px -2px 4px rgba(255, 255, 255, 0.8)`,
                  }}
                >
                  <input
                    type="radio"
                    {...register("isPersonal")}
                    value="true"
                    checked={isPersonal === true}
                    onChange={() => setValue("isPersonal", true)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {isPersonal === true && (
                    <div className="absolute inset-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-[#300808] font-medium">Para mí</span>
              </label>

              <label className="flex items-center cursor-pointer">
                <div
                  className="relative w-6 h-6 rounded-full mr-3"
                  style={{
                    background:
                      isPersonal === false
                        ? "linear-gradient(135deg, #C62328, #9d0d0b)"
                        : "linear-gradient(145deg, #d4c7bb, #e7e0d5)",
                    boxShadow:
                      isPersonal === false
                        ? `inset 2px 2px 4px rgba(91, 1, 8, 0.3), inset -2px -2px 4px rgba(255, 108, 92, 0.2)`
                        : `inset 2px 2px 4px rgba(91, 1, 8, 0.05), inset -2px -2px 4px rgba(255, 255, 255, 0.8)`,
                  }}
                >
                  <input
                    type="radio"
                    {...register("isPersonal")}
                    value="false"
                    checked={isPersonal === false}
                    onChange={() => setValue("isPersonal", false)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {isPersonal === false && (
                    <div className="absolute inset-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-[#300808] font-medium">
                  Para acompañar
                </span>
              </label>
            </div>

            {typeof isPersonal === "boolean" && (
              <div
                className="mt-4 p-3 rounded-xl text-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(198, 35, 40, 0.05), rgba(157, 13, 11, 0.03))",
                  border: "1px solid rgba(198, 35, 40, 0.1)",
                }}
              >
                <p className="text-sm text-[#5b0108] italic">
                  {isPersonal
                    ? "Configuraremos EYRA para ayudarte con el seguimiento de tu ciclo y salud hormonal."
                    : "EYRA se adaptará para que puedas acompañar a otra persona en su experiencia."}
                </p>
              </div>
            )}
          </fieldset>
        </div>

        {/* Campo de identidad de género */}
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
          <label className="block text-[#5b0108] mb-3 font-medium text-center">
            ¿Cómo te identificas?
          </label>
          <div
            className="relative"
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
              type="text"
              ref={(element) => {
                register("genderIdentity").ref(element);
                genderInputRef.current = element;
              }}
              name="genderIdentity"
              onChange={register("genderIdentity").onChange}
              onBlur={register("genderIdentity").onBlur}
              className={`w-full bg-transparent border-none rounded-xl py-3 px-4 text-[#5b0108] placeholder-[#9d0d0b]/60 focus:outline-none focus:ring-2 focus:ring-[#C62328]/30 transition-all ${
                errors.genderIdentity ? "ring-2 ring-red-400" : ""
              }`}
              placeholder="Ej: Mujer cis, Persona trans, No binaria..."
            />
          </div>
          {errors.genderIdentity && (
            <div
              className="mt-3 p-2 rounded-lg text-center"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              <p className="text-red-600 text-sm font-medium">
                {errors.genderIdentity.message}
              </p>
            </div>
          )}
          <p className="text-xs text-[#9d0d0b]/80 mt-2 text-center">
            Puedes escribir lo que tú prefieras. Este dato es obligatorio para
            continuar.
          </p>
        </div>

        {/* Campo de pronombres */}
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
          <label className="block text-[#5b0108] mb-3 font-medium text-center">
            Pronombres (opcional)
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
              type="text"
              {...register("pronouns")}
              className="w-full bg-transparent border-none rounded-xl py-3 px-4 text-[#5b0108] placeholder-[#9d0d0b]/60 focus:outline-none focus:ring-2 focus:ring-[#C62328]/30 transition-all"
              placeholder="Ej: él, ella, elle..."
            />
          </div>
        </div>
      </div>

      {/* Botón de continuar */}
      <div className="flex justify-center mt-8">
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
          onMouseDown={(e) => {
            e.currentTarget.style.boxShadow = `
              inset 4px 4px 8px rgba(91, 1, 8, 0.3),
              inset -4px -4px 8px rgba(255, 108, 92, 0.1)
            `;
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.boxShadow = `
              8px 8px 16px rgba(91, 1, 8, 0.15),
              -8px -8px 16px rgba(255, 108, 92, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `
              8px 8px 16px rgba(91, 1, 8, 0.15),
              -8px -8px 16px rgba(255, 108, 92, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `;
          }}
        >
          {isSubmitting
            ? "Guardando..."
            : isPersonal
            ? "Continuar con mi perfil"
            : "Continuar como acompañante"}
        </button>
      </div>
    </div>
  );
};

export default Step1Context;
