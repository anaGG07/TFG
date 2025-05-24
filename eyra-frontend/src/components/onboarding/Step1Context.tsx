import React, { useEffect, useRef } from "react";
import { StepProps } from "../../types/components/StepProps";
import {
  NeomorphicCard,
  NeomorphicInput,
  NeomorphicButton,
  NeomorphicRadio,
  ErrorMessage,
  InfoMessage,
  StepHeader,
} from "../ui/NeomorphicComponents";

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
    <div className="w-full space-y-4">
      <StepHeader
        title="¡Comencemos tu viaje!"
        subtitle="Cuéntanos un poco sobre ti para personalizar tu experiencia."
        description="Cada historia es única, como tú."
      />

      {/* Pregunta personal/acompañante */}
      <NeomorphicCard compact>
        <div className="text-center mb-3">
          <p className="text-[#5b0108] text-sm font-medium">
            ¿Usarás EYRA para ti o para acompañar a alguien?
          </p>
        </div>
        <div className="flex gap-6 justify-center">
          <NeomorphicRadio
            name="isPersonal"
            checked={isPersonal === true}
            onChange={() => setValue("isPersonal", true)}
            label="Para mí"
          />
          <NeomorphicRadio
            name="isPersonal"
            checked={isPersonal === false}
            onChange={() => setValue("isPersonal", false)}
            label="Para acompañar"
          />
        </div>

        {typeof isPersonal === "boolean" && (
          <InfoMessage
            message={
              isPersonal
                ? "Configuraremos EYRA para ayudarte con el seguimiento de tu ciclo y salud hormonal."
                : "EYRA se adaptará para que puedas acompañar a otra persona en su experiencia."
            }
            className="mt-3"
          />
        )}
      </NeomorphicCard>

      {/* Campo de identidad de género */}
      <NeomorphicCard compact>
        <div className="text-center mb-3">
          <label className="text-[#5b0108] text-sm font-medium">
            ¿Cómo te identificas?
          </label>
        </div>
        <NeomorphicInput
          {...register("genderIdentity", {
            required: "El campo de identidad de género es obligatorio",
          })}
          ref={genderInputRef}
          placeholder="Ej: Mujer cis, Persona trans, No binaria..."
          hasError={!!errors.genderIdentity}
        />
        {errors.genderIdentity && (
          <ErrorMessage
            message={errors.genderIdentity.message || "Campo requerido"}
          />
        )}
        <p className="text-xs text-[#9d0d0b]/80 mt-2 text-center">
          Este dato es obligatorio para continuar.
        </p>
      </NeomorphicCard>

      {/* Campo de pronombres */}
      <NeomorphicCard compact>
        <div className="text-center mb-3">
          <label className="text-[#5b0108] text-sm font-medium">
            Pronombres (opcional)
          </label>
        </div>
        <NeomorphicInput
          {...register("pronouns")}
          placeholder="Ej: él, ella, elle..."
        />
      </NeomorphicCard>

      {/* Botón de continuar */}
      <div className="flex justify-center pt-2">
        <NeomorphicButton
          onClick={onNextStep}
          disabled={isSubmitting}
          className="px-8"
        >
          {isSubmitting
            ? "Guardando..."
            : isPersonal
            ? "Continuar con mi perfil"
            : "Continuar como acompañante"}
        </NeomorphicButton>
      </div>
    </div>
  );
};

export default Step1Context;
