import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsAdmin } from "../hooks/useIsAdmin";

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

  // Si no es administrador, no renderizar nada
  if (!isAdmin) {
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
      {/* Botón de administración prominente */}
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
