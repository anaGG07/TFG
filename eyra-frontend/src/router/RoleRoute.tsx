import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { ROUTES } from "./paths";

interface RoleRouteProps {
  children: ReactNode;
  allowedRoles: string[]; // los roles permitidos
  redirectTo?: string; // ruta a redirigir si no tiene acceso
}

const RoleRoute = ({
  children,
  allowedRoles,
  redirectTo = ROUTES.DASHBOARD,
}: RoleRouteProps) => {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const hasAccess = user.roles?.some((role) => allowedRoles.includes(role));

  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;
