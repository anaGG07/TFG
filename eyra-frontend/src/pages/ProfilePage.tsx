import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { NeomorphicCard, NeomorphicButton } from '../components/ui/NeomorphicComponents';
import { motion } from 'framer-motion';
import EditIcon from '../assets/icons/edit.svg';
import ProfileEditModal from '../components/ProfileEditModal';
import { userService } from '../services/userService';
import { toast } from 'react-hot-toast';

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

const ProfilePage = () => {
  const { user, updateUserData } = useAuth();
  const onboarding = user?.onboarding;
  const objetivo = objetivoInfo[onboarding?.profileType || 'profile_women'];

  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleSave = async (data: any) => {
    if (!user) return;
    // Actualizar perfil y onboarding
    await userService.updateProfile(user.id, {
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      birthDate: data.birthDate,
    });
    await userService.updateOnboarding({
      averageCycleLength: data.averageCycleLength,
      averagePeriodLength: data.averagePeriodLength,
      profileType: data.profileType,
      receiveAlerts: data.receiveAlerts,
      receiveRecommendations: data.receiveRecommendations,
      receiveCyclePhaseTips: data.receiveCyclePhaseTips,
      receiveWorkoutSuggestions: data.receiveWorkoutSuggestions,
      receiveNutritionAdvice: data.receiveNutritionAdvice,
    });
    if (data.passwords && data.passwords.new) {
      await userService.changePassword(data.passwords.current, data.passwords.new);
    }
    // Actualizar usuario en contexto
    updateUserData({ ...user, ...data });
    toast.custom((t) => (
      <div className="rounded-2xl px-6 py-4 shadow-xl bg-[#fff] border border-[#C62328]/20 flex items-center gap-3 animate-fade-in">
        <span className="text-2xl">✅</span>
        <span className="text-[#7a2323] font-semibold">¡Perfil actualizado con éxito!</span>
      </div>
    ), { duration: 3000 });
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center bg-[#e7e0d5] overflow-hidden">
      <ProfileEditModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        user={user}
        onboarding={onboarding}
        onSave={handleSave}
      />
      <motion.div
        className="flex flex-row gap-10 w-full max-w-6xl items-stretch"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Avatar y nombre */}
        <NeomorphicCard className="flex flex-col items-center justify-center min-w-[320px] max-w-[340px] flex-shrink-0 gap-4">
          <motion.div
            className="w-40 h-40 rounded-full flex items-center justify-center text-[4.5rem] font-serif font-bold mb-2 shadow-lg"
            style={{ background: '#C62328', color: '#fff', boxShadow: '0 8px 32px #c6232822' }}
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {user?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
          </motion.div>
          <div className="text-center">
            <h2 className="text-2xl font-serif font-bold text-[#7a2323] mb-1">{user?.name || user?.username}</h2>
            <p className="text-[#5b0108] text-base font-light">{user?.email}</p>
          </div>
          <NeomorphicButton
            variant="primary"
            className="mt-4 flex items-center gap-2 px-6 py-2 text-lg"
            onClick={handleOpenModal}
          >
            <img src={EditIcon} alt="Editar" style={{ width: 22, height: 22, marginRight: 8, verticalAlign: 'middle' }} />
            Editar perfil
          </NeomorphicButton>
        </NeomorphicCard>

        {/* Info principal */}
        <div className="flex-1 flex flex-col gap-8 justify-center">
          {/* Objetivo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
          >
            <NeomorphicCard className="flex items-center gap-6 p-8">
              <span className="text-5xl" style={{ color: objetivo.color }}>{objetivo.icon}</span>
              <div>
                <h3 className="text-xl font-serif font-bold mb-1" style={{ color: objetivo.color }}>{objetivo.title}</h3>
                <p className="text-[#7a2323] text-base font-light">{objetivo.desc}</p>
              </div>
            </NeomorphicCard>
          </motion.div>

          {/* Ciclo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
          >
            <NeomorphicCard className="flex items-center gap-8 p-8">
              <div className="flex flex-col items-center justify-center">
                <span className="text-3xl text-[#C62328] font-bold">{onboarding?.averageCycleLength || 28}</span>
                <span className="text-xs text-[#7a2323]">Días de ciclo</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-3xl text-[#C62328] font-bold">{onboarding?.averagePeriodLength || 5}</span>
                <span className="text-xs text-[#7a2323]">Días de periodo</span>
              </div>
              <NeomorphicButton
                variant="secondary"
                className="ml-8 px-4 py-2 text-base"
                onClick={handleOpenModal}
              >
                <img src={EditIcon} alt="Editar ciclo" style={{ width: 18, height: 18, marginRight: 8, verticalAlign: 'middle' }} />
                Editar ciclo
              </NeomorphicButton>
            </NeomorphicCard>
          </motion.div>

          {/* Recordatorios */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.7, ease: 'easeOut' }}
          >
            <NeomorphicCard className="flex flex-col gap-4 p-8">
              <h4 className="text-lg font-serif font-bold text-[#7a2323] mb-2">Recordatorios y notificaciones</h4>
              <div className="flex flex-row gap-8">
                <div className="flex flex-col gap-2">
                  <span className="text-[#5b0108] font-medium">Alertas importantes</span>
                  <div className="w-14 h-8 rounded-full bg-[#f0e8dc] flex items-center p-1 shadow-inner cursor-pointer opacity-60">
                    <div className="w-6 h-6 rounded-full bg-[#C62328]" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[#5b0108] font-medium">Recomendaciones</span>
                  <div className="w-14 h-8 rounded-full bg-[#f0e8dc] flex items-center p-1 shadow-inner cursor-pointer opacity-60">
                    <div className="w-6 h-6 rounded-full bg-[#C62328]" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[#5b0108] font-medium">Consejos por fase</span>
                  <div className="w-14 h-8 rounded-full bg-[#f0e8dc] flex items-center p-1 shadow-inner cursor-pointer opacity-60">
                    <div className="w-6 h-6 rounded-full bg-[#C62328]" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[#5b0108] font-medium">Ejercicio</span>
                  <div className="w-14 h-8 rounded-full bg-[#f0e8dc] flex items-center p-1 shadow-inner cursor-pointer opacity-60">
                    <div className="w-6 h-6 rounded-full bg-[#C62328]" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[#5b0108] font-medium">Nutrición</span>
                  <div className="w-14 h-8 rounded-full bg-[#f0e8dc] flex items-center p-1 shadow-inner cursor-pointer opacity-60">
                    <div className="w-6 h-6 rounded-full bg-[#C62328]" />
                  </div>
                </div>
              </div>
            </NeomorphicCard>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;