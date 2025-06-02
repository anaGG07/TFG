import React, { useEffect, useState } from 'react';
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
};

// Fases del ciclo
const PHASES = [
  { name: 'Menstrual', color: COLORS.phaseMenstrual },
  { name: 'Folicular', color: COLORS.phaseFolicular },
  { name: 'Ovulatoria', color: COLORS.phaseOvulatory },
  { name: 'Lútea', color: COLORS.phaseLuteal },
];

const CYCLE_DAYS = 28;

const MOODS = [
  { value: 'feliz', icon: '😊', label: 'Feliz' },
  { value: 'cansada', icon: '😴', label: 'Cansada' },
  { value: 'irritable', icon: '😠', label: 'Irritable' },
  { value: 'triste', icon: '😢', label: 'Triste' },
  { value: 'motivada', icon: '💪', label: 'Motivada' },
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

const CycleVisual: React.FC = () => {
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
    const fetchRecs = async () => {
      const recs = await getRecommendations();
      setRecipe(recs.find((r: Content) => r.type === ContentType.NUTRITION && r.targetPhase === phase) || null);
      setExercise(recs.find((r: Content) => r.type === ContentType.EXERCISE && r.targetPhase === phase) || null);
      setPhrase(recs.find((r: Content) => r.type === ContentType.RECOMMENDATION && r.targetPhase === phase) || null);
    };
    fetchRecs();
  }, [getRecommendations, phase]);

  // Guardar estado de ánimo
  const handleMoodSelect = async (mood: string) => {
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
  const handleSymptomToggle = async (symptom: string) => {
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
  const r = 110;
  const cx = 150;
  const cy = 150;
  const markerX = cx + r * Math.sin((angle * Math.PI) / 180);
  const markerY = cy - r * Math.cos((angle * Math.PI) / 180);
  const pregnancy = getPregnancyProbability(phase);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      background: COLORS.background,
      borderRadius: 24,
      boxShadow: '0 4px 24px #0001',
      padding: 24,
      gap: 32,
      minHeight: 360,
      width: '100%',
      maxWidth: 900,
      margin: '0 auto',
    }}>
      {/* Columna Izquierda: Gráfico y datos principales */}
      <div style={{ minWidth: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={300} height={300}>
          {/* Círculo base */}
          <circle cx={cx} cy={cy} r={r} fill={COLORS.circle} stroke="#E6B7C1" strokeWidth={4} />
          {/* Fases */}
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
          {/* Marcador de día actual */}
          <circle cx={markerX} cy={markerY} r={12} fill={COLORS.marker} stroke="#fff" strokeWidth={3} />
          {/* Icono de útero (placeholder simple) */}
          <ellipse cx={cx} cy={cy} rx={38} ry={24} fill="#fff" stroke="#E6B7C1" strokeWidth={2} />
          <rect x={cx - 6} y={cy + 10} width={12} height={32} rx={6} fill="#fff" stroke="#E6B7C1" strokeWidth={2} />
        </svg>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.text }}>
            Día {day} - {phase.charAt(0).toUpperCase() + phase.slice(1)}
          </div>
          {menstruationDay && menstruationLength && (
            <div style={{ fontSize: 15, color: COLORS.text, marginTop: 4 }}>
              Día {menstruationDay} de {menstruationLength} de menstruación
            </div>
          )}
          <div style={{ fontSize: 15, color: pregnancy.color, marginTop: 8 }}>
            Probabilidad de embarazo: <b>{pregnancy.text}</b>
          </div>
        </div>
      </div>
      {/* Columna Derecha: Recomendaciones, mood, síntomas */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18, justifyContent: 'center' }}>
        {/* Receta */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 16, marginBottom: 8, boxShadow: '0 2px 8px #0001' }}>
          <div style={{ fontWeight: 600, color: '#C62328', marginBottom: 4 }}>Receta recomendada</div>
          {recipe ? (
            <div>
              <div style={{ fontWeight: 500 }}>{recipe.title}</div>
              <div style={{ fontSize: 13, color: '#444' }}>{recipe.summary}</div>
            </div>
          ) : (
            <div style={{ color: '#888' }}>No hay receta para hoy.</div>
          )}
        </div>
        {/* Ejercicio */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 16, marginBottom: 8, boxShadow: '0 2px 8px #0001' }}>
          <div style={{ fontWeight: 600, color: '#C62328', marginBottom: 4 }}>Ejercicio recomendado</div>
          {exercise ? (
            <div>
              <div style={{ fontWeight: 500 }}>{exercise.title}</div>
              <div style={{ fontSize: 13, color: '#444' }}>{exercise.summary}</div>
            </div>
          ) : (
            <div style={{ color: '#888' }}>No hay ejercicio para hoy.</div>
          )}
        </div>
        {/* Frase de ánimo/conocimiento */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 16, marginBottom: 8, boxShadow: '0 2px 8px #0001' }}>
          <div style={{ fontWeight: 600, color: '#C62328', marginBottom: 4 }}>Frase para hoy</div>
          {phrase ? (
            <div style={{ fontSize: 15, color: '#444' }}>{phrase.summary}</div>
          ) : (
            <div style={{ color: '#888' }}>No hay frase para hoy.</div>
          )}
        </div>
        {/* Estado de ánimo */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 16, marginBottom: 8, boxShadow: '0 2px 8px #0001' }}>
          <div style={{ fontWeight: 600, color: '#C62328', marginBottom: 4 }}>¿Cómo te sientes hoy?</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            {MOODS.map(mood => (
              <button
                key={mood.value}
                onClick={() => handleMoodSelect(mood.value)}
                style={{
                  fontSize: 28,
                  background: selectedMood === mood.value ? '#F8D9D6' : 'transparent',
                  border: selectedMood === mood.value ? '2px solid #C62328' : '2px solid transparent',
                  borderRadius: 10,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  padding: 4,
                }}
                disabled={saving}
                aria-label={mood.label}
              >
                {mood.icon}
              </button>
            ))}
          </div>
        </div>
        {/* Síntomas */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 16, boxShadow: '0 2px 8px #0001' }}>
          <div style={{ fontWeight: 600, color: '#C62328', marginBottom: 4 }}>Síntomas</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SYMPTOM_OPTIONS.map(symptom => (
              <button
                key={symptom}
                onClick={() => handleSymptomToggle(symptom)}
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
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CycleVisual; 