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
    console.log("AuthContext: Estado sincronizado:", {
      isAuthenticated: !!user,
      hasUser: !!user,
      userEmail: user?.email,
    });
  }, []);

  // Verificación simplificada
  const checkAuth = useCallback(
    async (silent = false): Promise<boolean> => {
      if (!silent) setIsLoading(true);

      try {
        console.log("AuthContext: Verificando sesión...");
        const isValid = await authService.verifySession(silent);
        syncAuthState();
        console.log("AuthContext: Verificación completada:", isValid);
        return isValid;
      } catch (error) {
        console.error("AuthContext: Error en verificación:", error);
        syncAuthState();
        return false;
      } finally {
        if (!silent) {
          setIsLoading(false);
          console.log("AuthContext: Loading establecido a false");
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
      console.log("AuthContext: === INICIANDO INICIALIZACIÓN ===");

      try {
        // 1. Sincronizar estado local inmediatamente
        syncAuthState();

        // 2. Verificar en servidor con timeout
        const initPromise = checkAuth(true);
        const timeoutPromise = new Promise<boolean>((resolve) => {
          setTimeout(() => {
            console.log("AuthContext: Timeout de inicialización alcanzado");
            resolve(false);
          }, 5000); // 5 segundos máximo
        });

        await Promise.race([initPromise, timeoutPromise]);
      } catch (error) {
        console.error("AuthContext: Error en inicialización:", error);
      } finally {
        setIsLoading(false);
        console.log("AuthContext: === INICIALIZACIÓN COMPLETADA ===");
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
      console.log("AuthContext: Ejecutando login...");
      const loggedInUser = await authService.login(credentials);
      syncAuthState();
      console.log("AuthContext: Login exitoso para:", loggedInUser.email);
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
      console.log("AuthContext: Ejecutando registro...");
      await authService.register(userData);
      console.log("AuthContext: Registro exitoso");
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
      console.log("AuthContext: Ejecutando logout...");
      await authService.logout();
      syncAuthState();
      console.log("AuthContext: Logout exitoso");
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
    console.log("AuthContext: Completando onboarding...");
    const updatedUser = await authService.completeOnboarding(onboardingData);
    syncAuthState();
    console.log("AuthContext: Onboarding completado");
    return updatedUser;
  };

  const refreshSession = useCallback(async (): Promise<boolean> => {
    console.log("AuthContext: Refrescando sesión...");
    return checkAuth(false);
  }, [checkAuth]);

  // Log del estado actual
  console.log("AuthContext: Estado actual render:", {
    isLoading,
    isAuthenticated,
    hasUser: !!user,
    userEmail: user?.email,
    hasInitialized: hasInitialized.current,
  });

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
