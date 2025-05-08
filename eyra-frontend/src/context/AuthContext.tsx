import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types/domain";
import { authService } from "../services/authService";
import { LoginRequest, RegisterRequest } from "../types/api";

import {
  Cycle,
} from "../services/cycleService";

import {
  CycleSummary,
  Prediction,
  SymptomPattern,
} from "../services/insightService";

import { apiFetchParallel } from "../utils/httpClient";

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
  const [currentCycle, setCurrentCycle] = useState<Cycle | null>(
    DEFAULT_CURRENT_CYCLE
  );
  const [summary, setSummary] = useState<CycleSummary>(DEFAULT_SUMMARY);
  const [predictions, setPredictions] =
    useState<Prediction>(DEFAULT_PREDICTIONS);
  const [patterns, setPatterns] = useState<SymptomPattern[]>(DEFAULT_PATTERNS);

  const loadDashboardSafely = async () => {
    try {
      const userData = await authService.getProfile().catch(() => null);
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

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
    } catch (error) {
      console.error("Error al cargar dashboard:", error);
    } finally {
      setIsLoading(false);
      if (typeof window !== "undefined" && window.appReadyEvent) {
        window.dispatchEvent(window.appReadyEvent);
      }
    }
  };

  useEffect(() => {
    const initApp = async () => {
      try {
        if (authService.isAuthenticated()) {
          await loadDashboardSafely();
        } else {
          setIsLoading(false);
        }

        if (typeof window !== "undefined" && window.appReadyEvent) {
          window.dispatchEvent(window.appReadyEvent);
        }
      } catch (error) {
        console.error("Error en inicialización:", error);
        setIsLoading(false);
        if (typeof window !== "undefined" && window.appReadyEvent) {
          window.dispatchEvent(window.appReadyEvent);
        }
      }
    };

    setTimeout(initApp, 0);
  }, []);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const loggedInUser = await authService.login(credentials);
      if (!loggedInUser) {
        throw new Error("Login fallido");
      }

      setUser(loggedInUser);
      setIsAuthenticated(true);

      loadDashboardSafely().catch((e) => {
        console.warn("Error al cargar datos adicionales:", e);
      });

      return loggedInUser;
    } catch (error) {
      console.error("Error durante login:", error);
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
      localStorage.removeItem("eyra_user");
      setUser(null);
      setIsAuthenticated(false);
      setCycles([]);
      setCurrentCycle(null);
      setSummary(DEFAULT_SUMMARY);
      setPredictions(DEFAULT_PREDICTIONS);
      setPatterns([]);
    } catch (error) {
      console.error("Error durante logout:", error);
      localStorage.removeItem("eyra_user");
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
      try {
        localStorage.setItem("eyra_user", JSON.stringify(updatedUser));
      } catch (e) {
        console.warn("No se pudo guardar el usuario en localStorage:", e);
      }
    }
  };

  const completeOnboarding = async (onboardingData: any) => {
    if (user) {
      try {
        const updatedUser = await authService.completeOnboarding({
          ...onboardingData,
          onboardingCompleted: true,
        });

        setUser(updatedUser);
        try {
          localStorage.setItem("eyra_user", JSON.stringify(updatedUser));
        } catch (e) {
          console.warn(
            "No se pudo guardar el usuario actualizado en localStorage:",
            e
          );
        }

        return updatedUser;
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
