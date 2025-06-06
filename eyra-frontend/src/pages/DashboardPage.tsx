// C:\Users\Ana\Desktop\Curso\Proyecto\EYRA\eyra-frontend\src\pages\DashboardPage.tsx
import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useDashboardData } from "../hooks/useDashboardData";
import { useViewport } from "../hooks/useViewport";
import DraggableGrid from "../components/DraggableGrid";
import { CycleVisual } from "../components/cycle";
import SymptomsView from "../components/cycle/SymptomsView";
import RitualsView from "../components/cycle/RitualsView";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { isMobile, isTablet, isDesktop } = useViewport();
  const {
    currentCycle,
    todayData,
    statistics,
    notifications,
    insights,
    isLoading,
    error,
    refreshData,
  } = useDashboardData();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cycleMoodColor, setCycleMoodColor] = useState<string>("#FCE9E6");

  // Función para actualizar el color según la emoción
  const handleCycleMoodChange = (color: string) => {
    setCycleMoodColor(color);
  };

  console.log("DashboardPage: Renderizando para usuario:", user?.email);
  console.log("DashboardPage: Datos cargados:", {
    currentCycle,
    todayData,
    statistics,
    notifications,
    insights,
  });

  // Componentes del dashboard - Memoizados para evitar recreación
  const dashboardItems = useMemo(
    () => [
      {
        id: "cycle",
        title: "Tu Ciclo",
        isExpanded: expandedId === "cycle",
        component: (
          <div
            className="h-full flex flex-col items-center justify-center"
            style={{ background: cycleMoodColor, borderRadius: 24, transition: 'background 0.4s' }}
          >
            <CycleVisual expanded={expandedId === "cycle"} onMoodColorChange={handleCycleMoodChange} />
          </div>
        ),
      },
      {
        id: "symptoms",
        title: "Síntomas",
        isExpanded: expandedId === "symptoms",
        component: (
          <SymptomsView expanded={expandedId === "symptoms"} />
        ),
      },
      {
        id: "rituals",
        title: "Rituales",
        isExpanded: expandedId === "rituals",
        component: (
          <RitualsView expanded={expandedId === "rituals"} />
        ),
      },
      {
        id: "reminders",
        title: "Recordatorios",
        isExpanded: expandedId === "reminders",
        component: (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-center mb-6">
              <div
                className={`rounded-full flex items-center justify-center relative ${
                  isMobile ? 'w-12 h-12' : 'w-16 h-16'
                }`}
                style={{
                  background: "bg-secondary",
                  boxShadow: `
                  inset 4px 4px 8px rgba(91, 1, 8, 0.3),
                  inset -4px -4px 8px rgba(181, 65, 58, 0.2)
                `,
                }}
              >
                <span className={isMobile ? 'text-xl' : 'text-2xl'}>🔔</span>
                {notifications.unread > 0 && (
                  <div className={`absolute -top-1 -right-1 bg-red-500 rounded-full flex items-center justify-center ${
                    isMobile ? 'w-3 h-3' : 'w-4 h-4'
                  }`}>
                    <span className={`text-white font-bold ${
                      isMobile ? 'text-xs' : 'text-xs'
                    }`}>
                      {notifications.unread > 9 ? "9+" : notifications.unread}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <p className={`text-primary-dark text-center leading-relaxed font-medium ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                Notificaciones y recordatorios
              </p>
              <div
                className={`rounded-xl border ${
                  isMobile ? 'p-3' : 'p-4'
                }`}
                style={{
                  background: "bg-gradient-to-br from-primary to-primary-dark",
                  border: "1px solid rgba(181, 65, 58, 0.15)",
                  boxShadow: `
                  inset 2px 2px 4px rgba(181, 65, 58, 0.05),
                  inset -2px -2px 4px rgba(255, 255, 255, 0.8)
                `,
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        background: "bg-secondary",
                      }}
                    ></div>
                    <p className={`text-primary-dark font-semibold ${
                      isMobile ? 'text-xs' : 'text-xs'
                    }`}>
                      {notifications.unread > 0
                        ? `${notifications.unread} pendientes`
                        : "No hay recordatorios pendientes"}
                    </p>
                  </div>
                  {insights &&
                    insights.recommendations &&
                    insights.recommendations.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-primary-dark mb-1">
                          Recomendación:
                        </p>
                        <p className="text-xs text-primary font-semibold">
                          {insights.recommendations[0]}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "wellness",
        title: "Bienestar",
        isExpanded: expandedId === "wellness",
        component: (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-center mb-6">
              <div
                className={`rounded-full flex items-center justify-center ${
                  isMobile ? 'w-12 h-12' : 'w-16 h-16'
                }`}
                style={{
                  background: "bg-secondary",
                  border: "2px solid rgba(198, 35, 40, 0.3)",
                  boxShadow: `
                  inset 4px 4px 8px rgba(91, 1, 8, 0.1),
                  inset -4px -4px 8px rgba(255, 255, 255, 0.9)
                `,
                }}
              >
                <span className={isMobile ? 'text-xl' : 'text-2xl'}>💆‍♀️</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <p className={`text-primary-dark text-center leading-relaxed font-medium ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                Consejos y recomendaciones
              </p>
              <div
                className="rounded-xl p-4 border"
                style={{
                  background: "bg-gradient-to-br from-primary to-primary-dark",
                  border: "1px solid rgba(198, 35, 40, 0.15)",
                  boxShadow: `
                  inset 2px 2px 4px rgba(198, 35, 40, 0.03),
                  inset -2px -2px 4px rgba(255, 255, 255, 0.8)
                `,
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        background: "bg-secondary",
                      }}
                    ></div>
                    <p className="text-xs text-primary-dark font-semibold">
                      {currentCycle && currentCycle.currentPhase
                        ? "Contenido personalizado"
                        : "Explora contenido personalizado"}
                    </p>
                  </div>
                  {statistics && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-primary-dark">
                          Ciclo promedio:
                        </span>
                        <span className="text-xs text-primary font-bold">
                          {statistics.averageCycleLength} días
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-primary-dark">
                          Período promedio:
                        </span>
                        <span className="text-xs text-primary font-bold">
                          {statistics.averagePeriodLength} días
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "community",
        title: "Comunidad",
        isExpanded: expandedId === "community",
        component: (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-center mb-6">
              <div
                className={`rounded-full flex items-center justify-center ${
                  isMobile ? 'w-12 h-12' : 'w-16 h-16'
                }`}
                style={{
                  background: "bg-secondary",
                  boxShadow: `
                  inset 4px 4px 8px rgba(91, 1, 8, 0.3),
                  inset -4px -4px 8px rgba(255, 108, 92, 0.3)
                `,
                }}
              >
                <span className={isMobile ? 'text-xl' : 'text-2xl'}>👥</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <p className={`text-primary-dark text-center leading-relaxed font-medium ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                Conecta con otras usuarias
              </p>
              <div
                className="rounded-xl p-4 border"
                style={{
                  background: "bg-gradient-to-br from-primary to-primary-dark",
                  border: "1px solid rgba(198, 35, 40, 0.15)",
                  boxShadow: `
                  inset 2px 2px 4px rgba(198, 35, 40, 0.05),
                  inset -2px -2px 4px rgba(255, 255, 255, 0.8)
                `,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        background: "bg-secondary",
                      }}
                    ></div>
                    <p className="text-xs text-primary-dark font-semibold">
                      Estado:
                    </p>
                  </div>
                  <span className="text-xs text-primary font-bold">
                    Próximamente disponible
                  </span>
                </div>
                {error && (
                  <div className="mt-2">
                    <button
                      onClick={refreshData}
                      className="text-xs text-primary font-semibold underline"
                    >
                      Reintentar carga de datos
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ),
      },
    ],
    [expandedId, cycleMoodColor, isMobile, notifications, insights]
  );

  return (
    <div className="w-full h-full bg-secondary overflow-hidden">
      <DraggableGrid
        items={dashboardItems}
        onItemsChange={(newItems) => {
          // Detectar cuál se expandió
          const expanded = newItems.find((item) => item.isExpanded);
          setExpandedId(expanded ? expanded.id : null);
        }}
      />
    </div>
  );
};

export default DashboardPage;
