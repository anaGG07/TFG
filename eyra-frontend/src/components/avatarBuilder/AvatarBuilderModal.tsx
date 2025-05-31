import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AvatarBuilder from "./AvatarBuilder";
import { AvatarConfig } from "../../types/avatar";
import { NeomorphicButton } from "../ui/NeomorphicComponents";
import { userService } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

interface AvatarBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: AvatarConfig) => void;
  initialConfig: AvatarConfig;
}

const AvatarBuilderModal: React.FC<AvatarBuilderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialConfig,
}) => {
  const [config, setConfig] = useState<AvatarConfig>(initialConfig);
  const [saving, setSaving] = useState(false);
  const { checkAuth } = useAuth();

  React.useEffect(() => {
    if (isOpen) setConfig(initialConfig);
  }, [isOpen, initialConfig]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Guardar directamente en backend usando el endpoint existente
      await userService.updateAvatar(config);

      // Actualizar contexto de usuario para reflejar cambios inmediatamente
      await checkAuth();

      // Notificar al componente padre
      onSave(config);

      toast.custom(
        () => (
          <div className="rounded-2xl px-6 py-4 shadow-xl bg-[#fff] border border-[#C62328]/20 flex items-center gap-3 animate-fade-in">
            <span className="text-2xl">✅</span>
            <span className="text-[#7a2323] font-semibold">
              ¡Avatar actualizado con éxito!
            </span>
          </div>
        ),
        { duration: 3000 }
      );

      onClose();
    } catch (error) {
      console.error("Error al guardar avatar:", error);
      toast.custom(
        () => (
          <div className="rounded-2xl px-6 py-4 shadow-xl bg-[#fff] border border-red-500/20 flex items-center gap-3 animate-fade-in">
            <span className="text-2xl">❌</span>
            <span className="text-red-600 font-semibold">
              Error al guardar el avatar
            </span>
          </div>
        ),
        { duration: 3000 }
      );
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ background: "rgba(231, 224, 213, 0.7)" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0" onClick={onClose} />
        {/* Modal */}
        <motion.div
          className="relative bg-[#fff] rounded-3xl shadow-2xl p-8 w-full max-w-4xl mx-4"
          initial={{ scale: 0.95, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 40, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Botón cerrar */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-[#C62328] hover:text-[#7a2323] transition-colors z-10"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <h2 className="font-serif text-2xl font-bold text-[#7a2323] mb-6 text-center">
            Personaliza tu avatar
          </h2>

          <AvatarBuilder onChange={setConfig} initialConfig={config} />

          <div className="flex gap-4 mt-8">
            <NeomorphicButton
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={saving}
            >
              Cancelar
            </NeomorphicButton>
            <NeomorphicButton
              type="button"
              variant="primary"
              className="flex-1"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar avatar"}
            </NeomorphicButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AvatarBuilderModal;
