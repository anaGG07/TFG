import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../router/paths";

interface AuthGuardProps {
  children: React.ReactNode;
  onlyPublic?: boolean; // Rutas públicas (login, register)
  requireOnboarding?: boolean; // Requiere onboarding completo
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  onlyPublic = false,
  requireOnboarding = false,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      // Si estamos en una ruta pública pero ya autenticado
      if (onlyPublic) {
        navigate(
          user?.onboardingCompleted ? ROUTES.DASHBOARD : ROUTES.ONBOARDING,
          { replace: true }
        );
        return;
      }

      // Si requiere onboarding y no lo ha completado
      if (requireOnboarding && !user?.onboardingCompleted) {
        navigate(ROUTES.ONBOARDING, { replace: true });
        return;
      }
    } else {
      // Si estamos en una ruta protegida y no autenticado
      if (!onlyPublic) {
        navigate(ROUTES.LOGIN, { replace: true });
        return;
      }
    }

    // Todo validado, permitimos mostrar contenido
    setChecking(false);
  }, [
    isAuthenticated,
    isLoading,
    user,
    navigate,
    onlyPublic,
    requireOnboarding,
  ]);

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

  return <>{children}</>;
};

export default AuthGuard;
