import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeomorphicInput, NeomorphicButton } from "./ui/NeomorphicComponents";
import EditIcon from '../assets/icons/edit.svg';
import AvatarCreator from './AvatarCreator';
import { userService } from '../services/userService';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSave: (data: any) => Promise<void>;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [form, setForm] = useState({
    name: user?.name || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    birthDate: user?.birthDate || '',
    avatar: user?.avatar || '',
    receiveAlerts: user?.receiveAlerts ?? true,
    receiveRecommendations: user?.receiveRecommendations ?? true,
    receiveWorkoutSuggestions: user?.receiveWorkoutSuggestions ?? true,
    receiveNutritionAdvice: user?.receiveNutritionAdvice ?? true,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAvatarCreatorOpen, setIsAvatarCreatorOpen] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Validación de cambio de contraseña
      if (
        form.currentPassword || form.newPassword || form.confirmPassword
      ) {
        if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
          setError('Por favor, completa todos los campos de contraseña.');
          setLoading(false);
          return;
        }
        if (form.newPassword !== form.confirmPassword) {
          setError('La nueva contraseña y la confirmación no coinciden.');
          setLoading(false);
          return;
        }
        // Llamar al endpoint correcto para cambio de contraseña
        if (typeof userService.changePassword === 'function') {
          await userService.changePassword(form.currentPassword, form.newPassword);
        } else {
          setError('No se pudo cambiar la contraseña.');
          setLoading(false);
          return;
        }
      }
      // Guardar el resto del perfil
      const { currentPassword, newPassword, confirmPassword, ...profileData } = form;
      await onSave(profileData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar los cambios');
    } finally {
      setLoading(false);
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
        style={{ background: 'rgba(231, 224, 213, 0.7)' }}
      >
        {/* Overlay */}
        <div className="absolute inset-0" onClick={onClose} />
        {/* Modal */}
        <motion.div
          className="relative bg-[#fff] rounded-3xl shadow-2xl p-8 w-full max-w-2xl mx-4"
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

          <h2 className="font-serif text-2xl font-bold text-[#7a2323] mb-6 text-center flex items-center justify-center gap-2">
            <img src={EditIcon} alt="Editar" style={{ width: 28, height: 28, marginRight: 8, verticalAlign: 'middle' }} />
            Editar perfil
          </h2>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-[#C62328] flex items-center justify-center">
                {form.avatar ? (
                  <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl text-white font-bold">
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <NeomorphicButton
                type="button"
                variant="secondary"
                onClick={() => setIsAvatarCreatorOpen(true)}
              >
                Cambiar avatar
              </NeomorphicButton>
            </div>

            {/* Datos personales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-[#7a2323] font-medium mb-1">Nombre</label>
                <NeomorphicInput
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nombre"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-[#7a2323] font-medium mb-1">Apellido</label>
                <NeomorphicInput
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Apellido"
                  required
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-[#7a2323] font-medium mb-1">Nombre de usuario</label>
                <NeomorphicInput
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Nombre de usuario"
                  required
                />
              </div>
              <div>
                <label htmlFor="birthDate" className="block text-[#7a2323] font-medium mb-1">Fecha de nacimiento</label>
                <NeomorphicInput
                  id="birthDate"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  placeholder="Fecha de nacimiento"
                  type="date"
                  required
                />
              </div>
            </div>

            {/* Botón para mostrar/ocultar cambio de contraseña */}
            <div className="my-2">
              <button
                type="button"
                className="text-[#C62328] font-semibold underline hover:text-[#7a2323] transition-colors"
                onClick={() => setShowPasswordForm((v) => !v)}
              >
                {showPasswordForm ? 'Ocultar cambio de contraseña' : 'Cambiar contraseña'}
              </button>
            </div>

            {/* Cambio de contraseña (solo visible si showPasswordForm) */}
            {showPasswordForm && (
              <div className="space-y-2">
                <h4 className="text-lg font-serif font-bold text-[#7a2323]">Cambiar contraseña</h4>
                <div>
                  <label htmlFor="currentPassword" className="block text-[#7a2323] font-medium mb-1">Contraseña actual</label>
                  <NeomorphicInput
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={form.currentPassword || ''}
                    onChange={handleChange}
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
                    value={form.newPassword || ''}
                    onChange={handleChange}
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
                    value={form.confirmPassword || ''}
                    onChange={handleChange}
                    placeholder="Confirmar nueva contraseña"
                    autoComplete="new-password"
                  />
                </div>
              </div>
            )}

            {/* Recordatorios */}
            <div className="space-y-4">
              <h4 className="text-lg font-serif font-bold text-[#7a2323]">Notificaciones</h4>
              {[
                { name: 'receiveAlerts', label: 'Alertas importantes' },
                { name: 'receiveRecommendations', label: 'Recomendaciones' },
                { name: 'receiveWorkoutSuggestions', label: 'Ejercicio' },
                { name: 'receiveNutritionAdvice', label: 'Nutrición' },
              ].map((r) => (
                <label key={r.name} className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name={r.name}
                    checked={form[r.name as keyof typeof form] as boolean}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span
                    className={`w-10 h-6 rounded-full flex items-center transition-all duration-200 ${form[r.name as keyof typeof form] ? 'bg-[#C62328]/80' : 'bg-[#f0e8dc]'}`}
                    style={{ boxShadow: 'inset 2px 2px 6px #c6232822' }}
                  >
                    <span
                      className={`block w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200 ${form[r.name as keyof typeof form] ? 'translate-x-4' : 'translate-x-0'}`}
                    />
                  </span>
                  <span className="text-[#7a2323] text-sm font-medium">{r.label}</span>
                </label>
              ))}
            </div>

            {/* Error */}
            {error && <div className="text-red-600 text-center font-medium">{error}</div>}

            {/* Botones */}
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
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </NeomorphicButton>
            </div>
          </form>
        </motion.div>

        {/* Avatar Creator Modal */}
        <AvatarCreator
          isOpen={isAvatarCreatorOpen}
          onClose={() => setIsAvatarCreatorOpen(false)}
          onSelect={(url) => {
            setForm(prev => ({ ...prev, avatar: url }));
            setIsAvatarCreatorOpen(false);
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileEditModal; 