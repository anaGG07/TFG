import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../router/paths";
import Blob from "./Blob";
import { useLogout } from "../hooks/useLogout";
import { useIsAdmin } from "../hooks/useIsAdmin";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  color?: string;
}

// Iconos SVG personalizados lineales
const HomeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <circle cx="8" cy="16" r="1" />
    <circle cx="12" cy="16" r="1" />
    <circle cx="16" cy="16" r="1" />
  </svg>
);

// Nuevo icono de Biblioteca (diseño original siguiendo el estilo)
const LibraryIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <path d="M8 7h8" />
    <path d="M8 11h6" />
    <path d="M8 15h4" />
  </svg>
);

const ProfileIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// Nuevo icono de Seguimiento/Compartidos (diseño original siguiendo el estilo)
const TrackingIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

// Nuevo icono central de IA (diseño original siguiendo el estilo)
const AIIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6" />
    <path d="M12 17v6" />
    <path d="M4.22 4.22l4.24 4.24" />
    <path d="M15.54 15.54l4.24 4.24" />
    <path d="M1 12h6" />
    <path d="M17 12h6" />
    <path d="M4.22 19.78l4.24-4.24" />
    <path d="M15.54 8.46l4.24-4.24" />
  </svg>
);

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// Nuevo icono de Administración
const AdminIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 15v2" />
    <path d="M12 3v4" />
    <path d="M3 12h4" />
    <path d="M17 12h4" />
    <path d="M18.364 5.636l-2.828 2.828" />
    <path d="M8.464 15.536l-2.828 2.828" />
    <path d="M5.636 5.636l2.828 2.828" />
    <path d="M15.536 15.536l2.828 2.828" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const AdminNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const handleLogout = useLogout();
  const isAdmin = useIsAdmin();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const blobRef = useRef<HTMLDivElement>(null);

  // Si no es administrador, no renderizar nada
  if (!isAdmin) {
    return null;
  }

  // ! 31/05/2025 - Configuración específica para administradores
  const navigationItems: NavigationItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: HomeIcon,
      route: ROUTES.DASHBOARD,
      color: "#C62328",
    },
    {
      id: "calendar",
      label: "Calendario",
      icon: CalendarIcon,
      route: ROUTES.CALENDAR,
      color: "#B30E13",
    },
    {
      id: "library",
      label: "Biblioteca",
      icon: LibraryIcon,
      route: "/library",
      color: "#880004",
    },
    {
      id: "profile",
      label: "Perfil",
      icon: ProfileIcon,
      route: ROUTES.PROFILE,
      color: "#730003",
    },
    {
      id: "tracking",
      label: "Seguimiento",
      icon: TrackingIcon,
      route: "/tracking",
      color: "#470002",
    },
    {
      id: "ai-assistant",
      label: "Asistente IA",
      icon: AIIcon,
      route: "/ai-assistant",
      color: "#470002",
    },
    {
      id: "logout",
      label: "Cerrar Sesión",
      icon: LogoutIcon,
      route: "",
      color: "#360001",
    },
  ];

  // Detectar ruta actual y establecer índice
  useEffect(() => {
    const currentPath = location.pathname;
    const index = navigationItems.findIndex(
      (item) => item.route === currentPath
    );
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [location.pathname]);

  // Manejar hover sobre el blob
  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
    setHoveredIndex(null);
  };

  // Manejar selección de item
  const selectItem = (index: number) => {
    const item = navigationItems[index];
    if (item.id === "logout") {
      handleLogout();
    } else if (item.route) {
      navigate(item.route);
    }
  };

  // ! 31/05/2025 - Manejar click del botón admin
  const handleAdminClick = () => {
    navigate("/admin");
  };

  // Calcular posición de los elementos en el círculo
  const getItemPosition = (index: number, itemId: string) => {
    // Si es el asistente IA, posición central
    if (itemId === "ai-assistant") {
      return {
        x: 119,
        y: 119,
      };
    }

    // Para los demás elementos, calcular posición circular excluyendo la IA
    const circularItems = navigationItems.filter(
      (item) => item.id !== "ai-assistant"
    );
    const circularIndex = circularItems.findIndex(
      (item) => item.id === navigationItems[index].id
    );

    if (circularIndex === -1) return { x: 119, y: 119 };

    const radius = 60;
    const centerX = 119;
    const centerY = 119;

    const angleOffset = -Math.PI / 2; // Comenzar desde arriba
    const angle =
      (circularIndex * (Math.PI * 2)) / circularItems.length + angleOffset;

    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  };

  // Determinar qué texto mostrar
  const getDisplayText = () => {
    if (!isVisible) {
      return user?.name || "Admin";
    }
    if (hoveredIndex !== null) {
      return navigationItems[hoveredIndex]?.label;
    }
    return navigationItems[currentIndex]?.label;
  };

  // Verificar si estamos en el panel admin
  const isInAdminPanel = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Navegación circular principal */}
      <div
        className="fixed top-2 left-2 w-[250px] h-[250px] z-50"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Blob de fondo */}
        <div ref={blobRef} className="absolute inset-0">
          <Blob
            width={250}
            height={250}
            color={navigationItems[currentIndex]?.color || "#C62328"}
            radius={110}
          />
        </div>

        {/* Elementos de navegación circular - Solo visibles en hover */}
        {isVisible &&
          navigationItems.map((item, index) => {
            const position = getItemPosition(index, item.id);
            const isActive = index === currentIndex;
            const isHovered = index === hoveredIndex;
            const isAI = item.id === "ai-assistant";

            return (
              <div
                key={item.id}
                className={`absolute transition-all duration-300 ease-out transform
                ${isActive ? "scale-110 z-30" : "scale-85 z-20"}
                ${isHovered ? "scale-125" : ""}
                ${isAI ? "z-40" : ""}`}
                style={{
                  left: `${position.x - 18}px`,
                  top: `${position.y - 18}px`,
                  opacity: isActive ? 1 : 0.4,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold
                  ${
                    isActive || isHovered
                      ? " bg-opacity-25"
                      : " bg-opacity-10  "
                  }
                  cursor-pointer hover:bg-opacity-40 transition-all duration-200
                `}
                  onClick={() => selectItem(index)}
                >
                  <item.icon className="w-10 h-10 text-white" />
                </div>
              </div>
            );
          })}

        {/* Texto central dinámico - Solo cuando NO está visible el menú */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <div className="text-center">
            <p
              className={`capitalize text-3xl font-semibold text-white drop-shadow-lg transition-all duration-300 ${
                isVisible ? "opacity-0" : "opacity-100"
              }`}
            >
              {!isVisible ? user?.name || "Admin" : ""}
            </p>
          </div>
        </div>

        {/* Texto del elemento actual/hover */}
        <div className="absolute top-60 left-1/2 transform -translate-x-1/2 mt-3">
          <p
            className={`text-xl font-semibold text-[#C62328] capitalize drop-shadow-sm transition-all duration-300 text-center ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {getDisplayText()}
          </p>
        </div>
      </div>

      {/* ! 31/05/2025 - Botón de administración prominente */}
      {isAdmin && (
        <div
          className="fixed bottom-6 left-6 z-50 group"
          title="Panel de Administración"
        >
          <div
            className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white font-bold cursor-pointer
            shadow-2xl transition-all duration-300 transform hover:scale-115 hover:shadow-3xl
            ${
              isInAdminPanel
                ? "bg-gradient-to-br from-red-600 to-red-800 ring-4 ring-red-300 ring-opacity-60 scale-110 shadow-red-500/50"
                : "bg-gradient-to-br from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 shadow-red-600/40"
            }
            animate-pulse hover:animate-none border-2 border-red-400/30`}
            onClick={handleAdminClick}
          >
            <AdminIcon className="w-12 h-12 text-white drop-shadow-lg" />

            {/* Efecto de brillo */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent"></div>

            {/* Indicador de estado activo */}
            {isInAdminPanel && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          {/* Etiqueta del botón mejorada */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-xl border border-gray-700">
              <span className="font-semibold">Panel de Administración</span>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavigation;
