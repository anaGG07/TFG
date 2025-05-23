import { ReactNode } from "react";
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

  // Función mejorada para verificar onboarding
  const isOnboardingComplete = (user: any) => {
    if (!user) return false;

    const directComplete = user.onboardingCompleted === true;
    const nestedComplete = user.onboarding?.completed === true;

    return directComplete && (user.onboarding ? nestedComplete : true);
  };

  // No más verificaciones automáticas - confía completamente en AuthContext
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  // Verificación de onboarding
  if (
    requireOnboarding &&
    user &&
    !isOnboardingComplete(user) &&
    location.pathname !== ROUTES.ONBOARDING
  ) {
    return (
      <Navigate to={ROUTES.ONBOARDING} replace state={{ from: location }} />
    );
  }

  // Si está en onboarding pero ya lo completó, redirigir al dashboard
  if (
    location.pathname === ROUTES.ONBOARDING &&
    user &&
    isOnboardingComplete(user)
  ) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
