// ! 08/06/2025 - Actualizado para usar el nuevo CycleStatusCard que muestra datos correctos
import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useDashboardData } from "../hooks/useDashboardData";
import { useViewport } from "../hooks/useViewport";
import DraggableGrid from "../components/DraggableGrid";
import { CycleStatusCard } from "../components/cycle";
import SymptomsView from "../components/cycle/SymptomsView";
import RitualsView from "../components/cycle/RitualsView";
import RemindersView from "../components/cycle/RemindersView";
import IntrospectionBox from "../components/cycle/IntrospectionBox";
import { notificationService } from "../services/notificationService";
import CommunityBox from "../components/cycle/CommunityBox";

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
        component: <CycleStatusCard className="h-full w-full" />,
      },
      {
        id: "symptoms",
        title: "Síntomas",
        isExpanded: expandedId === "symptoms",
        component: <SymptomsView expanded={expandedId === "symptoms"} />,
      },
      {
        id: "rituals",
        title: "Rituales",
        isExpanded: expandedId === "rituals",
        component: <RitualsView expanded={expandedId === "rituals"} />,
      },
      {
        id: "reminders",
        title: "Recordatorios",
        isExpanded: expandedId === "reminders",
        component: (
          <RemindersView
            expanded={expandedId === "reminders"}
            notifications={notifications}
            markAllAsRead={notificationService.markAllAsRead}
            markAsRead={notificationService.markAsRead}
          />
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
            <CommunityBox expanded={expandedId === "community"} />
          </div>
        ),
      },
    ],
    [
      expandedId,
      cycleMoodColor,
      isMobile,
      notifications,
      insights,
      notificationService,
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
