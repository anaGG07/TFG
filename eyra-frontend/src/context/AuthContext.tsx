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


import Cookies from "js-cookie";
import { apiFetch } from "../utils/httpClient";

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

  // Comprobación de sesión usando apiFetch
  const checkAuth = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return false;
      }
      try {
        const userData = await apiFetch<User>("/auth/me");
        setUser(userData);
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      } catch (error) {
        Cookies.remove("token");
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }
  }, [location?.pathname]);

  useEffect(() => {
    const initApp = async () => {
      if (initializedRef.current) return;
      initializedRef.current = true;
      await checkAuth();
      if (typeof window !== "undefined" && window.appReadyEvent) {
        window.dispatchEvent(window.appReadyEvent);
      }
    };
    initApp();
  }, [location?.pathname, checkAuth]);

  useEffect(() => {
    const handlePopState = async () => {
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
    const user = await authService.completeOnboarding(onboardingData);
    setUser(user);
    setIsAuthenticated(true);
    return user;
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
