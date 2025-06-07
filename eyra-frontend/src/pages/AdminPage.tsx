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
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
    { id: "overview", label: "Resumen", icon: "📊" },
    { id: "users", label: "Usuarios", icon: "👥" },
    { id: "conditions", label: "Condiciones", icon: "🎯" }, // ! 01/06/2025 - Nueva pestaña condiciones
    { id: "content", label: "Contenido", icon: "📝" },
    { id: "settings", label: "Configuración", icon: "⚙️" },
  ] as const;

  // Datos para la gráfica
  const chartData = {
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
        borderRadius: 12,
        borderWidth: 0,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#7a2323", font: { weight: 'bold' as const } },
      },
      y: {
        grid: { color: "#f3f3f3" },
        ticks: { color: "#7a2323", font: { weight: 'bold' as const }, stepSize: 1 },
        beginAtZero: true,
        precision: 0,
      },
    },
  };

  return (
    <div className="w-full h-full min-h-0 flex flex-col overflow-hidden bg-[#f7f3ef]">
      <div className="max-w-7xl mx-auto p-6 flex flex-col h-full min-h-0">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-[#7a2323] mb-2 font-serif">Panel de Administración</h1>
          <p className="text-[#7a2323]/70">Bienvenido/a, {user.name}. Aquí puedes gestionar el sistema EYRA.</p>
        </div>
        {/* Navegación por pestañas */}
        <NeomorphicCard className="mb-0 p-0 flex flex-row gap-2 items-center justify-start shadow-neomorphic" compact>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-xl font-semibold text-base transition-all duration-200 focus:outline-none font-serif
                ${activeTab === tab.id
                  ? "bg-[#f8b4b4]/60 text-[#C62328] shadow-inner"
                  : "bg-transparent text-[#7a2323]/70 hover:bg-[#f8b4b4]/30"}
              `}
              style={{ minWidth: 120 }}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </NeomorphicCard>
        {/* Toggle gráfico/cajas */}
        <div className="flex items-center gap-3 mt-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showChart}
              onChange={() => setShowChart((v) => !v)}
              className="accent-[#C62328] w-5 h-5 rounded"
            />
            <span className="text-[#7a2323] font-medium">Ver como gráfica</span>
          </label>
        </div>
        {/* Contenido por pestañas */}
        <div className="bg-transparent rounded-lg shadow-none p-0 flex-1 min-h-0">
          {activeTab === "overview" && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-semibold mb-2 text-[#7a2323] font-serif">Resumen del Sistema</h2>
              {/* Estadísticas simples o gráfica */}
              {showChart ? (
                <div className="w-full max-w-lg mx-auto bg-white rounded-2xl p-6 shadow-neomorphic">
                  <Bar data={chartData} options={chartOptions} height={180} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <NeomorphicCard className="flex flex-col items-center justify-center gap-2 bg-[#f8b4b4]/30">
                    <h3 className="text-lg font-semibold text-[#C62328] font-serif">Usuarios</h3>
                    <p className="text-3xl font-bold text-[#991b1b]">{stats?.totalUsers?.toLocaleString() || "0"}</p>
                  </NeomorphicCard>
                  <NeomorphicCard className="flex flex-col items-center justify-center gap-2 bg-[#a7f3d0]/30">
                    <h3 className="text-lg font-semibold text-[#15803d] font-serif">Activos</h3>
                    <p className="text-3xl font-bold text-[#15803d]">{stats?.activeUsers?.toLocaleString() || "0"}</p>
                  </NeomorphicCard>
                  <NeomorphicCard className="flex flex-col items-center justify-center gap-2 bg-[#ddd6fe]/30">
                    <h3 className="text-lg font-semibold text-[#7c2d12] font-serif">Admins</h3>
                    <p className="text-3xl font-bold text-[#7c2d12]">{stats?.adminUsers?.toLocaleString() || "0"}</p>
                  </NeomorphicCard>
                </div>
              )}
              {/* Acciones rápidas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Acciones Rápidas
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab("users")}
                      className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            Gestionar Usuarios
                          </div>
                          <div className="text-sm text-gray-500">
                            Ver, editar y administrar cuentas
                          </div>
                        </div>
                        <span className="text-2xl">👥</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab("conditions")}
                      className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            Gestionar Condiciones
                          </div>
                          <div className="text-sm text-gray-500">
                            Administrar condiciones médicas
                          </div>
                        </div>
                        <span className="text-2xl">🎯</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab("content")}
                      className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            Gestionar Contenido
                          </div>
                          <div className="text-sm text-gray-500">
                            Administrar artículos y recursos
                          </div>
                        </div>
                        <span className="text-2xl">📝</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Actividad Reciente
                  </h3>
                  <div className="space-y-3">
                    {isLoadingStats ? (
                      // Skeleton loading para actividad reciente
                      <>
                        <div className="animate-pulse flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-6 h-6 bg-gray-200 rounded"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                        <div className="animate-pulse flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-6 h-6 bg-gray-200 rounded"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      </>
                    ) : (
                      recentActivity.slice(0, 5).map((activity) => {
                        const bgColor =
                          activity.color === "green"
                            ? "bg-[#f0fdf4] border-[#bbf7d0]"
                            : activity.color === "red"
                            ? "bg-[#fff1f1] border-[#fecaca]"
                            : "bg-[#f0f9ff] border-[#bae6fd]";

                        const textColor =
                          activity.color === "green"
                            ? "text-[#15803d]"
                            : activity.color === "red"
                            ? "text-[#d30006]"
                            : "text-[#0369a1]";

                        return (
                          <div
                            key={activity.id}
                            className={`flex items-center space-x-3 p-3 ${bgColor} rounded-lg border`}
                          >
                            <span className={textColor}>{activity.icon}</span>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {activity.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {adminStatsService.formatRelativeTime(
                                  activity.timestamp
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}

                    {!isLoadingStats && recentActivity.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        No hay actividad reciente
                      </div>
                    )}
                  </div>
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
