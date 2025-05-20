import { ReactNode, useEffect } from "react";
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

  if (isLoading) {
    console.log("ProtectedRoute: Cargando...");
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    console.log("ProtectedRoute: No autenticado, comprobando estado especial");
    
    // Si venimos de la página de error con el flag de preservar autenticación
    if (location.state && location.state.preserveAuth) {
      console.log("ProtectedRoute: Estado de preservación detectado, intentando refrescar sesión");
      // Intentar refrescar sesión antes de redirigir
      refreshSession().then(success => {
        if (!success) {
          console.log("ProtectedRoute: No se pudo refrescar sesión, redirigiendo a login");
          navigate(ROUTES.LOGIN, { replace: true });
        }
      });
      // Mientras tanto, mostrar un spinner de carga
      return <LoadingSpinner />;
    }

    // Comportamiento normal para redirigir si no está autenticado
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
