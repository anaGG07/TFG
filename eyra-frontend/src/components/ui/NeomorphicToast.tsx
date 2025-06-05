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
    bg: "#e7e0d5",
    border: "#7ac77a",
    icon: <CheckCircle size={32} color="#7ac77a" className="animate-pulse" />,
    shadow: "2px 2px 8px #d1c7b6, -2px -2px 8px #fff",
  },
  error: {
    bg: "#e7e0d5",
    border: "#C62328",
    icon: <XCircle size={32} color="#C62328" className="animate-shake" />,
    shadow: "2px 2px 8px #d1c7b6, -2px -2px 8px #fff",
  },
};

const CIRCLE_SIZE = 64;
const BANNER_WIDTH = 350;
const BANNER_HEIGHT = 64;

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
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -40, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          duration: 0.6,
        }}
        className="fixed top-8 right-8 z-[9999] flex flex-col items-center justify-center"
        style={{ transform: "none" }}
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
              duration: 0.7, // Expansión más lenta
              type: "spring",
              bounce: 0.15,
              ease: "easeOut",
            }}
            style={{
              background: colors[variant].bg,
              border: `2px solid ${colors[variant].border}`,
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
            {/* Icono animado de centro a izquierda */}
            <motion.span
              initial={{
                left: "50%",
                x: "-50%",
                position: "absolute",
                top: "50%",
                y: "-50%",
                scale: 1,
              }}
              animate={isExpanded ? {
                left: 24,
                x: 0,
                top: "50%",
                y: "-50%",
                position: "absolute",
                scale: 1,
              } : {
                left: "50%",
                x: "-50%",
                top: "50%",
                y: "-50%",
                position: "absolute",
                scale: 1,
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
              style={{ zIndex: 2 }}
            >
              {colors[variant].icon}
            </motion.span>

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
                  className="flex flex-row items-center gap-4 w-full pl-20 pr-6"
                  style={{ justifyContent: "flex-start" }}
                >
                  <motion.div
                    className="flex flex-col items-start flex-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <span className="text-base font-serif text-[#7a2323] font-semibold drop-shadow">
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
