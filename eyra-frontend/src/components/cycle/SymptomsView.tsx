import * as React from 'react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useCycle } from '../../context/CycleContext';
import { SYMPTOM_OPTIONS } from '../../constants/cycle';
import { SymptomIcons } from '../icons/CycleIcons';
import { getSymptomHistory, getSymptomPatterns, SymptomLog, SymptomPattern } from '../../services/symptomService';
import { useAuth } from '../../context/AuthContext';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SymptomsViewProps {
  expanded?: boolean;
}

const SymptomsView: React.FC<SymptomsViewProps> = ({ expanded = true }) => {
  const { user } = useAuth();
  const [symptomHistory, setSymptomHistory] = useState<SymptomLog[]>([]);
  const [symptomPatterns, setSymptomPatterns] = useState<SymptomPattern[]>([]);
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Obtener datos de síntomas de los últimos 90 días
  useEffect(() => {
    const fetchSymptomData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const endDate = new Date().toISOString();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 90);
        
        const [history, patterns] = await Promise.all([
          getSymptomHistory(String(user.id), startDate.toISOString(), endDate),
          getSymptomPatterns(String(user.id))
        ]);

        setSymptomHistory(history);
        setSymptomPatterns(patterns);
      } catch (error) {
        console.error('Error al cargar datos de síntomas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSymptomData();
  }, [user?.id]);

  // Configuración del gráfico
  const chartData = {
    labels: symptomHistory.map(log => new Date(log.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })),
    datasets: selectedSymptom ? [
      {
        label: selectedSymptom,
        data: symptomHistory.map(log => 
          log.symptom === selectedSymptom ? log.intensity : 0
        ),
        borderColor: '#C62328',
        backgroundColor: 'rgba(198, 35, 40, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ] : [],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  // Obtener síntomas del día actual
  const todaySymptoms = symptomHistory.filter(log => {
    const logDate = new Date(log.date);
    const today = new Date();
    return logDate.toDateString() === today.toDateString();
  });

  // Obtener análisis del síntoma seleccionado
  const getSymptomAnalysis = (symptom: string) => {
    const pattern = symptomPatterns.find(p => p.symptomType === symptom);
    if (!pattern) return null;

    return {
      frequency: pattern.frequency,
      averageIntensity: pattern.averageIntensity,
      dayInCycle: pattern.dayInCycle,
    };
  };

  // --- VISTA NO EXPANDIDA ---
  if (!expanded) {
    if (loading) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 180,
            width: '100%',
          }}
        >
          <div className="loading-spinner" />
        </motion.div>
      );
    }
    // Solo mostrar el SVG 16.svg grande y centrado
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
          padding: 24,
          minHeight: 180,
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <img src="/img/16.svg" alt="Síntomas" style={{ width: 320, height: 220, opacity: 0.97 }} />
      </motion.div>
    );
  }

  // --- VISTA EXPANDIDA ---
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 480,
          width: '100%',
        }}
      >
        <div className="loading-spinner" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        background: '#fff',
        borderRadius: 24,
        padding: 32,
        minHeight: 480,
        width: '100%',
      }}
    >
      {/* Panel superior: Síntomas actuales */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#C62328', marginBottom: 16 }}>
          Síntomas actuales
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {SYMPTOM_OPTIONS.map(symptom => {
            const todaySymptom = todaySymptoms.find(s => s.symptom === symptom);
            return (
              <motion.button
                key={symptom}
                onClick={() => setSelectedSymptom(symptom === selectedSymptom ? null : symptom)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: todaySymptom ? '#F8B7B7' : '#F8D9D6',
                  padding: '8px 16px',
                  borderRadius: 20,
                  border: 'none',
                  cursor: 'pointer',
                  gap: 8,
                  transition: 'all 0.2s',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {SymptomIcons[symptom]('#C62328')}
                <span style={{ fontSize: 14, color: '#222' }}>{symptom}</span>
                {todaySymptom && (
                  <div style={{ 
                    background: '#C62328', 
                    color: '#fff', 
                    padding: '2px 8px', 
                    borderRadius: 12,
                    fontSize: 12,
                  }}>
                    {todaySymptom.intensity}/5
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Panel central: Gráfico */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#C62328', marginBottom: 16 }}>
          {selectedSymptom ? `Evolución de ${selectedSymptom}` : 'Selecciona un síntoma para ver su evolución'}
        </h3>
        <div style={{ height: 200 }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Panel inferior: Análisis */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#C62328', marginBottom: 16 }}>
          Análisis de patrones
        </h3>
        {selectedSymptom ? (
          <div style={{ background: '#F8D9D6', padding: 16, borderRadius: 12 }}>
            {(() => {
              const analysis = getSymptomAnalysis(selectedSymptom);
              if (!analysis) {
                return (
                  <p style={{ color: '#222', fontSize: 14, lineHeight: 1.5 }}>
                    No hay suficientes datos para analizar este síntoma. Continúa registrando para obtener insights.
                  </p>
                );
              }

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p style={{ color: '#222', fontSize: 14, lineHeight: 1.5 }}>
                    Basado en tus registros, este síntoma aparece con una frecuencia del {analysis.frequency}% 
                    y una intensidad promedio de {analysis.averageIntensity.toFixed(1)}/5.
                  </p>
                  <p style={{ color: '#222', fontSize: 14, lineHeight: 1.5 }}>
                    Suele aparecer alrededor del día {analysis.dayInCycle} de tu ciclo.
                  </p>
                </div>
              );
            })()}
          </div>
        ) : (
          <div style={{ background: '#F8D9D6', padding: 16, borderRadius: 12 }}>
            <p style={{ color: '#222', fontSize: 14, lineHeight: 1.5 }}>
              Selecciona un síntoma para ver un análisis detallado de su patrón y recibir recomendaciones personalizadas.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SymptomsView; 