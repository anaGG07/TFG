import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { ROUTES } from "./paths";

interface RoleRouteProps {
  children: ReactNode;
  allowedRoles: string[]; // los roles permitidos
  redirectTo?: string; // ruta a redirigir si no tiene acceso
  requireOnboarding?: boolean; // si requiere onboarding completado
}

const RoleRoute = ({
  children,
  allowedRoles,
  redirectTo = ROUTES.DASHBOARD,
  requireOnboarding = true,
}: RoleRouteProps) => {
  const { isLoading, isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Logs para depuración
  useEffect(() => {
    console.log('RoleRoute: Verificando acceso a ruta restringida', {
      ruta: location.pathname,
      autenticado: isAuthenticated,
      usuario: user ? `${user.email} (onboarding: ${user.onboardingCompleted})` : 'no disponible',
      rolesPermitidos: allowedRoles,
      rolesUsuario: user ? user.roles : [],
    });
  }, [location.pathname, isAuthenticated, user, allowedRoles]);

  if (isLoading) {
    console.log('RoleRoute: Cargando...');
    return <LoadingSpinner />;
  }

  // Verificar autenticación
  if (!isAuthenticated || !user) {
    console.log('RoleRoute: No autenticado, redirigiendo a login');
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  // Verificar si necesita completar onboarding y NO está en página de onboarding
  if (requireOnboarding && !user.onboardingCompleted && 
      location.pathname !== ROUTES.ONBOARDING) {
    console.log('RoleRoute: Onboarding pendiente, redirigiendo a onboarding');
    return <Navigate to={ROUTES.ONBOARDING} replace state={{ from: location }} />;
  }

  // Verificar permisos de rol
  const hasAccess = user.roles?.some((role) => allowedRoles.includes(role));

  if (!hasAccess) {
    console.log('RoleRoute: Sin permiso de rol, redirigiendo a', redirectTo);
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  // Usuario autenticado con rol y onboarding correctos
  console.log('RoleRoute: Acceso concedido a ruta con permisos');
  return <>{children}</>;
};

export default RoleRoute;
