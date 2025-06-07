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
import { motion, AnimatePresence } from "framer-motion";

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

// Iconos SVG estilo CircularNavigation para actividad reciente
const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="11" fill="#bbf7d0" />
    <path d="M7 13l3 3 7-7" stroke="#15803d" strokeWidth="2.5" />
  </svg>
);
const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#d30006" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" fill="#fecaca" />
    <path d="M4 20v-1a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1" fill="#fff" />
    <circle cx="12" cy="8" r="4" stroke="#d30006" strokeWidth="2.5" fill="none" />
  </svg>
);
const DiskIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="11" fill="#ddd6fe" />
    <rect x="7" y="7" width="10" height="10" rx="2" fill="#fff" />
    <circle cx="12" cy="12" r="3" fill="#ddd6fe" stroke="#7c2d12" />
  </svg>
);

// Iconos SVG para las cajas de resumen (silueta grande, centrada y ocupando todo el viewBox)
const UsersSummaryIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" width="100%" height="100%" fill="none" stroke="#C62328" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="32" cy="22" r="14" />
    <path d="M8 60c0-12 10-22 24-22s24 10 24 22" />
  </svg>
);
const ActiveSummaryIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" width="100%" height="100%" fill="none" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="32" cy="22" r="14" />
    <path d="M8 60c0-12 10-22 24-22s24 10 24 22" />
    <polyline points="40 40 50 50 60 34" stroke="#15803d" strokeWidth="5" fill="none" />
  </svg>
);
const AdminSummaryIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" width="100%" height="100%" fill="none" stroke="#7c2d12" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="32" cy="22" r="14" />
    <path d="M8 60c0-12 10-22 24-22s24 10 24 22" />
    <path d="M32 2l6 10 10-4-6 10" stroke="#7c2d12" strokeWidth="3.5" fill="none" />
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
    { id: "overview", label: "Resumen" },
    { id: "users", label: "Usuarios" },
    { id: "conditions", label: "Condiciones" },
    { id: "content", label: "Contenido" },
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
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-5 py-2 font-semibold text-base font-serif transition-all duration-200 focus:outline-none neo-shadow-sm
                ${activeTab === tab.id ? "bg-[#f8b4b4]/60 ring-2 ring-[#C62328] shadow-inner text-[#C62328]" : "bg-transparent hover:bg-[#f8b4b4]/30 text-[#7a2323]"}
              `}
              aria-label={tab.label}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Contenido por pestañas */}
        <div className="w-full flex-1 flex flex-col items-center">
          <div className="w-full max-w-5xl min-w-[1100px] min-h-[520px] bg-transparent rounded-lg shadow-none p-0 flex-1 flex flex-col justify-start">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  className="grid grid-cols-1 md:grid-cols-[1fr_370px] gap-12 items-start mt-8 min-h-[420px]"
                  style={{ minWidth: 0 }}
                >
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
                    <AnimatePresence mode="wait">
                      {showChart ? (
                        <motion.div
                          key="doughnut"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="w-full max-w-xs mx-auto rounded-full p-0 flex items-center justify-center relative"
                        >
                          <Doughnut data={doughnutData} options={doughnutOptions} />
                          {/* Círculo central con total de usuarios */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-[#C62328] font-serif drop-shadow">{stats?.totalUsers?.toLocaleString() || "0"}</span>
                            <span className="text-base text-[#7a2323]/70 font-serif">Usuarios</span>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="resumen"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full justify-center mt-4 mb-4"
                        >
                          <div className="flex flex-col items-center">
                            <UsersSummaryIcon className="w-40 h-40 mb-2" />
                            <NeomorphicCard className="flex flex-col items-center justify-center gap-3 bg-[#f8b4b4]/30 w-36 h-36 min-w-[8rem] min-h-[8rem] max-w-[9rem] max-h-[9rem] p-0">
                              <h3 className="text-base font-semibold text-[#C62328] font-serif">Usuarios</h3>
                              <p className="text-3xl font-bold text-[#991b1b]">{stats?.totalUsers?.toLocaleString() || "0"}</p>
                            </NeomorphicCard>
                          </div>
                          <div className="flex flex-col items-center">
                            <ActiveSummaryIcon className="w-40 h-40 mb-2" />
                            <NeomorphicCard className="flex flex-col items-center justify-center gap-3 bg-[#a7f3d0]/30 w-36 h-36 min-w-[8rem] min-h-[8rem] max-w-[9rem] max-h-[9rem] p-0">
                              <h3 className="text-base font-semibold text-[#15803d] font-serif">Activos</h3>
                              <p className="text-3xl font-bold text-[#15803d]">{stats?.activeUsers?.toLocaleString() || "0"}</p>
                            </NeomorphicCard>
                          </div>
                          <div className="flex flex-col items-center">
                            <AdminSummaryIcon className="w-40 h-40 mb-2" />
                            <NeomorphicCard className="flex flex-col items-center justify-center gap-3 bg-[#ddd6fe]/30 w-36 h-36 min-w-[8rem] min-h-[8rem] max-w-[9rem] max-h-[9rem] p-0">
                              <h3 className="text-base font-semibold text-[#7c2d12] font-serif">Admins</h3>
                              <p className="text-3xl font-bold text-[#7c2d12]">{stats?.adminUsers?.toLocaleString() || "0"}</p>
                            </NeomorphicCard>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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

                          // Elegir icono SVG según tipo/color
                          let Icon = null;
                          if (activity.color === "green") Icon = CheckIcon;
                          else if (activity.color === "red") Icon = UserIcon;
                          else Icon = DiskIcon;

                          // Mostrar nombre en registro de usuario
                          let title = activity.title;
                          if (activity.type === "user_registered" && activity.description) {
                            // Extraer nombre del usuario del description
                            const match = activity.description.match(/([\wáéíóúüñÁÉÍÓÚÜÑ\s\-\.]+)/i);
                            const nombre = match ? match[1].trim() : "";
                            title = `Nuevo usuario: ${nombre}`;
                          }

                          return (
                            <div
                              key={activity.id}
                              className={`flex items-center space-x-3 p-3 ${bgColor} rounded-lg border`}
                            >
                              <span className="flex items-center justify-center neo-shadow-sm rounded-full bg-white/80 border border-white" style={{ width: 38, height: 38, minWidth: 38, minHeight: 38 }}>
                                <Icon className="w-7 h-7" />
                              </span>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-[#7a2323]">{title}</div>
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
                </motion.div>
              )}

              {activeTab === "users" && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  className="w-full"
                  style={{ minWidth: 0 }}
                >
                  <h2 className="text-2xl font-semibold mb-6">Gestión de Usuarios</h2>
                  <UsersTable onRefresh={() => loadData()} />
                </motion.div>
              )}

              {activeTab === "conditions" && (
                <motion.div
                  key="conditions"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  className="w-full"
                  style={{ minWidth: 0 }}
                >
                  <h2 className="text-2xl font-semibold mb-6">Gestión de Condiciones</h2>
                  <ConditionsTable onRefresh={() => loadData()} />
                </motion.div>
              )}

              {activeTab === "content" && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  className="w-full"
                  style={{ minWidth: 0 }}
                >
                  <h2 className="text-2xl font-semibold mb-6">Gestión de Contenido</h2>
                  <ContentTable onRefresh={() => loadData()} />
                </motion.div>
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
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
//comentario de control
export default AdminPage;
