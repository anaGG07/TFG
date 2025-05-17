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
  refreshSession: () => Promise.reject(new Error("AuthContext no inicializado"))
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
  const [currentCycle, setCurrentCycle] = useState<Cycle | null>(DEFAULT_CURRENT_CYCLE);
  const [summary, setSummary] = useState<CycleSummary>(DEFAULT_SUMMARY);
  const [predictions, setPredictions] = useState<Prediction>(DEFAULT_PREDICTIONS);
  const [patterns, setPatterns] = useState<SymptomPattern[]>(DEFAULT_PATTERNS);

  const location = useSafeLocation();
  const initializedRef = useRef(false);

  const loadDashboardSafely = async () => {
    // No cargar datos en páginas de login/registro
    if (
      window.location.pathname === '/login' ||
      window.location.pathname === '/register'
    ) {
      console.log("Omitiendo carga de datos en página de login/registro");
      setIsLoading(false);
      return false;
    }

    try {
      const userData = await authService.getProfile();

      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);

        const [
          cyclesData,
          currentCycleData,
          summaryData,
          predictionsData,
          patternsData,
        ] = await apiFetchParallel<Cycle[] | Cycle | null | CycleSummary | Prediction | SymptomPattern[]>([
          { path: "cycles", defaultValue: DEFAULT_CYCLES },
          { path: "cycles/current", defaultValue: DEFAULT_CURRENT_CYCLE },
          { path: "insights/summary", defaultValue: DEFAULT_SUMMARY },
          { path: "insights/predictions", defaultValue: DEFAULT_PREDICTIONS },
          { path: "insights/patterns", defaultValue: DEFAULT_PATTERNS },
        ]) as [Cycle[], Cycle | null, CycleSummary, Prediction, SymptomPattern[]];

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

  const checkAuth = useCallback(async (): Promise<boolean> => {
    console.log("AuthContext: Verificando estado de autenticación...", {
      path: window.location.pathname,
      cookies: document.cookie
    });

    // Si estamos en páginas públicas, no verificamos autenticación
    if (
      window.location.pathname === '/login' ||
      window.location.pathname === '/register'
    ) {
      console.log("AuthContext: Omitiendo verificación en página pública");
      setIsLoading(false);
      return false;
    }

    try {
      setIsLoading(true);
      
      // Verificar si el token es válido
      console.log("AuthContext: Verificando token...");
      const tokenValid = await tokenService.checkToken();
      
      if (!tokenValid) {
        console.log("AuthContext: Token inválido, limpiando estado", {
          path: window.location.pathname,
          cookies: document.cookie
        });
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }

      // Si el usuario está en onboarding, NO cargar el perfil
      if (window.location.pathname === '/onboarding') {
        console.log("AuthContext: Usuario en onboarding, no se carga perfil");
        return true;
      }

      // Si el token es válido, intentar cargar el perfil
      console.log("AuthContext: Token válido, cargando perfil...");
      const result = await loadDashboardSafely();
      console.log("AuthContext: Resultado de carga del perfil:", result);
      return result;
    } catch (error) {
      console.error("AuthContext: Error al verificar autenticación:", error, {
        path: window.location.pathname,
        cookies: document.cookie
      });
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    return checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const initApp = async () => {
      if (initializedRef.current) return; // Solo inicializar una vez
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
  }, [location?.pathname]); // Solo depende de la ruta, nunca de isAuthenticated

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      console.log('AuthContext: Iniciando proceso de login...');
      const loggedInUser = await authService.login(credentials);
      
      if (!loggedInUser) {
        console.error('AuthContext: No se recibió usuario del servidor');
        throw new Error("Login fallido");
      }

      console.log('AuthContext: Login exitoso, usuario:', loggedInUser);
      setUser(loggedInUser);
      setIsAuthenticated(true);

      // Dar tiempo a que las cookies se establezcan correctamente
      await new Promise(resolve => setTimeout(resolve, 100));

      return loggedInUser;
    } catch (error: any) {
      console.error('AuthContext: Error en login:', error);
      setUser(null);
      setIsAuthenticated(false);
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

      // Limpiar datos de sesión del contexto
      setUser(null);
      setIsAuthenticated(false);
      setCycles([]);
      setCurrentCycle(null);
      setSummary(DEFAULT_SUMMARY);
      setPredictions(DEFAULT_PREDICTIONS);
      setPatterns([]);
    } catch (error) {
      console.error("Error durante logout:", error);

      // Asegurar que se limpia el estado 
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
    console.log('AuthContext: Iniciando completeOnboarding', {
      hayUsuario: !!user,
      estaAutenticado: isAuthenticated,
      estaCargando: isLoading
    });

    if (!isAuthenticated || !user) {
      console.error('AuthContext: Intento de completar onboarding sin autenticación');
      throw new Error("No hay usuario autenticado");
    }

    try {
      // Intentar refrescar la sesión antes de continuar
      console.log('AuthContext: Intentando refrescar sesión antes del onboarding...');
      const refreshed = await tokenService.checkToken();
      
      if (!refreshed) {
        console.error('AuthContext: No se pudo refrescar la sesión');
        setIsAuthenticated(false);
        setUser(null);
        throw new Error("La sesión ha expirado");
      }

      console.log('AuthContext: Sesión refrescada correctamente, enviando datos:', {
        ...onboardingData,
        onboardingCompleted: true
      });
      
      const updatedUser = await authService.completeOnboarding({
        ...onboardingData,
        onboardingCompleted: true,
      });

      if (!updatedUser) {
        console.error('AuthContext: No se recibió respuesta del servidor');
        throw new Error('No se pudo completar el onboarding correctamente');
      }

      console.log('AuthContext: Usuario actualizado después del onboarding:', updatedUser);
      setUser(updatedUser);
      setIsAuthenticated(true);
      
      return updatedUser;
    } catch (error: any) {
      console.error("AuthContext: Error al completar onboarding:", error);
      
      // Si el error es de autenticación, limpiamos el estado
      if (error.message === "No hay usuario autenticado" || 
          error.message === "La sesión ha expirado") {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      throw error;
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
    refreshSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
