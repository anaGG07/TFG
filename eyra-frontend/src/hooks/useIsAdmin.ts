import { useAuth } from '../context/AuthContext';

export const useIsAdmin = () => {
  const { user } = useAuth();
  return user?.roles?.includes('ROLE_ADMIN') || false;
}; 