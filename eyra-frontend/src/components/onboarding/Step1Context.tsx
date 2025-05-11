import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { OnboardingFormData } from "../../types/forms/OnboardingFormData";

interface Props {
  isSubmitting: boolean;
  isValid: boolean;
  register: UseFormRegister<OnboardingFormData>;
  errors: FieldErrors<OnboardingFormData>;
  watch: UseFormWatch<OnboardingFormData>;
  setValue: UseFormSetValue<OnboardingFormData>;
  setStep: (step: number) => void;
}

const Step1Context: React.FC<Props> = ({
  isSubmitting,
  isValid,
  register,
  errors,
  watch,
  setValue,
  setStep,
}) => {
  const isPersonal = watch("isPersonal");

  return (
    <div className="space-y-6">
      <p className="text-[#300808] mb-8 text-center">
        Antes de empezar, cuéntanos un poco sobre ti para personalizar tu
        experiencia en EYRA.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-[#300808] mb-2 font-medium">
            ¿Usarás EYRA para ti o para acompañar a alguien?
          </label>
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
        </div>

        <div>
          <label className="block text-[#300808] mb-2 font-medium">
            ¿Cómo te identificas?
          </label>
          <input
            type="text"
            {...register("genderIdentity", {
              required: "Este campo es obligatorio",
            })}
            className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
            placeholder="Ej: Mujer cis, Persona trans, No binaria..."
          />
          {errors.genderIdentity && (
            <p className="text-red-500 text-sm mt-1">
              {errors.genderIdentity.message}
            </p>
          )}
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
          onClick={() => setStep(2)}
          disabled={!isValid || isSubmitting}
          className="px-8 py-3 bg-[#5b0108] text-white rounded-lg font-medium transition-all hover:bg-[#9d0d0b] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Guardando..." : "Siguiente"}
        </button>
      </div>
    </div>
  );
};

export default Step1Context;
