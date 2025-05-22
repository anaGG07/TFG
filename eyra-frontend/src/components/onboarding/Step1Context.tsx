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
    <div className="w-full flex flex-col items-center gap-8 animate-fade-in">
      <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#7a2323] mb-2 text-center">¡Comencemos tu viaje!</h3>
      <p className="text-[#3a1a1a] text-lg text-center mb-4">Cuéntanos un poco sobre ti para personalizar tu experiencia.<br/><span className="text-[#a62c2c] text-base">Cada historia es única, como tú.</span></p>

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
            // Usar una función que combine ambas referencias
            ref={(element) => {
              // Asigna la ref de React Hook Form
              register("genderIdentity").ref(element);
              // También asigna la ref del componente
              genderInputRef.current = element;
            }}
            // Incluir el resto de las propiedades de register excepto ref
            name="genderIdentity"
            onChange={register("genderIdentity").onChange}
            onBlur={register("genderIdentity").onBlur}
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
            placeholder="Ej: él, ella, elle..."
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
