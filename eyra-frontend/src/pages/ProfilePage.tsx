import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { NeomorphicButton } from '../components/ui/NeomorphicComponents';
import { motion } from 'framer-motion';
import ProfileTabsModal from '../components/ProfileTabsModal';
import { userService } from '../services/userService';
import { toast } from 'react-hot-toast';
import AvatarPreview from '../components/avatarBuilder/AvatarPreview';

const ProfilePage: React.FC = () => {
  const { user, updateUserData } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSave = async (data: any) => {
    if (!user) return;
    // Actualizar perfil
    await userService.updateProfile({
      name: data.name,
      lastName: data.lastName,
      username: data.username,
      birthDate: data.birthDate,
      avatar: data.avatar,
    });
    await userService.updateOnboarding({
      receiveAlerts: data.receiveAlerts,
      receiveRecommendations: data.receiveRecommendations,
      receiveWorkoutSuggestions: data.receiveWorkoutSuggestions,
      receiveNutritionAdvice: data.receiveNutritionAdvice,
    });
    // Actualizar usuario en contexto
    updateUserData({ ...user, ...data });
    toast.custom(() => (
      <div className="rounded-2xl px-6 py-4 shadow-xl bg-[#fff] border border-[#C62328]/20 flex items-center gap-3 animate-fade-in">
        <span className="text-2xl">✅</span>
        <span className="text-[#7a2323] font-semibold">¡Perfil actualizado con éxito!</span>
      </div>
    ), { duration: 3000 });
  };

  if (!user) return null;

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
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full overflow-hidden bg-[#C62328] flex items-center justify-center">
              {user.avatar ? (
                <AvatarPreview config={user.avatar} className="w-full h-full" />
              ) : (
                <span className="text-4xl text-white font-bold">
                  {user.username?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              )}
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