import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsAdmin } from "../hooks/useIsAdmin";
import { useViewport } from "../hooks/useViewport";

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
  const isAdmin = useIsAdmin();
  const { isDesktop, isTablet, isMobile } = useViewport();

  // Solo mostrar si es admin y NO es móvil
  if (!isAdmin || isMobile) {
    return null;
  }

  // Manejar click del botón admin
  const handleAdminClick = () => {
    navigate("/admin");
  };

  // Verificar si estamos en el panel admin
  const isInAdminPanel = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Botón de administración - adaptado para todas las pantallas */}
      <div
        className={`fixed z-50 group ${
          isDesktop 
            ? "bottom-6 left-6" 
            : isTablet
            ? "bottom-4 right-4"
            : "bottom-3 right-3"
        }`}
        title="Panel de Administración"
      >
          <div
            className={`relative rounded-full flex items-center justify-center text-white font-bold cursor-pointer
            shadow-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-3xl
            ${isDesktop ? "w-20 h-20" : isTablet ? "w-16 h-16" : "w-14 h-14"}
            ${
              isInAdminPanel
                ? "bg-gradient-to-br from-red-600 to-red-800 ring-4 ring-red-300 ring-opacity-60 scale-110 shadow-red-500/50"
                : "bg-gradient-to-br from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 shadow-red-600/40"
            }
            ${!isDesktop ? "animate-none" : "animate-pulse hover:animate-none"} border-2 border-red-400/30`}
            onClick={handleAdminClick}
          >
            <AdminIcon className={`${
              isDesktop ? "w-12 h-12" : isTablet ? "w-10 h-10" : "w-8 h-8"
            } text-white drop-shadow-lg`} />

            {/* Efecto de brillo */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent"></div>

            {/* Indicador de estado activo */}
            {isInAdminPanel && (
              <div className={`absolute -top-1 -right-1 bg-green-400 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                isDesktop ? "w-6 h-6" : isTablet ? "w-5 h-5" : "w-4 h-4"
              }`}>
                <div className={`bg-green-600 rounded-full animate-pulse ${
                  isDesktop ? "w-3 h-3" : isTablet ? "w-2.5 h-2.5" : "w-2 h-2"
                }`}></div>
              </div>
            )}
          </div>

          {/* Etiqueta del botón - solo en desktop y tablet */}
          {!isMobile && (
            <div className={`absolute whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 ${
              isDesktop 
                ? "-top-12 left-1/2 transform -translate-x-1/2"
                : "-left-32 top-1/2 transform -translate-y-1/2"
            }`}>
              <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-xl border border-gray-700">
                <span className="font-semibold">Panel Admin</span>
                <div className={`absolute transform ${
                  isDesktop 
                    ? "bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"
                    : "top-1/2 right-0 -translate-y-1/2 translate-x-full border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900"
                }`}>
                </div>
              </div>
            </div>
          )}
        </div>
    </>
  );
};

export default AdminNavigation;
