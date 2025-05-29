import React, { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import DraggableGrid from "../components/DraggableGrid";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  console.log("DashboardPage: Renderizando para usuario:", user?.email);

  // Componentes del dashboard - Memoizados para evitar recreación
  const dashboardItems = useMemo(
    () => [
      {
        id: "cycle",
        title: "Tu Ciclo",
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
                <span className="text-2xl">🌸</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-primary-dark text-center text-sm leading-relaxed font-medium">
                Información sobre tu ciclo menstrual actual
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
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: "bg-secondary",
                    }}
                  ></div>
                  <p className="text-xs text-primary-dark font-semibold">
                    Estado:{" "}
                    {user?.onboarding?.completed
                      ? "Configurado"
                      : "Pendiente configuración"}
                  </p>
                </div>
              </div>
            </div>
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
                    0 síntomas hoy
                  </span>
                </div>
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
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: "bg-secondary",
                    }}
                  ></div>
                  <p className="text-xs text-primary-dark font-semibold">
                    Datos disponibles próximamente
                  </p>
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
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: "bg-secondary",
                  boxShadow: `
                  inset 4px 4px 8px rgba(91, 1, 8, 0.3),
                  inset -4px -4px 8px rgba(181, 65, 58, 0.2)
                `,
                }}
              >
                <span className="text-2xl">🔔</span>
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
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: "bg-secondary",
                    }}
                  ></div>
                  <p className="text-xs text-primary-dark font-semibold">
                    No hay recordatorios pendientes
                  </p>
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
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: "bg-secondary",
                    }}
                  ></div>
                  <p className="text-xs text-primary-dark font-semibold">
                    Explora contenido personalizado
                  </p>
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
              </div>
            </div>
          </div>
        ),
      },
    ],
    [user?.onboarding?.completed]
  );

  return (
    <div className="w-full h-full bg-secondary overflow-hidden">
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
