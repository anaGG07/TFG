import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../router/paths";
import Blob from "./Blob";
import { useLogout } from "../hooks/useLogout";
import {
  Home,
  Calendar,
  BarChart3,
  User,
  Settings,
  LogOut,
  Hand,
} from "lucide-react";

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
  const { user } = useAuth();
  const handleLogout = useLogout();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const blobRef = useRef<HTMLDivElement>(null);

  // Configuración de elementos de navegación con iconos Lucide
  const navigationItems: NavigationItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      route: ROUTES.DASHBOARD,
      color: "#C62328",
    },
    {
      id: "calendar",
      label: "Calendario",
      icon: Calendar,
      route: ROUTES.CALENDAR,
      color: "#8B1538",
    },
    {
      id: "insights",
      label: "Insights",
      icon: BarChart3,
      route: ROUTES.INSIGHTS,
      color: "#A91D3A",
    },
    {
      id: "profile",
      label: "Perfil",
      icon: User,
      route: ROUTES.PROFILE,
      color: "#7A1E2D",
    },
    {
      id: "settings",
      label: "Configuración",
      icon: Settings,
      route: ROUTES.SETTINGS,
      color: "#6B1A28",
    },
    {
      id: "logout",
      label: "Cerrar Sesión",
      icon: LogOut,
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

  // Rotar la rueda hacia adelante
  const rotateWheel = () => {
    const newIndex =
      currentIndex < navigationItems.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
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
    const radius = 65; // Radio más pequeño del círculo de navegación
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

      {/* Botón central para rotar la rueda con icono de mano */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40
                   w-8 h-8 rounded-full bg-white bg-opacity-70 
                   flex items-center justify-center cursor-pointer
                   hover:bg-opacity-90 hover:scale-110 transition-all duration-200
                   border-2 border-white border-opacity-60 shadow-lg
                   group"
        onClick={rotateWheel}
        title="Click para rotar el menú"
      >
        <Hand
          size={14}
          className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200"
        />
      </div>

      {/* Indicador sutil del elemento actual */}
      {isVisible && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
          <div className="bg-white bg-opacity-90 rounded-md px-2 py-1 shadow-md">
            <p className="text-xs font-medium text-gray-800">
              {navigationItems[currentIndex]?.label}
            </p>
          </div>
        </div>
      )}

      {/* Info del usuario (más compacta) */}
      {isVisible && user && (
        <div className="absolute bottom-full left-0 mb-2 bg-white bg-opacity-90 rounded-md p-2 min-w-[100px] shadow-md">
          <p className="text-xs font-medium text-gray-800 truncate">
            {user.name}
          </p>
          <p className="text-xs text-gray-600 truncate">{user.email}</p>
        </div>
      )}
    </div>
  );
};

export default CircularNavigation;
