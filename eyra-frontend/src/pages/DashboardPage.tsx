// C:\Users\Ana\Desktop\Curso\Proyecto\EYRA\eyra-frontend\src\pages\DashboardPage.tsx
import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useDashboardData } from "../hooks/useDashboardData";
import DraggableGrid from "../components/DraggableGrid";
import { CycleVisual } from "../components/cycle";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
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
          <div className="h-full flex flex-col items-center justify-center">
            <CycleVisual expanded={expandedId === "cycle"} />
            {/* Puedes añadir aquí debajo más info textual si lo deseas */}
          </div>
        ),
      },
      {
        id: "symptoms",
        title: "Síntomas",
        component: (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-center mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: "bg-secondary",
                  boxShadow: `
                  inset 4px 4px 8px rgba(91, 1, 8, 0.3),
                  inset -4px -4px 8px rgba(255, 108, 92, 0.2)
                `,
                }}
              >
                <span className="text-2xl">📝</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-primary-dark text-center text-sm leading-relaxed font-medium">
                Registro de síntomas recientes
              </p>
              <div
                className="rounded-xl p-4 border"
                style={{
                  background: "bg-gradient-to-br from-primary to-primary-dark",
                  border: "1px solid rgba(255, 108, 92, 0.15)",
                  boxShadow: `
                  inset 2px 2px 4px rgba(255, 108, 92, 0.05),
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
                      Registros:
                    </p>
                  </div>
                  <span className="text-xs text-primary font-bold">
                    {isLoading ? "..." : `${todayData?.symptoms?.length || 0} síntomas hoy`}
                  </span>
                </div>
                {todayData && todayData.flowIntensity !== null && (
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-primary-dark">Flujo:</span>
                    <span className="text-xs text-primary font-bold">
                      {(() => {
                        const intensityMap: { [key: number]: string } = {
                          1: "Ligero",
                          2: "Moderado",
                          3: "Abundante",
                          4: "Muy abundante",
                          5: "Extremo",
                        };
                        return intensityMap[todayData.flowIntensity] || "No definido";
                      })()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "insights",
        title: "Insights",
        component: (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-center mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: "bg-secondary",
                  boxShadow: `
                  inset 4px 4px 8px rgba(91, 1, 8, 0.4),
                  inset -4px -4px 8px rgba(157, 13, 11, 0.2)
                `,
                }}
              >
                <span className="text-2xl">📊</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-primary-dark text-center text-sm leading-relaxed font-medium">
                Análisis y tendencias personalizadas
              </p>
              <div
                className="rounded-xl p-4 border"
                style={{
                  background: "bg-gradient-to-br from-primary to-primary-dark",
                  border: "1px solid rgba(157, 13, 11, 0.15)",
                  boxShadow: `
                  inset 2px 2px 4px rgba(157, 13, 11, 0.05),
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
                      {statistics ? "Análisis disponible" : "Recopilando datos"}
                    </p>
                  </div>
                  {statistics && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-primary-dark">
                          Regularidad:
                        </span>
                        <span className="text-xs text-primary font-bold">
                          {(() => {
                            const regularity = statistics.regularity;
                            if (regularity >= 80) return "Muy regular";
                            if (regularity >= 60) return "Regular";
                            if (regularity >= 40) return "Irregular";
                            return "Muy irregular";
                          })()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-primary-dark">
                          Ciclos analizados:
                        </span>
                        <span className="text-xs text-primary font-bold">
                          {statistics.cyclesAnalyzed}
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
        id: "reminders",
        title: "Recordatorios",
        component: (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-center mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center relative"
                style={{
                  background: "bg-secondary",
                  boxShadow: `
                  inset 4px 4px 8px rgba(91, 1, 8, 0.3),
                  inset -4px -4px 8px rgba(181, 65, 58, 0.2)
                `,
                }}
              >
                <span className="text-2xl">🔔</span>
                {notifications.unread > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">
                      {notifications.unread > 9 ? "9+" : notifications.unread}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-primary-dark text-center text-sm leading-relaxed font-medium">
                Notificaciones y recordatorios
              </p>
              <div
                className="rounded-xl p-4 border"
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
                    <p className="text-xs text-primary-dark font-semibold">
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
        component: (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-center mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: "bg-secondary",
                  border: "2px solid rgba(198, 35, 40, 0.3)",
                  boxShadow: `
                  inset 4px 4px 8px rgba(91, 1, 8, 0.1),
                  inset -4px -4px 8px rgba(255, 255, 255, 0.9)
                `,
                }}
              >
                <span className="text-2xl">💆‍♀️</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-primary-dark text-center text-sm leading-relaxed font-medium">
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
        component: (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-center mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: "bg-secondary",
                  boxShadow: `
                  inset 4px 4px 8px rgba(91, 1, 8, 0.3),
                  inset -4px -4px 8px rgba(255, 108, 92, 0.3)
                `,
                }}
              >
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-primary-dark text-center text-sm leading-relaxed font-medium">
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
    [
      user?.onboarding?.completed,
      currentCycle,
      todayData,
      statistics,
      notifications,
      insights,
      isLoading,
      error,
      refreshData,
      expandedId,
    ]
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
