import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ProfileType, User } from '../types/domain';
import { userService } from '../services/userService';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUserData } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    name: user?.name || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    birthDate: user?.birthDate || '',
    averageCycleLength: user?.onboarding?.averageCycleLength || 28,
    averagePeriodLength: user?.onboarding?.averagePeriodLength || 5,
    profileType: user?.profileType || ProfileType.WOMEN,
    receiveAlerts: user?.onboarding?.receiveAlerts ?? true,
    receiveRecommendations: user?.onboarding?.receiveRecommendations ?? true,
    receiveCyclePhaseTips: user?.onboarding?.receiveCyclePhaseTips ?? true,
    receiveWorkoutSuggestions: user?.onboarding?.receiveWorkoutSuggestions ?? true,
    receiveNutritionAdvice: user?.onboarding?.receiveNutritionAdvice ?? true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const updatedUser = await userService.updateProfile(user.id, {
        username: formData.username,
        name: formData.name,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        profileType: formData.profileType as ProfileType,
      });

      await userService.updateOnboarding({
        averageCycleLength: formData.averageCycleLength,
        averagePeriodLength: formData.averagePeriodLength,
        receiveAlerts: formData.receiveAlerts,
        receiveRecommendations: formData.receiveRecommendations,
        receiveCyclePhaseTips: formData.receiveCyclePhaseTips,
        receiveWorkoutSuggestions: formData.receiveWorkoutSuggestions,
        receiveNutritionAdvice: formData.receiveNutritionAdvice,
      });

      updateUserData(updatedUser);
      setIsEditing(false);
      toast.success('Perfil actualizado con éxito');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    try {
      await userService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success('Contraseña actualizada con éxito');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-page pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>
        
        {/* Tabs de navegación */}
        <div className="flex border-b mb-8">
          <button
            className={`px-4 py-2 ${activeTab === 'profile' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Perfil
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'account' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            Cuenta
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'notifications' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Recordatorios
          </button>
        </div>

        {/* Contenido de las pestañas */}
        <div className="card p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold">
                  {user?.username?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{user?.username || 'Usuario'}</h2>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre de usuario</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Apellido</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha de nacimiento</label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Configuración del ciclo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Duración promedio del ciclo (días)</label>
                      <input
                        type="number"
                        name="averageCycleLength"
                        value={formData.averageCycleLength}
                        onChange={handleInputChange}
                        min="21"
                        max="35"
                        className="w-full p-2 border rounded"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Duración promedio del periodo (días)</label>
                      <input
                        type="number"
                        name="averagePeriodLength"
                        value={formData.averagePeriodLength}
                        onChange={handleInputChange}
                        min="1"
                        max="14"
                        className="w-full p-2 border rounded"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Objetivo</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="profileType"
                        value={ProfileType.WOMEN}
                        checked={formData.profileType === ProfileType.WOMEN}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={!isEditing}
                      />
                      <label>Seguir el periodo</label>
                    </div>
                    <div className="flex items-center opacity-50">
                      <input
                        type="radio"
                        name="profileType"
                        value="conception"
                        disabled
                        className="mr-2"
                      />
                      <label>Intentar concebir (próximamente)</label>
                    </div>
                    <div className="flex items-center opacity-50">
                      <input
                        type="radio"
                        name="profileType"
                        value="pregnancy"
                        disabled
                        className="mr-2"
                      />
                      <label>Seguir embarazo (próximamente)</label>
                    </div>
                    <div className="flex items-center opacity-50">
                      <input
                        type="radio"
                        name="profileType"
                        value="hormones"
                        disabled
                        className="mr-2"
                      />
                      <label>Seguir hormonación (próximamente)</label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border rounded"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded"
                      >
                        Guardar cambios
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-primary text-white rounded"
                    >
                      Editar perfil
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">Configuración de la cuenta</h2>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Contraseña actual</label>
                    <input
                      type="password"
                      name="currentPassword"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nueva contraseña</label>
                    <input
                      type="password"
                      name="newPassword"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Confirmar nueva contraseña</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded"
                  >
                    Cambiar contraseña
                  </button>
                </div>
              </form>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Privacidad</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Compartir ciclo con pareja</h4>
                      <p className="text-sm text-gray-600">Permite que tu pareja vea tu ciclo menstrual</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">Recordatorios y notificaciones</h2>
              
              <form className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Alertas importantes</h4>
                      <p className="text-sm text-gray-600">Notificaciones sobre cambios significativos en tu ciclo</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="receiveAlerts"
                        checked={formData.receiveAlerts}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Recomendaciones personalizadas</h4>
                      <p className="text-sm text-gray-600">Sugerencias basadas en tu ciclo y síntomas</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="receiveRecommendations"
                        checked={formData.receiveRecommendations}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Consejos por fase del ciclo</h4>
                      <p className="text-sm text-gray-600">Información relevante según tu fase actual</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="receiveCyclePhaseTips"
                        checked={formData.receiveCyclePhaseTips}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Sugerencias de ejercicio</h4>
                      <p className="text-sm text-gray-600">Rutinas adaptadas a tu ciclo</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="receiveWorkoutSuggestions"
                        checked={formData.receiveWorkoutSuggestions}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Consejos de nutrición</h4>
                      <p className="text-sm text-gray-600">Recomendaciones alimenticias según tu ciclo</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="receiveNutritionAdvice"
                        checked={formData.receiveNutritionAdvice}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded"
                  >
                    Guardar preferencias
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;