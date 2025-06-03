import * as React from 'react';
import { useEffect, useState } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { useCycle } from '../../context/CycleContext';
import { ContentType, CyclePhase, Content } from '../../types/domain';
import { COLORS, MOODS, SYMPTOM_OPTIONS, CYCLE_DAYS, getPregnancyProbability } from '../../constants/cycle';
import { MoodIcons, SymptomIcons } from '../icons/CycleIcons';

interface CycleVisualProps {
  expanded?: boolean;
  onMoodColorChange?: (color: string) => void;
}

const CycleVisual: React.FC<CycleVisualProps> = ({ expanded = true, onMoodColorChange }) => {
  const { calendarDays, getRecommendations, addCycleDay, currentCycle } = useCycle();
  const today = new Date().toISOString().split('T')[0];
  const todayData = calendarDays.find(day => day.date === today);
  const day = todayData?.dayNumber || 1;
  const phase = todayData?.phase || CyclePhase.MENSTRUAL;
  const menstruationDay = phase === CyclePhase.MENSTRUAL ? day : undefined;
  const menstruationLength = phase === CyclePhase.MENSTRUAL ? 5 : undefined;

  // Estado para recomendaciones
  const [recipe, setRecipe] = useState<Content | null>(null);
  const [exercise, setExercise] = useState<Content | null>(null);
  const [phrase, setPhrase] = useState<Content | null>(null);
  // Estado para mood
  const [selectedMood, setSelectedMood] = useState<string>(todayData?.mood?.[0] || '');
  const [saving, setSaving] = useState(false);

  // Obtener recomendaciones al cargar
  useEffect(() => {
    if (!expanded) return;
    const fetchRecs = async () => {
      const recs = await getRecommendations();
      setRecipe(recs.find((r: Content) => r.type === ContentType.NUTRITION && r.targetPhase === phase) || null);
      setExercise(recs.find((r: Content) => r.type === ContentType.EXERCISE && r.targetPhase === phase) || null);
      setPhrase(recs.find((r: Content) => r.type === ContentType.RECOMMENDATION && r.targetPhase === phase) || null);
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
      notes: Array.isArray(todayData.notes) ? todayData.notes.join(' | ') : todayData.notes || '',
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
  const moodObj = MOODS.find(m => m.value === selectedMood);
  const moodColor = moodObj ? moodObj.color : 'transparent';


  // Llamar a onMoodColorChange cuando cambie el color
  useEffect(() => {
    if (onMoodColorChange) onMoodColorChange(moodColor);
  }, [moodColor, onMoodColorChange]);

  // --- VISTA EXPANDIDA ---
  const CYCLE_DAYS_DYNAMIC = (currentCycle?.phases && Object.keys(currentCycle.phases).length) || CYCLE_DAYS || 30;
  const SVG_SIZE = 520;
  const CIRCLE_RADIUS = 180;
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1, background: 'transparent' }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        background: 'transparent',
        borderRadius: 24,
        boxShadow: 'none',
        padding: 0,
        minHeight: 420,
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      {/* Columna Izquierda: SVG grande y progress ring */}
      <div style={{
        flexBasis: '40%',
        flexGrow: 0,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: 'transparent',
        zIndex: 1,
        padding: 0,
        minHeight: 420,
      }}>
        <div style={{ position: 'relative', width: SVG_SIZE, height: SVG_SIZE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* SVG útero grande y centrado */}
          <img src="/img/UteroRojo.svg" alt="Útero central del ciclo" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 220, height: 150, zIndex: 2, opacity: 0.97 }} />
          {/* Progress ring */}
          <svg width={SVG_SIZE} height={SVG_SIZE} style={{ position: 'absolute', left: 0, top: 0, zIndex: 1 }}>
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
              stroke="url(#progress-gradient)"
              strokeWidth={12}
              strokeDasharray={CIRCLE_LENGTH}
              strokeDashoffset={CIRCLE_LENGTH - progressLength}
              strokeLinecap="round"
              initial={false}
              animate={{ strokeDashoffset: CIRCLE_LENGTH - progressLength }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              style={{ filter: 'blur(1.2px)' }}
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
                  strokeWidth={i === dayIndex ? 4 : 2}
                  opacity={i === dayIndex ? 0.7 : 0.18}
                />
              );
            })}
          </svg>
          {/* Óvulo marcador */}
          <div
            style={{
              position: 'absolute',
              left: OVO_POS.x,
              top: OVO_POS.y,
              transform: 'translate(-50%, -50%)',
              zIndex: 3,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: COLORS.marker,
                border: '4px solid #fff',
                boxShadow: '0 2px 16px 0 #E5737355',
                zIndex: 3,
              }}
            />
          </div>
        </div>
      </div>
      {/* Columna Derecha: Info y recomendaciones */}
      <div style={{
        flexBasis: '60%',
        flexGrow: 1,
        flexShrink: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        padding: '32px 24px 24px 24px',
        background: 'transparent',
        zIndex: 2,
        minWidth: 0,
        maxWidth: '100%',
        gap: 16,
      }}>
        {/* Día, fase, probabilidad */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginBottom: 12,
          gap: 4,
        }}>
          <div style={{ fontSize: 38, fontWeight: 900, color: COLORS.text, letterSpacing: 0.2, lineHeight: 1 }}>
            Día {day}
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#C62328', marginBottom: 2, letterSpacing: 0.5 }}>
            {phase.charAt(0).toUpperCase() + phase.slice(1)}
          </div>
          <div style={{ fontSize: 15, color: pregnancy.color, fontWeight: 600, marginTop: 2 }}>
            Probabilidad de embarazo: <span style={{ fontWeight: 700 }}>{pregnancy.text}</span>
          </div>
        </div>
        {/* Estado de ánimo */}
        <div style={{
          marginBottom: 10,
          background: 'transparent',
          borderRadius: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 8,
        }}>
          <div style={{ fontWeight: 600, color: '#C62328', marginBottom: 2, fontSize: 15 }}>¿Cómo te sientes hoy?</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 2 }}>
            {MOODS.map(mood => {
              const isSelected = selectedMood === mood.value;
              return (
                <motion.button
                  key={mood.value}
                  onClick={e => handleMoodSelect(mood.value, e)}
                  style={{
                    border: 'none', background: 'none', cursor: 'pointer', padding: 0, margin: 0,
                  }}
                  disabled={saving}
                  aria-label={mood.label}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: isSelected ? mood.color : '#f3e6e6', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', boxShadow: isSelected ? `0 0 0 2px ${mood.intenseColor}55` : 'none' }}>
                    {MoodIcons[mood.value](mood.intenseColor)}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
        {/* Recomendaciones y frase */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          background: 'transparent',
          borderRadius: 0,
          padding: 0,
          marginTop: 'auto',
        }}>
          {/* Receta */}
          <div style={{ fontWeight: 600, color: '#C62328', marginBottom: 2, fontSize: 14 }}>
            {recipe ? recipe.title : 'Receta recomendada'}
          </div>
          <div style={{ color: '#444', fontWeight: 500, fontSize: 13, marginBottom: 4 }}>
            {recipe ? recipe.summary : 'No hay receta para hoy.'}
          </div>
          {/* Ejercicio */}
          <div style={{ fontWeight: 600, color: '#C62328', marginBottom: 2, fontSize: 14 }}>
            {exercise ? exercise.title : 'Ejercicio recomendado'}
          </div>
          <div style={{ color: '#444', fontWeight: 500, fontSize: 13, marginBottom: 4 }}>
            {exercise ? exercise.summary : 'No hay ejercicio para hoy.'}
          </div>
          {/* Frase de ánimo/conocimiento */}
          <div style={{ fontWeight: 600, color: '#C62328', marginBottom: 2, fontSize: 14 }}>
            {phrase ? phrase.title : 'Frase para hoy'}
          </div>
          <div style={{ color: '#888', fontSize: 13 }}>
            {phrase ? phrase.summary : 'No hay frase para hoy.'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CycleVisual; 