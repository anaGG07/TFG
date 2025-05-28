import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeomorphicButton, NeomorphicInput } from "./ui/NeomorphicComponents";
import AvatarBuilderModal from "./avatarBuilder/AvatarBuilderModal";
import AvatarPreview from "./avatarBuilder/AvatarPreview";
import { userService } from '../services/userService';

// Iconos SVG originales
const PrivacyIcon = ({ selected }: { selected: boolean }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    {selected && <circle cx="16" cy="16" r="15" fill="#F5E9E6" />}
    <circle cx="16" cy="13" r="5" stroke="#C62328" strokeWidth="2" fill={selected ? '#fff' : 'none'} />
    <path d="M10 23c0-3 4-4 6-4s6 1 6 4" stroke="#C62328" strokeWidth="2" strokeLinecap="round" fill={selected ? '#fff' : 'none'} />
  </svg>
);
const SecurityIcon = ({ selected }: { selected: boolean }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    {selected && <circle cx="16" cy="16" r="15" fill="#F5E9E6" />}
    <rect x="9" y="15" width="14" height="8" rx="3" stroke="#C62328" strokeWidth="2" fill={selected ? '#fff' : 'none'} />
    <path d="M12 15v-2a4 4 0 0 1 8 0v2" stroke="#C62328" strokeWidth="2" fill="none" />
    <circle cx="16" cy="19" r="2" stroke="#C62328" strokeWidth="2" fill={selected ? '#fff' : 'none'} />
  </svg>
);
const NotificationsIcon = ({ selected }: { selected: boolean }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    {selected && <circle cx="16" cy="16" r="15" fill="#F5E9E6" />}
    <path d="M24 23H8m8 0v1a2 2 0 1 1-4 0v-1" stroke="#C62328" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M22 23V15a6 6 0 1 0-12 0v8" stroke="#C62328" strokeWidth="2" fill={selected ? '#fff' : 'none'} />
    <circle cx="16" cy="10" r="1" fill="#C62328" />
  </svg>
);

const tabList = [
  { key: 'privacy', label: 'Privacidad', icon: PrivacyIcon },
  { key: 'security', label: 'Seguridad', icon: SecurityIcon },
  { key: 'notifications', label: 'Notificaciones', icon: NotificationsIcon },
];

interface ProfileTabsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSave: (data: any) => Promise<void>;
}

const ProfileTabsModal: React.FC<ProfileTabsModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'security' | 'notifications'>('privacy');
  const [form, setForm] = useState({
    name: user?.name || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    birthDate: user?.birthDate || '',
    avatar: user?.avatar || {},
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
  const [isAvatarBuilderOpen, setIsAvatarBuilderOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSave(form);
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
          className="relative bg-[#fff] rounded-3xl shadow-2xl p-6 w-full max-w-xl mx-4 flex flex-col items-center"
          style={{ maxHeight: '90vh' }}
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

          {/* Avatar con icono de edición */}
          <div className="relative flex flex-col items-center gap-2 mb-2">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-[#C62328] flex items-center justify-center">
              <AvatarPreview config={form.avatar} />
              <button
                type="button"
                onClick={() => setIsAvatarBuilderOpen(true)}
                className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow hover:bg-[#C62328]/90 hover:text-white transition-colors"
                style={{ zIndex: 2 }}
                aria-label="Editar avatar"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Pestañas solo iconos */}
          <div className="flex justify-center gap-8 mb-4 w-full">
            {tabList.map((tab, idx) => (
              <button
                key={tab.key}
                className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 ${activeTab === tab.key ? 'bg-[#F5E9E6] shadow-neomorphic border-2 border-[#C62328]' : 'bg-transparent border-2 border-transparent'} text-[#C62328] hover:bg-[#F5E9E6]/80`}
                style={{ boxSizing: 'border-box' }}
                onClick={() => setActiveTab(tab.key as any)}
                type="button"
                aria-label={tab.label}
              >
                <tab.icon selected={activeTab === tab.key} />
              </button>
            ))}
          </div>

          {/* Contenido de pestañas */}
          <div className="w-full flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'privacy' && (
                <motion.form
                  key="privacy"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSave}
                  className="flex flex-col gap-4 w-full"
                >
                  <NeomorphicInput
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nombre"
                    required
                  />
                  <NeomorphicInput
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Apellido"
                    required
                  />
                  <NeomorphicInput
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Nombre de usuario"
                    required
                  />
                  <NeomorphicInput
                    id="birthDate"
                    name="birthDate"
                    value={form.birthDate}
                    onChange={handleChange}
                    placeholder="Fecha de nacimiento"
                    type="date"
                    required
                  />
                  {error && <div className="text-red-600 text-center font-medium">{error}</div>}
                  <div className="flex gap-4 mt-2 w-full">
                    <NeomorphicButton
                      type="button"
                      variant="secondary"
                      onClick={onClose}
                      className="flex-1 border-2 border-transparent"
                    >
                      Cancelar
                    </NeomorphicButton>
                    <NeomorphicButton
                      type="submit"
                      variant="primary"
                      className="flex-1 border-2 border-transparent"
                      disabled={loading}
                    >
                      {loading ? 'Guardando...' : 'Guardar cambios'}
                    </NeomorphicButton>
                  </div>
                </motion.form>
              )}
              {activeTab === 'security' && (
                <motion.form
                  key="security"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-4 py-2 w-full"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setError(null);
                    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
                      setError('Por favor, completa todos los campos.');
                      return;
                    }
                    if (form.newPassword !== form.confirmPassword) {
                      setError('La nueva contraseña y la confirmación no coinciden.');
                      return;
                    }
                    setLoading(true);
                    try {
                      if (typeof userService.changePassword === 'function') {
                        await userService.changePassword(form.currentPassword, form.newPassword);
                      }
                      setError(null);
                      setForm((prev) => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
                      // Puedes mostrar un toast aquí si quieres
                    } catch (err: any) {
                      setError(err.message || 'Error al cambiar la contraseña');
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <NeomorphicInput
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={form.currentPassword || ''}
                    onChange={handleChange}
                    placeholder="Contraseña actual"
                    autoComplete="current-password"
                  />
                  <NeomorphicInput
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={form.newPassword || ''}
                    onChange={handleChange}
                    placeholder="Nueva contraseña"
                    autoComplete="new-password"
                  />
                  <NeomorphicInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword || ''}
                    onChange={handleChange}
                    placeholder="Confirmar nueva contraseña"
                    autoComplete="new-password"
                  />
                  {error && <div className="text-red-600 text-center font-medium">{error}</div>}
                  <div className="flex gap-4 mt-2 w-full">
                    <NeomorphicButton
                      type="button"
                      variant="secondary"
                      onClick={onClose}
                      className="flex-1 border-2 border-transparent"
                    >
                      Cancelar
                    </NeomorphicButton>
                    <NeomorphicButton
                      type="submit"
                      variant="primary"
                      className="flex-1 border-2 border-transparent"
                      disabled={loading}
                    >
                      {loading ? 'Guardando...' : 'Guardar contraseña'}
                    </NeomorphicButton>
                  </div>
                </motion.form>
              )}
              {activeTab === 'notifications' && (
                <motion.form
                  key="notifications"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-4 py-2 w-full"
                  onSubmit={handleSave}
                >
                  {[{
                    name: 'receiveAlerts', label: 'Alertas importantes'
                  }, {
                    name: 'receiveRecommendations', label: 'Recomendaciones'
                  }, {
                    name: 'receiveWorkoutSuggestions', label: 'Ejercicio'
                  }, {
                    name: 'receiveNutritionAdvice', label: 'Nutrición'
                  }].map((r) => (
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
                  <div className="flex gap-4 mt-2 w-full">
                    <NeomorphicButton
                      type="button"
                      variant="secondary"
                      onClick={onClose}
                      className="flex-1 border-2 border-transparent"
                    >
                      Cancelar
                    </NeomorphicButton>
                    <NeomorphicButton
                      type="submit"
                      variant="primary"
                      className="flex-1 border-2 border-transparent"
                      disabled={loading}
                    >
                      {loading ? 'Guardando...' : 'Guardar cambios'}
                    </NeomorphicButton>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Modales secundarios */}
          <AvatarBuilderModal
            isOpen={isAvatarBuilderOpen}
            onClose={() => setIsAvatarBuilderOpen(false)}
            initialConfig={form.avatar}
            onSave={(config) => {
              setForm((prev) => ({ ...prev, avatar: config }));
              setIsAvatarBuilderOpen(false);
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileTabsModal; 