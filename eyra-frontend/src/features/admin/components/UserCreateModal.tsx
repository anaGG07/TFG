// ! 31/05/2025 - Modal para crear nuevo usuario en administración

import React, { useState } from 'react';
import { ProfileType } from '../../../types/enums';
import { API_ROUTES } from '../../../config/apiRoutes';
import { apiFetch } from '../../../utils/httpClient';

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface CreateUserData {
  email: string;
  username: string;
  name: string;
  lastName: string;
  password: string;
  profileType: ProfileType;
  birthDate: string;
  roles: string[];
}

const ProfileTypeOptions = [
  { value: ProfileType.PROFILE_WOMEN, label: 'Mujer' },
  { value: ProfileType.PROFILE_MEN, label: 'Hombre' },
  { value: ProfileType.PROFILE_NB, label: 'No Binario' },
  { value: ProfileType.PROFILE_TRANS, label: 'Transgénero' },
  { value: ProfileType.PROFILE_CUSTOM, label: 'Personalizado' },
  { value: ProfileType.PROFILE_PARENT, label: 'Padre/Madre' },
  { value: ProfileType.PROFILE_PARTNER, label: 'Pareja' },
  { value: ProfileType.PROFILE_PROVIDER, label: 'Proveedor' },
  { value: ProfileType.PROFILE_GUEST, label: 'Invitado' },
];

const RoleOptions = [
  { value: 'ROLE_USER', label: 'Usuario' },
  { value: 'ROLE_ADMIN', label: 'Administrador' },
  { value: 'ROLE_GUEST', label: 'Invitado' },
];

const UserCreateModal: React.FC<UserCreateModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    username: '',
    name: '',
    lastName: '',
    password: '',
    profileType: ProfileType.PROFILE_WOMEN,
    birthDate: '',
    roles: ['ROLE_USER'],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      email: '',
      username: '',
      name: '',
      lastName: '',
      password: '',
      profileType: ProfileType.PROFILE_WOMEN,
      birthDate: '',
      roles: ['ROLE_USER'],
    });
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRolesChange = (role: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      roles: checked 
        ? [...prev.roles, role]
        : prev.roles.filter(r => r !== role)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validaciones básicas
      if (!formData.email || !formData.username || !formData.name || !formData.password) {
        throw new Error('Los campos email, username, nombre y contraseña son obligatorios');
      }

      if (formData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      if (formData.roles.length === 0) {
        throw new Error('El usuario debe tener al menos un rol');
      }

      // Crear el avatar por defecto
      const defaultAvatar = {
        skinColor: "light",
        eyes: "normal",
        eyebrows: "normal", 
        mouth: "smile",
        hairStyle: "short",
        hairColor: "brown",
        facialHair: "none",
        clothes: "casual",
        fabricColor: "blue",
        glasses: "none",
        glassOpacity: "0",
        accessories: "none",
        tattoos: "none",
        backgroundColor: "white"
      };

      // Preparar datos para envío (usamos endpoint de registro)
      const userData = {
        ...formData,
        avatar: defaultAvatar
      };

      const createdUser = await apiFetch(API_ROUTES.AUTH.REGISTER, {
        method: 'POST',
        body: userData
      });

      console.log('Usuario creado:', createdUser);
      resetForm();
      onSave();
    } catch (err: any) {
      setError(err.message || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-serif text-[#b91c1c]">
            Crear Usuario
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Información básica */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
              </div>
            </div>
          </div>

          {/* Configuración de perfil */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Configuración de Perfil
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Perfil
                </label>
                <select
                  name="profileType"
                  value={formData.profileType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent"
                >
                  {ProfileTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Roles */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Roles *
            </h3>
            <div className="space-y-2">
              {RoleOptions.map(role => (
                <label key={role.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.roles.includes(role.value)}
                    onChange={(e) => handleRolesChange(role.value, e.target.checked)}
                    className="rounded border-gray-300 text-[#b91c1c] focus:ring-[#b91c1c]"
                  />
                  <span className="ml-2 text-sm text-gray-700">{role.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white bg-[#b91c1c] rounded-md hover:bg-[#991b1b] disabled:opacity-50 flex items-center"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {loading ? 'Creando...' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserCreateModal;
