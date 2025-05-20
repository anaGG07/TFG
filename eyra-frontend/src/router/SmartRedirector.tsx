import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { tokenService } from '../services/tokenService';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from './paths';

/**
 * SmartRedirector - Componente inteligente para gestionar redirecciones globales
 * Se encarga de verificar la autenticación en cada cambio de ruta
 */
const SmartRedirector = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, refreshSession } = useAuth();
  
  useEffect(() => {
    const handleRouteChange = async () => {
      // Evitar verificaciones en las rutas públicas
      const publicRoutes = [ROUTES.LOGIN, ROUTES.REGISTER];
      if (publicRoutes.includes(location.pathname)) {
        return;
      }
      
      // Si estamos en el dashboard o ruta autenticada y hay una cookie JWT pero no estamos autenticados, 
      // intentar refrescar la sesión
      const hasJwtCookie = tokenService.hasJwtCookie();
      console.log('SmartRedirector: Cambio de ruta detectado', {
        path: location.pathname,
        isAuthenticated,
        isLoading,
        hasJwtCookie
      });
      
      // Si estamos en la página de inicio (/) y tenemos cookie, intentar refrescar
      if (location.pathname === '/' && hasJwtCookie && !isAuthenticated && !isLoading) {
        console.log('SmartRedirector: Intentando refrescar sesión en home');
        const success = await refreshSession();
        if (success) {
          console.log('SmartRedirector: Sesión refrescada en home, redirigiendo a dashboard');
          navigate(ROUTES.DASHBOARD, { replace: true });
        }
      }
      
      // Si estamos en cualquier ruta protegida y tenemos una cookie pero no estamos autenticados
      const protectedRoutes = [
        ROUTES.DASHBOARD, 
        ROUTES.CALENDAR, 
        ROUTES.PROFILE, 
        ROUTES.INSIGHTS,
        ROUTES.SETTINGS
      ];
      
      if (protectedRoutes.includes(location.pathname) && hasJwtCookie && !isAuthenticated && !isLoading) {
        console.log('SmartRedirector: Intentando recuperar sesión en ruta protegida');
        await refreshSession();
      }
    };
    
    handleRouteChange();
  }, [location, isAuthenticated, isLoading, navigate, refreshSession]);
  
  return null; // Este componente no renderiza nada
};

export default SmartRedirector;
