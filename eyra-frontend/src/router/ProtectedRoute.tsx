import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { ROUTES } from "./paths";
import cookieService from "../services/cookieService";

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
      cookieStatus: cookieService.getAuthCookiesStatus(),
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
    console.log('ProtectedRoute: No autenticado, verificando cookies...');
    
    // Verificar si existe cookie de JWT (para recuperar sesión perdida)
    const { hasJwt, isAuthenticated: hasCookieAuth } = cookieService.getAuthCookiesStatus();
    
    if (hasCookieAuth) {
      console.log('ProtectedRoute: Se encontró cookie JWT válida a pesar de estado no autenticado');
      // Mostrar spinner mientras intentamos recuperar la sesión
      return <LoadingSpinner text="Recuperando sesión..." />;
    }
    
    console.log('ProtectedRoute: No hay cookies de autenticación, redirigiendo a login');
    // Evitar ciclo de redirecciones si estamos intentando acceder a una ruta
    // que requiere autenticación inmediatamente después de un cierre de sesión
    if (location.state && location.state.justLoggedOut) {
      return <Navigate to={ROUTES.LOGIN} replace />;
    }
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  // Comprobar si necesita completar onboarding y NO está en la página de onboarding
  if (requireOnboarding && user && !user.onboardingCompleted && 
      location.pathname !== ROUTES.ONBOARDING) {
    
    // Si venimos de completar el onboarding (pero hubo un error al guardarlo en backend),
    // permitimos el acceso para evitar bucles
    if (location.state && (location.state.onboardingCompleted || location.state.onboardingError)) {
      console.log('ProtectedRoute: Permitiendo acceso a pesar de onboarding incompleto debido a estado especial', location.state);
      return <>{children}</>;
    }
    
    console.log('ProtectedRoute: Onboarding pendiente, redirigiendo a onboarding', {
      onboardingCompleted: user.onboardingCompleted
    });
    return <Navigate to={ROUTES.ONBOARDING} replace state={{ from: location }} />;
  }

  // Usuario autenticado y cumple requisitos de onboarding
  console.log('ProtectedRoute: Acceso concedido a', location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;
