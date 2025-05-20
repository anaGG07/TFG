import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function EYRAEntrancePage() {
  const [phase, setPhase] = useState("initial");
  const [menuIndex, setMenuIndex] = useState(0);
  const [circlePos, setCirclePos] = useState({ x: 0, y: 0 });
  const [targetPositions, setTargetPositions] = useState<{ x: number; y: number }[]>([]);
  const [captured, setCaptured] = useState<number[]>([]);
  const [scale, setScale] = useState(1);

  const menuOptions = ["Iniciar sesión", "Registro", "Acerca de"];
  const particleCount = 30;
  const windowW = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const windowH = typeof window !== 'undefined' ? window.innerHeight : 800;

  // Generar posiciones objetivo para las partículas
  useEffect(() => {
    const margin = 40;
    const positions = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * (windowW - margin * 2) - windowW / 2 + margin,
      y: Math.random() * (windowH - margin * 2) - windowH / 2 + margin,
    }));
    setTargetPositions(positions);
  }, [windowW, windowH]);

  // Secuencia de fases
  useEffect(() => {
    const sequence = [
      { time: 1000, phase: "explode" },
      { time: 4000, phase: "collect" },
    ];
    sequence.forEach(({ time, phase }) => {
      setTimeout(() => setPhase(phase), time);
    });
  }, []);

  // Lógica de captura en grupos y animación del círculo
  useEffect(() => {
    if (phase === "collect") {
      let i = 0;
      let scaleValue = 1.5;
      const interval = setInterval(() => {
        if (i < particleCount) {
          const groupSize = 4;
          const group = targetPositions.slice(i, i + groupSize);
          const avgX = group.reduce((sum, p) => sum + p.x, 0) / group.length;
          const avgY = group.reduce((sum, p) => sum + p.y, 0) / group.length;
          setCirclePos({ x: avgX, y: avgY });
          setCaptured((prev) => [...prev, ...group.map((_, idx) => i + idx)]);
          setScale(scaleValue);
          scaleValue += 0.3;
          i += groupSize;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setCirclePos({ x: 0, y: 0 });
            setTimeout(() => setPhase("move"), 2000);
            setTimeout(() => setPhase("idle"), 5000);
          }, 1500);
        }
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [phase, targetPositions]);

  const handleMenuChange = (direction: "up" | "down") => {
    setMenuIndex((prev) =>
      direction === "up"
        ? (prev - 1 + menuOptions.length) % menuOptions.length
        : (prev + 1) % menuOptions.length
    );
  };

  return (
    <div className="w-screen h-screen bg-[#FFEDEA] overflow-hidden relative">
      {/* Partículas */}
      {(phase === "explode" || phase === "collect") &&
        targetPositions.map((pos, i) => (
          !captured.includes(i) && (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-[#C62828] rounded-full"
              style={{
                top: windowH / 2,
                left: windowW / 2,
                filter: "blur(2px)",
                zIndex: 1,
              }}
              animate={{
                x: pos.x,
                y: pos.y,
                opacity: 1,
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: i * 0.05 }}
            />
          )
        ))}

      {/* Círculo animado principal */}
      <motion.div
        className="absolute bg-[#C62828] shadow-2xl"
        animate={{
          x:
            phase === "move" || phase === "idle"
              ? -windowW / 2 + 60
              : circlePos.x,
          y:
            phase === "move" || phase === "idle"
              ? -windowH / 2 + 60
              : circlePos.y,
          scale: scale,
          rotate: [0, 2, -2, 0],
          borderRadius: [
            "58% 42% 47% 53% / 50% 60% 40% 45%",
            "65% 35% 60% 40% / 70% 60% 45% 50%",
            "60% 40% 48% 52% / 55% 65% 45% 50%",
          ],
        }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: phase === "idle" ? Infinity : 0,
          repeatType: "loop",
        }}
        style={{
          width: 120,
          height: 120,
          top: windowH / 2 - 60,
          left: windowW / 2 - 60,
          filter: "blur(1.5px)",
          zIndex: 2,
        }}
      ></motion.div>

      {/* Menú circular curvo ajustado al borde del círculo */}
      <AnimatePresence>
        {phase === "idle" && (
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
    </div>
  );
} 