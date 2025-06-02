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
const MoodIcons: Record<string, React.ReactElement> = {
  feliz: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13" />
      <path d="M11 20c1.5 2 7.5 2 9 0" />
      <circle cx="12" cy="14" r="1.2" fill="white" />
      <circle cx="20" cy="14" r="1.2" fill="white" />
    </svg>
  ),
  cansada: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13" />
      <path d="M11 22c2-2 8-2 10 0" />
      <path d="M12 14l2 2m0-2l-2 2" />
      <path d="M20 14l2 2m0-2l-2 2" />
    </svg>
  ),
  irritable: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13" />
      <path d="M11 22c2-2 8-2 10 0" />
      <path d="M12 14c0-1 2-1 2 0" />
      <path d="M20 14c0-1 2-1 2 0" />
    </svg>
  ),
  triste: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13" />
      <path d="M11 22c1.5-2 7.5-2 9 0" />
      <path d="M12 14c0-1 2-1 2 0" />
      <path d="M20 14c0-1 2-1 2 0" />
    </svg>
  ),
  motivada: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13" />
      <path d="M10 20c2-4 10-4 12 0" />
      <path d="M16 12v6" />
      <path d="M16 12l-2 2" />
      <path d="M16 12l2 2" />
    </svg>
  ),
};

// Iconos SVG para síntomas (estilo lineal)
const SymptomIcons: Record<string, React.ReactElement> = {
  'Dolor abdominal': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="8" ry="6" /><path d="M8 12c1-2 7-2 8 0" /></svg>
  ),
  'Fatiga': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="8" rx="4" /><path d="M8 14h8" /></svg>
  ),
  'Dolor de cabeza': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8" /><path d="M12 8v4l2 2" /></svg>
  ),
  'Hinchazón': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="14" rx="7" ry="4" /><ellipse cx="12" cy="10" rx="4" ry="2" /></svg>
  ),
  'Náuseas': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8" /><path d="M8 16c2-2 6-2 8 0" /><path d="M10 10h.01" /><path d="M14 10h.01" /></svg>
  ),
  'Sensibilidad en senos': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="8" cy="14" rx="3" ry="2" /><ellipse cx="16" cy="14" rx="3" ry="2" /><path d="M8 14v2" /><path d="M16 14v2" /></svg>
  ),
  'Cambios de humor': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8" /><path d="M8 16c1.5-2 6.5-2 8 0" /><path d="M10 10h.01" /><path d="M14 10h.01" /></svg>
  ),
};

const MOODS = [
  { value: 'feliz', label: 'Feliz', color: COLORS.feliz },
  { value: 'cansada', label: 'Cansada', color: COLORS.cansada },
  { value: 'irritable', label: 'Irritable', color: COLORS.irritable },
  { value: 'triste', label: 'Triste', color: COLORS.triste },
  { value: 'motivada', label: 'Motivada', color: COLORS.motivada },
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
}

const CycleVisual: React.FC<CycleVisualProps> = ({ expanded = true }) => {
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
  const moodColor = MOODS.find(m => m.value === selectedMood)?.color || 'rgba(255,255,255,0.15)';

  // --- RESUMEN (no expandido) ---
  if (!expanded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          background: 'transparent',
          borderRadius: 18,
          padding: 18,
          minHeight: 120,
          width: '100%',
          gap: 18,
          overflow: 'hidden',
        }}
      >
        <svg width={160} height={160}>
          <circle cx={cx} cy={cy} r={r} fill={COLORS.circle} stroke="#E6B7C1" strokeWidth={3} />
          {PHASES.map((p, i) => {
            const startAngle = (i * 360) / 4;
            const endAngle = ((i + 1) * 360) / 4;
            const largeArc = endAngle - startAngle > 180 ? 1 : 0;
            const x1 = cx + r * Math.sin((startAngle * Math.PI) / 180);
            const y1 = cy - r * Math.cos((startAngle * Math.PI) / 180);
            const x2 = cx + r * Math.sin((endAngle * Math.PI) / 180);
            const y2 = cy - r * Math.cos((endAngle * Math.PI) / 180);
            return (
              <path
                key={p.name}
                d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`}
                fill={p.color}
                opacity={0.13}
              />
            );
          })}
          <circle cx={markerX} cy={markerY} r={8} fill={COLORS.marker} stroke="#fff" strokeWidth={2} />
          <ellipse cx={cx} cy={cy} rx={22} ry={14} fill="#fff" stroke="#E6B7C1" strokeWidth={1.5} />
          <rect x={cx - 3} y={cy + 6} width={6} height={16} rx={3} fill="#fff" stroke="#E6B7C1" strokeWidth={1.5} />
        </svg>
        <div style={{ marginLeft: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>
            Día {day} - {phase.charAt(0).toUpperCase() + phase.slice(1)}
          </div>
          {menstruationDay && menstruationLength && (
            <div style={{ fontSize: 13, color: COLORS.text, marginTop: 2 }}>
              Día {menstruationDay} de {menstruationLength} de menstruación
            </div>
          )}
          <div style={{ fontSize: 13, color: pregnancy.color, marginTop: 2 }}>
            Embarazo: <b>{pregnancy.text}</b>
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
        boxShadow: '0 4px 24px #0001',
        padding: 0,
        minHeight: 360,
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      {/* Columna Izquierda: Gráfico y datos principales */}
      <div style={{
        flex: '0 0 38%',
        minWidth: 340,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 0 32px 32px',
      }}>
        <svg width={300} height={300}>
          <circle cx={cx} cy={cy} r={r} fill={COLORS.circle} stroke="#E6B7C1" strokeWidth={4} />
          {PHASES.map((p, i) => {
            const startAngle = (i * 360) / 4;
            const endAngle = ((i + 1) * 360) / 4;
            const largeArc = endAngle - startAngle > 180 ? 1 : 0;
            const x1 = cx + r * Math.sin((startAngle * Math.PI) / 180);
            const y1 = cy - r * Math.cos((startAngle * Math.PI) / 180);
            const x2 = cx + r * Math.sin((endAngle * Math.PI) / 180);
            const y2 = cy - r * Math.cos((endAngle * Math.PI) / 180);
            return (
              <path
                key={p.name}
                d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`}
                fill={p.color}
                opacity={0.13}
              />
            );
          })}
          <circle cx={markerX} cy={markerY} r={12} fill={COLORS.marker} stroke="#fff" strokeWidth={3} />
          <ellipse cx={cx} cy={cy} rx={38} ry={24} fill="#fff" stroke="#E6B7C1" strokeWidth={2} />
          <rect x={cx - 6} y={cy + 10} width={12} height={32} rx={6} fill="#fff" stroke="#E6B7C1" strokeWidth={2} />
        </svg>
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.text }}>
            Día {day} - {phase.charAt(0).toUpperCase() + phase.slice(1)}
          </div>
          {menstruationDay && menstruationLength && (
            <div style={{ fontSize: 16, color: COLORS.text, marginTop: 4 }}>
              Día {menstruationDay} de {menstruationLength} de menstruación
            </div>
          )}
          <div style={{ fontSize: 16, color: pregnancy.color, marginTop: 8 }}>
            Probabilidad de embarazo: <b>{pregnancy.text}</b>
          </div>
        </div>
      </div>
      {/* Columna Derecha: Recomendaciones, mood, síntomas */}
      <div style={{
        flex: '1 1 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        justifyContent: 'center',
        padding: '32px 32px 32px 0',
        overflow: 'hidden',
      }}>
        {/* Receta */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: 16, marginBottom: 8, boxShadow: '0 2px 8px #0001' }}
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
          style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: 16, marginBottom: 8, boxShadow: '0 2px 8px #0001' }}
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
          style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: 16, marginBottom: 8, boxShadow: '0 2px 8px #0001' }}
        >
          <div style={{ fontWeight: 600, color: '#C62328', marginBottom: 4 }}>Frase para hoy</div>
          {phrase ? (
            <div style={{ fontSize: 15, color: '#444' }}>{phrase.summary}</div>
          ) : (
            <div style={{ color: '#888' }}>No hay frase para hoy.</div>
          )}
        </motion.div>
        {/* Estado de ánimo */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: 16, marginBottom: 8, boxShadow: '0 2px 8px #0001' }}
        >
          <div style={{ fontWeight: 600, color: '#C62328', marginBottom: 4 }}>¿Cómo te sientes hoy?</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            {MOODS.map(mood => (
              <motion.button
                key={mood.value}
                onClick={e => handleMoodSelect(mood.value, e)}
                style={{
                  fontSize: 28,
                  background: selectedMood === mood.value ? mood.color : 'transparent',
                  border: selectedMood === mood.value ? '2px solid #C62328' : '2px solid transparent',
                  borderRadius: 10,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  padding: 4,
                }}
                disabled={saving}
                aria-label={mood.label}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
              >
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: selectedMood === mood.value ? mood.color : 'rgba(198,35,40,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                  {MoodIcons[mood.value]}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
        {/* Síntomas */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: 16, boxShadow: '0 2px 8px #0001' }}
        >
          <div style={{ fontWeight: 600, color: '#C62328', marginBottom: 4 }}>Síntomas</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SYMPTOM_OPTIONS.map(symptom => (
              <motion.button
                key={symptom}
                onClick={e => handleSymptomToggle(symptom, e)}
                style={{
                  fontSize: 14,
                  background: selectedSymptoms.includes(symptom) ? '#F8D9D6' : 'transparent',
                  border: selectedSymptoms.includes(symptom) ? '2px solid #C62328' : '2px solid #eee',
                  borderRadius: 8,
                  cursor: 'pointer',
                  padding: '4px 10px',
                  color: '#222',
                  transition: 'all 0.2s',
                }}
                disabled={saving}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: selectedSymptoms.includes(symptom) ? '#F8D9D6' : 'rgba(198,35,40,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                  {SymptomIcons[symptom]}
                </div>
                <span style={{ marginLeft: 6, color: '#222', fontSize: 13 }}>{symptom}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CycleVisual; 