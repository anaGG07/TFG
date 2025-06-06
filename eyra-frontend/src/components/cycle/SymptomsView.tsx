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
import { SYMPTOM_OPTIONS } from '../../constants/cycle';
import { SymptomIcons } from '../icons/CycleIcons';
import { getSymptomHistory, getSymptomPatterns, SymptomLog, SymptomPattern } from '../../services/symptomService';
import { useAuth } from '../../context/AuthContext';
import { useViewport } from '../../hooks/useViewport';

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
  const { isMobile, isTablet, isDesktop } = useViewport();
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
        
        const [historyResult, patternsResult] = await Promise.allSettled([
          getSymptomHistory(String(user.id), startDate.toISOString(), endDate),
          getSymptomPatterns(String(user.id))
        ]);

        // Manejar resultado del historial
        if (historyResult.status === 'fulfilled') {
          const history = Array.isArray(historyResult.value) ? historyResult.value : [];
          setSymptomHistory(history);
        } else {
          console.warn('Failed to fetch symptom history:', historyResult.reason);
          setSymptomHistory([]);
        }

        // Manejar resultado de los patrones
        if (patternsResult.status === 'fulfilled') {
          const patterns = Array.isArray(patternsResult.value) ? patternsResult.value : [];
          setSymptomPatterns(patterns);
        } else {
          console.warn('Failed to fetch symptom patterns:', patternsResult.reason);
          setSymptomPatterns([]);
        }

      } catch (error) {
        console.error('Error al cargar datos de síntomas:', error);
        // Asegurar que siempre tenemos arrays válidos
        setSymptomHistory([]);
        setSymptomPatterns([]);
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
            height: '100%',
            width: '100%',
          }}
        >
          <div className="loading-spinner" />
        </motion.div>
      );
    }
    // Solo mostrar el SVG 16.svg adaptado al tamaño
    const svgSize = isMobile ? { width: 240, height: 165 } : 
                   isTablet ? { width: 280, height: 192 } : 
                   { width: 320, height: 220 };
    
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
          padding: isMobile ? 16 : 24,
          height: '100%',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <img 
          src="/img/16.svg" 
          alt="Síntomas" 
          style={{ 
            width: svgSize.width, 
            height: svgSize.height, 
            opacity: 0.97,
            objectFit: 'contain'
          }} 
        />
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
          minHeight: isMobile ? 360 : isTablet ? 420 : 480,
          width: '100%',
          background: 'transparent',
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
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 24 : isTablet ? 32 : 40,
        background: 'transparent',
        borderRadius: 24,
        padding: isMobile ? 20 : isTablet ? 28 : 32,
        minHeight: isMobile ? 360 : isTablet ? 420 : 480,
        width: '100%',
        boxShadow: 'none',
        alignItems: 'stretch',
        justifyContent: 'center',
      }}
    >
      {/* Columna izquierda/superior: Síntomas y análisis */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? 20 : 28,
        minWidth: 0,
        justifyContent: 'flex-start',
      }}>
        {/* Síntomas actuales */}
        <div style={{
          background: 'transparent',
          borderRadius: 22,
          boxShadow: 'none',
          padding: isMobile ? 16 : 24,
          marginBottom: 0,
        }}>
          <h3 style={{ 
            fontSize: isMobile ? 16 : 18, 
            fontWeight: 700, 
            color: '#C62328', 
            marginBottom: isMobile ? 14 : 18 
          }}>
            Síntomas actuales
          </h3>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: isMobile ? 12 : 16 
          }}>
            {SYMPTOM_OPTIONS.map(symptom => {
              const todaySymptom = todaySymptoms.find(s => s.symptom === symptom);
              return (
                <motion.button
                  key={symptom}
                  onClick={e => { e.stopPropagation(); setSelectedSymptom(symptom === selectedSymptom ? null : symptom); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: todaySymptom ? '#F8B7B7' : '#F8D9D6',
                    padding: isMobile ? '6px 12px' : '8px 16px',
                    borderRadius: 20,
                    border: 'none',
                    cursor: 'pointer',
                    gap: isMobile ? 6 : 8,
                    transition: 'all 0.2s',
                    boxShadow: todaySymptom ? '2px 2px 8px #e5bcbc' : 'none',
                  }}
                  whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {SymptomIcons[symptom]('#C62328')}
                  <span style={{ 
                    fontSize: isMobile ? 12 : 14, 
                    color: '#222' 
                  }}>{symptom}</span>
                  {todaySymptom && (
                    <div style={{
                      background: '#C62328',
                      color: '#fff',
                      padding: '2px 8px',
                      borderRadius: 12,
                      fontSize: isMobile ? 11 : 12,
                    }}>
                      {todaySymptom.intensity}/5
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
        {/* Análisis de patrones */}
        <div style={{
          background: 'transparent',
          borderRadius: 22,
          boxShadow: 'none',
          padding: isMobile ? 16 : 24,
        }}>
          <h3 style={{ 
            fontSize: isMobile ? 16 : 18, 
            fontWeight: 700, 
            color: '#C62328', 
            marginBottom: 16 
          }}>
            Análisis de patrones
          </h3>
          {selectedSymptom ? (
            <div style={{ background: '#F8D9D6', padding: isMobile ? 12 : 16, borderRadius: 12 }}>
              {(() => {
                const analysis = getSymptomAnalysis(selectedSymptom);
                if (!analysis) {
                  return (
                    <p style={{ 
                      color: '#222', 
                      fontSize: isMobile ? 12 : 14, 
                      lineHeight: 1.5 
                    }}>
                      No hay suficientes datos para analizar este síntoma. Continúa registrando para obtener insights.
                    </p>
                  );
                }

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <p style={{ 
                      color: '#222', 
                      fontSize: isMobile ? 12 : 14, 
                      lineHeight: 1.5 
                    }}>
                      Basado en tus registros, este síntoma aparece con una frecuencia del {analysis.frequency}%
                      y una intensidad promedio de {analysis.averageIntensity.toFixed(1)}/5.
                    </p>
                    <p style={{ 
                      color: '#222', 
                      fontSize: isMobile ? 12 : 14, 
                      lineHeight: 1.5 
                    }}>
                      Suele aparecer alrededor del día {analysis.dayInCycle} de tu ciclo.
                    </p>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div style={{ background: '#F8D9D6', padding: isMobile ? 12 : 16, borderRadius: 12 }}>
              <p style={{ 
                color: '#222', 
                fontSize: isMobile ? 12 : 14, 
                lineHeight: 1.5 
              }}>
                Selecciona un síntoma para ver un análisis detallado de su patrón y recibir recomendaciones personalizadas.
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Columna derecha/inferior: Gráfica */}
      <div style={{
        flex: isMobile ? 'none' : 1.1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 0,
        background: 'transparent',
        borderRadius: 22,
        boxShadow: 'none',
        padding: isMobile ? 20 : isTablet ? 28 : 32,
        margin: 0,
        height: isMobile ? 'auto' : '100%',
      }}>
        <h3 style={{ 
          fontSize: isMobile ? 16 : 18, 
          fontWeight: 700, 
          color: '#C62328', 
          marginBottom: isMobile ? 14 : 18, 
          textAlign: 'center' 
        }}>
          {selectedSymptom ? `Evolución de ${selectedSymptom}` : 'Selecciona un síntoma para ver su evolución'}
        </h3>
        <div style={{ 
          width: '100%', 
          maxWidth: isMobile ? 320 : isTablet ? 380 : 420, 
          height: isMobile ? 200 : isTablet ? 220 : 260, 
          background: 'linear-gradient(135deg, #f8d9d6 0%, #fff 100%)', 
          borderRadius: 18, 
          boxShadow: '2px 2px 12px #e5d6d6', 
          padding: isMobile ? 12 : 16, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Line
            data={chartData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                legend: { display: false },
                tooltip: { ...chartOptions.plugins.tooltip, backgroundColor: '#C62328', titleColor: '#fff', bodyColor: '#fff' },
              },
              elements: {
                line: { borderWidth: 4, borderColor: '#C62328', tension: 0.5 },
                point: { radius: 6, backgroundColor: '#C62328', borderColor: '#fff', borderWidth: 2 },
              },
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { color: '#C62328', font: { weight: 'bold' } },
                },
                y: {
                  grid: { color: '#F8D9D6' },
                  ticks: { color: '#C62328', font: { weight: 'bold' }, stepSize: 1 },
                  min: 0,
                  max: 5,
                },
              },
              animation: {
                duration: 1200,
                easing: 'easeInOutQuart',
              },
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SymptomsView; 