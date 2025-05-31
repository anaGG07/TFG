import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { NeomorphicButton } from "../components/ui/NeomorphicComponents";
import { motion } from "framer-motion";
import ProfileTabsModal from "../components/ProfileTabsModal";
import { userService } from "../services/userService";
import { toast } from "react-hot-toast";
import AvatarPreview from "../components/avatarBuilder/AvatarPreview";
import { defaultAvatarConfig } from "../types/avatar";

const ProfilePage: React.FC = () => {
  const { user, checkAuth } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSave = async (data: any) => {
    if (!user) return;
    // Actualizar perfil SIN avatar (el avatar se guarda por separado)
    await userService.updateProfile({
      name: data.name,
      lastName: data.lastName,
      username: data.username,
      birthDate: data.birthDate,
    });
    await userService.updateOnboarding({
      receiveAlerts: data.receiveAlerts,
      receiveRecommendations: data.receiveRecommendations,
      receiveWorkoutSuggestions: data.receiveWorkoutSuggestions,
      receiveNutritionAdvice: data.receiveNutritionAdvice,
    });
    // Refrescar usuario desde backend para asegurar datos actualizados
    await checkAuth();
    toast.custom(
      () => (
        <div className="rounded-2xl px-6 py-4 shadow-xl bg-[#fff] border border-[#C62328]/20 flex items-center gap-3 animate-fade-in">
          <span className="text-2xl">✅</span>
          <span className="text-[#7a2323] font-semibold">
            ¡Perfil actualizado con éxito!
          </span>
        </div>
      ),
      { duration: 3000 }
    );
  };

  if (!user) return null;

  // Solo usar default si NO hay avatar o está completamente vacío
  const getAvatarConfig = () => {
    // Si no hay objeto avatar en absoluto
    if (!user.avatar || typeof user.avatar !== "object") {
      console.log("No hay avatar object, usando default");
      return defaultAvatarConfig;
    }

    // Si existe el objeto, verificar si tiene al menos UN campo con contenido
    const hasAnyContent = Object.values(user.avatar).some(
      (value) => value && typeof value === "string" && value.trim() !== ""
    );

    if (!hasAnyContent) {
      console.log("Avatar sin contenido, usando default");
      return defaultAvatarConfig;
    }

    
    console.log("Usando avatar de BD:", user.avatar);
    return user.avatar;
  };

  const avatarConfig = getAvatarConfig();

  console.log('=== DEBUGGING AVATAR ===');
  console.log('user.avatar:', user?.avatar);
  console.log('typeof user.avatar:', typeof user?.avatar);
  if (user?.avatar) {
    console.log('Campos del avatar:');
    Object.keys(user.avatar).forEach(key => {
      const typedKey = key as keyof typeof user.avatar;
      console.log(`${key}: "${user.avatar[typedKey]}"`);
    });
    console.log('¿Tiene contenido?', Object.values(user.avatar).some(value => 
      value && typeof value === 'string' && value.trim() !== ''
    ));
  }
  console.log('Avatar final usado:', avatarConfig);
  console.log('========================');

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Información del usuario */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <div className="flex flex-col items-center gap-6">
            {/* Avatar - SIEMPRE MOSTRAR, NUNCA INICIALES */}
            <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
              <AvatarPreview config={avatarConfig} className="w-full h-full" />
            </div>

            {/* Nombre y email */}
            <div className="text-center">
              <h1 className="text-3xl font-serif font-bold text-[#7a2323] mb-2">
                {user.name} {user.lastName}
              </h1>
              <p className="text-[#7a2323]/80">{user.email}</p>
            </div>

            {/* Botón editar */}
            <NeomorphicButton
              variant="primary"
              onClick={() => setIsEditModalOpen(true)}
              className="cursor-pointer"
            >
              Editar perfil
            </NeomorphicButton>
          </div>
        </div>
      </motion.div>

      {/* Modal de edición */}
      <ProfileTabsModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        user={user}
      />
    </div>
  );
};

export default ProfilePage;
