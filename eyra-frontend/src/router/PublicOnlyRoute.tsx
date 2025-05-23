import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "./paths";

interface PublicOnlyRouteProps {
  children: ReactNode;
}

const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // No mostrar loading durante inicialización para rutas públicas
  if (isLoading) {
    // Para rutas públicas, mostrar el contenido inmediatamente
    // El loading se maneja internamente en los componentes
    return <>{children}</>;
  }

  if (isAuthenticated && user) {
    // Si está autenticado, redirigir según el estado del onboarding
    const redirectTo = user.onboardingCompleted
      ? ROUTES.DASHBOARD
      : ROUTES.ONBOARDING;
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default PublicOnlyRoute;
