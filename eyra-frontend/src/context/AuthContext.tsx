import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
} from "react";
import { useLocation } from "react-router-dom";
import { User } from "../types/domain";
import { authService } from "../services/authService";
import { LoginRequest, RegisterRequest } from "../types/api";
import { Cycle } from "../services/cycleService";
import {
  CycleSummary,
  Prediction,
  SymptomPattern,
} from "../services/insightService";
import { apiFetchParallel } from "../utils/httpClient";
import tokenService from "../services/tokenService";
import cookieService from "../services/cookieService";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<any>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (userData: Partial<User>) => void;
  completeOnboarding: (onboardingData: any) => Promise<User>;
  cycles: Cycle[];
  currentCycle: Cycle | null;
  summary: CycleSummary | null;
  predictions: Prediction | null;
  patterns: SymptomPattern[];
  checkAuth: () => Promise<boolean>;
  refreshSession: () => Promise<boolean>;
  hasAuthCookie: () => boolean;
}

const DEFAULT_CYCLES: Cycle[] = [];
const DEFAULT_CURRENT_CYCLE: Cycle | null = null;
const DEFAULT_SUMMARY: CycleSummary = {
  averageDuration: 28,
  shortestCycle: 26,
  longestCycle: 32,
  totalCycles: 0,
  commonSymptoms: [],
};
const DEFAULT_PREDICTIONS: Prediction = {
  nextPeriodDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  confidenceScore: 0.8,
  nextFertileWindow: {
    start: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
};
const DEFAULT_PATTERNS: SymptomPattern[] = [];

const defaultContextValue: AuthContextType = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => Promise.reject(new Error("AuthContext no inicializado")),
  register: () => Promise.reject(new Error("AuthContext no inicializado")),
  logout: () => Promise.reject(new Error("AuthContext no inicializado")),
  updateUserData: () => {},
  completeOnboarding: () =>
    Promise.reject(new Error("AuthContext no inicializado")),
  cycles: DEFAULT_CYCLES,
  currentCycle: DEFAULT_CURRENT_CYCLE,
  summary: DEFAULT_SUMMARY,
  predictions: DEFAULT_PREDICTIONS,
  patterns: DEFAULT_PATTERNS,
  checkAuth: () => Promise.reject(new Error("AuthContext no inicializado")),
  refreshSession: () => Promise.reject(new Error("AuthContext no inicializado")),
  hasAuthCookie: () => false
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);
export const useAuth = () => useContext(AuthContext);

// ✅ Safe useLocation to prevent errors outside <Router>
const useSafeLocation = () => {
  try {
    return useLocation();
  } catch {
    return null;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cycles, setCycles] = useState<Cycle[]>(DEFAULT_CYCLES);
  const [currentCycle, setCurrentCycle] = useState<Cycle | null>(
    DEFAULT_CURRENT_CYCLE
  );
  const [summary, setSummary] = useState<CycleSummary>(DEFAULT_SUMMARY);
  const [predictions, setPredictions] = useState<Prediction>(
    DEFAULT_PREDICTIONS
  );
  const [patterns, setPatterns] = useState<SymptomPattern[]>(DEFAULT_PATTERNS);

  const location = useSafeLocation();
  const initializedRef = useRef(false);
  const tokenRefresherRef = useRef<(() => void) | null>(null);

  // Inicializar el sistema de renovación automática de tokens
  useEffect(() => {
    console.log('Configurando sistema de renovación automática de tokens...');
    
    // Solo configurar si no existe ya
    if (!tokenRefresherRef.current) {
      tokenRefresherRef.current = tokenService.setupTokenRefresher();
    }
    
    // Limpiar al desmontar
    return () => {
      if (tokenRefresherRef.current) {
        tokenRefresherRef.current();
        tokenRefresherRef.current = null;
      }
    };
  }, []);

  const loadDashboardSafely = async () => {
    try {
      const userData = await authService
        .getProfile({ skipRedirectCheck: true })
        .catch((err) => {
          console.warn("Error al obtener perfil:", err);
          return null;
        });

      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);

        const [
          cyclesData,
          currentCycleData,
          summaryData,
          predictionsData,
          patternsData,
        ]: [Cycle[], Cycle | null, CycleSummary, Prediction, SymptomPattern[]] =
          await apiFetchParallel([
            { path: "cycles", defaultValue: DEFAULT_CYCLES },
            { path: "cycles/current", defaultValue: DEFAULT_CURRENT_CYCLE },
            { path: "insights/summary", defaultValue: DEFAULT_SUMMARY },
            { path: "insights/predictions", defaultValue: DEFAULT_PREDICTIONS },
            { path: "insights/patterns", defaultValue: DEFAULT_PATTERNS },
          ]);

        if (cyclesData) setCycles(cyclesData);
        if (currentCycleData) setCurrentCycle(currentCycleData);
        if (summaryData) setSummary(summaryData);
        if (predictionsData) setPredictions(predictionsData);
        if (patternsData) setPatterns(patternsData);
        
        return true;
      } else {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error("Error al cargar dashboard:", error);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
      if (typeof window !== "undefined" && window.appReadyEvent) {
        window.dispatchEvent(window.appReadyEvent);
      }
    }
  };

  // Verificar autenticación actual
  const checkAuth = useCallback(async (): Promise<boolean> => {
    console.log('Verificando estado de autenticación...');
    
    try {
      // Si ya estamos autenticados y tenemos usuario, no es necesario volver a verificar
      if (isAuthenticated && user) {
        console.log('Ya estamos autenticados con usuario:', user);
        return true;
      }
      
      // Verificar si hay cookies de autenticación
      const { hasJwt, hasRefresh } = cookieService.getAuthCookiesStatus();
      console.log('Estado de cookies:', { hasJwt, hasRefresh });
      
      // Si no hay cookies, no hay autenticación
      if (!hasJwt) {
        console.log('No hay cookies JWT, no estamos autenticados');
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
      
      // Intentar cargar el perfil
      setIsLoading(true);
      const result = await loadDashboardSafely();
      console.log('Resultado de verificación de autenticación:', result);
      return result;
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Método para renovar la sesión si es necesario
  const refreshSession = useCallback(async (): Promise<boolean> => {
    console.log('Intentando renovar sesión...');
    
    try {
      // Verificar si hay cookies que renovar
      if (!cookieService.hasValidAuthCookie()) {
        console.log('No hay cookies para renovar');
        return false;
      }
      
      // Intentar renovar el token
      setIsLoading(true);
      const refreshed = await tokenService.checkAndRefreshToken();
      
      if (refreshed) {
        console.log('Token renovado, recargando perfil');
        return await loadDashboardSafely();
      } else {
        console.log('No fue necesario renovar el token o no se pudo');
        return await checkAuth();
      }
    } catch (error) {
      console.error('Error al renovar sesión:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [checkAuth]);

  // Verificar si hay cookie de autenticación
  const hasAuthCookie = useCallback((): boolean => {
    return cookieService.hasValidAuthCookie();
  }, []);

  useEffect(() => {
    const initApp = async () => {
      if (initializedRef.current || isAuthenticated) return;
      initializedRef.current = true;

      const publicPaths = ["/", "/login", "/register", "/onboarding"];

      if (!location || publicPaths.includes(location.pathname)) {
        setIsLoading(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 150));
      await loadDashboardSafely();

      if (typeof window !== "undefined" && window.appReadyEvent) {
        window.dispatchEvent(window.appReadyEvent);
      }
    };

    setTimeout(initApp, 0);
  }, [location?.pathname, isAuthenticated]);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const loggedInUser = await authService.login(credentials);
      if (!loggedInUser) throw new Error("Login fallido");

      setUser(loggedInUser);
      setIsAuthenticated(true);
      return loggedInUser;
    } catch (error) {
      console.error("Error durante login:", error);
      setIsAuthenticated(false);
      setUser(null);
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
      console.error("Error durante el registro:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setCycles([]);
      setCurrentCycle(null);
      setSummary(DEFAULT_SUMMARY);
      setPredictions(DEFAULT_PREDICTIONS);
      setPatterns([]);
    } catch (error) {
      console.error("Error durante logout:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserData = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
    }
  };

  const completeOnboarding = async (onboardingData: any) => {
    if (user) {
      try {
        console.log('Enviando datos de onboarding:', {
          ...onboardingData,
          onboardingCompleted: true
        });
        
        const updatedUser = await authService.completeOnboarding({
          ...onboardingData,
          onboardingCompleted: true,
        });

        // Verificar que el usuario se actualizó correctamente y establecer el estado
        if (updatedUser) {
          console.log('Usuario actualizado después del onboarding:', updatedUser);
          setUser(updatedUser);
          setIsAuthenticated(true); // Asegurar que el estado de autenticación se mantenga
          
          // Carga adicional de datos del dashboard para garantizar una transición fluida
          try {
            // Intentar cargar los datos del dashboard en segundo plano
            await loadDashboardSafely();
          } catch (dashboardError) {
            console.warn('Error al precargar datos del dashboard:', dashboardError);
            // Continuar con el flujo normal aunque falle la precarga
          }
          
          return updatedUser;
        } else {
          console.error('Onboarding completado pero no se recibió usuario actualizado');
          throw new Error('Error al actualizar el perfil de usuario');
        }
      } catch (error) {
        console.error("Error al completar onboarding:", error);
        throw error;
      }
    } else {
      throw new Error("No hay usuario autenticado");
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUserData,
    completeOnboarding,
    cycles,
    currentCycle,
    summary,
    predictions,
    patterns,
    checkAuth,
    refreshSession,
    hasAuthCookie
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
