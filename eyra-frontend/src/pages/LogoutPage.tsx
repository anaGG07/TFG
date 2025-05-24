import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../router/paths";
import LoadingSpinner from "../components/LoadingSpinner";

const LogoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        console.log("LogoutPage: Ejecutando logout...");
        await logout();
        console.log("LogoutPage: Logout completado");
      } catch (error) {
        console.error("LogoutPage: Error en logout:", error);
      } finally {
        // Siempre redirigir, incluso si hay error
        console.log("LogoutPage: Redirigiendo a home...");
        navigate(ROUTES.HOME, { replace: true });
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8e9ea] to-[#e7e0d5]">
      <div className="bg-white rounded-xl p-8 shadow-xl text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5b0108] mx-auto mb-4"></div>
              <LoadingSpinner/>
              <p className="text-[#5b0108]">Cerrando sesión...</p>
      </div>
    </div>
  );
};

export default LogoutPage;
