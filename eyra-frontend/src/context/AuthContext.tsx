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


  const initRef = useRef(false);
  const verificationInProgress = useRef(false);

  // Sincronización simple sin efectos secundarios
  const syncAuthState = useCallback(() => {
    const authState = authService.getAuthState();
    setUser(authState.user);
    setIsAuthenticated(authState.isAuthenticated);
  }, []);

  // Verificación controlada sin bucles
  const checkAuth = useCallback(
    async (silent = false): Promise<boolean> => {
      // Evitar verificaciones concurrentes
      if (verificationInProgress.current) {
        console.log("AuthContext: Verificación ya en progreso, omitiendo...");
        return isAuthenticated;
      }

      verificationInProgress.current = true;
      if (!silent) setIsLoading(true);

      try {
        console.log("AuthContext: Iniciando verificación de sesión");
        const isValid = await authService.verifySession(silent);
        syncAuthState();
        console.log(
          "AuthContext: Verificación completada, resultado:",
          isValid
        );
        return isValid;
      } catch (error) {
        console.error("AuthContext: Error en verificación:", error);
        syncAuthState();
        return false;
      } finally {
        verificationInProgress.current = false;
        if (!silent) setIsLoading(false);
      }
    },
    [syncAuthState, isAuthenticated]
  );

  // Inicialización única y controlada
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initialize = async () => {
      console.log("AuthContext: Inicializando contexto...");

      // Sincronizar con estado local primero
      syncAuthState();

      // Verificar en servidor solo una vez
      await checkAuth(true);

      console.log("AuthContext: Inicialización completada");
    };

    initialize();
  }, []); // Dependencias vacías = solo se ejecuta una vez

  // Efecto simplificado para cambios de localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_state") {
        console.log("AuthContext: Cambio detectado en localStorage");
        syncAuthState();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [syncAuthState]);

  // ELIMINAR: El efecto que causaba el bucle
  // Este useEffect con location.pathname era la causa del bucle
  // useEffect(() => { ... }, [location.pathname, ...]) ❌

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      console.log("AuthContext: Iniciando login...");
      const loggedInUser = await authService.login(credentials);
      syncAuthState();
      console.log("AuthContext: Login exitoso");
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
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      console.log("AuthContext: Iniciando logout...");
      await authService.logout();
      syncAuthState();
      console.log("AuthContext: Logout exitoso");
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
