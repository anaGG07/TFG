import React from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
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
    icon: <CheckCircle size={48} color="#7ac77a" className="animate-pulse" />,
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

const NeomorphicToast: React.FC<NeomorphicToastProps> = ({
  message,
  variant,
  onClose,
  subtitle,
  duration = 4000, // Aumentado a 4 segundos por defecto
}) => {
  const [showContent, setShowContent] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);

  React.useEffect(() => {
    if (!onClose) return;

    // Timer para cerrar el toast
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  // Secuencia de animación mejorada
  React.useEffect(() => {
    // Paso 1: Mostrar círculo y hacer pulso (1.5 segundos)
    const pulseTimer = setTimeout(() => {
      setIsExpanded(true);
    }, 1500); // Más tiempo para ver el pulso

    // Paso 2: Mostrar contenido después de la expansión (0.6 segundos después)
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 2100); // 1500ms + 600ms de expansión

    return () => {
      clearTimeout(pulseTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          duration: 0.6,
        }}
        className="fixed left-1/2 bottom-8 z-[9999] flex flex-col items-center justify-center"
        style={{ transform: "translateX(-50%)" }}
      >
        {/* Contenedor principal con animaciones secuenciales */}
        <motion.div
          className="relative flex items-center justify-center"
          // Animación de pulso más lenta y visible
          animate={{
            scale: isExpanded ? 1 : [1, 1.2, 1.05, 1.15, 1],
          }}
          transition={{
            scale: {
              duration: isExpanded ? 0 : 1.2, // Pulso más lento
              times: [0, 0.25, 0.5, 0.75, 1],
              ease: "easeInOut",
              repeat: isExpanded ? 0 : 0,
            },
          }}
        >
          <motion.div
            initial={{
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              borderRadius: CIRCLE_SIZE / 2,
            }}
            animate={{
              width: isExpanded ? BANNER_WIDTH : CIRCLE_SIZE,
              height: isExpanded ? BANNER_HEIGHT : CIRCLE_SIZE,
              borderRadius: isExpanded ? 32 : CIRCLE_SIZE / 2,
            }}
            transition={{
              duration: 0.6, // Expansión más lenta
              type: "spring",
              bounce: 0.15,
              ease: "easeOut",
            }}
            style={{
              background: colors[variant].bg,
              border: `4px solid ${colors[variant].border}`,
              boxShadow: colors[variant].shadow,
              minHeight: CIRCLE_SIZE,
              minWidth: CIRCLE_SIZE,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {/* Icono que aparece inmediatamente en el círculo */}
            <AnimatePresence mode="wait">
              {!showContent && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {colors[variant].icon}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Contenido completo que aparece tras la expansión */}
            <AnimatePresence>
              {showContent && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    transition: {
                      duration: 0.4,
                      ease: "easeOut",
                    },
                  }}
                  exit={{
                    opacity: 0,
                    x: 20,
                    scale: 0.9,
                    transition: { duration: 0.2 },
                  }}
                  className="flex flex-row items-center gap-4 w-full px-6"
                  style={{ justifyContent: "center" }}
                >
                  <motion.span
                    initial={{ rotate: -10, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {colors[variant].icon}
                  </motion.span>

                  <motion.div
                    className="flex flex-col items-start flex-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <span className="text-lg font-serif text-[#7a2323] font-bold drop-shadow-lg">
                      {message}
                    </span>
                    {subtitle && (
                      <motion.span
                        className="text-base text-[#7a2323] opacity-80 mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                      >
                        {subtitle}
                      </motion.span>
                    )}
                  </motion.div>

                  {onClose && (
                    <motion.button
                      className="ml-2 p-1 rounded-full hover:bg-[#e7e0d5] transition-colors"
                      onClick={onClose}
                      aria-label="Cerrar notificación"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: 0.4 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X size={24} color="#7a2323" />
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Indicador de progreso opcional */}
        {duration > 0 && (
          <motion.div
            className="mt-2 h-1 bg-[#e7e0d5] rounded-full overflow-hidden"
            style={{ width: isExpanded ? BANNER_WIDTH - 40 : CIRCLE_SIZE - 20 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 0.6 : 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <motion.div
              className={`h-full ${
                variant === "success" ? "bg-[#7ac77a]" : "bg-[#C62328]"
              }`}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{
                duration: (duration - 2100) / 1000, // Descontar el tiempo de animación inicial
                ease: "linear",
                delay: 2.1, // Empezar después de las animaciones iniciales
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default NeomorphicToast;
