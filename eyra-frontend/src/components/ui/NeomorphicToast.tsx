import React from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

interface NeomorphicToastProps {
  message: string;
  variant: "success" | "error";
  onClose?: () => void;
}

const colors = {
  success: {
    bg: "#f5ede6",
    border: "#7ac77a",
    icon: <CheckCircle size={28} color="#3bb13b" />,
  },
  error: {
    bg: "#f5ede6",
    border: "#C62328",
    icon: <XCircle size={28} color="#C62328" />,
  },
};

const NeomorphicToast: React.FC<NeomorphicToastProps> = ({ message, variant, onClose }) => {
  return (
    <div
      className="flex items-center gap-4 px-6 py-4 min-w-[320px] max-w-xs shadow-neomorphic rounded-2xl border-2 animate-fade-in relative"
      style={{
        background: colors[variant].bg,
        borderColor: colors[variant].border,
        boxShadow:
          "8px 8px 24px #e7e0d5, -8px -8px 24px #fff8, 0 2px 8px #c6232822, 0 0 0 2px #fff8 inset",
      }}
    >
      <span>{colors[variant].icon}</span>
      <span className="flex-1 text-base font-serif text-[#7a2323]">{message}</span>
      {onClose && (
        <button
          className="ml-2 p-1 rounded-full hover:bg-[#e7e0d5] transition-colors"
          onClick={onClose}
          aria-label="Cerrar notificación"
        >
          <X size={20} color="#7a2323" />
        </button>
      )}
    </div>
  );
};

export default NeomorphicToast; 