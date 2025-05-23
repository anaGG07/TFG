import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { useLocation } from "react-router-dom";
import { User } from "../types/domain";
import { authService } from "../services/authService";
import { LoginRequest, RegisterRequest } from "../types/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<any>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (userData: Partial<User>) => void;
  completeOnboarding: (onboardingData: any) => Promise<User>;
  checkAuth: () => Promise<boolean>;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const location = useLocation();
  const initRef = useRef(false);

  // Sincronizar el estado del contexto con el servicio de autenticación
  const syncAuthState = useCallback(() => {
    const authState = authService.getAuthState();
    setUser(authState.user);
    setIsAuthenticated(authState.isAuthenticated);
  }, []);

  // Verificar la sesión
  const checkAuth = useCallback(
    async (silent = false): Promise<boolean> => {
      if (!silent) setIsLoading(true);

      try {
        const isValid = await authService.verifySession(silent);
        syncAuthState();
        return isValid;
      } catch (error) {
        syncAuthState();
        return false;
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [syncAuthState]
  );

  // Inicialización única optimizada
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initialize = async () => {
      // Primero sincronizar con localStorage
      syncAuthState();

      // Si parece que está autenticado, verificar silenciosamente
      if (authService.isLikelyAuthenticated()) {
        console.log("AuthContext: Usuario parece autenticado, verificando...");
        await checkAuth(true);
      } else {
        console.log(
          "AuthContext: No hay sesión local, verificando servidor..."
        );
        await checkAuth(true);
      }

      setIsLoading(false);
    };

    initialize();
  }, [syncAuthState, checkAuth]);

  // Efecto simplificado para cambios de ruta (solo para rutas que requieren auth)
  useEffect(() => {
    // Solo verificar en rutas protegidas si no estamos autenticados
    const protectedRoutes = [
      "/dashboard",
      "/profile",
      "/calendar",
      "/insights",
      "/onboarding",
    ];
    const isProtectedRoute = protectedRoutes.some((route) =>
      location.pathname.startsWith(route)
    );

    if (isProtectedRoute && !isAuthenticated && !isLoading) {
      console.log(
        "AuthContext: Ruta protegida sin autenticación, verificando..."
      );
      checkAuth(true);
    }
  }, [location.pathname, isAuthenticated, isLoading, checkAuth]);

  // Efecto para manejar cambios en localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_state") {
        syncAuthState();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [syncAuthState]);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const loggedInUser = await authService.login(credentials);
      syncAuthState();
      return loggedInUser;
    } catch (error) {
      syncAuthState();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    try {
      await authService.register(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      syncAuthState();
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserData = (userData: Partial<User>) => {
    authService.updateUserData(userData);
    syncAuthState();
  };

  const completeOnboarding = async (onboardingData: any) => {
    const updatedUser = await authService.completeOnboarding(onboardingData);
    syncAuthState();
    return updatedUser;
  };

  const refreshSession = useCallback(async (): Promise<boolean> => {
    return checkAuth(false);
  }, [checkAuth]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUserData,
    completeOnboarding,
    checkAuth,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
