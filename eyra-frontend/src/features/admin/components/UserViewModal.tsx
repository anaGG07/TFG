// ! 31/05/2025 - Modal para ver detalles del usuario en administración
// ! 31/05/2025 - Actualizados colores para usar colores de EYRA

import React from 'react';
import { User } from '../../../types/user';
import { ProfileType } from '../../../types/enums';

interface UserViewModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}
// ! 01/06/2025 - Eliminado PROFILE_TRANSGENDER
const ProfileTypeLabels: Record<string, string> = {
  [ProfileType.PROFILE_WOMEN]: 'Mujer',
  [ProfileType.PROFILE_MEN]: 'Hombre',
  [ProfileType.PROFILE_NB]: 'No Binario',
  [ProfileType.PROFILE_TRANS]: 'Transgénero',
  [ProfileType.PROFILE_CUSTOM]: 'Personalizado',
  [ProfileType.PROFILE_PARENT]: 'Padre/Madre',
  [ProfileType.PROFILE_PARTNER]: 'Pareja',
  [ProfileType.PROFILE_PROVIDER]: 'Proveedor',
  [ProfileType.PROFILE_GUEST]: 'Invitado',
  //[ProfileType.USER]: 'Usuario',
  //[ProfileType.GUEST]: 'Invitado',
  //[ProfileType.ADMIN]: 'Administrador',
};

const RoleLabels: Record<string, string> = {
  'ROLE_USER': 'Usuario',
  'ROLE_ADMIN': 'Administrador',
  'ROLE_GUEST': 'Invitado',
};

const UserViewModal: React.FC<UserViewModalProps> = ({ user, isOpen, onClose, onEdit }) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRoles = (roles: string[]) => {
    return roles.map(role => RoleLabels[role] || role).join(', ');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-serif text-[#b91c1c]">
            Detalles del Usuario
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Avatar y info básica */}
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 h-16 w-16">
              <div className="h-16 w-16 rounded-full bg-[#b91c1c] text-white flex items-center justify-center font-bold text-xl">
                {user.name?.charAt(0) || user.username?.charAt(0) || 'U'}
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {user.name} {user.lastName}
              </h3>
              <p className="text-gray-600">@{user.username}</p>
              <div className="mt-1">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.state 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.state ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>

          {/* Información personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Información Personal
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha de Nacimiento
                  </label>
                  <p className="text-sm text-gray-900">
                    {user.birthDate ? new Date(user.birthDate).toLocaleDateString('es-ES') : 'No especificada'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tipo de Perfil
                  </label>
                  <p className="text-sm text-gray-900">
                    {ProfileTypeLabels[user.profileType] || user.profileType}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Información del Sistema
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ID
                  </label>
                  <p className="text-sm text-gray-900">{user.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Roles
                  </label>
                  <p className="text-sm text-gray-900">{formatRoles(user.roles)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Onboarding Completado
                  </label>
                  <p className="text-sm text-gray-900">
                    {user.onboardingCompleted ? 'Sí' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Fechas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de Registro
                </label>
                <p className="text-sm text-gray-900">{formatDate(user.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Última Actualización
                </label>
                <p className="text-sm text-gray-900">
                  {user.updatedAt ? formatDate(user.updatedAt) : 'Nunca'}
                </p>
              </div>
            </div>
          </div>

          {/* Información de Onboarding */}
          {user.onboarding && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Información de Onboarding
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Etapa de Vida
                    </label>
                    <p className="text-sm text-gray-900">
                      {user.onboarding.stageOfLife || 'No especificada'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Última Menstruación
                    </label>
                    <p className="text-sm text-gray-900">
                      {user.onboarding.lastPeriodDate 
                        ? new Date(user.onboarding.lastPeriodDate).toLocaleDateString('es-ES')
                        : 'No especificada'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Duración Promedio del Ciclo
                    </label>
                    <p className="text-sm text-gray-900">
                      {user.onboarding.averageCycleLength ? `${user.onboarding.averageCycleLength} días` : 'No especificada'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Duración Promedio del Período
                    </label>
                    <p className="text-sm text-gray-900">
                      {user.onboarding.averagePeriodLength ? `${user.onboarding.averagePeriodLength} días` : 'No especificada'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cerrar
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm font-medium text-white bg-[#b91c1c] rounded-md hover:bg-[#991b1b]"
          >
            Editar Usuario
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserViewModal;
