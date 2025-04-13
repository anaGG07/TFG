import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { ROUTES } from "./paths";

interface PublicOnlyRouteProps {
  children: ReactNode;
  redirectTo?: string; // opcional, por defecto a dashboard
}

const PublicOnlyRoute = ({ children, redirectTo = ROUTES.DASHBOARD }: PublicOnlyRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PublicOnlyRoute;
