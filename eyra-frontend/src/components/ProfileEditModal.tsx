import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeomorphicInput, NeomorphicButton } from "./ui/NeomorphicComponents";
import EditIcon from '../assets/icons/edit.svg';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onboarding: any;
  onSave: (data: any) => Promise<void>;
}

const objetivoInfo: Record<string, { icon: string; title: string; desc: string; color: string }> = {
  profile_women: {
    icon: '🌸',
    title: 'Ciclo y Bienestar',
    desc: 'Descubre tu ciclo, conecta con tu cuerpo y potencia tu bienestar.',
    color: '#C62328',
  },
  profile_trans: {
    icon: '🦋',
    title: 'Transición y Autocuidado',
    desc: 'Acompaña tu transición con información y apoyo personalizado.',
    color: '#7a2323',
  },
  profile_underage: {
    icon: '🌱',
    title: 'Primeros Ciclos',
    desc: 'Aprende y explora tus primeros ciclos de forma segura.',
    color: '#A62C2C',
  },
  profile_guest: {
    icon: '🤝',
    title: 'Acompañar a alguien',
    desc: 'Apoya y aprende junto a quien más quieres.',
    color: '#5b0108',
  },
};

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, user, onboarding, onSave }) => {
  const [form, setForm] = useState({
    name: user?.name || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    birthDate: user?.birthDate || '',
    averageCycleLength: onboarding?.averageCycleLength || 28,
    averagePeriodLength: onboarding?.averagePeriodLength || 5,
    profileType: onboarding?.profileType || 'profile_women',
    receiveAlerts: onboarding?.receiveAlerts ?? true,
    receiveRecommendations: onboarding?.receiveRecommendations ?? true,
    receiveCyclePhaseTips: onboarding?.receiveCyclePhaseTips ?? true,
    receiveWorkoutSuggestions: onboarding?.receiveWorkoutSuggestions ?? true,
    receiveNutritionAdvice: onboarding?.receiveNutritionAdvice ?? true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleObjetivo = (profileType: string) => {
    setForm((prev) => ({ ...prev, profileType }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSave({ ...form, passwords: showPassword ? passwords : undefined });
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
            {/* Datos personales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NeomorphicInput
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nombre"
                required
              />
              <NeomorphicInput
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Apellido"
                required
              />
              <NeomorphicInput
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                type="email"
                required
              />
              <NeomorphicInput
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
                placeholder="Fecha de nacimiento"
                type="date"
                required
              />
            </div>

            {/* Ciclo */}
            <div className="grid grid-cols-2 gap-6">
              <NeomorphicInput
                name="averageCycleLength"
                value={form.averageCycleLength}
                onChange={handleChange}
                placeholder="Duración ciclo (días)"
                type="number"
                min={21}
                max={35}
                required
              />
              <NeomorphicInput
                name="averagePeriodLength"
                value={form.averagePeriodLength}
                onChange={handleChange}
                placeholder="Duración periodo (días)"
                type="number"
                min={1}
                max={14}
                required
              />
            </div>

            {/* Objetivo */}
            <div>
              <div className="flex gap-4 justify-center">
                {Object.entries(objetivoInfo).map(([key, obj]) => (
                  <button
                    key={key}
                    type="button"
                    className={`flex flex-col items-center px-4 py-2 rounded-xl border-2 transition-all ${form.profileType === key ? 'border-[#C62328] bg-[#f8e9ea]' : 'border-transparent bg-[#f0e8dc]'}`}
                    style={{ minWidth: 120, boxShadow: form.profileType === key ? '0 4px 16px #c6232822' : undefined }}
                    onClick={() => handleObjetivo(key)}
                  >
                    <span className="text-3xl mb-1" style={{ color: obj.color }}>{obj.icon}</span>
                    <span className="font-bold text-[#7a2323] text-sm mb-1">{obj.title}</span>
                    <span className="text-xs text-[#7a2323] text-center">{obj.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recordatorios */}
            <div className="flex flex-wrap gap-6 justify-center">
              {[
                { name: 'receiveAlerts', label: 'Alertas importantes' },
                { name: 'receiveRecommendations', label: 'Recomendaciones' },
                { name: 'receiveCyclePhaseTips', label: 'Consejos por fase' },
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

            {/* Cambiar contraseña */}
            <div>
              <button
                type="button"
                className="text-[#C62328] underline text-sm mb-2"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? 'Ocultar cambio de contraseña' : 'Cambiar contraseña'}
              </button>
              <AnimatePresence>
                {showPassword && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <NeomorphicInput
                        name="current"
                        value={passwords.current}
                        onChange={handlePasswordChange}
                        placeholder="Contraseña actual"
                        type="password"
                        required
                      />
                      <NeomorphicInput
                        name="new"
                        value={passwords.new}
                        onChange={handlePasswordChange}
                        placeholder="Nueva contraseña"
                        type="password"
                        required
                      />
                      <NeomorphicInput
                        name="confirm"
                        value={passwords.confirm}
                        onChange={handlePasswordChange}
                        placeholder="Confirmar nueva"
                        type="password"
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error */}
            {error && <div className="text-red-600 text-center font-medium">{error}</div>}

            {/* Botones */}
            <div className="flex justify-end gap-4 mt-6">
              <NeomorphicButton type="button" variant="secondary" onClick={onClose}>
                Cancelar
              </NeomorphicButton>
              <NeomorphicButton type="submit" variant="primary" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </NeomorphicButton>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileEditModal; 