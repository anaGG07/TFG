// C:\Users\Ana\Desktop\Curso\Proyecto\EYRA\eyra-frontend\src\pages\DashboardPage.tsx
import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useDashboardData } from "../hooks/useDashboardData";
import { useViewport } from "../hooks/useViewport";
import DraggableGrid from "../components/DraggableGrid";
import { CycleVisual } from "../components/cycle";
import SymptomsView from "../components/cycle/SymptomsView";
import RitualsView from "../components/cycle/RitualsView";
import RemindersExpanded from "../components/cycle/RemindersExpanded";
import IntrospectionBox from "../components/cycle/IntrospectionBox";
import { notificationService } from "../services/notificationService";

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
        component: expandedId === "reminders" ? (
          // Vista EXPANDIDA
          <RemindersExpanded
            notifications={notifications}
            insights={insights}
            markAllAsRead={notificationService.markAllAsRead}
            markAsRead={notificationService.markAsRead}
            isMobile={isMobile}
          />
        ) : (
          // Vista NO EXPANDIDA
          <div className="flex flex-col items-center justify-center h-full">
            <img src="/img/31.svg" alt="Recordatorios" className={isMobile ? "w-24 h-24" : "w-32 h-32"} />
          </div>
        ),
      },
      {
        id: "wellness",
        title: "Introspección",
        isExpanded: expandedId === "wellness",
        component: <IntrospectionBox />,
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
    [expandedId, cycleMoodColor, isMobile, notifications, insights, notificationService]
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
