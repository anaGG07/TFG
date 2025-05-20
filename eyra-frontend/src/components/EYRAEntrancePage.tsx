import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface EYRAEntrancePageProps {
  onFinish: () => void;
}

export default function EYRAEntrancePage({ onFinish }: EYRAEntrancePageProps) {
  const [phase, setPhase] = useState("initial");
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sequence = [
      { time: 2000, phase: "explode" },
      { time: 4000, phase: "collect" },
      { time: 6000, phase: "expand" },
      { time: 8000, phase: "move" },
      { time: 10000, phase: "idle" },
    ];
    sequence.forEach(({ time, phase }) => {
      setTimeout(() => setPhase(phase), time);
    });
    // Llama a onFinish cuando termina la animación
    const finishTimeout = setTimeout(() => {
      onFinish();
    }, 10500);
    return () => clearTimeout(finishTimeout);
  }, [onFinish]);

  // Centrado dinámico
  const [center, setCenter] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateCenter = () => {
      setCenter({
        x: window.innerWidth / 2 - 60,
        y: window.innerHeight / 2 - 60,
      });
    };
    updateCenter();
    window.addEventListener("resize", updateCenter);
    return () => window.removeEventListener("resize", updateCenter);
  }, []);

  return (
    <div className="w-screen h-screen bg-[#FFEDEA] overflow-hidden relative">
      {/* Partículas */}
      {(phase === "explode" || phase === "collect") &&
        Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-6 h-6 bg-[#C62828]"
            style={{
              top: center.y,
              left: center.x,
              borderRadius: "60% 40% 50% 50% / 50% 60% 40% 50%",
              filter: "blur(3px)",
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
        initial={{ scale: 1, borderRadius: "50%" }}
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
          borderRadius: [
            "58% 42% 47% 53% / 50% 60% 40% 45%",
            "55% 45% 60% 40% / 65% 60% 45% 50%",
            "60% 40% 48% 52% / 55% 65% 45% 50%",
          ],
          rotate: phase === "idle" ? 360 : 0,
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: phase === "idle" ? Infinity : 0,
          repeatType: "loop",
        }}
        style={{
          width: 120,
          height: 120,
          top: center.y,
          left: center.x,
          filter: "blur(4px)",
          zIndex: 2,
        }}
      ></motion.div>
    </div>
  );
} 