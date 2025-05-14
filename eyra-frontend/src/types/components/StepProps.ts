import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors, UseFormTrigger, Control } from "react-hook-form";
import { OnboardingFormData } from "../forms/OnboardingFormData";
import { Dispatch, SetStateAction } from "react";

/**
 * Props base comunes para todos los componentes Step del onboarding
 */
export interface StepProps {
  isSubmitting: boolean;
  error: string | null;
  register: UseFormRegister<OnboardingFormData>;
  control: Control<OnboardingFormData>;
  watch: UseFormWatch<OnboardingFormData>;
  setValue: UseFormSetValue<OnboardingFormData>;
  errors: FieldErrors<OnboardingFormData>;
  trigger: UseFormTrigger<OnboardingFormData>;
  onNextStep: () => void;
  onPreviousStep?: () => void;
  onSubmit?: () => void;
  // Props legacy para compatibilidad
  setStep: Dispatch<SetStateAction<number>>;
}

/**
 * Props específicas para el componente Step5HealthConcerns
 */
export interface Step5Props extends StepProps {
  onSubmit: () => void; // Hacemos este prop requerido
}
