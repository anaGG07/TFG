import React, { useEffect, useRef } from "react";
import { StepProps } from "../../types/components/StepProps";

const Step1Context: React.FC<StepProps> = ({
  isSubmitting,
  register,
  errors,
  watch,
  setValue,
  onNextStep,
  // onGenderBlur,
}) => {
  const isPersonal = watch("isPersonal");
  const genderInputRef = useRef<HTMLInputElement>(null);

  // Autofocus en el primer input
  useEffect(() => {
    genderInputRef.current?.focus();
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-6 animate-fade-in max-w-3xl mx-auto py-4">
      <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#7a2323] mb-2 text-center drop-shadow-sm animate-fade-in">
        Bienvenida a EYRA
      </h2>
      <p className="text-lg text-[#3a1a1a] mb-8 text-center animate-fade-in">
        Un espacio para ti, tu ciclo y tu bienestar.{" "}
        <span className="block text-base text-[#a62c2c] mt-2">
          Tómate tu tiempo, este espacio es solo para ti.
        </span>
      </p>

      <div className="grid grid-cols-2 gap-8 w-full justify-items-center">
        <div className="space-y-6">
          <fieldset
            className="p-6 rounded-2xl"
            style={{
              background: "#e7e0d5",
              boxShadow: `
              inset 4px 4px 8px rgba(91, 1, 8, 0.1),
              inset -4px -4px 8px rgba(255, 255, 255, 0.8)
            `,
            }}
          >
            <legend className="block text-[#300808] mb-4 font-medium px-2">
              ¿Usarás EYRA para ti o para acompañar a alguien?
            </legend>
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer text-base">
                <input
                  type="radio"
                  {...register("isPersonal")}
                  value="true"
                  checked={isPersonal === true}
                  onChange={() => setValue("isPersonal", true)}
                  className="mr-2 w-5 h-5 accent-[#C62328] rounded-full shadow-sm border border-[#C62328]/30 focus:ring-2 focus:ring-[#C62328]/30"
                />
                <span>Para mí</span>
              </label>
              <label className="flex items-center cursor-pointer text-base">
                <input
                  type="radio"
                  {...register("isPersonal")}
                  value="false"
                  checked={isPersonal === false}
                  onChange={() => setValue("isPersonal", false)}
                  className="mr-2 w-5 h-5 accent-[#C62328] rounded-full shadow-sm border border-[#C62328]/30 focus:ring-2 focus:ring-[#C62328]/30"
                />
                <span>Para acompañar</span>
              </label>
            </div>
            {typeof isPersonal === "boolean" && (
              <p className="text-sm text-[#5b0108] mt-2 italic">
                {isPersonal
                  ? "Configuraremos EYRA para ayudarte con el seguimiento de tu ciclo y salud hormonal."
                  : "EYRA se adaptará para que puedas acompañar a otra persona en su experiencia."}
              </p>
            )}
          </fieldset>
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
            <label className="block text-[#300808] mb-4 font-medium">
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
              className={`w-full bg-white border ${
                errors.genderIdentity ? "border-red-500" : "border-[#C62328]/30"
              } rounded-xl py-3 px-4 text-[#5b0108] shadow-sm focus:ring-2 focus:ring-[#C62328]/20 focus:border-[#C62328] transition-all text-base`}
              placeholder="Ej: Mujer cis, Persona trans, No binaria..."
            />
            {errors.genderIdentity && (
              <p className="text-red-500 text-sm mt-1 font-medium">
                {errors.genderIdentity.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Puedes escribir lo que tú prefieras. Este dato es obligatorio para
              continuar.
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
            <label className="block text-[#300808] mb-4 font-medium">
              Pronombres (opcional)
            </label>
            <input
              type="text"
              {...register("pronouns")}
              className="w-full bg-white border border-[#C62328]/30 rounded-xl py-3 px-4 text-[#5b0108] shadow-sm focus:ring-2 focus:ring-[#C62328]/20 focus:border-[#C62328] transition-all text-base"
              placeholder="Ej: él, ella, elle..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6 w-full max-w-md mx-auto">
        <button
          type="button"
          onClick={onNextStep}
          disabled={isSubmitting}
          className="px-10 py-3 bg-[#C62328] text-white rounded-xl font-semibold text-lg shadow-md transition-all hover:bg-[#9d0d0b] disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
};

export default Step1Context;
