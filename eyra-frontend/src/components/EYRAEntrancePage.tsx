import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

interface EYRAEntrancePageProps {
  onFinish: () => void;
}

// Utilidad para generar posiciones aleatorias dentro de la pantalla
function getRandomPositions(count: number, radius: number) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * (window.innerWidth / 2 - radius - 40) + 80;
    const x = window.innerWidth / 2 + Math.cos(angle) * distance - radius;
    const y = window.innerHeight / 2 + Math.sin(angle) * distance - radius;
    positions.push({ x, y });
  }
  return positions;
}

const POINTS = 20;
const CIRCLE_SIZE = 120;
const CIRCLE_RADIUS = CIRCLE_SIZE / 2;

export default function EYRAEntrancePage({ onFinish }: EYRAEntrancePageProps) {
  const [phase, setPhase] = useState<
    | "start"
    | "explode"
    | "capture"
    | "center"
    | "moveToCorner"
    | "idle"
  >("start");
  const [points, setPoints] = useState<{ x: number; y: number; captured: boolean }[]>([]);
  const [circlePos, setCirclePos] = useState<{ x: number; y: number }>({
    x: window.innerWidth / 2 - CIRCLE_RADIUS,
    y: window.innerHeight / 2 - CIRCLE_RADIUS,
  });
  const [circleSize, setCircleSize] = useState(CIRCLE_SIZE);
  const [fadeOut, setFadeOut] = useState(false);
  const [rotation, setRotation] = useState(0);
  const captureStep = useRef(0);

  // Generar posiciones aleatorias para los puntos al inicio
  useEffect(() => {
    setPoints(
      getRandomPositions(POINTS, 8).map((pos) => ({ ...pos, captured: false }))
    );
  }, []);

  // Secuencia de fases
  useEffect(() => {
    if (phase === "start") {
      setTimeout(() => setPhase("explode"), 1200);
    } else if (phase === "explode") {
      setTimeout(() => setPhase("capture"), 1800);
    } else if (phase === "capture") {
      // Iniciar captura de puntos
      captureStep.current = 0;
      capturePoints();
    } else if (phase === "center") {
      setTimeout(() => setPhase("moveToCorner"), 1200);
    } else if (phase === "moveToCorner") {
      setTimeout(() => setPhase("idle"), 1200);
    } else if (phase === "idle") {
      setTimeout(() => setFadeOut(true), 800);
      setTimeout(() => onFinish(), 1800);
    }
    // eslint-disable-next-line
  }, [phase]);

  // Rotación continua
  useEffect(() => {
    if (phase !== "idle") {
      const interval = setInterval(() => {
        setRotation((r) => (r + 2) % 360);
      }, 16);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Captura de puntos: el círculo se mueve por varias posiciones, "capturando" puntos cercanos
  function capturePoints() {
    const steps = 6;
    const positions = [
      ...Array(steps).fill(0).map((_) => {
        // Elegir un punto no capturado aleatorio
        const uncaptured = points.filter((p) => !p.captured);
        if (uncaptured.length === 0) return null;
        const idx = Math.floor(Math.random() * uncaptured.length);
        return { x: uncaptured[idx].x, y: uncaptured[idx].y };
      }),
      // Al final, volver al centro
      { x: window.innerWidth / 2 - CIRCLE_RADIUS, y: window.innerHeight / 2 - CIRCLE_RADIUS },
    ].filter(Boolean);

    let i = 0;
    function next() {
      if (i < positions.length) {
        setCirclePos(positions[i]!);
        // Capturar puntos cercanos
        setPoints((prev) =>
          prev.map((p) => {
            if (!p.captured) {
              const dx = p.x - positions[i]!.x;
              const dy = p.y - positions[i]!.y;
              if (Math.sqrt(dx * dx + dy * dy) < 80) {
                return { ...p, captured: true };
              }
            }
            return p;
          })
        );
        // Hacer crecer el círculo suavemente
        setCircleSize((size) => Math.min(size + 18, 220));
        i++;
        setTimeout(next, 600);
      } else {
        setTimeout(() => setPhase("center"), 700);
      }
    }
    next();
  }

  // Cuando el círculo vuelve al centro, lo hacemos esperar y luego moverse a la esquina
  useEffect(() => {
    if (phase === "center") {
      setCirclePos({
        x: window.innerWidth / 2 - circleSize / 2,
        y: window.innerHeight / 2 - circleSize / 2,
      });
    }
    if (phase === "moveToCorner") {
      setCirclePos({ x: -circleSize * 0.4, y: -circleSize * 0.4 });
    }
    // eslint-disable-next-line
  }, [phase, circleSize]);

  // El círculo sigue rotando en todas las fases
  const borderRadiusKeyframes = [
    "58% 42% 47% 53% / 50% 60% 40% 45%",
    "65% 35% 60% 40% / 70% 60% 45% 50%",
    "60% 40% 48% 52% / 55% 65% 45% 50%",
    "58% 42% 47% 53% / 50% 60% 40% 45%",
  ];

  return (
    <motion.div
      className="w-screen h-screen bg-[#FFEDEA] overflow-hidden relative"
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Puntos */}
      {(phase === "explode" || phase === "capture" || phase === "center" || phase === "moveToCorner") &&
        points.map((p, i) =>
          !p.captured ? (
            <motion.div
              key={i}
              className="absolute bg-[#C62828]"
              style={{
                width: 16,
                height: 16,
                top: p.y,
                left: p.x,
                borderRadius: "50%",
                filter: "blur(1.5px)",
                zIndex: 1,
              }}
              initial={phase === "explode" ? {
                top: window.innerHeight / 2 - 8,
                left: window.innerWidth / 2 - 8,
                opacity: 1,
              } : false}
              animate={{
                top: p.y,
                left: p.x,
                opacity: 1,
                scale: 1,
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          ) : null
        )}

      {/* Círculo animado principal */}
      <motion.div
        className="absolute bg-[#C62828] shadow-lg"
        animate={{
          top: circlePos.y,
          left: circlePos.x,
          width: circleSize,
          height: circleSize,
          borderRadius: borderRadiusKeyframes,
          rotate: rotation,
        }}
        transition={{
          top: { duration: 0.7, ease: "easeInOut" },
          left: { duration: 0.7, ease: "easeInOut" },
          width: { duration: 0.7, ease: "easeInOut" },
          height: { duration: 0.7, ease: "easeInOut" },
          borderRadius: { duration: 2, ease: "easeInOut" },
          rotate: { duration: 2, ease: "linear" },
        }}
        style={{
          zIndex: 2,
          filter: "blur(2px)",
        }}
      />

      {/* Menú solo en fase idle y en la esquina */}
      <AnimatePresence>
        {phase === "idle" && !fadeOut && (
          <motion.div
            className="absolute top-12 left-10 z-10 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <button className="text-[#C62828] mb-2">
              <ChevronUp size={24} />
            </button>
            <div className="relative w-[200px] h-[200px]">
              {["Iniciar sesión", "Registro", "Acerca de"].map((option, i) => {
                const angle = (-60 + i * 60) * (Math.PI / 180);
                const radius = 90;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                return (
                  <motion.div
                    key={option}
                    className="absolute bg-white text-[#C62828] text-sm font-serif px-4 py-1 rounded-full shadow"
                    style={{
                      top: `calc(50% + ${y}px - 20px)`,
                      left: `calc(50% + ${x}px - 50px)`
                    }}
                  >
                    {option}
                  </motion.div>
                );
              })}
            </div>
            <button className="text-[#C62828] mt-2">
              <ChevronDown size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 