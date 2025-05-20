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
    const verifyAccess = async () => {
      if (!isAuthenticated && !isLoading) {
        const success = await refreshSession();
        if (!success) {
          navigate(ROUTES.LOGIN, {
            replace: true,
            state: { from: location }
          });
        }
      }
    };

    verifyAccess();
  }, [isAuthenticated, isLoading, location, navigate, refreshSession]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  if (
    requireOnboarding &&
    user &&
    !user.onboardingCompleted &&
    location.pathname !== ROUTES.ONBOARDING
  ) {
    return (
      <Navigate to={ROUTES.ONBOARDING} replace state={{ from: location }} />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
