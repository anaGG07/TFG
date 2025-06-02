import * as React from 'react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCycle } from '../../context/CycleContext';
import { ContentType, CyclePhase, Content } from '../../types/domain';

// Paleta de colores inspirada en la imagen de referencia
const COLORS = {
  background: '#FCE9E6',
  circle: '#F8D9D6',
  phaseMenstrual: '#222',
  phaseFolicular: '#E6B7C1',
  phaseOvulatory: '#FFF',
  phaseLuteal: '#B7C1E6',
  marker: '#E57373',
  text: '#222',
  feliz: '#FFE6A7',
  cansada: '#D6E6F8',
  irritable: '#FFD6D6',
  triste: '#D6D6F8',
  motivada: '#D6F8E6',
};

// Fases del ciclo
const PHASES = [
  { name: 'Menstrual', color: COLORS.phaseMenstrual },
  { name: 'Folicular', color: COLORS.phaseFolicular },
  { name: 'Ovulatoria', color: COLORS.phaseOvulatory },
  { name: 'Lútea', color: COLORS.phaseLuteal },
];

const CYCLE_DAYS = 28;

// Iconos SVG para emociones (estilo CircularNavigation)
const MoodIcons: Record<string, (color: string) => React.ReactElement> = {
  feliz: (color) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13" />
      <path d="M11 20c1.5 2 7.5 2 9 0" />
      <circle cx="12" cy="14" r="1.2" fill={color} />
      <circle cx="20" cy="14" r="1.2" fill={color} />
    </svg>
  ),
  cansada: (color) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13" />
      <path d="M11 22c2-2 8-2 10 0" />
      <path d="M12 14l2 2m0-2l-2 2" />
      <path d="M20 14l2 2m0-2l-2 2" />
    </svg>
  ),
  irritable: (color) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13" />
      <path d="M11 22c2-2 8-2 10 0" />
      <path d="M12 14c0-1 2-1 2 0" />
      <path d="M20 14c0-1 2-1 2 0" />
    </svg>
  ),
  triste: (color) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13" />
      <path d="M11 22c1.5-2 7.5-2 9 0" />
      <path d="M12 14c0-1 2-1 2 0" />
      <path d="M20 14c0-1 2-1 2 0" />
    </svg>
  ),
  motivada: (color) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13" />
      <path d="M10 20c2-4 10-4 12 0" />
      <path d="M16 12v6" />
      <path d="M16 12l-2 2" />
      <path d="M16 12l2 2" />
    </svg>
  ),
};

// Iconos SVG para síntomas (estilo lineal)
const SymptomIcons: Record<string, (color: string) => React.ReactElement> = {
  'Dolor abdominal': (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="8" ry="6" /><path d="M8 12c1-2 7-2 8 0" /></svg>
  ),
  'Fatiga': (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="8" rx="4" /><path d="M8 14h8" /></svg>
  ),
  'Dolor de cabeza': (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8" /><path d="M12 8v4l2 2" /></svg>
  ),
  'Hinchazón': (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="14" rx="7" ry="4" /><ellipse cx="12" cy="10" rx="4" ry="2" /></svg>
  ),
  'Náuseas': (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8" /><path d="M8 16c2-2 6-2 8 0" /><path d="M10 10h.01" /><path d="M14 10h.01" /></svg>
  ),
  'Sensibilidad en senos': (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="8" cy="14" rx="3" ry="2" /><ellipse cx="16" cy="14" rx="3" ry="2" /><path d="M8 14v2" /><path d="M16 14v2" /></svg>
  ),
  'Cambios de humor': (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8" /><path d="M8 16c1.5-2 6.5-2 8 0" /><path d="M10 10h.01" /><path d="M14 10h.01" /></svg>
  ),
};

const MOODS = [
  { value: 'feliz', label: 'Feliz', color: '#FFE6A7' },
  { value: 'tranquila', label: 'Tranquila', color: '#D6E6F8' },
  { value: 'motivada', label: 'Motivada', color: '#D6F8E6' },
  { value: 'sensible', label: 'Sensible', color: '#D6D6F8' },
  { value: 'irritable', label: 'Irritable', color: '#FFD6D6' },
];

const SYMPTOM_OPTIONS = [
  'Dolor abdominal',
  'Fatiga',
  'Dolor de cabeza',
  'Hinchazón',
  'Náuseas',
  'Sensibilidad en senos',
  'Cambios de humor',
];

function getPregnancyProbability(phase: string) {
  switch (phase) {
    case CyclePhase.OVULACION:
      return { text: 'Alta', color: '#E57373' };
    case CyclePhase.FOLICULAR:
      return { text: 'Media', color: '#E6B7C1' };
    case CyclePhase.LUTEA:
      return { text: 'Baja', color: '#B7C1E6' };
    case CyclePhase.MENSTRUAL:
    default:
      return { text: 'Muy baja', color: '#222' };
  }
}

interface CycleVisualProps {
  expanded?: boolean;
  onMoodColorChange?: (color: string) => void;
}

const CycleVisual: React.FC<CycleVisualProps> = ({ expanded = true, onMoodColorChange }) => {
  const { calendarDays, getRecommendations, addCycleDay } = useCycle();
  const today = new Date().toISOString().split('T')[0];
  const todayData = calendarDays.find(day => day.date === today);
  const day = todayData?.dayNumber || 1;
  const phase = todayData?.phase || CyclePhase.MENSTRUAL;
  const menstruationDay = phase === CyclePhase.MENSTRUAL ? day : undefined;
  const menstruationLength = phase === CyclePhase.MENSTRUAL ? 5 : undefined; // Ajusta según tus datos

  // Estado para recomendaciones
  const [recipe, setRecipe] = useState<Content | null>(null);
  const [exercise, setExercise] = useState<Content | null>(null);
  const [phrase, setPhrase] = useState<Content | null>(null);
  // Estado para mood y síntomas
  const [selectedMood, setSelectedMood] = useState<string>(todayData?.mood?.[0] || '');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(todayData?.symptoms || []);
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
      symptoms: selectedSymptoms,
      notes: Array.isArray(todayData.notes) ? todayData.notes.join(' | ') : todayData.notes || '',
    });
    setSaving(false);
  };

  // Guardar síntomas
  const handleSymptomToggle = async (symptom: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let newSymptoms;
    if (selectedSymptoms.includes(symptom)) {
      newSymptoms = selectedSymptoms.filter(s => s !== symptom);
    } else {
      newSymptoms = [...selectedSymptoms, symptom];
    }
    setSelectedSymptoms(newSymptoms);
    if (!todayData) return;
    setSaving(true);
    await addCycleDay({
      ...todayData,
      mood: [selectedMood],
      symptoms: newSymptoms,
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
  const moodIntense = moodObj ? {
    feliz: '#E6B800',
    tranquila: '#3A7CA5',
    motivada: '#1DB954',
    sensible: '#6C63FF',
    irritable: '#C62328',
  }[selectedMood] : '#C62328';

  // Llamar a onMoodColorChange cuando cambie el color
  useEffect(() => {
    if (onMoodColorChange) onMoodColorChange(moodColor);
  }, [moodColor, onMoodColorChange]);

  // --- RESUMEN (no expandido) ---
  if (!expanded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          borderRadius: 18,
          padding: 32,
          minHeight: 180,
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* SVG de útero grande y centrado de fondo */}
        <img src="/img/UteroRojo.svg" alt="Útero fondo" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 140, height: 100, opacity: 0.13, zIndex: 0, pointerEvents: 'none' }} />
        {/* Texto centrado encima */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: COLORS.text, letterSpacing: 0.2, marginBottom: 0 }}>
            Día {day}
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#C62328', marginBottom: 2 }}>
            {phase.charAt(0).toUpperCase() + phase.slice(1)}
          </div>
          {menstruationDay && menstruationLength && (
            <div style={{ fontSize: 13.5, color: COLORS.text, marginTop: 2, opacity: 0.85 }}>
              Día {menstruationDay} de {menstruationLength} de menstruación
            </div>
          )}
          <div style={{ fontSize: 13.5, color: pregnancy.color, marginTop: 2, fontWeight: 600 }}>
            Embarazo: <span style={{ fontWeight: 700 }}>{pregnancy.text}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // --- VISTA EXPANDIDA ---
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1, background: moodColor }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        background: moodColor,
        borderRadius: 24,
        boxShadow: 'none',
        padding: 0,
        minHeight: 480,
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      {/* Columna 1: SVG útero + óvulo animado + resumen */}
      <div style={{
        flex: '0 0 36%',
        minWidth: 380,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        padding: '64px 0 48px 32px',
        height: '100%',
      }}>
        {/* SVG útero grande y centrado */}
        <div style={{ position: 'relative', width: 240, height: 240, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/img/UteroRojo.svg" alt="Útero central del ciclo" style={{ position: 'absolute', left: '50%', top: 24, transform: 'translateX(-50%)', width: 140, height: 90, zIndex: 2, display: 'block' }} />
          {/* Círculo base */}
          <svg width={240} height={180} style={{ position: 'absolute', left: 0, top: 0, zIndex: 1, pointerEvents: 'none' }}>
            <circle cx={120} cy={100} r={90} fill="none" stroke="#E6B7C1" strokeWidth={2} />
          </svg>
          {/* Óvulo con animación de pulso */}
          <motion.div
            style={{ position: 'absolute', left: '50%', top: 100, transform: 'translate(-50%, -50%)', zIndex: 3 }}
          >
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#E57373',
                filter: 'blur(2px)',
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
              }}
            />
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: COLORS.marker,
                border: '3px solid #fff',
                boxShadow: '0 2px 12px 0 #E5737355',
                zIndex: 3,
              }}
            />
          </motion.div>
        </div>
        {/* Resumen debajo, bien separado */}
        <div style={{ marginTop: 80, textAlign: 'center', zIndex: 2, width: '100%' }}>
          <div style={{ fontSize: 54, fontWeight: 900, color: COLORS.text, letterSpacing: 0.2, marginBottom: 0 }}>
            {day}
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#C62328', marginBottom: 2 }}>
            {phase.charAt(0).toUpperCase() + phase.slice(1)}
          </div>
          <div style={{ fontSize: 17, color: pregnancy.color, marginTop: 8, fontWeight: 600 }}>
            Probabilidad de embarazo: <span style={{ fontWeight: 700 }}>{pregnancy.text}</span>
          </div>
        </div>
      </div>
      {/* Columna 2: Receta, Ejercicio, Frase */}
      <div style={{
        flex: '0 0 28%',
        minWidth: 260,
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        justifyContent: 'center',
        alignItems: 'stretch',
        padding: '48px 12px 48px 12px',
      }}>
        {/* Receta */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          style={{ background: 'transparent', borderRadius: 0, padding: 0, marginBottom: 0, boxShadow: 'none' }}
        >
          <div style={{ fontWeight: 600, color: '#C62328', marginBottom: 4 }}>Receta recomendada</div>
          {recipe ? (
            <div>
              <div style={{ fontWeight: 500 }}>{recipe.title}</div>
              <div style={{ fontSize: 13, color: '#444' }}>{recipe.summary}</div>
            </div>
          ) : (
            <div style={{ color: '#888' }}>No hay receta para hoy.</div>
          )}
        </motion.div>
        {/* Ejercicio */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={{ background: 'transparent', borderRadius: 0, padding: 0, marginBottom: 0, boxShadow: 'none' }}
        >
          <div style={{ fontWeight: 600, color: '#C62328', marginBottom: 4 }}>Ejercicio recomendado</div>
          {exercise ? (
            <div>
              <div style={{ fontWeight: 500 }}>{exercise.title}</div>
              <div style={{ fontSize: 13, color: '#444' }}>{exercise.summary}</div>
            </div>
          ) : (
            <div style={{ color: '#888' }}>No hay ejercicio para hoy.</div>
          )}
        </motion.div>
        {/* Frase de ánimo/conocimiento */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          style={{ background: 'transparent', borderRadius: 0, padding: 0, marginBottom: 0, boxShadow: 'none' }}
        >
          <div style={{ fontWeight: 600, color: '#C62328', marginBottom: 4 }}>Frase para hoy</div>
          {phrase ? (
            <div style={{ fontSize: 15, color: '#444' }}>{phrase.summary}</div>
          ) : (
            <div style={{ color: '#888' }}>No hay frase para hoy.</div>
          )}
        </motion.div>
      </div>
      {/* Columna 3: Síntomas (arriba, más espacio), Moods (debajo) */}
      <div style={{
        flex: '1 1 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        justifyContent: 'center',
        alignItems: 'stretch',
        padding: '48px 32px 48px 12px',
        overflow: 'hidden',
      }}>
        {/* Síntomas */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          style={{ background: 'transparent', borderRadius: 0, padding: 0, boxShadow: 'none', marginBottom: 0 }}
        >
          <div style={{ fontWeight: 600, color: '#C62328', marginBottom: 8 }}>Síntomas</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
            {SYMPTOM_OPTIONS.map(symptom => {
              // Color pastel e intenso para cada icono
              const pastel = '#F8D9D6';
              const intenso = '#C62328';
              const isSelected = selectedSymptoms.includes(symptom);
              return (
                <motion.button
                  key={symptom}
                  onClick={e => handleSymptomToggle(symptom, e)}
                  style={{
                    display: 'flex', alignItems: 'center', border: isSelected ? `2px solid ${intenso}` : 'none', background: 'none', cursor: 'pointer', padding: 0, margin: 0,
                  }}
                  disabled={saving}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: isSelected ? '#F8B7B7' : pastel, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s, border 0.2s' }}>
                    {SymptomIcons[symptom](intenso)}
                  </div>
                  <span style={{ marginLeft: 8, color: '#222', fontSize: 14 }}>{symptom}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
        {/* Estado de ánimo */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          style={{ background: 'transparent', borderRadius: 0, padding: 0, boxShadow: 'none', marginBottom: 0 }}
        >
          <div style={{ fontWeight: 600, color: '#C62328', marginBottom: 8 }}>¿Cómo te sientes hoy?</div>
          <div style={{ display: 'flex', gap: 18, marginTop: 6 }}>
            {MOODS.map(mood => {
              // Color pastel e intenso para cada icono
              const pastel = mood.color;
              const intenso = {
                feliz: '#E6B800',
                cansada: '#3A7CA5',
                irritable: '#C62328',
                triste: '#6C63FF',
                motivada: '#1DB954',
              }[mood.value];
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
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: selectedMood === mood.value ? pastel : '#f3e6e6', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', boxShadow: selectedMood === mood.value ? `0 0 0 3px ${intenso}55` : 'none' }}>
                    {MoodIcons[mood.value](intenso || '#C62328')}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CycleVisual; 