import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../router/paths';

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const performLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.HOME, { replace: true });
    } catch (error) {
      console.error('Error durante logout:', error);
      // Incluso con error, redirigir a home
      navigate(ROUTES.HOME, { replace: true });
    }
  };

  return performLogout;
};