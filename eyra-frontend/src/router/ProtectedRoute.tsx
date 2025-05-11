import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { ROUTES } from "./paths";

interface ProtectedRouteProps {
  children: ReactNode;
  requireOnboarding?: boolean;
}

const ProtectedRoute = ({
  children,
  requireOnboarding = true,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("ProtectedRoute: Evaluando acceso a ruta", {
      ruta: location.pathname,
      autenticado: isAuthenticated,
      cargando: isLoading,
      usuario: user
        ? `${user.email} (onboarding: ${user.onboardingCompleted})`
        : "no disponible",
      requireOnboarding,
    });
  }, [location.pathname, isAuthenticated, isLoading, user, requireOnboarding]);

  if (isLoading) {
    console.log("ProtectedRoute: Cargando...");
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    console.log("ProtectedRoute: No autenticado, redirigiendo a login");

    if (location.state && location.state.justLoggedOut) {
      return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  if (
    requireOnboarding &&
    user &&
    !user.onboardingCompleted &&
    location.pathname !== ROUTES.ONBOARDING
  ) {
    if (
      location.state &&
      (location.state.onboardingCompleted || location.state.onboardingError)
    ) {
      console.log(
        "ProtectedRoute: Permitiendo acceso por estado especial post-onboarding"
      );
      return <>{children}</>;
    }

    console.log(
      "ProtectedRoute: Onboarding pendiente, redirigiendo a onboarding"
    );
    return (
      <Navigate to={ROUTES.ONBOARDING} replace state={{ from: location }} />
    );
  }

  console.log("ProtectedRoute: Acceso concedido a", location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;
