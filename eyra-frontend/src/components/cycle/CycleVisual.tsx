import React from 'react';

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

interface CycleVisualProps {
  day: number; // Día actual del ciclo (1-28)
  phase: string; // Nombre de la fase actual
  menstruationDay?: number; // Día de menstruación si aplica
  menstruationLength?: number; // Duración total de la menstruación
}

const CYCLE_DAYS = 28;

const CycleVisual: React.FC<CycleVisualProps> = ({
  day,
  phase,
  menstruationDay,
  menstruationLength,
}) => {
  // Calcular ángulo del marcador
  const angle = ((day - 1) / CYCLE_DAYS) * 360;

  // Coordenadas para el marcador
  const r = 110;
  const cx = 150;
  const cy = 150;
  const markerX = cx + r * Math.sin((angle * Math.PI) / 180);
  const markerY = cy - r * Math.cos((angle * Math.PI) / 180);

  return (
    <div
      style={{
        background: COLORS.background,
        borderRadius: 24,
        padding: 24,
        boxShadow: '0 4px 24px #0001',
        width: 340,
        height: 340,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={300} height={300}>
        {/* Círculo base */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={COLORS.circle}
          stroke="#E6B7C1"
          strokeWidth={4}
        />
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
        <circle
          cx={markerX}
          cy={markerY}
          r={12}
          fill={COLORS.marker}
          stroke="#fff"
          strokeWidth={3}
        />
        {/* Icono de útero (placeholder simple) */}
        <ellipse
          cx={cx}
          cy={cy}
          rx={38}
          ry={24}
          fill="#fff"
          stroke="#E6B7C1"
          strokeWidth={2}
        />
        <rect
          x={cx - 6}
          y={cy + 10}
          width={12}
          height={32}
          rx={6}
          fill="#fff"
          stroke="#E6B7C1"
          strokeWidth={2}
        />
        {/* Puedes reemplazar el útero por un SVG más detallado */}
      </svg>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.text }}>
          Día {day} - {phase}
        </div>
        {menstruationDay && menstruationLength && (
          <div style={{ fontSize: 15, color: COLORS.text, marginTop: 4 }}>
            Día {menstruationDay} de {menstruationLength} de menstruación
          </div>
        )}
      </div>
    </div>
  );
};

export default CycleVisual; 