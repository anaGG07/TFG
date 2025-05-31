import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = "button",
  variant = "primary",
  size = "medium",
  isLoading = false,
  className = "",
}) => {
  const baseClasses =
    "relative overflow-hidden rounded-2xl font-semibold transition-all duration-300 ease-in-out transform backdrop-blur-md border cursor-pointer";

  const sizeClasses = {
    small: "px-6 py-2 text-sm",
    medium: "px-8 py-3 text-base",
    large: "px-12 py-4 text-lg",
  };

  const variantClasses = {
    primary: `
      bg-[#e7e0d5]/30 border-[#e7e0d5]/60 text-[#e7e0d5]
      hover:bg-[#e7e0d5]/50 hover:border-[#e7e0d5]/80 hover:scale-105 hover:shadow-[0_8px_32px_rgba(231,224,213,0.5)]
      active:scale-95 active:bg-[#e7e0d5]/40
      focus:outline-none focus:ring-2 focus:ring-[#e7e0d5]/60
      shadow-[0_4px_24px_0_#E7E0D5] 
    `,
    secondary: `
      bg-[#E7E0D5]/15 border-[#E7E0D5]/20 text-[#E7E0D5]
      hover:bg-[#E7E0D5]/25 hover:border-[#E7E0D5]/30 hover:scale-105 hover:shadow-[0_8px_32px_rgba(231,224,213,0.3)]
      active:scale-95 active:bg-[#E7E0D5]/20
      focus:outline-none focus:ring-2 focus:ring-[#E7E0D5]/30
    `,
    outline: `
      bg-transparent border-[#E7E0D5]/40 text-[#E7E0D5]
      hover:bg-white/10 hover:border-[#E7E0D5]/60 hover:scale-105 hover:shadow-[0_8px_32px_rgba(231,224,213,0.15)]
      active:scale-95 active:bg-white/5
      focus:outline-none focus:ring-2 focus:ring-[#E7E0D5]/30
    `,
  };

  const disabledClasses =
    "opacity-50 cursor-not-allowed transform-none hover:transform-none hover:bg-opacity-15";

  const finalClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${disabled || isLoading ? disabledClasses : variantClasses[variant]}
    ${className}
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={finalClasses}
    >
      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

      {/* Contenido del botón */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <svg
              className="animate-spin w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Cargando...
          </>
        ) : (
          children
        )}
      </span>

      {/* Borde interno sutil */}
      <div className="absolute inset-0 rounded-2xl border border-white/10" />
    </button>
  );
};

export default Button;
