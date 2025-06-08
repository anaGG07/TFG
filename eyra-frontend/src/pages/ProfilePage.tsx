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
  
  // Hook para detectar tamaño de pantalla
  const [isMobile, setIsMobile] = useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const [form, setForm] = useState({
    name: user?.name || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    birthDate: user?.birthDate || "",
    avatar: user?.avatar || defaultAvatarConfig,
    // ! 08/06/2025 - Añadido campo de privacidad
    allowSearchable: user?.allowSearchable ?? true,
    receiveAlerts: user?.onboarding?.receiveAlerts ?? true,
    receiveRecommendations: user?.onboarding?.receiveRecommendations ?? true,
    receiveCyclePhaseTips: user?.onboarding?.receiveCyclePhaseTips ?? true, 
    receiveWorkoutSuggestions:
      user?.onboarding?.receiveWorkoutSuggestions ?? true,
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
        // ! 08/06/2025 - Añadido campo de privacidad
        allowSearchable: user?.allowSearchable ?? true,
        receiveAlerts: user?.onboarding?.receiveAlerts ?? true,
        receiveRecommendations:
          user?.onboarding?.receiveRecommendations ?? true,
        receiveCyclePhaseTips: user?.onboarding?.receiveCyclePhaseTips ?? true,
        receiveWorkoutSuggestions:
          user?.onboarding?.receiveWorkoutSuggestions ?? true,
        receiveNutritionAdvice:
          user?.onboarding?.receiveNutritionAdvice ?? true,
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
          duration={3500}
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
       receiveCyclePhaseTips: form.receiveCyclePhaseTips, 
       receiveWorkoutSuggestions: form.receiveWorkoutSuggestions,
       receiveNutritionAdvice: form.receiveNutritionAdvice,
     });
     await checkAuth();
     showCustomToast(
       "¡Preferencias de notificaciones actualizadas!",
       "success"
     );
   } catch (err: any) {
     // Si el error es 404, intenta POST (crear onboarding)
     if (err?.message?.includes("404")) {
       try {
         await userService.updateOnboarding({
           receiveAlerts: form.receiveAlerts,
           receiveRecommendations: form.receiveRecommendations,
           receiveCyclePhaseTips: form.receiveCyclePhaseTips, 
           receiveWorkoutSuggestions: form.receiveWorkoutSuggestions,
           receiveNutritionAdvice: form.receiveNutritionAdvice,
         });
         await checkAuth();
         showCustomToast(
           "¡Preferencias de notificaciones guardadas!",
           "success"
         );
         return;
       } catch (err2: any) {
         showCustomToast(
           err2.message || "Error al guardar las notificaciones",
           "error"
         );
       }
     } else {
       showCustomToast(
         err.message || "Error al guardar las notificaciones",
         "error"
       );
     }
   } finally {
     setLoading(false);
   }
 };

  // Renderizado
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen" style={{ background: '#e7e0d5' }}>
      {/* Columna izquierda: Avatar */}
      <div className="flex flex-col items-center justify-center w-full lg:w-[420px] lg:min-w-[340px] h-full pt-6 lg:pt-10 px-2 gap-6 relative max-h-screen overflow-visible" style={{ minHeight: 'unset' }}>
        {/* Línea de separación neumórfica - solo desktop */}
        <div className="hidden lg:block absolute top-0 right-0 h-full w-[2.5rem] flex items-center justify-center z-10">
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
        {/* Avatar neumórfico circular con pulso de luz + botón alineado */}
        <div className="relative flex flex-col items-center w-full justify-center">
          <span className="absolute z-0 animate-avatar-pulse" style={{
            width: isEditingAvatar ? 200 : (isMobile ? 250 : 340),
            height: isEditingAvatar ? 200 : (isMobile ? 250 : 340),
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
              width: isEditingAvatar ? 180 : (isMobile ? 220 : 320),
              height: isEditingAvatar ? 180 : (isMobile ? 220 : 320),
              background: (isEditingAvatar ? tempAvatar.backgroundColor : form.avatar.backgroundColor) || '#f5ede6',
              boxShadow: '0 8px 32px #c6232822, 8px 8px 24px #e7e0d5, -8px -8px 24px #fff8',
            }}
          >
            <AvatarPreview 
              config={isEditingAvatar ? tempAvatar : getAvatarConfig()} 
              className={isEditingAvatar ? "w-[120px] h-[120px]" : (isMobile ? "w-[160px] h-[160px]" : "w-[220px] h-[220px]")}
            />
          </motion.div>
          <NeomorphicButton
            variant="primary"
            onClick={() => {
              setTempAvatar(form.avatar);
              setIsEditingAvatar(true);
            }}
            className="mt-6 px-4 lg:px-8 py-2 lg:py-3 text-base lg:text-lg"
          >
            Editar avatar
          </NeomorphicButton>
        </div>
      </div>
      {/* Columna derecha: Contenido sobre fondo */}
      <div className="flex-1 flex flex-col justify-start items-center min-h-screen py-4 lg:py-10 px-2 md:px-8 overflow-visible" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
        {/* Cabecera: nombre, email, frase */}
        {!isEditingAvatar && (
          <div className="flex flex-col items-center gap-1 mb-4 lg:mb-6">
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#7a2323] text-center">{user.name} {user.lastName}</h1>
            <p className="text-sm lg:text-base text-[#7a2323]/80 text-center">{user.email}</p>
            <p className="text-base lg:text-lg text-[#C62328] font-serif mt-2 text-center">Hoy es un gran día para cuidar de ti ✨</p>
          </div>
        )}
        {/* Tabs de iconos mejorados o editor de avatar */}
        {isEditingAvatar ? (
          <div className="w-full max-w-4xl animate-fade-in">
            <h2 className="font-serif text-xl lg:text-2xl font-bold text-[#7a2323] mb-2 text-center">Personaliza tu avatar</h2>
            <AvatarBuilder
              initialConfig={tempAvatar}
              onChange={setTempAvatar}
              showPreview={false}
              onCancel={() => setIsEditingAvatar(false)}
              onSave={async () => {
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
              onRandom={() => {
                const random = getRandomAvatarConfig();
                setTempAvatar(random);
              }}
            />
          </div>
        ) : (
          <>
            <div className="flex justify-center gap-4 lg:gap-8 mb-4 lg:mb-6">
              {tabList.map((tab) => (
                <button
                  key={tab.key}
                  className={`flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-full transition-all duration-200 bg-transparent border-none shadow-none p-0 ${
                    activeTab === tab.key ? "scale-110" : "opacity-60 hover:opacity-100"
                  } text-[#C62328]`}
                  style={{ boxSizing: "border-box", background: 'none' }}
                  onClick={() => setActiveTab(tab.key as any)}
                  type="button"
                  aria-label={tab.alt}
                >
                  <div className="scale-90 lg:scale-100">
                    {iconMap[tab.icon]}
                  </div>
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
