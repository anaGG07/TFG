import { ReactNode, useEffect, useCallback } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
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
  const { isAuthenticated, isLoading, user, refreshSession } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Manejar recuperación después de error
  const handleErrorRecovery = useCallback(async () => {
    if (location.state && location.state.forceRefresh) {
      console.log("ProtectedRoute: Detectado estado de recuperación post-error");
      
      // Eliminar limitaciones de refrescado
      localStorage.removeItem('lastTokenCheck');
      
      // Intentar refrescar la sesión
      const success = await refreshSession();
      
      if (!success) {
        console.log("ProtectedRoute: Fallo en recuperación post-error, redirigiendo a /login");
        navigate(ROUTES.LOGIN, { replace: true });
      } else {
        console.log("ProtectedRoute: Recuperación post-error exitosa");
        // // Limpiar el estado para evitar bucles
        // const clearedLocation = {
        //   ...location,
        //   state: {}
        // };
        navigate(location.pathname, { 
          replace: true, 
          state: {} // Limpiar estado
        });
      }
    }
  }, [location, refreshSession, navigate]);

  useEffect(() => {
    handleErrorRecovery();
  }, [handleErrorRecovery]);

  useEffect(() => {
    console.log("ProtectedRoute: Evaluando acceso a ruta", {
      ruta: location.pathname,
      autenticado: isAuthenticated,
      cargando: isLoading,
      usuario: user
        ? `${user.email} (onboarding: ${user.onboardingCompleted})`
        : "no disponible",
      requireOnboarding,
      state: location.state,
    });
  }, [location.pathname, isAuthenticated, isLoading, user, requireOnboarding, location.state]);

  // Si estamos manejando recuperación de error, mostrar spinner
  if (location.state && location.state.forceRefresh) {
    return <LoadingSpinner text="Restaurando sesión..." />;
  }

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
