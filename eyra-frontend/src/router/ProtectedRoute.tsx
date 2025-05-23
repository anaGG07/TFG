import { ReactNode, useEffect, useCallback, useState } from "react";
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
  const [isReady, setIsReady] = useState(false);

  // Función para verificar si el onboarding está completo
  const isOnboardingComplete = useCallback((user: any) => {
    if (!user) return false;

    // Verificar tanto el campo directo como el objeto anidado
    const directComplete = user.onboardingCompleted === true;
    const nestedComplete = user.onboarding?.completed === true;

    console.log("ProtectedRoute: Verificando onboarding:", {
      userId: user.id,
      directComplete,
      nestedComplete,
      finalResult: directComplete && (user.onboarding ? nestedComplete : true),
    });

    return directComplete && (user.onboarding ? nestedComplete : true);
  }, []);

  // Manejar recuperación después de error
  const handleErrorRecovery = useCallback(async () => {
    if (location.state?.forceRefresh) {
      const success = await refreshSession();

      if (!success) {
        navigate(ROUTES.LOGIN, {
          replace: true,
          state: { from: location },
        });
      } else {
        navigate(location.pathname, {
          replace: true,
          state: { from: location },
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
            state: { from: location },
          });
          return;
        }
      }
      setIsReady(true);
    };

    verifyAccess();
  }, [isAuthenticated, isLoading, location, navigate, refreshSession]);

  if (isLoading || !isReady) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  // Usar función mejorada para verificar onboarding
  if (
    requireOnboarding &&
    user &&
    !isOnboardingComplete(user) &&
    location.pathname !== ROUTES.ONBOARDING
  ) {
    console.log(
      "ProtectedRoute: Redirigiendo a onboarding para usuario:",
      user.id
    );
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
    console.log(
      "ProtectedRoute: Usuario ya completó onboarding, redirigiendo a dashboard"
    );
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
