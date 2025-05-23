import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../router/paths";
import Blob from "./Blob";
import { useLogout } from "../hooks/useLogout";
import * as LucideIcons from "lucide-react";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  route: string;
  color?: string;
}

const CircularNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = useLogout();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const blobRef = useRef<HTMLDivElement>(null);

  // Configuración de elementos de navegación con iconos Lucide
  const navigationItems: NavigationItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LucideIcons.Home,
      route: ROUTES.DASHBOARD,
      color: "#C62328",
    },
    {
      id: "calendar",
      label: "Calendario",
      icon: LucideIcons.Calendar,
      route: ROUTES.CALENDAR,
      color: "#8B1538",
    },
    {
      id: "insights",
      label: "Insights",
      icon: LucideIcons.BarChart3,
      route: ROUTES.INSIGHTS,
      color: "#A91D3A",
    },
    {
      id: "profile",
      label: "Perfil",
      icon: LucideIcons.User,
      route: ROUTES.PROFILE,
      color: "#7A1E2D",
    },
    {
      id: "settings",
      label: "Configuración",
      icon: LucideIcons.Settings,
      route: ROUTES.SETTINGS,
      color: "#6B1A28",
    },
    {
      id: "logout",
      label: "Cerrar Sesión",
      icon: LucideIcons.LogOut,
      route: "",
      color: "#E53E3E",
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
  };



  // Manejar selección de item (solo cuando se hace click en un icono)
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
    const radius = 50; // Radio con más margen del borde
    const centerX = 100; // Centro del blob más pequeño
    const centerY = 100;

    // Ajustar ángulo para que los iconos estén mejor centrados respecto al eje central
    const angleOffset = -Math.PI / 2; // Comenzar desde arriba
    const angle =
      (index * (Math.PI * 2)) / navigationItems.length + angleOffset;

    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  };

  return (
    <div
      className="fixed top-2 left-2 w-[200px] h-[200px] z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Blob de fondo más pequeño */}
      <div ref={blobRef} className="absolute inset-0">
        <Blob
          width={200}
          height={200}
          color={navigationItems[currentIndex]?.color || "#C62328"}
          radius={80}
        />
      </div>

      {/* Elementos de navegación circular - TODOS VISIBLES */}
      {navigationItems.map((item, index) => {
        const position = getItemPosition(index);
        const isActive = index === currentIndex;
        const IconComponent = item.icon;

        return (
          <div
            key={item.id}
            className={`absolute transition-all duration-300 ease-out transform
            ${isActive ? "scale-110 z-30" : "scale-85 z-20"}
          `}
            style={{
              left: `${position.x - 18}px`,
              top: `${position.y - 18}px`,
              opacity: isActive ? 1 : 0.4, // Elementos no activos con opacidad
            }}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold
              ${
                isActive
                  ? "bg-white bg-opacity-25 shadow-lg border-2 border-white border-opacity-50"
                  : "bg-white bg-opacity-10 border border-white border-opacity-20"
              }
              cursor-pointer hover:bg-opacity-40 hover:scale-105 transition-all duration-200
            `}
              onClick={() => selectItem(index)}
            >
              <IconComponent size={16} className="text-white" />
            </div>
          </div>
        );
      })}

      {/* Indicador sutil del elemento actual */}
      {isVisible && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3">
          <p className="text-sm font-semibold text-[#C62328] drop-shadow-sm">
            {navigationItems[currentIndex]?.label}
          </p>
        </div>
      )}

      
    </div>
  );
};

export default CircularNavigation;
