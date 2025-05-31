import React from "react";
import { CheckCircle, XCircle, X, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NeomorphicToastProps {
  message: string;
  variant: "success" | "error";
  onClose?: () => void;
  subtitle?: string;
  duration?: number; // en ms
}

const colors = {
  success: {
    bg: "#f5ede6",
    border: "#7ac77a",
    icon: <Trophy size={48} color="#7ac77a" className="animate-bounce" />,
    shadow: "0 8px 32px #7ac77a44, 0 2px 8px #7ac77a22, 0 0 0 2px #fff8 inset",
  },
  error: {
    bg: "#f5ede6",
    border: "#C62328",
    icon: <XCircle size={48} color="#C62328" className="animate-shake" />,
    shadow: "0 8px 32px #C6232844, 0 2px 8px #C6232822, 0 0 0 2px #fff8 inset",
  },
};

const variants = {
  initial: { y: 100, opacity: 0, scale: 0.8 },
  animate: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 400, damping: 30 } },
  exit: { y: 100, opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
};

const NeomorphicToast: React.FC<NeomorphicToastProps> = ({ message, variant, onClose, subtitle, duration = 3000 }) => {
  React.useEffect(() => {
    if (!onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <AnimatePresence>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        className="fixed left-1/2 bottom-8 z-[9999] flex flex-col items-center justify-center"
        style={{ transform: "translateX(-50%)" }}
      >
        <div
          className="flex flex-col items-center px-8 py-6 min-w-[340px] max-w-lg shadow-neomorphic rounded-3xl border-4 relative"
          style={{
            background: colors[variant].bg,
            borderColor: colors[variant].border,
            boxShadow: colors[variant].shadow,
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <span>{colors[variant].icon}</span>
            <span className="text-lg font-serif text-[#7a2323] text-center font-bold drop-shadow-lg">
              {message}
            </span>
            {subtitle && (
              <span className="text-base text-[#7a2323] text-center opacity-80 mt-1">{subtitle}</span>
            )}
          </div>
          {onClose && (
            <button
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-[#e7e0d5] transition-colors"
              onClick={onClose}
              aria-label="Cerrar notificación"
            >
              <X size={24} color="#7a2323" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NeomorphicToast; 