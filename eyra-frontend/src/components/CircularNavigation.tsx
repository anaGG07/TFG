import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../router/paths";
import Blob from "./Blob";
import { useLogout } from "../hooks/useLogout";

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
    stroke="currentColor"
    strokeWidth="2"
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
    stroke="currentColor"
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

const InsightsIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const ProfileIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m17-4a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 15a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
  </svg>
);

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);


const CircularNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const handleLogout = useLogout();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const blobRef = useRef<HTMLDivElement>(null);

  // Configuración de elementos de navegación con iconos SVG
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
      id: "insights",
      label: "Insights",
      icon: InsightsIcon,
      route: ROUTES.INSIGHTS,
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
      id: "settings",
      label: "Configuración",
      icon: SettingsIcon,
      route: ROUTES.SETTINGS,
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

  // Calcular posición de los elementos en el círculo
  const getItemPosition = (index: number) => {
    const radius = 60; // Radio con más margen del borde
    const centerX = 119; // Centro del blob
    const centerY = 119;

    const angleOffset = -Math.PI / 2; // Comenzar desde arriba
    const angle =
      (index * (Math.PI * 2)) / navigationItems.length + angleOffset;

    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  };

  // Determinar qué texto mostrar
  const getDisplayText = () => {
    if (!isVisible) {
      return user?.name || "Usuario";
    }
    if (hoveredIndex !== null) {
      return navigationItems[hoveredIndex]?.label;
    }
    return navigationItems[currentIndex]?.label;
  };

  return (
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
          const position = getItemPosition(index);
          const isActive = index === currentIndex;
          const isHovered = index === hoveredIndex;
          const IconComponent = item.icon;

          return (
            <div
              key={item.id}
              className={`absolute transition-all duration-300 ease-out transform
              ${isActive ? "scale-110 z-30" : "scale-85 z-20"}
              ${isHovered ? "scale-125" : ""}
            `}
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
                    ? "bg-white bg-opacity-25 shadow-lg border-2 border-white border-opacity-50"
                    : "bg-white bg-opacity-10 border border-white border-opacity-20"
                }
                cursor-pointer hover:bg-opacity-40 transition-all duration-200
              `}
                onClick={() => selectItem(index)}
              >
                <IconComponent className="w-4 h-4 text-white" />
              </div>
            </div>
          );
        })}


      {/* Texto central dinámico */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
        <div className="text-center">
          <p
            className={`text-3xl font-semibold text-white drop-shadow-lg transition-all duration-300 ${
              isVisible ? "opacity-0" : "opacity-100"
            }`}
          >
            {!isVisible ? user?.name || "Usuario" : ""}
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
  );
};

export default CircularNavigation;
