import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../router/paths';

interface AuthGuardProps {
  children: React.ReactNode;
  onlyPublic?: boolean; // Para rutas que sólo deben ser accesibles sin autenticación
  requireOnboarding?: boolean; // Para rutas que requieren onboarding completo
}

/**
 * Componente de protección para rutas autenticadas
 * - Verifica que el usuario esté autenticado
 * - Redirecciona según el estado de autenticación y onboarding
 * - Muestra un indicador de carga durante la verificación
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  onlyPublic = false, 
  requireOnboarding = false 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Si todavía está cargando, no hacemos nada aún
    if (isLoading) return;

    // Para rutas que sólo deben ser accesibles sin autenticación (login, register)
    if (onlyPublic && isAuthenticated) {
      // Si el usuario está autenticado, verificar estado de onboarding
      if (user?.onboardingCompleted) {
        navigate(ROUTES.DASHBOARD, { replace: true });
      } else {
        navigate(ROUTES.ONBOARDING, { replace: true });
      }
      return;
    }

    // Para rutas protegidas que requieren autenticación
    if (!onlyPublic && !isAuthenticated) {
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }

    // Para rutas que requieren onboarding completo
    if (requireOnboarding && isAuthenticated && user && !user.onboardingCompleted) {
      navigate(ROUTES.ONBOARDING, { replace: true });
      return;
    }

    // Terminamos la verificación
    setChecking(false);
  }, [isAuthenticated, isLoading, user, navigate, onlyPublic, requireOnboarding]);

  // Mostrar indicador de carga mientras verificamos
  if (isLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e7e0d5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5b0108] mx-auto mb-4"></div>
          <p className="text-[#5b0108]">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Mostrar los hijos si pasa todas las verificaciones
  return <>{children}</>;
};

export default AuthGuard;
