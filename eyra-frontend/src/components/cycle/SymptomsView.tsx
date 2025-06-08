import * as React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
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
} from "chart.js";
import { SYMPTOM_OPTIONS } from "../../constants/cycle";
import { SymptomIcons } from "../icons/CycleIcons";
import {
  getSymptomHistory,
  getSymptomPatterns,
  SymptomLog,
  SymptomPattern,
} from "../../services/symptomService";
import { useAuth } from "../../context/AuthContext";
import { useViewport } from "../../hooks/useViewport";
import { NeomorphicCard, NeomorphicButton } from "../ui/NeomorphicComponents";

// control
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
  const { isMobile, isTablet } = useViewport();
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
          getSymptomPatterns(String(user.id)),
        ]);

        // Manejar resultado del historial
        if (historyResult.status === "fulfilled") {
          const history = Array.isArray(historyResult.value)
            ? historyResult.value
            : [];
          setSymptomHistory(history);
        } else {
          console.warn(
            "Failed to fetch symptom history:",
            historyResult.reason
          );
          setSymptomHistory([]);
        }

        // Manejar resultado de los patrones
        if (patternsResult.status === "fulfilled") {
          const patterns = Array.isArray(patternsResult.value)
            ? patternsResult.value
            : [];
          setSymptomPatterns(patterns);
        } else {
          console.warn(
            "Failed to fetch symptom patterns:",
            patternsResult.reason
          );
          setSymptomPatterns([]);
        }
      } catch (error) {
        console.error("Error al cargar datos de síntomas:", error);
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
    labels: symptomHistory.map((log) =>
      new Date(log.date).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      })
    ),
    datasets: selectedSymptom
      ? [
          {
            label: selectedSymptom,
            data: symptomHistory.map((log) =>
              log.symptom === selectedSymptom ? log.intensity : 0
            ),
            borderColor: "#C62328",
            backgroundColor: "rgba(198, 35, 40, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ]
      : [],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
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
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  };

  // Obtener síntomas del día actual
  const todaySymptoms = symptomHistory.filter((log) => {
    const logDate = new Date(log.date);
    const today = new Date();
    return logDate.toDateString() === today.toDateString();
  });

  // Obtener análisis del síntoma seleccionado
  const getSymptomAnalysis = (symptom: string) => {
    const pattern = symptomPatterns.find((p) => p.symptomType === symptom);
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <div className="loading-spinner" />
        </motion.div>
      );
    }
    // Solo mostrar el SVG 16.svg adaptado al tamaño
    const svgSize = isMobile
      ? { width: 240, height: 165 }
      : isTablet
      ? { width: 280, height: 192 }
      : { width: 320, height: 220 };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          borderRadius: 18,
          padding: isMobile ? 16 : 24,
          height: "100%",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <img
          src="/img/16.svg"
          alt="Síntomas"
          style={{
            width: svgSize.width,
            height: svgSize.height,
            opacity: 0.97,
            objectFit: "contain",
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: isMobile ? 360 : isTablet ? 420 : 480,
          width: "100%",
          background: "transparent",
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
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 16 : 24,
        background: "transparent",
        borderRadius: 24,
        padding: isMobile ? 16 : isTablet ? 24 : 28,
        minHeight: isMobile ? 360 : isTablet ? 420 : 480,
        width: "100%",
        boxShadow: "none",
        alignItems: "stretch",
        justifyContent: "flex-start",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      {/* Caja de síntomas en la parte superior */}
      <NeomorphicCard compact className="mb-2">
        <h3 className="font-bold text-lg mb-2 text-[#C62328]">
          Síntomas actuales
        </h3>
        <div
          className="flex flex-wrap gap-3 justify-start"
          style={{
            maxHeight: 110,
            overflow: "visible",
            alignItems: "flex-start",
            paddingBottom: 4,
          }}
        >
          {SYMPTOM_OPTIONS.map((symptom) => {
            const todaySymptom = todaySymptoms.find(
              (s) => s.symptom === symptom
            );
            const isSelected = symptom === selectedSymptom;
            return (
              <NeomorphicButton
                key={symptom}
                variant={isSelected ? "primary" : "secondary"}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-medium transition-all duration-200 ${
                  isSelected ? "scale-105 shadow-lg" : "hover:shadow-md"
                } ${isSelected ? "ring-2 ring-[#C62328]/60" : ""}`}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  setSelectedSymptom(isSelected ? null : symptom);
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    filter: isSelected
                      ? "drop-shadow(0 2px 6px #c62328aa)"
                      : "none",
                  }}
                >
                  {SymptomIcons[symptom](isSelected ? "#fff" : "#7a2323")}
                </span>
                <span>{symptom}</span>
                {todaySymptom && (
                  <span className="ml-1 bg-[#C62328] text-white rounded-xl px-2 py-0.5 text-[11px] font-semibold">
                    {todaySymptom.intensity}/5
                  </span>
                )}
              </NeomorphicButton>
            );
          })}
        </div>
      </NeomorphicCard>

      {/* Fila con análisis y gráfica */}
      <div
        className={`flex w-full items-stretch justify-between ${isMobile ? "flex-col gap-4" : "flex-row gap-6"}`}
      >
        {/* Análisis de patrones */}
        <div className={isMobile ? "w-full mb-2" : "max-w-xs w-full"}>
          <NeomorphicCard compact>
            <h3 className="font-bold text-lg mb-3 text-[#C62328]">
              Análisis de patrones
            </h3>
            {selectedSymptom ? (
              <div className="rounded-xl p-3 bg-[#f8f4f1]/60 transition-all duration-200">
                {(() => {
                  const analysis = getSymptomAnalysis(selectedSymptom);
                  if (!analysis) {
                    return (
                      <p className="text-[#222] text-sm leading-relaxed">
                        No hay suficientes datos para analizar este síntoma.
                        Continúa registrando para obtener insights.
                      </p>
                    );
                  }
                  return (
                    <div className="flex flex-col gap-2">
                      <p className="text-[#222] text-sm leading-relaxed">
                        Basado en tus registros, este síntoma aparece con una
                        frecuencia del {analysis.frequency}% y una intensidad
                        promedio de {analysis.averageIntensity.toFixed(1)}/5.
                      </p>
                      <p className="text-[#222] text-sm leading-relaxed">
                        Suele aparecer alrededor del día {analysis.dayInCycle} de
                        tu ciclo.
                      </p>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="rounded-xl p-3 bg-[#f8f4f1]/60 transition-all duration-200">
                <p className="text-[#222] text-sm leading-relaxed">
                  Selecciona un síntoma para ver un análisis detallado de su
                  patrón y recibir recomendaciones personalizadas.
                </p>
              </div>
            )}
          </NeomorphicCard>
        </div>
        {/* Gráfica */}
        <div className={isMobile ? "w-full" : "flex-1 ml-2"}>
          <NeomorphicCard
            compact
            className="flex flex-col items-center justify-center w-full max-w-lg mx-auto"
          >
            <h3 className="font-bold text-lg mb-2 text-[#C62328] text-center">
              {selectedSymptom
                ? `Evolución de ${selectedSymptom}`
                : "Selecciona un síntoma para ver su evolución"}
            </h3>
            <p className="text-xs text-[#7a2323] mb-2 text-center">
              {selectedSymptom
                ? "Evolución de la intensidad del síntoma seleccionado en los últimos 90 días."
                : "Selecciona un síntoma para ver su evolución temporal."}
            </p>
            <div className="w-full">
              {selectedSymptom &&
              chartData.datasets[0]?.data.some((v) => v > 0) ? (
                <Line
                  data={chartData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: { display: false },
                      tooltip: {
                        ...chartOptions.plugins.tooltip,
                        backgroundColor: "#C62328",
                        titleColor: "#fff",
                        bodyColor: "#fff",
                      },
                    },
                    elements: {
                      line: {
                        borderWidth: 4,
                        borderColor: "#C62328",
                        tension: 0.5,
                      },
                      point: {
                        radius: 7,
                        backgroundColor: "#ff393f",
                        borderColor: "#fff",
                        borderWidth: 2,
                      },
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: "Fecha",
                          color: "#7a2323",
                          font: { weight: "bold", size: 12 },
                        },
                        grid: { display: false },
                        ticks: { color: "#C62328", font: { weight: "bold" } },
                      },
                      y: {
                        title: {
                          display: true,
                          text: "Intensidad (0-5)",
                          color: "#7a2323",
                          font: { weight: "bold", size: 12 },
                        },
                        grid: { color: "#F8D9D6" },
                        ticks: {
                          color: "#C62328",
                          font: { weight: "bold" },
                          stepSize: 1,
                        },
                        min: 0,
                        max: 5,
                      },
                    },
                  }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <span className="text-[#C62328] text-sm font-medium opacity-70 text-center">
                    No hay datos suficientes para mostrar la evolución de este
                    síntoma.
                  </span>
                </div>
              )}
            </div>
          </NeomorphicCard>
        </div>
      </div>
    </motion.div>
  );
};

export default SymptomsView;
