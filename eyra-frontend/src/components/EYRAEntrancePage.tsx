import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

interface EYRAEntrancePageProps {
  onFinish: () => void;
}

const POINTS = 20;
const CIRCLE_SIZE = 120;
const CIRCLE_RADIUS = CIRCLE_SIZE / 2;
const POINT_SIZE = 16;
const CAPTURE_RADIUS = 80;

// Generar posiciones aleatorias dentro del área visible
function getRandomPositions(count: number, margin: number) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * (window.innerWidth - margin * 2 - POINT_SIZE) + margin;
    const y = Math.random() * (window.innerHeight - margin * 2 - POINT_SIZE) + margin;
    positions.push({ x, y });
  }
  return positions;
}

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
  const [exploded, setExploded] = useState(false);
  const [pointTargets, setPointTargets] = useState<{ x: number; y: number }[]>([]);

  // Generar posiciones objetivo para los puntos al inicio
  useEffect(() => {
    setPointTargets(getRandomPositions(POINTS, 40));
    setPoints(
      Array.from({ length: POINTS }).map(() => ({
        x: window.innerWidth / 2 - POINT_SIZE / 2,
        y: window.innerHeight / 2 - POINT_SIZE / 2,
        captured: false,
      }))
    );
  }, []);

  // Secuencia de fases
  useEffect(() => {
    if (phase === "start") {
      setTimeout(() => setPhase("explode"), 1000);
    } else if (phase === "explode") {
      setExploded(true);
      setTimeout(() => setPhase("capture"), 1800);
    } else if (phase === "capture") {
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

  // Animar puntos desde el centro hacia sus posiciones objetivo
  useEffect(() => {
    if (exploded && pointTargets.length === POINTS) {
      setPoints((prev) =>
        prev.map((p, i) => ({ ...p, x: pointTargets[i].x, y: pointTargets[i].y }))
      );
    }
    // eslint-disable-next-line
  }, [exploded, pointTargets]);

  // Captura de puntos: el círculo se mueve suavemente por varias posiciones, "capturando" puntos cercanos
  async function capturePoints() {
    const uncapturedIndexes = () => points.map((p, i) => (!p.captured ? i : null)).filter((i) => i !== null) as number[];
    let currentSize = circleSize;
    for (let step = 0; step < 7; step++) {
      const uncaptured = uncapturedIndexes();
      if (uncaptured.length === 0) break;
      // Elegir un punto no capturado aleatorio
      const idx = uncaptured[Math.floor(Math.random() * uncaptured.length)];
      const target = points[idx];
      if (!target) continue;
      // Mover el círculo suavemente hacia el punto
      await new Promise((resolve) => {
        setCirclePos({ x: target.x - CIRCLE_RADIUS, y: target.y - CIRCLE_RADIUS });
        setTimeout(resolve, 1100);
      });
      // Capturar puntos cercanos
      setPoints((prev) =>
        prev.map((p) => {
          if (!p.captured) {
            const dx = p.x - (target.x);
            const dy = p.y - (target.y);
            if (Math.sqrt(dx * dx + dy * dy) < CAPTURE_RADIUS) {
              return { ...p, captured: true };
            }
          }
          return p;
        })
      );
      // Hacer crecer el círculo suavemente
      currentSize = Math.min(currentSize + 18, 220);
      setCircleSize(currentSize);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    // Volver al centro
    await new Promise((resolve) => {
      setCirclePos({
        x: window.innerWidth / 2 - currentSize / 2,
        y: window.innerHeight / 2 - currentSize / 2,
      });
      setTimeout(resolve, 1200);
    });
    setTimeout(() => setPhase("center"), 400);
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
                width: POINT_SIZE,
                height: POINT_SIZE,
                top: p.y,
                left: p.x,
                borderRadius: "50%",
                filter: "blur(1.5px)",
                zIndex: 1,
              }}
              initial={phase === "explode" ? {
                top: window.innerHeight / 2 - POINT_SIZE / 2,
                left: window.innerWidth / 2 - POINT_SIZE / 2,
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