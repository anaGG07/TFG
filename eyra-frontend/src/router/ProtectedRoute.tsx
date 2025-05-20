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
