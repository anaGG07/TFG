import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from "react";
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

  const hasInitialized = useRef(false);

  // Sincronización simple y directa
  const syncAuthState = useCallback(() => {
    const user = authService.getAuthState();
    setUser(user);
    setIsAuthenticated(!!user);
  }, []);

  // Verificación simplificada
  const checkAuth = useCallback(
    async (silent = false): Promise<boolean> => {
      if (!silent) setIsLoading(true);

      try {
        const isValid = await authService.verifySession(silent);
        syncAuthState();
        return isValid;
      } catch (error) {
        console.error("AuthContext: Error en verificación:", error);
        syncAuthState();
        return false;
      } finally {
        if (!silent) {
          setIsLoading(false);
        }
      }
    },
    [syncAuthState]
  );

  // Inicialización robusta con timeout
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initialize = async () => {
      try {
        // 1. Sincronizar estado local inmediatamente
        syncAuthState();

        // 2. Verificar en servidor con timeout
        const initPromise = checkAuth(true);
        const timeoutPromise = new Promise<boolean>((resolve) => {
          setTimeout(() => resolve(false), 5000); // 5 segundos máximo
        });

        await Promise.race([initPromise, timeoutPromise]);
      } catch (error) {
        console.error("AuthContext: Error en inicialización:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []); // Solo se ejecuta una vez

  // Sincronización entre pestañas solo con eventos, no datos sensibles
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_event") {
        checkAuth();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [checkAuth]);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const loggedInUser = await authService.login(credentials);
      syncAuthState();
      return loggedInUser;
    } catch (error) {
      console.error("AuthContext: Error en login:", error);
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
    } catch (error) {
      console.error("AuthContext: Error en registro:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      syncAuthState();
    } catch (error) {
      console.error("AuthContext: Error en logout:", error);
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
