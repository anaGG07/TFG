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

  useEffect(() => {
    register("isPersonal", { value: true });
  }, [register]);

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full flex flex-col items-center gap-6 animate-fade-in max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#7a2323] mb-2 text-center drop-shadow-sm animate-fade-in">
          Bienvenida a EYRA
        </h2>
        <p className="text-lg text-[#3a1a1a] mb-6 text-center animate-fade-in">
          Un espacio para ti, tu ciclo y tu bienestar.{" "}
          <span className="block text-base text-[#a62c2c] mt-2">
            Tómate tu tiempo, este espacio es solo para ti.
          </span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-3xl">
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
            <legend className="block text-[#300808] mb-4 font-medium text-base">
              ¿Usarás EYRA para ti o para acompañar a alguien?
            </legend>
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer text-base">
                <input
                  type="radio"
                  name="isPersonal"
                  value="true"
                  checked={isPersonal === true}
                  onChange={() => {
                    setValue("isPersonal", true, { shouldValidate: true });
                    setValue("stageOfLife", "", { shouldValidate: true });
                  }}
                  className="mr-3 w-5 h-5 text-[#C62328] border-2 border-[#C62328]/40 focus:ring-2 focus:ring-[#C62328]/30 focus:ring-offset-0 rounded-full"
                  style={{
                    accentColor: "#C62328",
                    filter: "drop-shadow(2px 2px 4px rgba(91, 1, 8, 0.1))",
                  }}
                />
                <span>Para mí</span>
              </label>
              <label className="flex items-center cursor-pointer text-base">
                <input
                  type="radio"
                  name="isPersonal"
                  value="false"
                  checked={isPersonal === false}
                  onChange={() => {
                    setValue("isPersonal", false, { shouldValidate: true });
                    setValue("stageOfLife", "", { shouldValidate: true });
                  }}
                  className="mr-3 w-5 h-5 text-[#C62328] border-2 border-[#C62328]/40 focus:ring-2 focus:ring-[#C62328]/30 focus:ring-offset-0 rounded-full"
                  style={{
                    accentColor: "#C62328",
                    filter: "drop-shadow(2px 2px 4px rgba(91, 1, 8, 0.1))",
                  }}
                />
                <span>Para acompañar</span>
              </label>
            </div>
            {typeof isPersonal === "boolean" && (
              <p className="text-sm text-[#5b0108] mt-3 italic">
                {isPersonal
                  ? "Configuraremos EYRA para ayudarte con el seguimiento de tu ciclo y salud hormonal."
                  : "EYRA se adaptará para que puedas acompañar a otra persona en su experiencia."}
              </p>
            )}
          </div>

          <div className="space-y-6">
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
                ¿Cómo te identificas?
              </label>
              <input
                type="text"
                ref={(element) => {
                  register("genderIdentity").ref(element);
                  genderInputRef.current = element;
                }}
                name="genderIdentity"
                onChange={register("genderIdentity").onChange}
                onBlur={register("genderIdentity").onBlur}
                className={`w-full border-0 bg-transparent rounded-xl py-3 px-4 text-[#5b0108] focus:ring-2 focus:ring-[#C62328]/20 transition-all text-base outline-none autofill:bg-transparent autofill:text-[#5b0108] autofill:shadow-[inset_4px_4px_8px_rgba(91,1,8,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] ${
                  errors.genderIdentity ? "focus:ring-red-500/20" : ""
                }`}
                style={{
                  background: "transparent",
                  boxShadow:
                    "inset 4px 4px 8px rgba(91, 1, 8, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.8)",
                }}
                placeholder="Ej: Mujer cis, Persona trans, No binaria..."
                autoComplete="off"
              />
              {errors.genderIdentity && (
                <p className="text-red-500 text-sm mt-2 font-medium">
                  {errors.genderIdentity.message}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Este dato es obligatorio para continuar.
              </p>
            </div>

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
                Pronombres (opcional)
              </label>
              <input
                type="text"
                {...register("pronouns")}
                className="w-full border-0 bg-transparent rounded-xl py-3 px-4 text-[#5b0108] focus:ring-2 focus:ring-[#C62328]/20 transition-all text-base outline-none autofill:bg-transparent autofill:text-[#5b0108] autofill:shadow-[inset_4px_4px_8px_rgba(91,1,8,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]"
                style={{
                  background: "transparent",
                  boxShadow:
                    "inset 4px 4px 8px rgba(91, 1, 8, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.8)",
                }}
                placeholder="Ej: él, ella, elle..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8 w-full max-w-3xl">
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
            {isSubmitting
              ? "Guardando..."
              : isPersonal
              ? "Continuar con mi perfil"
              : "Continuar como acompañante"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step1Context;
