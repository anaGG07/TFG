import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../router/paths";
import Blob from "./Blob";
import { useLogout } from "../hooks/useLogout";

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
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

  // Configuración de elementos de navegación
  const navigationItems: NavigationItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "🏠",
      route: ROUTES.DASHBOARD,
      color: "#C62328",
    },
    {
      id: "calendar",
      label: "Calendario",
      icon: "📅",
      route: ROUTES.CALENDAR,
      color: "#8B1538",
    },
    {
      id: "insights",
      label: "Insights",
      icon: "📊",
      route: ROUTES.INSIGHTS,
      color: "#A91D3A",
    },
    {
      id: "profile",
      label: "Perfil",
      icon: "👤",
      route: ROUTES.PROFILE,
      color: "#7A1E2D",
    },
    {
      id: "settings",
      label: "Configuración",
      icon: "⚙️",
      route: ROUTES.SETTINGS,
      color: "#6B1A28",
    },
    {
      id: "logout",
      label: "Cerrar Sesión",
      icon: "🚪",
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
  const getItemPosition = (index: number, isVisible: boolean) => {
    if (!isVisible) return { x: 0, y: 0, opacity: 0 };

    const radius = 90; // Radio del círculo de navegación
    const centerX = 150; // Centro del blob
    const centerY = 150;

    // Ajustar ángulo para que los iconos estén mejor centrados respecto al eje central
    const angleOffset = -Math.PI / 2; // Comenzar desde arriba
    const angle =
      (index * (Math.PI * 2)) / navigationItems.length + angleOffset;

    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      opacity: 1,
    };
  };

  return (
    <div
      className="fixed top-2 left-2 w-[300px] h-[300px] z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Blob de fondo */}
      <div ref={blobRef} className="absolute inset-0">
        <Blob
          width={300}
          height={300}
          color={navigationItems[currentIndex]?.color || "#C62328"}
          radius={120}
        />
      </div>

      {/* Elementos de navegación circular */}
      {isVisible &&
        navigationItems.map((item, index) => {
          const position = getItemPosition(index, isVisible);
          const isActive = index === currentIndex;
          const isAdjacentToCurrent =
            Math.abs(index - currentIndex) === 1 ||
            (currentIndex === 0 && index === navigationItems.length - 1) ||
            (currentIndex === navigationItems.length - 1 && index === 0);

          // Solo mostrar el elemento actual y los adyacentes
          if (!isActive && !isAdjacentToCurrent) return null;

          return (
            <div
              key={item.id}
              className={`absolute transition-all duration-300 ease-out transform
              ${isActive ? "scale-110 z-30" : "scale-90 z-20"}
            `}
              style={{
                left: `${position.x - 20}px`,
                top: `${position.y - 20}px`,
                opacity: position.opacity,
              }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                ${
                  isActive
                    ? "bg-white bg-opacity-20 shadow-lg"
                    : "bg-black bg-opacity-10"
                }
                border-2 border-white border-opacity-30
                cursor-pointer hover:bg-opacity-30 transition-all duration-200
              `}
                onClick={() => selectItem(index)}
              >
                <span className="text-lg">{item.icon}</span>
              </div>
            </div>
          );
        })}

      {/* Botón central para rotar la rueda */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40
                   w-8 h-8 rounded-full bg-white bg-opacity-60 
                   flex items-center justify-center cursor-pointer
                   hover:bg-opacity-80 transition-all duration-200
                   border-2 border-white border-opacity-40"
        onClick={rotateWheel}
      >
        <div className="w-3 h-3 rounded-full bg-white"></div>
      </div>
    </div>
  );
};

export default CircularNavigation;
