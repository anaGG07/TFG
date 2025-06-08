import React, { ReactNode, forwardRef } from "react";

// Estilos base reutilizables
const baseNeomorphicStyle = {
  background: "linear-gradient(145deg, #e7e0d5, #d4c7bb)",
  boxShadow: `
    inset 8px 8px 16px rgba(91, 1, 8, 0.05),
    inset -8px -8px 16px rgba(255, 255, 255, 0.3)
  `,
};

const inputNeomorphicStyle = {
  background: "linear-gradient(145deg, #f0e8dc, #ddd5c9)",
  boxShadow: `
    inset 4px 4px 8px rgba(91, 1, 8, 0.05),
    inset -4px -4px 8px rgba(255, 255, 255, 0.8)
  `,
};

const buttonPrimaryStyle = {
  background: "linear-gradient(135deg, #C62328, #9d0d0b)",
  boxShadow: `
    8px 8px 16px rgba(91, 1, 8, 0.15),
    -8px -8px 16px rgba(255, 108, 92, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2)
  `,
};

const buttonSecondaryStyle = {
  background: "linear-gradient(145deg, #f0e8dc, #ddd5c9)",
  boxShadow: `
    8px 8px 16px rgba(91, 1, 8, 0.08),
    -8px -8px 16px rgba(255, 255, 255, 0.25)
  `,
};

// Interfaces
interface NeomorphicCardProps {
  children: ReactNode;
  className?: string;
  compact?: boolean;
}

interface NeomorphicInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

interface NeomorphicSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
  hasError?: boolean;
}

interface NeomorphicButtonProps {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  className?: string;
}

interface NeomorphicRadioProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  name?: string;
}

interface NeomorphicCheckboxProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  compact?: boolean;
}

interface StepHeaderProps {
  title: string;
  subtitle: string;
  description?: string;
}

interface NavigationButtonsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  isSubmitting?: boolean;
  isLastStep?: boolean;
  nextLabel?: string;
}

// Componentes
export const NeomorphicCard: React.FC<NeomorphicCardProps> = ({
  children,
  className = "",
  compact = false,
}) => (
  <div
    className={`rounded-2xl ${compact ? "p-4" : "p-6"} ${className}`}
    style={baseNeomorphicStyle}
  >
    {children}
  </div>
);

export const NeomorphicInput = forwardRef<
  HTMLInputElement,
  NeomorphicInputProps
>(({ hasError = false, className = "", ...props }, ref) => (
  <div style={inputNeomorphicStyle} className="rounded-xl">
    <input
      ref={ref}
      className={`w-full bg-transparent border-none rounded-xl py-3 px-4 text-[#5b0108] placeholder-[#9d0d0b]/60 focus:outline-none focus:ring-2 focus:ring-[#C62328]/30 transition-all ${
        hasError ? "ring-2 ring-red-400" : ""
      } ${className}`}
      {...props}
    />
  </div>
));

NeomorphicInput.displayName = "NeomorphicInput";

export const NeomorphicSelect: React.FC<NeomorphicSelectProps> = ({
  children,
  hasError = false,
  className = "",
  ...props
}) => (
  <div style={inputNeomorphicStyle} className="rounded-xl">
    <select
      className={`w-full bg-transparent border-none rounded-xl py-3 px-4 text-[#5b0108] focus:outline-none focus:ring-2 focus:ring-[#C62328]/30 transition-all ${
        hasError ? "ring-2 ring-red-400" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </select>
  </div>
);

export const NeomorphicButton: React.FC<NeomorphicButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  type = "button",
  className = "",
}) => {
  const isPrimary = variant === "primary";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden rounded-xl px-6 py-3 font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
        isPrimary ? "text-white" : "text-[#5b0108]"
      } ${className}`}
      style={isPrimary ? buttonPrimaryStyle : buttonSecondaryStyle}
    >
      {children}
    </button>
  );
};

export const NeomorphicRadio: React.FC<NeomorphicRadioProps> = ({
  checked,
  onChange,
  label,
  name,
}) => (
  <label className="flex items-center cursor-pointer">
    <div
      className="relative w-6 h-6 rounded-full mr-3"
      style={{
        background: checked
          ? "linear-gradient(135deg, #C62328, #9d0d0b)"
          : "linear-gradient(145deg, #d4c7bb, #e7e0d5)",
        boxShadow: checked
          ? `inset 2px 2px 4px rgba(91, 1, 8, 0.3), inset -2px -2px 4px rgba(255, 108, 92, 0.2)`
          : `inset 2px 2px 4px rgba(91, 1, 8, 0.05), inset -2px -2px 4px rgba(255, 255, 255, 0.8)`,
      }}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      {checked && (
        <div className="absolute inset-2 bg-white rounded-full"></div>
      )}
    </div>
    <span className="text-[#300808] font-medium">{label}</span>
  </label>
);

export const NeomorphicCheckbox: React.FC<NeomorphicCheckboxProps> = ({
  checked,
  onChange,
  label,
  compact = false,
}) => (
  <label
    className={`flex items-center justify-between ${
      compact ? "p-3" : "p-4"
    } border rounded-xl cursor-pointer transition-all duration-300 ${
      checked
        ? "bg-[#fceced] border-[#5b0108]/60 shadow-sm"
        : "hover:bg-[#5b010810] hover:border-[#5b0108]/30"
    }`}
    onClick={onChange}
  >
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        readOnly
        className="mr-3 w-5 h-5 accent-[#5b0108]"
      />
      <span className={`text-[#3a1a1a] ${compact ? "text-sm" : ""}`}>
        {label}
      </span>
    </div>
    {checked && <span className="text-[#5b0108] text-lg font-medium">✓</span>}
  </label>
);

export const StepHeader: React.FC<StepHeaderProps> = ({
  title,
  subtitle,
  description,
}) => (
  <div className="text-center mb-6">
    <h3 className="font-serif text-xl font-light text-[#5b0108] mb-2">
      {title}
    </h3>
    <p className="text-[#300808] text-sm leading-relaxed">
      {subtitle}
      {description && (
        <>
          <br />
          <span className="text-[#9d0d0b] text-xs italic">{description}</span>
        </>
      )}
    </p>
  </div>
);

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onNext,
  isSubmitting = false,
  isLastStep = false,
  nextLabel,
}) => (
  <div className="flex justify-between items-center mt-6 w-full">
    {onPrevious ? (
      <NeomorphicButton variant="secondary" onClick={onPrevious}>
        Atrás
      </NeomorphicButton>
    ) : (
      <div></div>
    )}

    <NeomorphicButton
      variant="primary"
      onClick={onNext}
      disabled={isSubmitting}
      className="px-8"
    >
      {isSubmitting
        ? "Guardando..."
        : nextLabel || (isLastStep ? "Finalizar" : "Siguiente")}
    </NeomorphicButton>
  </div>
);
