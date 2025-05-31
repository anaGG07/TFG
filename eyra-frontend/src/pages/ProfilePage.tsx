import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { NeomorphicButton } from "../components/ui/NeomorphicComponents";
import { motion, AnimatePresence } from "framer-motion";
import { userService } from "../services/userService";
import { toast } from "react-hot-toast";
import AvatarPreview from "../components/avatarBuilder/AvatarPreview";
import { defaultAvatarConfig } from "../types/avatar";
import ProfileForm from "../components/profile/ProfileForm";
import SecurityForm from "../components/profile/SecurityForm";
import NotificationsForm from "../components/profile/NotificationsForm";
import AvatarBuilder from "../components/avatarBuilder/AvatarBuilder";
import { User as UserIcon, Lock, Bell } from "lucide-react";
import { getRandomAvatarConfig } from "../components/avatarBuilder/randomAvatar";
import NeomorphicToast from "../components/ui/NeomorphicToast";

const tabList = [
  { key: "privacy", icon: "user", alt: "Perfil" },
  { key: "security", icon: "lock", alt: "Seguridad" },
  { key: "notifications", icon: "bell", alt: "Notificaciones" },
];

const iconMap: Record<string, React.ReactNode> = {
  user: <UserIcon size={28} stroke="#C62328" strokeWidth={2.2} />,
  lock: <Lock size={28} stroke="#C62328" strokeWidth={2.2} />,
  bell: <Bell size={28} stroke="#C62328" strokeWidth={2.2} />,
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
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(form.avatar);

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

  // Utilidad para mostrar toast personalizado
  const showCustomToast = (message: string, variant: 'success' | 'error') => {
    toast.custom(
      (t) => (
        <NeomorphicToast
          message={message}
          variant={variant}
          onClose={() => toast.dismiss(t.id)}
        />
      ),
      { duration: 3500 }
    );
  };

  // Guardar perfil y notificaciones
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { avatar, currentPassword, newPassword, confirmPassword, ...formWithoutAvatar } = form;
      await userService.updateProfile(formWithoutAvatar);
      await checkAuth();
      showCustomToast("¡Perfil actualizado con éxito!", "success");
    } catch (err: any) {
      showCustomToast(err.message || "Error al guardar los cambios", "error");
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
      showCustomToast("Por favor, completa todos los campos.", "error");
      setError("Por favor, completa todos los campos.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      showCustomToast("La nueva contraseña y la confirmación no coinciden.", "error");
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
      showCustomToast("¡Contraseña actualizada!", "success");
    } catch (err: any) {
      showCustomToast(err.message || "Error al cambiar la contraseña", "error");
      setError(err.message || "Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  // Guardar preferencias de notificaciones
  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userService.updateOnboardingPartial({
        receiveAlerts: form.receiveAlerts,
        receiveRecommendations: form.receiveRecommendations,
        receiveWorkoutSuggestions: form.receiveWorkoutSuggestions,
        receiveNutritionAdvice: form.receiveNutritionAdvice,
      });
      await checkAuth();
      showCustomToast("¡Preferencias de notificaciones actualizadas!", "success");
    } catch (err: any) {
      // Si el error es 404, intenta POST (crear onboarding)
      if (err?.message?.includes("404")) {
        try {
          await userService.updateOnboarding({
            receiveAlerts: form.receiveAlerts,
            receiveRecommendations: form.receiveRecommendations,
            receiveWorkoutSuggestions: form.receiveWorkoutSuggestions,
            receiveNutritionAdvice: form.receiveNutritionAdvice,
          });
          await checkAuth();
          showCustomToast("¡Preferencias de notificaciones guardadas!", "success");
          return;
        } catch (err2: any) {
          showCustomToast(err2.message || "Error al guardar las notificaciones", "error");
        }
      } else {
        showCustomToast(err.message || "Error al guardar las notificaciones", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Renderizado
  return (
    <div className="flex w-full min-h-screen" style={{ background: '#e7e0d5' }}>
      {/* Columna izquierda: Avatar */}
      <div className="flex flex-col items-center justify-center w-[420px] min-w-[340px] py-16 gap-8 relative" style={{ minHeight: '100vh' }}>
        {/* Línea de separación neumórfica */}
        <div className="absolute top-0 right-0 h-full w-[2.5rem] flex items-center justify-center z-10">
          <div style={{
            width: '2px',
            height: '80%',
            background: 'linear-gradient(180deg, #e0d6c8 0%, #d4c7bb 100%)',
            boxShadow: '2px 0 8px #c6232822, -2px 0 8px #fff8',
            borderRadius: '2px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }} />
        </div>
        {/* Avatar neumórfico circular con pulso de luz */}
        <div className="relative flex items-center justify-center">
          <span className="absolute z-0 animate-avatar-pulse" style={{
            width: 340,
            height: 340,
            borderRadius: '50%',
            boxShadow: '0 0 0 0 #fff0, 0 0 32px 8px #fff6',
            background: 'radial-gradient(circle, #fff8 0%, #fff0 70%)',
            pointerEvents: 'none',
          }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center rounded-full shadow-lg relative z-10"
            style={{
              width: 320,
              height: 320,
              background: (isEditingAvatar ? tempAvatar.backgroundColor : form.avatar.backgroundColor) || '#f5ede6',
              boxShadow: '0 8px 32px #c6232822, 8px 8px 24px #e7e0d5, -8px -8px 24px #fff8',
            }}
          >
            <AvatarPreview config={isEditingAvatar ? tempAvatar : getAvatarConfig()} className="w-[220px] h-[220px]" />
          </motion.div>
        </div>
        <NeomorphicButton
          variant="primary"
          onClick={() => {
            setTempAvatar(form.avatar);
            setIsEditingAvatar(true);
          }}
          className="mt-2 px-8 py-3 text-lg"
        >
          Editar avatar
        </NeomorphicButton>
      </div>
      {/* Columna derecha: Contenido sobre fondo */}
      <div className="flex-1 flex flex-col justify-center items-center min-h-screen py-16 px-4 md:px-12">
        {/* Cabecera: nombre, email, frase */}
        {!isEditingAvatar && (
          <div className="flex flex-col items-center gap-1 mb-8">
            <h1 className="text-3xl font-serif font-bold text-[#7a2323] text-center">{user.name} {user.lastName}</h1>
            <p className="text-[#7a2323]/80 text-center">{user.email}</p>
            <p className="text-[#C62328] text-lg font-serif mt-2 text-center">Hoy es un gran día para cuidar de ti ✨</p>
          </div>
        )}
        {/* Tabs de iconos mejorados o editor de avatar */}
        {isEditingAvatar ? (
          <div className="w-full max-w-4xl animate-fade-in" style={{background: 'none', boxShadow: 'none', borderRadius: 0, padding: 0}}>
            <h2 className="font-serif text-2xl font-bold text-[#7a2323] mb-2 text-center">Personaliza tu avatar</h2>
            <AvatarBuilder
              initialConfig={tempAvatar}
              onChange={setTempAvatar}
              showPreview={false}
            />
            <div className="flex flex-row flex-wrap gap-4 justify-center mt-4">
              <NeomorphicButton
                type="button"
                variant="secondary"
                onClick={() => setIsEditingAvatar(false)}
                className="min-w-[160px] px-8 py-3 text-lg bg-[#7a2323] text-white shadow-neomorphic font-semibold border border-[#a88] hover:bg-[#a23] hover:text-white transition-colors"
              >
                Cancelar
              </NeomorphicButton>
              <NeomorphicButton
                type="button"
                variant="primary"
                className="min-w-[160px] px-8 py-3 text-lg"
                onClick={async () => {
                  setLoading(true);
                  try {
                    await userService.updateAvatar(tempAvatar);
                    await checkAuth();
                    setForm((prev) => ({ ...prev, avatar: tempAvatar }));
                    setIsEditingAvatar(false);
                    showCustomToast("¡Avatar actualizado con éxito!", "success");
                  } catch (error: any) {
                    showCustomToast("Error al guardar el avatar", "error");
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar avatar"}
              </NeomorphicButton>
              <NeomorphicButton
                type="button"
                variant="primary"
                className="min-w-[160px] px-8 py-3 text-lg bg-[#C62328] text-white"
                onClick={() => {
                  const random = getRandomAvatarConfig();
                  setTempAvatar(random);
                }}
              >
                Aleatorio
              </NeomorphicButton>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-center gap-8 mb-6">
              {tabList.map((tab) => (
                <button
                  key={tab.key}
                  className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 bg-transparent border-none shadow-none p-0 ${
                    activeTab === tab.key ? "scale-110" : "opacity-60 hover:opacity-100"
                  } text-[#C62328]`}
                  style={{ boxSizing: "border-box", background: 'none' }}
                  onClick={() => setActiveTab(tab.key as any)}
                  type="button"
                  aria-label={tab.alt}
                >
                  {iconMap[tab.icon]}
                </button>
              ))}
            </div>
            <div className="w-full max-w-2xl min-h-[320px]">
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
                      handleSave={handleSaveNotifications}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
      {/* Añadir animación global para el pulso de luz */}
      <style>{`
      @keyframes avatar-pulse {
        0% { box-shadow: 0 0 0 0 #fff0, 0 0 32px 8px #fff6; opacity: 0.7; }
        50% { box-shadow: 0 0 0 16px #fff4, 0 0 48px 16px #fff6; opacity: 1; }
        100% { box-shadow: 0 0 0 0 #fff0, 0 0 32px 8px #fff6; opacity: 0.7; }
      }
      .animate-avatar-pulse {
        animation: avatar-pulse 2.8s infinite cubic-bezier(.4,0,.2,1);
      }
      `}</style>
    </div>
  );
};

export default ProfilePage;
