import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { ROUTES } from "./paths";

interface PublicOnlyRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const PublicOnlyRoute = ({
  children,
  redirectTo = ROUTES.DASHBOARD,
}: PublicOnlyRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar spinner mientras se carga el estado de autenticación
  if (isLoading) {
    return <LoadingSpinner text="Verificando sesión..." />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PublicOnlyRoute;
