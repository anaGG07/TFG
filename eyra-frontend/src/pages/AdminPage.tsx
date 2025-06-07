// ! 31/05/2025 - Página de administración completamente actualizada con gestión de usuarios
// ! 31/05/2025 - Activados componentes de gestión de usuarios

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  adminStatsService,
  AdminStats,
  RecentActivity,
} from "../services/adminStatsService";
import UsersTable from "../features/admin/components/UsersTable";
import ConditionsTable from "../features/admin/components/ConditionsTable"; // ! 01/06/2025 - CRUD de condiciones médicas
import ContentTable from "../features/admin/components/ContentTable"; // ! 01/06/2025 - CRUD de contenido
import { NeomorphicCard } from "../components/ui/NeomorphicComponents";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Iconos para las pestañas
const OverviewIcon = ({ active }: { active: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="4" y="16" width="4" height="8" rx="2" fill={active ? "#f8b4b4" : "#e7e0d5"} />
    <rect x="12" y="8" width="4" height="16" rx="2" fill={active ? "#a7f3d0" : "#e7e0d5"} />
    <rect x="20" y="4" width="4" height="20" rx="2" fill={active ? "#ddd6fe" : "#e7e0d5"} />
  </svg>
);
const UsersIcon = ({ active }: { active: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="10" cy="12" r="4" fill={active ? "#f8b4b4" : "#e7e0d5"} />
    <circle cx="18" cy="12" r="4" fill={active ? "#a7f3d0" : "#e7e0d5"} />
    <ellipse cx="14" cy="20" rx="8" ry="4" fill={active ? "#ddd6fe" : "#e7e0d5"} />
  </svg>
);
const ConditionsIcon = ({ active }: { active: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="12" fill={active ? "#a7f3d0" : "#e7e0d5"} />
    <path d="M14 8v8" stroke="#C62328" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="14" cy="20" r="1.5" fill="#C62328" />
  </svg>
);
const ContentIcon = ({ active }: { active: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="6" y="6" width="16" height="16" rx="4" fill={active ? "#f8b4b4" : "#e7e0d5"} />
    <path d="M10 12h8M10 16h8" stroke="#C62328" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Iconos para el toggle de gráfica/tabla
const ChartToggleIcon = ({ active }: { active: boolean }) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="16" fill={active ? "#f8b4b4" : "#e7e0d5"} style={{ filter: active ? "blur(2px)" : "none" }} />
    <path d="M12 24V16" stroke="#C62328" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M18 24V12" stroke="#C62328" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M24 24V20" stroke="#C62328" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);
const TableToggleIcon = ({ active }: { active: boolean }) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="16" fill={active ? "#a7f3d0" : "#e7e0d5"} style={{ filter: active ? "blur(2px)" : "none" }} />
    <rect x="11" y="13" width="14" height="10" rx="2" fill="#C62328" fillOpacity={active ? 0.7 : 0.3} />
    <rect x="13" y="15" width="3" height="6" rx="1" fill="#fff" />
    <rect x="20" y="15" width="3" height="6" rx="1" fill="#fff" />
  </svg>
);

const AdminPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "conditions" | "content" | "settings"
  >("overview"); // ! 01/06/2025 - Añadida pestaña conditions

  // Estados para datos reales
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChart, setShowChart] = useState(false);

  // Cargar datos cuando el componente se monta
  const loadData = async () => {
    if (!user || !user.roles.includes("ROLE_ADMIN")) {
      return;
    }

    try {
      setIsLoadingStats(true);
      setError(null);

      const [statsData, activityData] = await Promise.all([
        adminStatsService.getSystemStats(),
        adminStatsService.getRecentActivity(),
      ]);

      setStats(statsData);
      setRecentActivity(activityData);
    } catch (err: any) {
      console.error("Error cargando datos de administración:", err);
      setError(err.message || "Error al cargar los datos");
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  if (authLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d30006]"></div>
      </div>
    );
  }

  if (!user || !user.roles.includes("ROLE_ADMIN")) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Acceso Denegado
          </h1>
          <p className="text-gray-600">
            No tienes permisos para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Resumen", icon: OverviewIcon },
    { id: "users", label: "Usuarios", icon: UsersIcon },
    { id: "conditions", label: "Condiciones", icon: ConditionsIcon },
    { id: "content", label: "Contenido", icon: ContentIcon },
  ] as const;

  // Datos para la gráfica circular
  const doughnutData = {
    labels: ["Usuarios", "Activos", "Admins"],
    datasets: [
      {
        label: "Cantidad",
        data: [stats?.totalUsers || 0, stats?.activeUsers || 0, stats?.adminUsers || 0],
        backgroundColor: [
          "#F8B4B4", // pastel rojo
          "#A7F3D0", // pastel verde
          "#DDD6FE", // pastel violeta
        ],
        borderWidth: 6,
        borderColor: "#fff",
        hoverOffset: 10,
        cutout: "70%",
      },
    ],
  };
  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    cutout: "70%",
  };

  return (
    <div className="w-full h-full min-h-0 flex flex-col overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto pl-8 pr-4 pt-6 pb-6 flex flex-col h-full min-h-0">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-[#7a2323] mb-2 font-serif">Panel de Administración</h1>
          <p className="text-[#7a2323]/70">Bienvenido/a, {user.name}. Aquí puedes gestionar el sistema EYRA.</p>
        </div>
        {/* Navegación por pestañas */}
        <div className="flex flex-row gap-3 items-center mb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl p-2 transition-all duration-200 focus:outline-none flex items-center justify-center
                  ${activeTab === tab.id
                    ? "bg-[#f8b4b4]/60 ring-2 ring-[#C62328] shadow-inner"
                    : "bg-transparent hover:bg-[#f8b4b4]/30"}
                `}
                aria-label={tab.label}
                style={{ minWidth: 44, minHeight: 44 }}
              >
                <Icon active={activeTab === tab.id} />
              </button>
            );
          })}
        </div>
        {/* Contenido por pestañas */}
        <div className="bg-transparent rounded-lg shadow-none p-0 flex-1 min-h-0">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-8">
              {/* Columna 1: Resumen o gráfica con toggle */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-2 mb-2">
                  <button
                    className={`rounded-full p-2 transition-all duration-200 ${!showChart ? "ring-2 ring-[#a7f3d0] bg-white" : "bg-transparent"}`}
                    onClick={() => setShowChart(false)}
                    aria-label="Ver resumen"
                  >
                    <TableToggleIcon active={!showChart} />
                  </button>
                  <button
                    className={`rounded-full p-2 transition-all duration-200 ${showChart ? "ring-2 ring-[#f8b4b4] bg-white" : "bg-transparent"}`}
                    onClick={() => setShowChart(true)}
                    aria-label="Ver gráfica"
                  >
                    <ChartToggleIcon active={showChart} />
                  </button>
                </div>
                {showChart ? (
                  <div className="w-full max-w-xs mx-auto rounded-full p-0 flex items-center justify-center relative">
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                    {/* Círculo central con total de usuarios */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-[#C62328] font-serif drop-shadow">{stats?.totalUsers?.toLocaleString() || "0"}</span>
                      <span className="text-base text-[#7a2323]/70 font-serif">Usuarios</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 w-full justify-center">
                    <NeomorphicCard className="flex flex-col items-center justify-center gap-1 bg-[#f8b4b4]/30 w-28 h-28 min-w-[6.5rem] min-h-[6.5rem] max-w-[7rem] max-h-[7rem]">
                      <h3 className="text-base font-semibold text-[#C62328] font-serif">Usuarios</h3>
                      <p className="text-3xl font-bold text-[#991b1b]">{stats?.totalUsers?.toLocaleString() || "0"}</p>
                    </NeomorphicCard>
                    <NeomorphicCard className="flex flex-col items-center justify-center gap-1 bg-[#a7f3d0]/30 w-28 h-28 min-w-[6.5rem] min-h-[6.5rem] max-w-[7rem] max-h-[7rem]">
                      <h3 className="text-base font-semibold text-[#15803d] font-serif">Activos</h3>
                      <p className="text-3xl font-bold text-[#15803d]">{stats?.activeUsers?.toLocaleString() || "0"}</p>
                    </NeomorphicCard>
                    <NeomorphicCard className="flex flex-col items-center justify-center gap-1 bg-[#ddd6fe]/30 w-28 h-28 min-w-[6.5rem] min-h-[6.5rem] max-w-[7rem] max-h-[7rem]">
                      <h3 className="text-base font-semibold text-[#7c2d12] font-serif">Admins</h3>
                      <p className="text-3xl font-bold text-[#7c2d12]">{stats?.adminUsers?.toLocaleString() || "0"}</p>
                    </NeomorphicCard>
                  </div>
                )}
              </div>
              {/* Columna 2: Actividad reciente */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold text-[#7a2323] font-serif mb-2">Actividad Reciente</h3>
                <div className="space-y-3">
                  {isLoadingStats ? (
                    <div className="animate-pulse flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ) : (
                    recentActivity.slice(0, 5).map((activity) => {
                      const bgColor =
                        activity.color === "green"
                          ? "bg-[#a7f3d0]/30 border-[#bbf7d0]"
                          : activity.color === "red"
                          ? "bg-[#f8b4b4]/30 border-[#fecaca]"
                          : "bg-[#ddd6fe]/30 border-[#e9d5ff]";

                      const textColor =
                        activity.color === "green"
                          ? "text-[#15803d]"
                          : activity.color === "red"
                          ? "text-[#d30006]"
                          : "text-[#7c2d12]";

                      return (
                        <div
                          key={activity.id}
                          className={`flex items-center space-x-3 p-3 ${bgColor} rounded-lg border`}
                        >
                          <span className={textColor}>{activity.icon}</span>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-[#7a2323]">{activity.title}</div>
                            <div className="text-xs text-[#7a2323]/60">{adminStatsService.formatRelativeTime(activity.timestamp)}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  {!isLoadingStats && recentActivity.length === 0 && (
                    <div className="text-center py-4 text-gray-500">No hay actividad reciente</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Gestión de Usuarios
              </h2>
              <UsersTable onRefresh={() => loadData()} />
            </div>
          )}

          {/* ! 01/06/2025 - Nueva sección para CRUD de condiciones médicas */}
          {activeTab === "conditions" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Gestión de Condiciones Médicas
              </h2>
              <ConditionsTable onRefresh={() => loadData()} />
            </div>
          )}

          {activeTab === "content" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Gestión de Contenido
              </h2>
              <ContentTable onRefresh={() => loadData()} />
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Configuración del Sistema
              </h2>
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">⚙️</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Próximamente
                </h3>
                <p className="text-gray-600">
                  Las configuraciones del sistema estarán disponibles en una
                  próxima actualización.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
//comentario de control
export default AdminPage;
