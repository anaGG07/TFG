import React, { useEffect, useRef } from "react";
import { StepProps } from "../../types/components/StepProps";

const Step1Context: React.FC<StepProps> = ({
  isSubmitting,
  register,
  errors,
  watch,
  setValue,
  onNextStep,
  onGenderBlur,
}) => {
  const isPersonal = watch("isPersonal");
  const genderInputRef = useRef<HTMLInputElement>(null);

  // Autofocus en el primer input
  useEffect(() => {
    genderInputRef.current?.focus();
  }, []);

  return (
    <div className="space-y-6">
      <p className="text-[#300808] mb-8 text-center text-lg">
        Antes de empezar, cuéntanos un poco sobre ti para personalizar tu
        experiencia en EYRA.
      </p>

      <div className="space-y-4">
        <fieldset>
          <legend className="block text-[#300808] mb-2 font-medium">
            ¿Usarás EYRA para ti o para acompañar a alguien?
          </legend>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                {...register("isPersonal")}
                value="true"
                checked={isPersonal === true}
                onChange={() => setValue("isPersonal", true)}
                className="mr-2"
              />
              <span>Para mí</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                {...register("isPersonal")}
                value="false"
                checked={isPersonal === false}
                onChange={() => setValue("isPersonal", false)}
                className="mr-2"
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

        <div>
          <label className="block text-[#300808] mb-2 font-medium">
            ¿Cómo te identificas?
          </label>
          <input
            type="text"
            {...register("genderIdentity", {
              required: "El campo de identidad de género es obligatorio",
              validate: (value) => {
                return value.trim() !== "" || "El campo de identidad de género es obligatorio";
              }
            })}
            ref={genderInputRef}
            onBlur={onGenderBlur} // Añadimos el evento onBlur
            className={`w-full bg-white border ${
              errors.genderIdentity ? "border-red-500" : "border-[#300808]/20"
            } rounded-lg py-3 px-4 text-[#5b0108]`}
            placeholder="Ej: Mujer cis, Persona trans, No binaria..."
          />
          {errors.genderIdentity && (
            <p className="text-red-500 text-sm mt-1">
              {errors.genderIdentity.message}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Puedes escribir lo que tú prefieras. Este dato es obligatorio para
            continuar. 
          </p>
        </div>

        <div>
          <label className="block text-[#300808] mb-2 font-medium">
            Pronombres (opcional)
          </label>
          <input
            type="text"
            {...register("pronouns")}
            className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
            placeholder="Ej: ella/ella, él/él, elle..."
          />
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          type="button"
          onClick={onNextStep}
          disabled={isSubmitting}
          className="px-8 py-3 bg-[#5b0108] text-white rounded-lg font-medium transition-all hover:bg-[#9d0d0b] disabled:opacity-50 disabled:cursor-not-allowed"
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
