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

const CIRCLE_SIZE = 100;
const BANNER_WIDTH = 380;
const BANNER_HEIGHT = 100;

const NeomorphicToast: React.FC<NeomorphicToastProps> = ({ message, variant, onClose, subtitle, duration = 3000 }) => {
  const [showContent, setShowContent] = React.useState(false);

  React.useEffect(() => {
    if (!onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  // Controla cuándo mostrar el contenido tras la expansión
  React.useEffect(() => {
    const contentTimer = setTimeout(() => setShowContent(true), 1200);
    return () => clearTimeout(contentTimer);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="fixed left-1/2 bottom-8 z-[9999] flex flex-col items-center justify-center"
        style={{ transform: "translateX(-50%)" }}
      >
        {/* Animación de círculo pulsante y expansión */}
        <motion.div
          initial={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, borderRadius: CIRCLE_SIZE / 2, scale: 1 }}
          animate={{
            scale: [1, 1.15, 1, 1.12, 1],
            transition: { times: [0, 0.2, 0.4, 0.6, 0.8], duration: 0.8, repeat: 0 },
          }}
        >
          <motion.div
            initial={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, borderRadius: CIRCLE_SIZE / 2 }}
            animate={{
              width: showContent ? BANNER_WIDTH : CIRCLE_SIZE,
              height: BANNER_HEIGHT,
              borderRadius: showContent ? 32 : CIRCLE_SIZE / 2,
              transition: { delay: 0.8, duration: 0.4, type: "spring", bounce: 0.2 },
            }}
            style={{
              background: colors[variant].bg,
              border: `4px solid ${colors[variant].border}`,
              boxShadow: colors[variant].shadow,
              minHeight: BANNER_HEIGHT,
              minWidth: CIRCLE_SIZE,
              maxWidth: BANNER_WIDTH,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {/* Contenido aparece tras la expansión */}
            <AnimatePresence>
              {showContent && (
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
                  exit={{ opacity: 0, x: 40 }}
                  className="flex flex-row items-center gap-4 w-full px-6"
                  style={{ justifyContent: "center" }}
                >
                  <span>{colors[variant].icon}</span>
                  <div className="flex flex-col items-start flex-1">
                    <span className="text-lg font-serif text-[#7a2323] font-bold drop-shadow-lg">
                      {message}
                    </span>
                    {subtitle && (
                      <span className="text-base text-[#7a2323] opacity-80 mt-1">{subtitle}</span>
                    )}
                  </div>
                  {onClose && (
                    <button
                      className="ml-2 p-1 rounded-full hover:bg-[#e7e0d5] transition-colors"
                      onClick={onClose}
                      aria-label="Cerrar notificación"
                    >
                      <X size={24} color="#7a2323" />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NeomorphicToast; 