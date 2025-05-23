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

  console.log("ProtectedRoute: Verificando acceso:", {
    path: location.pathname,
    isLoading,
    isAuthenticated,
    requireOnboarding,
    userEmail: user?.email,
    onboardingCompleted: user?.onboardingCompleted,
  });

  // Función mejorada para verificar onboarding
  const isOnboardingComplete = (user: any) => {
    if (!user) return false;

    const directComplete = user.onboardingCompleted === true;
    const nestedComplete = user.onboarding?.completed !== false; // null/undefined = true

    return directComplete && nestedComplete;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    console.log("ProtectedRoute: Usuario no autenticado, redirigiendo a login");
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  // Verificación mejorada de onboarding
  if (requireOnboarding) {
    const onboardingCompleted = isOnboardingComplete(user);

    if (!onboardingCompleted && location.pathname !== ROUTES.ONBOARDING) {
      console.log("ProtectedRoute: Onboarding incompleto, redirigiendo");
      return (
        <Navigate to={ROUTES.ONBOARDING} replace state={{ from: location }} />
      );
    }

    // Si está en onboarding pero ya lo completó, redirigir al dashboard
    if (onboardingCompleted && location.pathname === ROUTES.ONBOARDING) {
      console.log(
        "ProtectedRoute: Onboarding ya completado, redirigiendo a dashboard"
      );
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
  }

  console.log("ProtectedRoute: Acceso permitido");
  return <>{children}</>;
};

export default ProtectedRoute;
