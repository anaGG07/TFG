import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  
  return (
    <div className="profile-page pt-24 pb-20 px-4">
      <div className="container">
        <h1>Mi Perfil</h1>
        
        <div className="card">
          {user ? (
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full profile-avatar flex items-center justify-center text-3xl font-bold">
                  {user.username?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
                <div>
                  <h2>{user.username || 'Usuario'}</h2>
                  <p className="secondary-text">{user.email}</p>
                </div>
              </div>
              
              <div className="separator pt-6">
                <h3 className="text-lg font-medium mb-4">Información de la cuenta</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="label-text mb-1">Nombre de usuario</p>
                    <p>{user.username || 'No disponible'}</p>
                  </div>
                  
                  <div>
                    <p className="label-text mb-1">Email</p>
                    <p>{user.email}</p>
                  </div>
                  
                  <div>
                    <p className="label-text mb-1">Miembro desde</p>
                    <p>
                      {user.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString() 
                        : 'No disponible'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="separator pt-6">
                <button className="button-primary">
                  Editar perfil
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center py-6">Cargando información del usuario...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;