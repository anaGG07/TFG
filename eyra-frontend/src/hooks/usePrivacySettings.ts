import { useState, useEffect } from "react";
import { userService } from "../services/userService";
import { useAuth } from "../context/AuthContext";

interface PrivacySettings {
  allowSearchable: boolean;
  cycleInfoSharing: boolean;
  symptomsSharing: boolean;
  alertsSharing: boolean;
  medicalDataSharing: boolean;
}

export const usePrivacySettings = () => {
  const { user, updateUserData } = useAuth();
  const [settings, setSettings] = useState<PrivacySettings>({
    allowSearchable: true,
    cycleInfoSharing: true,
    symptomsSharing: true,
    alertsSharing: true,
    medicalDataSharing: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar configuración desde el usuario autenticado
  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        allowSearchable: user.allowSearchable ?? true,
      }));
    }
  }, [user]);

  const updatePrivacySetting = async (
    key: keyof PrivacySettings,
    value: boolean
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Solo sincronizar con backend los campos que existen en la entidad User
      if (key === 'allowSearchable') {
        await userService.updatePrivacySettings({ [key]: value });
        
        // Actualizar el contexto de usuario local sin recargar toda la sesión
        if (user) {
          updateUserData({ ...user, [key]: value });
        }
      }
      
      // Actualizar estado local
      setSettings(prev => ({ ...prev, [key]: value }));
      
      console.log(`Privacy setting updated: ${key} = ${value}`);

    } catch (err) {
      setError(`Error al actualizar configuración de ${key}`);
      console.error(`Error updating privacy setting ${key}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAllSettings = async (newSettings: Partial<PrivacySettings>) => {
    try {
      setLoading(true);
      setError(null);

      // Preparar actualizaciones para el backend
      const backendUpdates: { allowSearchable?: boolean } = {};
      
      if (newSettings.allowSearchable !== undefined) {
        backendUpdates.allowSearchable = newSettings.allowSearchable;
      }

      // Sincronizar con backend solo campos existentes
      if (Object.keys(backendUpdates).length > 0) {
        await userService.updatePrivacySettings(backendUpdates);
        
        // Actualizar el contexto de usuario local
        if (user) {
          updateUserData({ ...user, ...backendUpdates });
        }
      }

      // Actualizar estado local
      setSettings(prev => ({ ...prev, ...newSettings }));

      console.log('Privacy settings updated:', newSettings);

    } catch (err) {
      setError("Error al actualizar configuración");
      console.error("Error updating privacy settings:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    error,
    updatePrivacySetting,
    updateAllSettings,
  };
};