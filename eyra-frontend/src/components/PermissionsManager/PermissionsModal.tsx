import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trackingService } from "../../services/trackingService";

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  companionId: string;
  companionName: string;
  currentPermissions: string[];
  currentGuestPreferences?: string[];
  isOwner: boolean;
  onUpdate: () => void;
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  companionId,
  companionName,
  currentPermissions,
  currentGuestPreferences = [],
  isOwner,
  onUpdate,
}) => {
  const [availablePermissions, setAvailablePermissions] = useState<string[]>(
    []
  );
  const [ownerPermissions, setOwnerPermissions] =
    useState<string[]>(currentPermissions);
  const [guestPreferences, setGuestPreferences] = useState<string[]>(
    currentGuestPreferences
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAvailablePermissions();
      setOwnerPermissions(currentPermissions);
      setGuestPreferences(currentGuestPreferences);
    }
  }, [isOpen, currentPermissions, currentGuestPreferences]);

  const loadAvailablePermissions = async () => {
    try {
      setLoading(true);
      const permissions = await trackingService.getAvailablePermissions();
      setAvailablePermissions(permissions);
    } catch (error) {
      console.error("Error cargando permisos:", error);
      setAvailablePermissions([
        "view_cycle",
        "view_symptoms",
        "receive_notifications",
        "view_predictions",
        "view_mood_tracking",
        "view_basic_info",
      ]);
    } finally {
      setLoading(false);
    }
  };
  const handleOwnerPermissionToggle = (permission: string) => {
    if (!isOwner) return;

    setOwnerPermissions((prev) => {
      const newPermissions = prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission];

      if (!newPermissions.includes(permission)) {
        setGuestPreferences((prevPrefs) =>
          prevPrefs.filter((p) => p !== permission)
        );
      }

      return newPermissions;
    });
  };

  const handleGuestPreferenceToggle = (permission: string) => {
    if (!ownerPermissions.includes(permission)) return;

    setGuestPreferences((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (isOwner) {
        await trackingService.updateCompanionPermissions(
          companionId,
          ownerPermissions
        );
      } else {
        await trackingService.updateMyPreferences(
          companionId,
          guestPreferences
        );
      }

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error guardando permisos:", error);
      alert("Error al guardar los cambios. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const getPermissionLabel = (permission: string): string => {
    const labels: Record<string, string> = {
      // Fases del ciclo
      phase_menstrual: "Fase Menstrual",
      phase_follicular: "Fase Folicular",
      phase_ovulation: "Ovulación",
      phase_luteal: "Fase Lútea",
      // Detalles
      basic_info: "Información Básica",
      symptoms: "Síntomas",
      notes: "Notas",
      flow_details: "Detalles del Flujo",
      pain_levels: "Niveles de Dolor",
      mood_tracking: "Estado de Ánimo",
      // Características
      predictions: "Predicciones",
      recommendations: "Recomendaciones",
      statistics: "Estadísticas",
      // Compatibilidad hacia atrás
      view_cycle: "Ver ciclo menstrual",
      view_symptoms: "Ver síntomas",
      receive_notifications: "Recibir notificaciones",
      view_predictions: "Ver predicciones",
      view_mood_tracking: "Ver seguimiento del estado de ánimo",
      view_basic_info: "Ver información básica",
    };
    return labels[permission] || permission;
  };
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#7a2323]">
              Gestionar Permisos
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          <p className="text-sm text-[#5b0108] mb-4">
            {isOwner
              ? `Configurando acceso para @${companionName}`
              : `Configurando tus preferencias para @${companionName}`}
          </p>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C62328] mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Cargando permisos...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {isOwner && (
                <div>
                  <h4 className="font-semibold text-[#5b0108] mb-3">
                    Permisos que concedes:
                  </h4>
                  <div className="space-y-2">
                    {availablePermissions.map((permission) => (
                      <label
                        key={permission}
                        className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded p-2"
                      >
                        <input
                          type="checkbox"
                          checked={ownerPermissions.includes(permission)}
                          onChange={() =>
                            handleOwnerPermissionToggle(permission)
                          }
                          className="w-4 h-4 text-[#C62328] border-gray-300 rounded focus:ring-[#C62328]"
                        />
                        <span className="text-sm text-[#5b0108]">
                          {getPermissionLabel(permission)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h4 className="font-semibold text-[#5b0108] mb-3">
                  {isOwner ? "Preferencias del invitado:" : "Tus preferencias:"}
                </h4>
                <p className="text-xs text-gray-600 mb-3">
                  Solo puedes activar lo que el propietario permite
                </p>
                <div className="space-y-2">
                  {availablePermissions.map((permission) => {
                    const isAllowed = ownerPermissions.includes(permission);
                    const isSelected = guestPreferences.includes(permission);

                    return (
                      <label
                        key={permission}
                        className={`flex items-center space-x-3 rounded p-2 ${
                          isAllowed
                            ? "cursor-pointer hover:bg-gray-50"
                            : "cursor-not-allowed opacity-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={!isAllowed}
                          onChange={() =>
                            handleGuestPreferenceToggle(permission)
                          }
                          className="w-4 h-4 text-[#C62328] border-gray-300 rounded focus:ring-[#C62328] disabled:opacity-50"
                        />
                        <span className="text-sm text-[#5b0108]">
                          {getPermissionLabel(permission)}
                          {!isAllowed && (
                            <span className="text-red-500 ml-2">
                              (No permitido)
                            </span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-[#C62328] text-white rounded-lg hover:bg-[#9d0d0b] transition-colors disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PermissionsModal;
