import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeomorphicInput, NeomorphicButton } from './ui/NeomorphicComponents';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangePassword: (current: string, next: string, confirm: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, onChangePassword, loading, error }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setLocalError('Por favor, completa todos los campos.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalError('La nueva contraseña y la confirmación no coinciden.');
      return;
    }
    await onChangePassword(currentPassword, newPassword, confirmPassword);
  };

  React.useEffect(() => {
    if (!isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setLocalError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ background: 'rgba(231, 224, 213, 0.7)' }}
      >
        {/* Overlay */}
        <div className="absolute inset-0" onClick={onClose} />
        {/* Modal */}
        <motion.div
          className="relative bg-[#fff] rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4"
          initial={{ scale: 0.95, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 40, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Botón cerrar */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-[#C62328] hover:text-[#7a2323] transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="font-serif text-2xl font-bold text-[#7a2323] mb-6 text-center">
            Cambiar contraseña
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-[#7a2323] font-medium mb-1">Contraseña actual</label>
              <NeomorphicInput
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Contraseña actual"
                autoComplete="current-password"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-[#7a2323] font-medium mb-1">Nueva contraseña</label>
              <NeomorphicInput
                id="newPassword"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Nueva contraseña"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-[#7a2323] font-medium mb-1">Confirmar nueva contraseña</label>
              <NeomorphicInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirmar nueva contraseña"
                autoComplete="new-password"
              />
            </div>
            {(localError || error) && <div className="text-red-600 text-center font-medium">{localError || error}</div>}
            <div className="flex gap-4">
              <NeomorphicButton
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </NeomorphicButton>
              <NeomorphicButton
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </NeomorphicButton>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChangePasswordModal; 