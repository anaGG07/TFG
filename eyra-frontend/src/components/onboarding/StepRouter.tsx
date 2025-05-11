import React from "react";
import {
  UseFormRegister,
  Control,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
  SubmitHandler,
} from "react-hook-form";
import { OnboardingFormData } from "../../types/forms/OnboardingFormData";
import WomenStep1Profile from "./Step1Context";
import WomenStep2LifeStage from "./Step2LifeStage";
import WomenStep3Preferences from "./Step3Preferences";
import WomenStep4Symptoms from "./Step4Sympoms";
import WomenStep5Health from "./Step5HealthConcerns";

interface StepRouterProps {
  step: number;
  setStep: (step: number) => void;
  isSubmitting: boolean;
  isValid: boolean;
  error: string | null;
  register: UseFormRegister<OnboardingFormData>;
  control: Control<OnboardingFormData>;
  watch: UseFormWatch<OnboardingFormData>;
  setValue: UseFormSetValue<OnboardingFormData>;
  errors: FieldErrors<OnboardingFormData>;
  saveOnboarding: SubmitHandler<OnboardingFormData>;
}

const WomenStepRouter: React.FC<StepRouterProps> = (props) => {
  const { step } = props;

  switch (step) {
    case 1:
      return <WomenStep1Profile {...props} />;
    case 2:
      return <WomenStep2LifeStage {...props} />;
    case 3:
      return <WomenStep3Preferences {...props} />;
    case 4:
      return <WomenStep4Symptoms {...props} />;
    case 5:
      return <WomenStep5Health {...props} />;
    default:
      return (
        <div className="text-center py-12 text-red-600">Paso no válido</div>
      );
  }
};

export default WomenStepRouter;
