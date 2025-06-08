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
  const { user, refreshSession } = useAuth();
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
      setSettings({
        allowSearchable: user.allowSearchable ?? true,
        // Estas configuraciones por ahora son locales, se pueden expandir
        cycleInfoSharing: true,
        symptomsSharing: true,
        alertsSharing: true,
        medicalDataSharing: false,
      });
    }
  }, [user]);

  const updatePrivacySetting = async (
    key: keyof PrivacySettings,
    value: boolean
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Actualizar estado local inmediatamente para mejor UX
      setSettings(prev => ({ ...prev, [key]: value }));

      // Solo sincronizar con backend los campos que existen en la entidad User
      if (key === 'allowSearchable') {
        await userService.updatePrivacySettings({ [key]: value });
        // Refrescar datos del usuario para mantener consistencia
        await refreshSession();
      }
      
      // Para otros campos, solo mantenemos estado local por ahora
      console.log(`Privacy setting updated: ${key} = ${value}`);

    } catch (err) {
      // Revertir cambio local en caso de error
      setSettings(prev => ({ ...prev, [key]: !value }));
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

      // Actualizar estado local
      setSettings(prev => ({ ...prev, ...newSettings }));

      // Sincronizar con backend solo campos existentes
      if (Object.keys(backendUpdates).length > 0) {
        await userService.updatePrivacySettings(backendUpdates);
        await refreshSession();
      }

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