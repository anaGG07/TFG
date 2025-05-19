import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "../types/domain";
import { authService } from "../services/authService";
import { LoginRequest, RegisterRequest } from "../types/api";
import { Cycle } from "../services/cycleService";
import {
  CycleSummary,
  Prediction,
  SymptomPattern,
} from "../services/insightService";
import { apiFetchParallel, apiFetch } from "../utils/httpClient";
import tokenService from "../services/tokenService";
import { ROUTES } from "../router/paths";
import Cookies from "js-cookie";

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
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const location = useSafeLocation();
  const navigate = useNavigate();
  const initializedRef = useRef(false);

  // Función para cargar datos del dashboard de forma diferida
  const loadDashboardData = async () => {
    if (isDataLoaded) return;

    try {
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
      
      setIsDataLoaded(true);
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
    }
  };

  const loadDashboardSafely = async () => {
    // No cargar datos en páginas de login/registro
    if (
      window.location.pathname === '/login' ||
      window.location.pathname === '/register'
    ) {
      setIsLoading(false);
      return false;
    }

    try {
      const userData = await authService.getProfile();

      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
        
        // Cargar datos esenciales inmediatamente
        const currentCycleData = await apiFetch<Cycle | null>("cycles/current", { defaultValue: DEFAULT_CURRENT_CYCLE });
        if (currentCycleData) setCurrentCycle(currentCycleData);
        
        // Cargar el resto de datos de forma diferida
        requestIdleCallback(() => {
          loadDashboardData();
        });
        
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
    try {
      const token = Cookies.get("token");
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return false;
      }

      // Verificar si estamos en una ruta pública
      const publicPaths = ["/login", "/register"];
      const currentPath = location?.pathname || window.location.pathname;
      const isPublicPath = publicPaths.includes(currentPath);

      // Si no estamos en una ruta pública y no hay token, redirigir a login
      if (!isPublicPath && !token) {
        navigate(ROUTES.LOGIN, { replace: true });
        return false;
      }

      // Si hay token, intentar obtener los datos del usuario
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          
          // Si estamos en una ruta pública y el usuario está autenticado, redirigir al dashboard
          if (isPublicPath) {
            navigate(ROUTES.DASHBOARD, { replace: true });
          }
          return true;
        } else {
          // Si la respuesta no es exitosa, limpiar el token y el usuario
          Cookies.remove("token");
          setUser(null);
          if (!isPublicPath) {
            navigate(ROUTES.LOGIN, { replace: true });
          }
          return false;
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
        Cookies.remove("token");
        setUser(null);
        if (!isPublicPath) {
          navigate(ROUTES.LOGIN, { replace: true });
        }
        return false;
      }
    } catch (error) {
      console.error("Error al verificar la autenticación:", error);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [location?.pathname, navigate]);

  useEffect(() => {
    const initApp = async () => {
      if (initializedRef.current) return;
      initializedRef.current = true;
      
      // Lista de rutas públicas donde no necesitamos cargar datos
      const publicPaths = ["/login", "/register", "/onboarding"];
      
      // Si estamos en una ruta pública, no cargamos datos y marcamos la app como lista
      if (!location || publicPaths.includes(location.pathname)) {
        setIsLoading(false);
        setIsAuthenticated(false);
        setUser(null);
        if (typeof window !== "undefined" && window.appReadyEvent) {
          window.dispatchEvent(window.appReadyEvent);
        }
        return;
      }
      
      // Verificar autenticación al iniciar la aplicación
      const isAuth = await checkAuth();
      
      // Si no está autenticado y no estamos en una ruta pública, redirigir al login
      if (!isAuth && !publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
        return;
      }
      
      // Solo cargamos datos si estamos autenticados
      if (isAuth) {
        await loadDashboardSafely();
      }
    };
    
    initApp();
  }, [location?.pathname, checkAuth]);

  // Añadir un listener para el evento popstate (navegación del navegador)
  useEffect(() => {
    const handlePopState = async () => {
      // Verificar autenticación cuando se usa el botón de retroceso
      await checkAuth();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [checkAuth]);

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

      // Marcar que acabamos de autenticar para evitar verificaciones redundantes
      localStorage.setItem('lastAuthentication', Date.now().toString());
      // También guardar que el token es válido para evitar verificaciones innecesarias
      localStorage.setItem('lastTokenCheck', Date.now().toString());

      // Dar tiempo a que las cookies se establezcan correctamente
      await new Promise(resolve => setTimeout(resolve, 200));

      console.log('AuthContext: Login completado con éxito, listo para redireccionar');
      return loggedInUser;
    } catch (error: any) {
      console.error('AuthContext: Error en login:', error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('lastAuthentication');
      localStorage.removeItem('lastTokenCheck');
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
      });
      
      const updatedUser = await authService.completeOnboarding({
        ...onboardingData,
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

  const refreshSession = useCallback(async (): Promise<boolean> => {
    return checkAuth();
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
