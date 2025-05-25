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
    <div className="w-full flex flex-col items-center gap-4 animate-fade-in max-w-4xl mx-auto py-2">
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#7a2323] mb-1 text-center drop-shadow-sm animate-fade-in">
        Bienvenida a EYRA
      </h2>
      <p className="text-base text-[#3a1a1a] mb-4 text-center animate-fade-in">
        Un espacio para ti, tu ciclo y tu bienestar.{" "}
        <span className="block text-sm text-[#a62c2c] mt-1">
          Tómate tu tiempo, este espacio es solo para ti.
        </span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-3xl">
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
          <legend className="block text-[#300808] mb-3 font-medium text-sm">
            ¿Usarás EYRA para ti o para acompañar a alguien?
          </legend>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer text-sm">
              <input
                type="radio"
                {...register("isPersonal")}
                value="true"
                checked={isPersonal === true}
                onChange={() => setValue("isPersonal", true)}
                className="mr-2 w-4 h-4 accent-[#C62328] rounded-full shadow-sm border border-[#C62328]/30 focus:ring-2 focus:ring-[#C62328]/30"
              />
              <span>Para mí</span>
            </label>
            <label className="flex items-center cursor-pointer text-sm">
              <input
                type="radio"
                {...register("isPersonal")}
                value="false"
                checked={isPersonal === false}
                onChange={() => setValue("isPersonal", false)}
                className="mr-2 w-4 h-4 accent-[#C62328] rounded-full shadow-sm border border-[#C62328]/30 focus:ring-2 focus:ring-[#C62328]/30"
              />
              <span>Para acompañar</span>
            </label>
          </div>
          {typeof isPersonal === "boolean" && (
            <p className="text-xs text-[#5b0108] mt-2 italic">
              {isPersonal
                ? "Configuraremos EYRA para ayudarte con el seguimiento de tu ciclo y salud hormonal."
                : "EYRA se adaptará para que puedas acompañar a otra persona en su experiencia."}
            </p>
          )}
        </div>

        <div className="space-y-4">
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
              } rounded-xl py-2.5 px-3 text-[#5b0108] shadow-sm focus:ring-2 focus:ring-[#C62328]/20 focus:border-[#C62328] transition-all text-sm`}
              placeholder="Ej: Mujer cis, Persona trans, No binaria..."
            />
            {errors.genderIdentity && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.genderIdentity.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Este dato es obligatorio para continuar.
            </p>
          </div>

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
              Pronombres (opcional)
            </label>
            <input
              type="text"
              {...register("pronouns")}
              className="w-full bg-white border border-[#C62328]/30 rounded-xl py-2.5 px-3 text-[#5b0108] shadow-sm focus:ring-2 focus:ring-[#C62328]/20 focus:border-[#C62328] transition-all text-sm"
              placeholder="Ej: él, ella, elle..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4 w-full max-w-3xl">
        <button
          type="button"
          onClick={onNextStep}
          disabled={isSubmitting}
          className="px-8 py-2.5 bg-[#C62328] text-white rounded-xl font-semibold text-base shadow-md transition-all hover:bg-[#9d0d0b] disabled:opacity-50 disabled:cursor-not-allowed"
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