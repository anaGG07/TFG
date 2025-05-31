import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { NeomorphicButton, NeomorphicCard } from "../components/ui/NeomorphicComponents";
import { motion, AnimatePresence } from "framer-motion";
import { userService } from "../services/userService";
import { toast } from "react-hot-toast";
import AvatarPreview from "../components/avatarBuilder/AvatarPreview";
import { defaultAvatarConfig } from "../types/avatar";
import ProfileForm from "../components/profile/ProfileForm";
import SecurityForm from "../components/profile/SecurityForm";
import NotificationsForm from "../components/profile/NotificationsForm";
import AvatarBuilderModal from "../components/avatarBuilder/AvatarBuilderModal";

const tabList = [
  { key: "privacy", icon: "user", alt: "Perfil" },
  { key: "security", icon: "lock", alt: "Seguridad" },
  { key: "notifications", icon: "bell", alt: "Notificaciones" },
];

const iconMap: Record<string, React.ReactNode> = {
  user: (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="13" r="5" stroke="#C62328" strokeWidth="2" fill="none" /><path d="M10 23c0-3 4-4 6-4s6 1 6 4" stroke="#C62328" strokeWidth="2" strokeLinecap="round" fill="none" /></svg>
  ),
  lock: (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><rect x="9" y="15" width="14" height="8" rx="3" stroke="#C62328" strokeWidth="2" fill="none" /><path d="M12 15v-2a4 4 0 0 1 8 0v2" stroke="#C62328" strokeWidth="2" fill="none" /><circle cx="16" cy="19" r="2" stroke="#C62328" strokeWidth="2" fill="none" /></svg>
  ),
  bell: (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><path d="M24 23H8m8 0v1a2 2 0 1 1-4 0v-1" stroke="#C62328" strokeWidth="2" strokeLinecap="round" fill="none" /><path d="M22 23V15a6 6 0 1 0-12 0v8" stroke="#C62328" strokeWidth="2" fill="none" /><circle cx="16" cy="10" r="1" fill="#C62328" /></svg>
  ),
};

const ProfilePage: React.FC = () => {
  const { user, checkAuth } = useAuth();
  const [activeTab, setActiveTab] = useState<"privacy" | "security" | "notifications">("privacy");
  const [form, setForm] = useState({
    name: user?.name || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    birthDate: user?.birthDate || "",
    avatar: user?.avatar || defaultAvatarConfig,
    receiveAlerts: user?.onboarding?.receiveAlerts ?? true,
    receiveRecommendations: user?.onboarding?.receiveRecommendations ?? true,
    receiveWorkoutSuggestions: user?.onboarding?.receiveWorkoutSuggestions ?? true,
    receiveNutritionAdvice: user?.onboarding?.receiveNutritionAdvice ?? true,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAvatarBuilderOpen, setIsAvatarBuilderOpen] = useState(false);

  React.useEffect(() => {
    if (user) {
      setForm({
        name: user?.name || "",
        lastName: user?.lastName || "",
        username: user?.username || "",
        birthDate: user?.birthDate || "",
        avatar: user?.avatar || defaultAvatarConfig,
        receiveAlerts: user?.onboarding?.receiveAlerts ?? true,
        receiveRecommendations: user?.onboarding?.receiveRecommendations ?? true,
        receiveWorkoutSuggestions: user?.onboarding?.receiveWorkoutSuggestions ?? true,
        receiveNutritionAdvice: user?.onboarding?.receiveNutritionAdvice ?? true,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  if (!user) return null;

  const getAvatarConfig = () => {
    if (!form.avatar || typeof form.avatar !== "object") {
      return defaultAvatarConfig;
    }
    const hasAnyContent = Object.values(form.avatar).some(
      (value) => value && typeof value === "string" && value.trim() !== ""
    );
    if (!hasAnyContent) {
      return defaultAvatarConfig;
    }
    return form.avatar;
  };

  // Handlers generales
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Guardar perfil y notificaciones
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { avatar, currentPassword, newPassword, confirmPassword, ...formWithoutAvatar } = form;
      await userService.updateProfile(formWithoutAvatar);
      await userService.updateOnboarding({
        receiveAlerts: form.receiveAlerts,
        receiveRecommendations: form.receiveRecommendations,
        receiveWorkoutSuggestions: form.receiveWorkoutSuggestions,
        receiveNutritionAdvice: form.receiveNutritionAdvice,
      });
      await checkAuth();
      toast.success("¡Perfil actualizado con éxito!");
    } catch (err: any) {
      setError(err.message || "Error al guardar los cambios");
    } finally {
      setLoading(false);
    }
  };

  // Guardar contraseña
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("La nueva contraseña y la confirmación no coinciden.");
      return;
    }
    setLoading(true);
    try {
      await userService.changePassword(form.currentPassword, form.newPassword);
      setError(null);
      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      toast.success("¡Contraseña actualizada!");
    } catch (err: any) {
      setError(err.message || "Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  // Renderizado
  return (
    <div className="flex w-full min-h-screen bg-[#ece5db]">
      {/* Columna izquierda: Avatar */}
      <div className="flex flex-col items-center justify-center w-1/3 min-w-[340px] p-10 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-full shadow-lg"
          style={{ background: "#f5ede6", boxShadow: "0 8px 32px #c6232822" }}
        >
          <AvatarPreview config={getAvatarConfig()} className="w-56 h-56" />
        </motion.div>
        <NeomorphicButton
          variant="primary"
          onClick={() => setIsAvatarBuilderOpen(true)}
          className="mt-2 px-8 py-3 text-lg"
        >
          Editar avatar
        </NeomorphicButton>
      </div>
      {/* Columna derecha: Caja dinámica */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <NeomorphicCard className="w-full max-w-2xl p-10 flex flex-col gap-8">
          {/* Cabecera: nombre, email, frase */}
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-3xl font-serif font-bold text-[#7a2323]">{user.name} {user.lastName}</h1>
            <p className="text-[#7a2323]/80">{user.email}</p>
            <p className="text-[#C62328] text-lg font-serif mt-2">Hoy es un gran día para cuidar de ti ✨</p>
          </div>
          {/* Tabs de iconos */}
          <div className="flex justify-center gap-8 mb-2">
            {tabList.map((tab) => (
              <button
                key={tab.key}
                className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-[#F5E9E6] shadow-neomorphic border-2 border-[#C62328]"
                    : "bg-transparent border-2 border-transparent"
                } text-[#C62328] hover:bg-[#F5E9E6]/80`}
                style={{ boxSizing: "border-box" }}
                onClick={() => setActiveTab(tab.key as any)}
                type="button"
                aria-label={tab.alt}
              >
                {iconMap[tab.icon]}
              </button>
            ))}
          </div>
          {/* Contenido dinámico */}
          <div className="w-full min-h-[320px]">
            <AnimatePresence mode="wait">
              {activeTab === "privacy" && (
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProfileForm
                    form={form}
                    error={error}
                    loading={loading}
                    handleChange={handleChange}
                    handleSave={handleSave}
                  />
                </motion.div>
              )}
              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                >
                  <SecurityForm
                    form={form}
                    error={error}
                    loading={loading}
                    handleChange={handleChange}
                    handlePasswordChange={handlePasswordChange}
                  />
                </motion.div>
              )}
              {activeTab === "notifications" && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                >
                  <NotificationsForm
                    form={form}
                    loading={loading}
                    handleChange={handleChange}
                    handleSave={handleSave}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </NeomorphicCard>
      </div>
      {/* Modal del editor de avatar */}
      <AvatarBuilderModal
        isOpen={isAvatarBuilderOpen}
        onClose={() => setIsAvatarBuilderOpen(false)}
        initialConfig={form.avatar}
        onSave={(config) => {
          setForm((prev) => ({ ...prev, avatar: config }));
          setIsAvatarBuilderOpen(false);
        }}
      />
    </div>
  );
};

export default ProfilePage;
