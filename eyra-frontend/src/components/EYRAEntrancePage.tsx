import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

interface EYRAEntrancePageProps {
  onFinish: () => void;
}

export default function EYRAEntrancePage({ onFinish }: EYRAEntrancePageProps) {
  const [phase, setPhase] = useState("initial");
  const [menuIndex, setMenuIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const circleRef = useRef(null);

  const menuOptions = ["Iniciar sesión", "Registro", "Acerca de"];

  useEffect(() => {
    const sequence = [
      { time: 3000, phase: "explode" },
      { time: 6000, phase: "collect" },
      { time: 9000, phase: "expand" },
      { time: 12000, phase: "move" },
      { time: 15000, phase: "idle" },
    ];
    sequence.forEach(({ time, phase }) => {
      setTimeout(() => setPhase(phase), time);
    });
  }, []);

  // Cuando entra en fase idle, espera 2s y luego fade out
  useEffect(() => {
    if (phase === "idle") {
      const timeout = setTimeout(() => setFadeOut(true), 2000);
      const finishTimeout = setTimeout(() => onFinish(), 2800);
      return () => {
        clearTimeout(timeout);
        clearTimeout(finishTimeout);
      };
    }
  }, [phase, onFinish]);

  const centerX = window.innerWidth / 2 - 60;
  const centerY = window.innerHeight / 2 - 60;

  const handleMenuChange = (direction: "up" | "down") => {
    setMenuIndex((prev) =>
      direction === "up"
        ? (prev - 1 + menuOptions.length) % menuOptions.length
        : (prev + 1) % menuOptions.length
    );
  };

  // Animación de borderRadius y rotación continua
  const borderRadiusKeyframes = [
    "58% 42% 47% 53% / 50% 60% 40% 45%",
    "65% 35% 60% 40% / 70% 60% 45% 50%",
    "60% 40% 48% 52% / 55% 65% 45% 50%",
    "58% 42% 47% 53% / 50% 60% 40% 45%"
  ];

  return (
    <motion.div
      className="w-screen h-screen bg-[#FFEDEA] overflow-hidden relative"
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Partículas */}
      {(phase === "explode" || phase === "collect") &&
        Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-6 h-6 bg-[#C62828]"
            style={{
              top: centerY + 60,
              left: centerX + 60,
              borderRadius: "60% 40% 50% 50% / 50% 60% 40% 50%",
              filter: "blur(2px)",
              zIndex: 1,
            }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: phase === "explode" ? Math.random() * 800 - 400 : 0,
              y: phase === "explode" ? Math.random() * 800 - 400 : 0,
              opacity: phase === "collect" ? 0 : 1,
            }}
            transition={{ duration: 1.5, delay: i * 0.03 }}
          />
        ))}

      {/* Círculo animado principal */}
      <motion.div
        ref={circleRef}
        className="absolute bg-[#C62828]"
        initial={{ scale: 1, borderRadius: borderRadiusKeyframes[0], rotate: 0 }}
        animate={{
          x:
            phase === "move" || phase === "idle"
              ? -window.innerWidth / 2 + 60
              : 0,
          y:
            phase === "move" || phase === "idle"
              ? -window.innerHeight / 2 + 60
              : 0,
          scale:
            phase === "expand" || phase === "move" || phase === "idle"
              ? 5
              : 1,
          borderRadius: borderRadiusKeyframes,
          rotate: [0, 360],
        }}
        transition={{
          duration: 10,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
        style={{
          width: 120,
          height: 120,
          top: centerY,
          left: centerX,
          filter: "blur(2px)",
          zIndex: 2,
        }}
      ></motion.div>

      {/* Menú circular curvo ajustado al borde del círculo */}
      <AnimatePresence>
        {phase === "idle" && !fadeOut && (
          <motion.div
            className="absolute top-12 left-10 z-10 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <button onClick={() => handleMenuChange("up")} className="text-[#C62828] mb-2">
              <ChevronUp size={24} />
            </button>
            <div className="relative w-[200px] h-[200px]">
              {[...Array(3)].map((_, i) => {
                const index = (menuIndex + i) % menuOptions.length;
                const angle = (-60 + i * 60) * (Math.PI / 180);
                const radius = 90;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                return (
                  <motion.div
                    key={index}
                    className="absolute bg-white text-[#C62828] text-sm font-serif px-4 py-1 rounded-full shadow"
                    style={{
                      top: `calc(50% + ${y}px - 20px)`,
                      left: `calc(50% + ${x}px - 50px)`
                    }}
                  >
                    {menuOptions[index]}
                  </motion.div>
                );
              })}
            </div>
            <button onClick={() => handleMenuChange("down")} className="text-[#C62828] mt-2">
              <ChevronDown size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 