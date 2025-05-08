import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { ROUTES } from "./paths";

interface ProtectedRouteProps {
  children: ReactNode;
  requireOnboarding?: boolean;
}

const ProtectedRoute = ({ children, requireOnboarding = true }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Log para debugging
  useEffect(() => {
    console.log('ProtectedRoute: Evaluando acceso a ruta', {
      ruta: location.pathname,
      autenticado: isAuthenticated,
      cargando: isLoading,
      usuario: user ? `${user.email} (onboarding: ${user.onboardingCompleted})` : 'no disponible',
      requireOnboarding,
    });
  }, [location.pathname, isAuthenticated, isLoading, user, requireOnboarding]);

  // Mostrar spinner mientras carga
  if (isLoading) {
    console.log('ProtectedRoute: Cargando...');
    return <LoadingSpinner />;
  }
  
  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    console.log('ProtectedRoute: No autenticado, redirigiendo a login');
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  // Comprobar si necesita completar onboarding y NO está en la página de onboarding
  if (requireOnboarding && user && !user.onboardingCompleted && 
      location.pathname !== ROUTES.ONBOARDING) {
    console.log('ProtectedRoute: Onboarding pendiente, redirigiendo a onboarding');
    return <Navigate to={ROUTES.ONBOARDING} replace state={{ from: location }} />;
  }

  // Usuario autenticado y cumple requisitos de onboarding
  console.log('ProtectedRoute: Acceso concedido a', location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;
