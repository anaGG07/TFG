import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/domain';
import { authService } from '../services/authService';
import { LoginRequest, RegisterRequest } from '../types/api';

import {
  fetchAllCycles,
  fetchCurrentCycle,
  Cycle
} from '../services/cycleService';

import {
  fetchSummary,
  fetchPredictions,
  fetchPatterns,
  CycleSummary,
  Prediction,
  SymptomPattern
} from '../services/insightService';

import { apiFetchParallel } from '../utils/httpClient';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<any>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (userData: Partial<User>) => void;
  completeOnboarding: (onboardingData: any) => Promise<void>;

  // Datos del dashboard
  cycles: Cycle[];
  currentCycle: Cycle | null;
  summary: CycleSummary | null;
  predictions: Prediction | null;
  patterns: SymptomPattern[];
}

// Valores por defecto para los datos del dashboard
const DEFAULT_CYCLES: Cycle[] = [];
const DEFAULT_CURRENT_CYCLE: Cycle | null = null;
const DEFAULT_SUMMARY: CycleSummary = {
  averageDuration: 28,
  shortestCycle: 26,
  longestCycle: 32,
  totalCycles: 0,
  commonSymptoms: []
};
const DEFAULT_PREDICTIONS: Prediction = {
  nextPeriodDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  confidenceScore: 0.8,
  nextFertileWindow: {
    start: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
  }
};
const DEFAULT_PATTERNS: SymptomPattern[] = [];

// Evitar null context para simplificar el código
const defaultContextValue: AuthContextType = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => Promise.reject(new Error('AuthContext no inicializado')),
  register: () => Promise.reject(new Error('AuthContext no inicializado')),
  logout: () => Promise.reject(new Error('AuthContext no inicializado')),
  updateUserData: () => {},
  completeOnboarding: () => Promise.reject(new Error('AuthContext no inicializado')),
  cycles: DEFAULT_CYCLES,
  currentCycle: DEFAULT_CURRENT_CYCLE,
  summary: DEFAULT_SUMMARY,
  predictions: DEFAULT_PREDICTIONS,
  patterns: DEFAULT_PATTERNS
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Dashboard data with reasonable defaults
  const [cycles, setCycles] = useState<Cycle[]>(DEFAULT_CYCLES);
  const [currentCycle, setCurrentCycle] = useState<Cycle | null>(DEFAULT_CURRENT_CYCLE);
  const [summary, setSummary] = useState<CycleSummary>(DEFAULT_SUMMARY);
  const [predictions, setPredictions] = useState<Prediction>(DEFAULT_PREDICTIONS);
  const [patterns, setPatterns] = useState<SymptomPattern[]>(DEFAULT_PATTERNS);

  // Carga segura que evita bloquear la UI
  const loadDashboardSafely = async () => {
    try {
      // Primero cargamos el perfil del usuario, que es crítico
      const userData = await authService.getProfile().catch(() => null);
      
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Si no hay datos de usuario, asumimos que no está autenticado
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Luego cargamos los datos no críticos en paralelo con manejo de errores mejorado
      const [
        cyclesData,
        currentCycleData,
        summaryData,
        predictionsData,
        patternsData
      ] = await apiFetchParallel([
        { path: 'cycles', defaultValue: DEFAULT_CYCLES },
        { path: 'cycles/current', defaultValue: DEFAULT_CURRENT_CYCLE },
        { path: 'insights/summary', defaultValue: DEFAULT_SUMMARY },
        { path: 'insights/predictions', defaultValue: DEFAULT_PREDICTIONS },
        { path: 'insights/patterns', defaultValue: DEFAULT_PATTERNS }
      ]);

      // Actualizamos el estado con los datos obtenidos
      if (cyclesData) setCycles(cyclesData);
      if (currentCycleData) setCurrentCycle(currentCycleData);
      if (summaryData) setSummary(summaryData);
      if (predictionsData) setPredictions(predictionsData);
      if (patternsData) setPatterns(patternsData);
    } catch (error) {
      console.error('Error al cargar dashboard, usando datos por defecto:', error);
    } finally {
      setIsLoading(false);
      
      // Notificamos que la aplicación ha cargado
      if (typeof window !== 'undefined' && window.appReadyEvent) {
        window.dispatchEvent(window.appReadyEvent);
      }
    }
  };

  // Inicialización con mejor manejo de errores
  useEffect(() => {
    const initApp = async () => {
      try {
        // Verificamos si el usuario está autenticado
        if (authService.isAuthenticated()) {
          // Iniciamos la carga de datos
          await loadDashboardSafely();
        } else {
          // Si no está autenticado, simplemente marcamos como cargado
          setIsLoading(false);
        }
        
        // Notificamos que la aplicación ha cargado
        if (typeof window !== 'undefined' && window.appReadyEvent) {
          window.dispatchEvent(window.appReadyEvent);
        }
      } catch (error) {
        console.error('Error en la inicialización de la app:', error);
        setIsLoading(false);
        
        // Aseguramos que la app siempre termine de cargar
        if (typeof window !== 'undefined' && window.appReadyEvent) {
          window.dispatchEvent(window.appReadyEvent);
        }
      }
    };

    // Ejecutamos con un pequeño timeout para evitar bloquear el hilo principal durante el renderizado
    setTimeout(initApp, 0);
    
    // Cleanup function
    return () => {
      // Nada que limpiar por ahora
    };
  }, []);

  // Función de login mejorada con manejo de errores robusto
  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      console.log('Context: Iniciando proceso de login');
      const loginSuccessful = await authService.login(credentials);
      
      if (!loginSuccessful) {
        throw new Error('Login fallido');
      }
      
      // Usamos datos mock para evitar dependencias del backend
      console.log('Context: Login exitoso, estableciendo usuario');
      
      const mockUser: User = {
        id: 1,
        email: credentials.email,
        username: 'usuario',
        name: 'Usuario',
        lastName: 'Demo',
        roles: ['ROLE_USER'],
        profileType: 'profile_women' as ProfileType,
        genderIdentity: 'woman',
        birthDate: '1990-01-01',
        createdAt: new Date().toISOString(),
        updatedAt: null,
        state: true,
        onboardingCompleted: false, // Por defecto necesita completar onboarding
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      // Iniciamos carga de datos adicionales en segundo plano
      loadDashboardSafely().catch(e => {
        console.warn('Error al cargar datos adicionales:', e);
      });
      
      return mockUser;
    } catch (error) {
      console.error('Error durante login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Registro con mejor manejo de errores
  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    try {
      await authService.register(userData);
    } catch (error) {
      console.error('Error durante el registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout con mejor manejo de errores
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      
      // Limpiamos el estado local
      setUser(null);
      setIsAuthenticated(false);
      setCycles([]);
      setCurrentCycle(null);
      setSummary(DEFAULT_SUMMARY);
      setPredictions(DEFAULT_PREDICTIONS);
      setPatterns([]);
    } catch (error) {
      console.error('Error durante logout:', error);
      // Incluso si hay error, limpiamos el estado local
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar datos del usuario de forma segura
  const updateUserData = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Actualizar en localStorage para mantener sincronizado
      try {
        localStorage.setItem('eyra_user', JSON.stringify(updatedUser));
      } catch (e) {
        console.warn('No se pudo guardar el usuario en localStorage:', e);
      }
    }
  };

  // Función para completar el onboarding y actualizar el perfil
  const completeOnboarding = async (onboardingData: any) => {
    if (user) {
      try {
        // Actualizamos el perfil con los datos del onboarding
        const updatedUser = await authService.updateProfile({
          ...onboardingData,
          onboardingCompleted: true // Marcamos como completado
        });
        setUser(updatedUser);
        return updatedUser;
      } catch (error) {
        console.error('Error al completar onboarding:', error);
        throw error;
      }
    } else {
      throw new Error('No hay usuario autenticado');
    }
  };

  // Objeto de contexto con todos los valores y funciones
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
    patterns
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
