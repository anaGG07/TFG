// ! 08/06/2025 - Actualizado para usar datos correctos del ciclo
import * as React from "react";
import { useEffect, useState } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useCycle } from "../../context/CycleContext";
import { useCurrentCycle } from "../../hooks/useCurrentCycle";
import { ContentType, CyclePhase, Content } from "../../types/domain";
import {
  COLORS,
  MOODS,
  SYMPTOM_OPTIONS,
  CYCLE_DAYS,
  getPregnancyProbability,
} from "../../constants/cycle";
import { MoodIcons, SymptomIcons } from "../icons/CycleIcons";
import { useViewport } from "../../hooks/useViewport";

interface CycleVisualProps {
  expanded?: boolean;
  onMoodColorChange?: (color: string) => void;
}

const CycleVisual: React.FC<CycleVisualProps> = ({
  expanded = true,
  onMoodColorChange,
}) => {
  const { calendarDays, getRecommendations, addCycleDay, currentCycle } =
    useCycle();
  const { isMobile, isTablet, isDesktop } = useViewport();

  // ! 08/06/2025 - Usar datos correctos del hook useCurrentCycle
  const {
    currentDay: correctDay,
    currentPhase: correctPhase,
    phaseName,
    phaseDescription,
    isLoading: cycleLoading,
    error: cycleError,
  } = useCurrentCycle();

  // Usar datos corregidos en lugar de los antiguos
  const today = new Date().toISOString().split("T")[0];
  const todayData = calendarDays.find((day) => day.date === today);
  const day = correctDay; // ✅ Ahora usa el día correcto
  const phase = correctPhase as CyclePhase; // ✅ Ahora usa la fase correcta
  const menstruationDay = phase === CyclePhase.MENSTRUAL ? day : undefined;
  const menstruationLength = phase === CyclePhase.MENSTRUAL ? 5 : undefined;

  // Estado para recomendaciones
  const [recipe, setRecipe] = useState<Content | null>(null);
  const [exercise, setExercise] = useState<Content | null>(null);
  const [phrase, setPhrase] = useState<Content | null>(null);
  // Estado para mood
  const [selectedMood, setSelectedMood] = useState<string>(
    todayData?.mood?.[0] || ""
  );
  const [saving, setSaving] = useState(false);

  // Obtener recomendaciones al cargar
  useEffect(() => {
    if (!expanded) return;
    const fetchRecs = async () => {
      const recs = await getRecommendations();
      setRecipe(
        recs.find(
          (r: Content) =>
            r.type === ContentType.NUTRITION && r.targetPhase === phase
        ) || null
      );
      setExercise(
        recs.find(
          (r: Content) =>
            r.type === ContentType.EXERCISE && r.targetPhase === phase
        ) || null
      );
      setPhrase(
        recs.find(
          (r: Content) =>
            r.type === ContentType.RECOMMENDATION && r.targetPhase === phase
        ) || null
      );
    };
    fetchRecs();
  }, [getRecommendations, phase, expanded]);

  // Guardar estado de ánimo
  const handleMoodSelect = async (mood: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMood(mood);
    if (!todayData) return;
    setSaving(true);
    await addCycleDay({
      ...todayData,
      mood: [mood],
      notes: Array.isArray(todayData.notes)
        ? todayData.notes.join(" | ")
        : todayData.notes || "",
    });
    setSaving(false);
  };

  // Calcular ángulo del marcador
  const angle = ((day - 1) / CYCLE_DAYS) * 360;
  const r = expanded ? 110 : 60;
  const cx = expanded ? 150 : 80;
  const cy = expanded ? 150 : 80;
  const markerX = cx + r * Math.sin((angle * Math.PI) / 180);
  const markerY = cy - r * Math.cos((angle * Math.PI) / 180);
  const pregnancy = getPregnancyProbability(phase);

  // Color de fondo según emoción
  const moodObj = MOODS.find((m) => m.value === selectedMood);
  const moodColor = moodObj ? moodObj.color : "transparent";

  // Llamar a onMoodColorChange cuando cambie el color
  useEffect(() => {
    if (onMoodColorChange) onMoodColorChange(moodColor);
  }, [moodColor, onMoodColorChange]);

  // --- VISTA EXPANDIDA RESPONSIVE ---
  const CYCLE_DAYS_DYNAMIC =
    (currentCycle?.phases && Object.keys(currentCycle.phases).length) ||
    CYCLE_DAYS ||
    30;
  const SVG_SIZE = isMobile ? 360 : isTablet ? 440 : 520;
  const CIRCLE_RADIUS = isMobile ? 120 : isTablet ? 150 : 180;
  const CENTER = SVG_SIZE / 2;
  const angleStep = (2 * Math.PI) / CYCLE_DAYS_DYNAMIC;
  const dayIndex = (day - 1) % CYCLE_DAYS_DYNAMIC;
  const ovoAngle = -Math.PI / 2 + angleStep * dayIndex; // Día 1 arriba (12h), sentido horario
  const OVO_POS = {
    x: CENTER + CIRCLE_RADIUS * Math.cos(ovoAngle),
    y: CENTER + CIRCLE_RADIUS * Math.sin(ovoAngle),
  };
  const CIRCLE_LENGTH = 2 * Math.PI * CIRCLE_RADIUS;

  const progressRatio = (dayIndex + 1) / CYCLE_DAYS_DYNAMIC;
  const progressLength = CIRCLE_LENGTH * progressRatio;

  // ! 08/06/2025 - Estados de carga y error para datos correctos
  if (cycleLoading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          padding: isMobile ? 16 : 24,
          minHeight: "auto",
        }}
      >
        <img
          src="/img/UteroRojo.svg"
          alt="Cargando ciclo"
          style={{
            width: isMobile ? 240 : isTablet ? 280 : 320,
            height: isMobile ? 165 : isTablet ? 192 : 220,
            opacity: 0.5,
            objectFit: "contain",
          }}
        />
        <p
          style={{ fontSize: isMobile ? 12 : 14, color: "#666", marginTop: 8 }}
        >
          Cargando...
        </p>
      </div>
    );
  }

  if (cycleError) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          padding: isMobile ? 16 : 24,
          minHeight: "auto",
        }}
      >
        <img
          src="/img/UteroRojo.svg"
          alt="Error"
          style={{
            width: isMobile ? 240 : isTablet ? 280 : 320,
            height: isMobile ? 165 : isTablet ? 192 : 220,
            opacity: 0.3,
            objectFit: "contain",
          }}
        />
        <p
          style={{
            fontSize: isMobile ? 12 : 14,
            color: "#C62328",
            marginTop: 8,
          }}
        >
          Error al cargar
        </p>
      </div>
    );
  }

  if (!expanded) {
    // Vista miniatura: solo SVG del útero, adaptado al tamaño
    const uterusSize = isMobile
      ? { width: 240, height: 165 }
      : isTablet
      ? { width: 280, height: 192 }
      : { width: 320, height: 220 };

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          padding: isMobile ? 16 : 24,
          minHeight: "auto",
        }}
      >
        <img
          src="/img/UteroRojo.svg"
          alt="Útero central del ciclo"
          style={{
            width: uterusSize.width,
            height: uterusSize.height,
            opacity: 0.97,
            objectFit: "contain",
          }}
        />
        {/* ! 08/06/2025 - Información superpuesta con datos correctos */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            top: "20%",
          }}
        >
          <h1
            style={{
              fontSize: isMobile ? 32 : 40,
              fontWeight: "bold",
              color: "white",
              marginBottom: 4,
            }}
          >
            Día {day}
          </h1>
          <p
            style={{
              color: "white",
              fontSize: isMobile ? 16 : 20,
              opacity: 0.9,
            }}
          >
            {phaseName}
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1, background: "transparent" }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "stretch",
        background: "transparent",
        borderRadius: 24,
        boxShadow: "none",
        padding: 0,
        minHeight: isMobile ? 360 : isTablet ? 400 : 420,
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto",
        overflow: "hidden",
        gap: isMobile ? 16 : 0,
      }}
    >
      {/* Columna Izquierda/Superior: SVG grande y progress ring */}
      <div
        style={{
          flexBasis: isMobile ? "auto" : "40%",
          flexGrow: 0,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: "transparent",
          zIndex: 1,
          padding: 0,
          minHeight: isMobile ? 240 : isTablet ? 320 : 420,
        }}
      >
        <div
          style={{
            position: "relative",
            width: SVG_SIZE,
            height: SVG_SIZE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: isMobile
              ? "scale(0.8)"
              : isTablet
              ? "scale(0.9)"
              : "scale(1)",
          }}
        >
          {/* SVG útero grande y centrado */}
          <img
            src="/img/UteroRojo.svg"
            alt="Útero central del ciclo"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: isMobile ? 200 : isTablet ? 240 : 286,
              height: isMobile ? 136 : isTablet ? 163 : 195,
              zIndex: 2,
              opacity: 0.97,
            }}
          />
          {/* Progress ring */}
          <svg
            width={SVG_SIZE}
            height={SVG_SIZE}
            style={{ position: "absolute", left: 0, top: 0, zIndex: 1 }}
          >
            <defs>
              <linearGradient
                id="progress-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#C62328" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#C62328" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            {/* Fondo del círculo */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={CIRCLE_RADIUS}
              fill="none"
              stroke="#C6232822"
              strokeWidth={10}
            />
            {/* Progreso del ciclo */}
            <motion.circle
              cx={CENTER}
              cy={CENTER}
              r={CIRCLE_RADIUS}
              fill="none"
              stroke="#C62328"
              strokeWidth={12}
              strokeDasharray={CIRCLE_LENGTH}
              strokeDashoffset={CIRCLE_LENGTH - progressLength}
              strokeLinecap="round"
              initial={false}
              animate={{ strokeDashoffset: CIRCLE_LENGTH - progressLength }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              style={{}}
            />
            {/* Divisiones de días */}
            {Array.from({ length: CYCLE_DAYS_DYNAMIC }).map((_, i) => {
              const a = -Math.PI / 2 + angleStep * i;
              const x1 = CENTER + (CIRCLE_RADIUS - 8) * Math.cos(a);
              const y1 = CENTER + (CIRCLE_RADIUS - 8) * Math.sin(a);
              const x2 = CENTER + (CIRCLE_RADIUS + 8) * Math.cos(a);
              const y2 = CENTER + (CIRCLE_RADIUS + 8) * Math.sin(a);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#C62328"
                  strokeWidth={i === dayIndex ? (isMobile ? 3 : 4) : 2}
                  opacity={i === dayIndex ? 0.7 : 0.18}
                />
              );
            })}
          </svg>
          {/* Óvulo marcador */}
          <div
            style={{
              position: "absolute",
              left: OVO_POS.x,
              top: OVO_POS.y,
              transform: "translate(-50%, -50%)",
              zIndex: 3,
            }}
          >
            <div
              style={{
                width: isMobile ? 32 : isTablet ? 36 : 40,
                height: isMobile ? 32 : isTablet ? 36 : 40,
                borderRadius: "50%",
                background: COLORS.marker,
                border: `${isMobile ? 3 : 4}px solid #fff`,
                boxShadow: "0 2px 16px 0 #E5737355",
                zIndex: 3,
              }}
            />
          </div>
        </div>
      </div>
      {/* Columna Derecha/Inferior: Info y recomendaciones */}
      <div
        style={{
          flexBasis: isMobile ? "auto" : "60%",
          flexGrow: 1,
          flexShrink: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
          padding: isMobile
            ? "16px 12px 12px 12px"
            : isTablet
            ? "24px 20px 20px 20px"
            : "32px 24px 24px 24px",
          background: "transparent",
          zIndex: 2,
          minWidth: 0,
          maxWidth: "100%",
          gap: isMobile ? 12 : 16,
        }}
      >
        {/* Día, fase, probabilidad */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            marginBottom: isMobile ? 8 : 12,
            gap: isMobile ? 2 : 4,
          }}
        >
          {/* ! 08/06/2025 - Usar datos correctos del ciclo */}
          <div
            style={{
              fontSize: isMobile ? 28 : isTablet ? 32 : 38,
              fontWeight: 900,
              color: COLORS.text,
              letterSpacing: 0.2,
              lineHeight: 1,
            }}
          >
            Día {day}
          </div>
          <div
            style={{
              fontSize: isMobile ? 16 : isTablet ? 18 : 20,
              fontWeight: 700,
              color: "#C62328",
              marginBottom: 2,
              letterSpacing: 0.5,
            }}
          >
            {phaseName}
          </div>
          <div
            style={{
              fontSize: isMobile ? 12 : isTablet ? 13 : 15,
              color: pregnancy.color,
              fontWeight: 600,
              marginTop: 2,
            }}
          >
            Probabilidad de embarazo:{" "}
            <span style={{ fontWeight: 700 }}>{pregnancy.text}</span>
          </div>
        </div>
        {/* Estado de ánimo */}
        <div
          style={{
            marginBottom: 0,
            background: "transparent",
            borderRadius: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: isMobile ? 6 : 8,
          }}
        >
          <div
            style={{
              fontWeight: 600,
              color: "#C62328",
              marginBottom: 2,
              fontSize: isMobile ? 13 : 15,
            }}
          >
            ¿Cómo te sientes hoy?
          </div>
          <div
            style={{
              display: "flex",
              gap: isMobile ? 8 : 12,
              marginTop: 2,
              flexWrap: "wrap",
            }}
          >
            {MOODS.map((mood) => {
              const isSelected = selectedMood === mood.value;
              return (
                <motion.button
                  key={mood.value}
                  onClick={(e) => handleMoodSelect(mood.value, e)}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    padding: 0,
                    margin: 0,
                  }}
                  disabled={saving}
                  aria-label={mood.label}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div
                    style={{
                      width: isMobile ? 28 : 32,
                      height: isMobile ? 28 : 32,
                      borderRadius: "50%",
                      background: isSelected ? mood.color : "#f3e6e6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.2s",
                      boxShadow: isSelected
                        ? `0 0 0 2px ${mood.intenseColor}55`
                        : "none",
                    }}
                  >
                    {MoodIcons[mood.value](mood.intenseColor)}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
        {/* Recomendaciones y frase */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 16 : 28,
            background: "transparent",
            borderRadius: 0,
            padding: 0,
            marginTop: isMobile ? 4 : 8,
          }}
        >
          {/* Receta */}
          <div>
            <div
              style={{
                fontWeight: 600,
                color: "#C62328",
                marginBottom: 2,
                fontSize: isMobile ? 12 : 14,
              }}
            >
              {recipe ? recipe.title : "Receta recomendada"}
            </div>
            <div
              style={{
                color: "#444",
                fontWeight: 500,
                fontSize: isMobile ? 11 : 13,
                marginBottom: 4,
                lineHeight: 1.4,
              }}
            >
              {recipe ? recipe.summary : "No hay receta para hoy."}
            </div>
          </div>
          {/* Ejercicio */}
          <div>
            <div
              style={{
                fontWeight: 600,
                color: "#C62328",
                marginBottom: 2,
                fontSize: isMobile ? 12 : 14,
              }}
            >
              {exercise ? exercise.title : "Ejercicio recomendado"}
            </div>
            <div
              style={{
                color: "#444",
                fontWeight: 500,
                fontSize: isMobile ? 11 : 13,
                marginBottom: 4,
                lineHeight: 1.4,
              }}
            >
              {exercise ? exercise.summary : "No hay ejercicio para hoy."}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CycleVisual;
