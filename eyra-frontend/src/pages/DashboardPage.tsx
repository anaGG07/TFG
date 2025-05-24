import React from "react";
import { useAuth } from "../context/AuthContext";
import DraggableGrid from "../components/DraggableGrid";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  console.log("DashboardPage: Renderizando para usuario:", user?.email);

  // Componentes del dashboard
  const dashboardItems = [
    {
      id: "cycle",
      title: "Tu Ciclo",
      component: (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">🌸</span>
          </div>
          <p className="text-gray-600 mb-3">
            Información sobre tu ciclo menstrual actual
          </p>
          <div className="bg-[#f8f4f0] rounded-lg p-3">
            <p className="text-sm text-[#7a2323]">
              Estado:{" "}
              {user?.onboarding?.completed
                ? "Configurado"
                : "Pendiente configuración"}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "symptoms",
      title: "Síntomas",
      component: (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <p className="text-gray-600 mb-3">Registro de síntomas recientes</p>
          <div className="bg-[#f8f4f0] rounded-lg p-3">
            <p className="text-sm text-[#7a2323]">Registros: 0 síntomas hoy</p>
          </div>
        </div>
      ),
    },
    {
      id: "insights",
      title: "Insights",
      component: (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-gray-600 mb-3">
            Análisis y tendencias personalizadas
          </p>
          <div className="bg-[#f8f4f0] rounded-lg p-3">
            <p className="text-sm text-[#7a2323]">
              Datos disponibles próximamente
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "reminders",
      title: "Recordatorios",
      component: (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">🔔</span>
          </div>
          <p className="text-gray-600 mb-3">Notificaciones y recordatorios</p>
          <div className="bg-[#f8f4f0] rounded-lg p-3">
            <p className="text-sm text-[#7a2323]">
              No hay recordatorios pendientes
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "wellness",
      title: "Bienestar",
      component: (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">💆‍♀️</span>
          </div>
          <p className="text-gray-600 mb-3">Consejos y recomendaciones</p>
          <div className="bg-[#f8f4f0] rounded-lg p-3">
            <p className="text-sm text-[#7a2323]">
              Explora contenido personalizado
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "community",
      title: "Comunidad",
      component: (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">👥</span>
          </div>
          <p className="text-gray-600 mb-3">Conecta con otras usuarias</p>
          <div className="bg-[#f8f4f0] rounded-lg p-3">
            <p className="text-sm text-[#7a2323]">Próximamente disponible</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full bg-[#f5ede6] overflow-hidden">
      <DraggableGrid
        items={dashboardItems}
        onItemsChange={(newItems) => {
          console.log("Grid items reordenados:", newItems);
        }}
      />
    </div>
  );
};

export default DashboardPage;
