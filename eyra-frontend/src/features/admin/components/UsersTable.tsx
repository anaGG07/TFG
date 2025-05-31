// ! 31/05/2025 - Componente tabla de usuarios para administración
// ! 31/05/2025 - Agregada funcionalidad de crear usuarios y corregidos errores de formato

import React, { useState, useEffect } from 'react';
import { User } from '../../../types/user';
import { ProfileType } from '../../../types/enums';
import { adminService, AdminUserListParams } from '../../../services/adminService';
import { Card } from '../../../components/ui/Card';
import UserEditModal from './UserEditModal';
import UserViewModal from './UserViewModal';
import UserCreateModal from './UserCreateModal';

interface UsersTableProps {
  onRefresh?: () => void;
}

// ! 31/05/2025 - Corregidas las etiquetas del ProfileType para coincidir con el enum del backend
const ProfileTypeLabels: Record<string, string> = {
  [ProfileType.PROFILE_WOMEN]: 'Mujer',
  [ProfileType.PROFILE_MEN]: 'Hombre',
  [ProfileType.PROFILE_NB]: 'No Binario',
  [ProfileType.PROFILE_TRANSGENDER]: 'Transgénero',
  [ProfileType.PROFILE_CUSTOM]: 'Personalizado',
  [ProfileType.PROFILE_PARENT]: 'Padre/Madre',
  [ProfileType.PROFILE_PARTNER]: 'Pareja',
  [ProfileType.PROFILE_PROVIDER]: 'Proveedor',
  [ProfileType.PROFILE_GUEST]: 'Invitado',
  // Compatibilidad con valores antiguos
  [ProfileType.PROFILE_TRANS]: 'Transgénero (Legacy)',
  [ProfileType.PROFILE_UNDERAGE]: 'Menor de Edad',
};

const RoleLabels: Record<string, string> = {
  'ROLE_USER': 'Usuario',
  'ROLE_ADMIN': 'Administrador',
  'ROLE_GUEST': 'Invitado',
};

const UsersTable: React.FC<UsersTableProps> = ({ onRefresh }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit] = useState(10);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [profileTypeFilter, setProfileTypeFilter] = useState('');
  
  // Modales
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadUsers = async (params: AdminUserListParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminService.listUsers({
        page: currentPage,
        limit,
        search: searchTerm || undefined,
        role: roleFilter || undefined,
        profileType: profileTypeFilter || undefined,
        ...params,
      });
      
      setUsers(response.users);
      setTotalPages(response.pagination.totalPages);
      setTotalUsers(response.pagination.total);
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers({ page: currentPage });
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    loadUsers({ page: 1 });
  };

  const handleReset = () => {
    setSearchTerm('');
    setRoleFilter('');
    setProfileTypeFilter('');
    setCurrentPage(1);
    loadUsers({ page: 1 });
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`¿Estás seguro de que quieres desactivar al usuario "${user.username}"?`)) {
      return;
    }

    try {
      await adminService.deleteUser(user.id.toString());
      loadUsers({ page: currentPage });
      onRefresh?.();
    } catch (err: any) {
      alert(err.message || 'Error al desactivar usuario');
    }
  };

  const handleUserUpdated = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    loadUsers({ page: currentPage });
    onRefresh?.();
  };

  const handleUserCreated = () => {
    setIsCreateModalOpen(false);
    loadUsers({ page: currentPage });
    onRefresh?.();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatRoles = (roles: string[]) => {
    return roles.map(role => RoleLabels[role] || role).join(', ');
  };

  if (loading && users.length === 0) {
    return (
      <Card>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b91c1c]"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => loadUsers()}
            className="bg-[#b91c1c] text-white px-4 py-2 rounded-lg hover:bg-[#991b1b] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card title="Gestión de Usuarios" className="mb-6">
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Email, nombre o username..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent"
            >
              <option value="">Todos los roles</option>
              <option value="ROLE_USER">Usuario</option>
              <option value="ROLE_ADMIN">Administrador</option>
              <option value="ROLE_GUEST">Invitado</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Perfil
            </label>
            <select
              value={profileTypeFilter}
              onChange={(e) => setProfileTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              {Object.entries(ProfileTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col justify-end">
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="flex-1 bg-[#b91c1c] text-white px-4 py-2 rounded-md hover:bg-[#991b1b] transition-colors"
              >
                Buscar
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Información de resultados y botón crear */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            Mostrando {users.length} de {totalUsers} usuarios
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#b91c1c] text-white px-4 py-2 rounded-md hover:bg-[#991b1b] transition-colors flex items-center gap-2"
          >
            <span>+</span>
            Crear Usuario
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Perfil
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Registro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-[#b91c1c] text-white flex items-center justify-center font-semibold">
                          {user.name?.charAt(0) || user.username?.charAt(0) || 'U'}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatRoles(user.roles)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ProfileTypeLabels[user.profileType] || user.profileType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.state 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.state ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        disabled={!user.state}
                      >
                        {user.state ? 'Desactivar' : 'Desactivado'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Página {currentPage} de {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Modales */}
      {selectedUser && (
        <>
          <UserViewModal
            user={selectedUser}
            isOpen={isViewModalOpen}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedUser(null);
            }}
            onEdit={() => {
              setIsViewModalOpen(false);
              setIsEditModalOpen(true);
            }}
          />
          
          <UserEditModal
            user={selectedUser}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedUser(null);
            }}
            onSave={handleUserUpdated}
          />
        </>
      )}

      <UserCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleUserCreated}
      />
    </>
  );
};

export default UsersTable;
