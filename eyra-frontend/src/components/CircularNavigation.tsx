import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  const { user } = useAuth();
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

  // Navegación hacia arriba/abajo
  const navigateUp = () => {
    const newIndex =
      currentIndex > 0 ? currentIndex - 1 : navigationItems.length - 1;
    setCurrentIndex(newIndex);
  };


  // Manejar selección de item
  const selectCurrentItem = () => {
    const currentItem = navigationItems[currentIndex];
    if (currentItem.id === "logout") {
      handleLogout();
    } else if (currentItem.route) {
      navigate(currentItem.route);
    }
  };

  // Calcular posición de los elementos en el círculo
  const getItemPosition = (index: number, isVisible: boolean) => {
    if (!isVisible) return { x: 0, y: 0, opacity: 0 };

    const radius = 90; // Radio del círculo de navegación
    const centerX = 150; // Centro del blob
    const centerY = 150;
    const angle =
      (index * (Math.PI * 2)) / navigationItems.length - Math.PI / 2; // Empezar desde arriba

    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      opacity: 1,
    };
  };

  return (
    <div
      className="fixed top-4 left-4 w-[300px] h-[300px] z-50"
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
                left: `${position.x - 10}px`,
                top: `${position.y - 10}px`,
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
                onClick={() => {
                  setCurrentIndex(index);
                  selectCurrentItem();
                }}
              >
                <span className="text-lg">{item.icon}</span>
              </div>

              {/* Etiqueta del elemento activo */}
              {isActive && (
                <div
                  className="absolute top-12 left-1/2 transform -translate-x-1/2 
                            bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs whitespace-nowrap"
                >
                  {item.label}
                </div>
              )}
            </div>
          );
        })}

      {/* Controles de navegación (flechas) */}
      {isVisible && (
        <>
          {/* Flecha hacia arriba */}
          <button
            onClick={navigateUp}
            className="absolute top-2 left-1/2 transform -translate-x-1/2 z-40
                     w-6 h-6 rounded-full bg-white bg-opacity-20 
                     flex items-center justify-center text-white hover:bg-opacity-30
                     transition-all duration-200"
          >
            ↑
          </button>

        </>
      )}

      {/* Indicador central */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="w-4 h-4 rounded-full bg-white bg-opacity-40 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white"></div>
        </div>
      </div>

      {/* Info del usuario (opcional, se muestra al hacer hover) */}
      {isVisible && user && (
        <div className="absolute top-full left-0 mt-2 bg-white bg-opacity-90 rounded-lg p-2 min-w-[120px] shadow-lg">
          <p className="text-xs font-medium text-gray-800">{user.name}</p>
          <p className="text-xs text-gray-600">{user.email}</p>
        </div>
      )}
    </div>
  );
};

export default CircularNavigation;
