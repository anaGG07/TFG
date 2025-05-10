import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { ROUTES } from "./paths";
import cookieService from "../services/cookieService";

interface PublicOnlyRouteProps {
  children: ReactNode;
  redirectTo?: string; // opcional, por defecto a dashboard
}

const PublicOnlyRoute = ({ children, redirectTo = ROUTES.DASHBOARD }: PublicOnlyRouteProps) => {
  const { isAuthenticated, isLoading, user, checkAuth } = useAuth();
  const [verifying, setVerifying] = useState(false);
  
  // Verificar cookies JWT al cargar (para evitar acceder a rutas públicas si ya hay sesión)
  useEffect(() => {
    const verifyCookies = async () => {
      if (!isAuthenticated && !isLoading) {
        // Verificar si hay cookies de JWT aunque el estado diga que no está autenticado
        const { hasJwt } = cookieService.getAuthCookiesStatus();
        
        if (hasJwt) {
          console.log('PublicOnlyRoute: Detectada cookie JWT. Verificando sesión...');
          setVerifying(true);
          
          try {
            // Intentar verificar la autenticación
            await checkAuth();
          } catch (error) {
            console.error('Error al verificar autenticación:', error);
          } finally {
            setVerifying(false);
          }
        }
      }
    };
    
    verifyCookies();
  }, [isAuthenticated, isLoading, checkAuth]);

  // Mostrar spinner mientras estamos cargando o verificando
  if (isLoading || verifying) {
    return <LoadingSpinner text="Verificando sesión..." />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PublicOnlyRoute;
