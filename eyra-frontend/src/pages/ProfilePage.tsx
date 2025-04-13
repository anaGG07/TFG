import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-gradient-to-br from-[#1A0B2E] to-[#2D0A31]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Mi Perfil</h1>
        
        <div className="bg-[#ffffff08] backdrop-blur-md p-8 rounded-xl border border-white/10">
          {user ? (
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] flex items-center justify-center text-white text-3xl font-bold">
                  {user.username?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">{user.username || 'Usuario'}</h2>
                  <p className="text-white/70">{user.email}</p>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-medium text-white mb-4">Información de la cuenta</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-white/50 mb-1">Nombre de usuario</p>
                    <p className="text-white">{user.username || 'No disponible'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-white/50 mb-1">Email</p>
                    <p className="text-white">{user.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-white/50 mb-1">Miembro desde</p>
                    <p className="text-white">
                      {user.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString() 
                        : 'No disponible'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-6">
                <button className="px-6 py-2 bg-[#ff2dae51] hover:bg-[#FF2DAF] rounded-lg text-white font-medium transition-colors duration-300">
                  Editar perfil
                </button>
              </div>
            </div>
          ) : (
            <p className="text-white/70 text-center py-6">Cargando información del usuario...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;