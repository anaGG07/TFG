import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
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

  const location = useLocation();

  // Sincronizar el estado del contexto con el servicio de autenticación
  const syncAuthState = useCallback(() => {
    const authState = authService.getAuthState();
    setUser(authState.user);
    setIsAuthenticated(authState.isAuthenticated);
  }, []);

  // Verificar la sesión
  const checkAuth = useCallback(async (silent = false): Promise<boolean> => {
    setIsLoading(true);
    try {
      const isValid = await authService.verifySession(silent);
      syncAuthState();
      return isValid;
    } catch (error) {
      syncAuthState();
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [syncAuthState]);

  // Efecto para verificar la sesión al montar el componente y cuando cambia la ruta
  useEffect(() => {
    checkAuth(true); // Primer chequeo: silencioso
  }, [location.pathname, checkAuth]);

  // Efecto para manejar cambios en el estado de autenticación
  useEffect(() => {
    const handleStorageChange = () => {
      syncAuthState();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [syncAuthState]);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const loggedInUser = await authService.login(credentials);
      // Actualizar el contexto con la respuesta del login
      syncAuthState();
      // Hacer una petición a /api/profile para obtener el estado más actualizado
      const updatedUser = await authService.verifySession(true);
      if (updatedUser) {
        syncAuthState();
      }
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
      setCycles([]);
      setCurrentCycle(null);
      setSummary(DEFAULT_SUMMARY);
      setPredictions(DEFAULT_PREDICTIONS);
      setPatterns([]);
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
    await authService.completeOnboarding(onboardingData);
    // Forzar recarga del usuario desde el backend
    await authService.verifySession();
    syncAuthState();
    const updatedUser = authService.getAuthState().user;
    if (!updatedUser) throw new Error('No se pudo actualizar el usuario tras el onboarding');
    return updatedUser;
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
