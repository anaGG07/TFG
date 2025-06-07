// ! 31/05/2025 - Componente tabla de usuarios para administración
// ! 31/05/2025 - Agregada funcionalidad de crear usuarios y corregidos errores de formato

import React, { useState, useEffect } from 'react';
import { User } from '../../../types/user';
import { ProfileType } from '../../../types/enums';
import { adminService } from '../../../services/adminService';
import UserEditModal from './UserEditModal';
import UserViewModal from './UserViewModal';
import UserCreateModal from './UserCreateModal';

interface UsersTableProps {
  onRefresh?: () => void;
}

// ! 31/05/2025 - Corregidas las etiquetas del ProfileType para coincidir con el enum del backend
// ! 01/06/2025 - Eliminado PROFILE_TRANSGENDER
const ProfileTypeLabels: Record<string, string> = {
  [ProfileType.USER]: 'Usuario',
  [ProfileType.GUEST]: 'Invitado',
  [ProfileType.ADMIN]: 'Administrador',
};

const RoleLabels: Record<string, string> = {
  'ROLE_USER': 'Usuario',
  'ROLE_ADMIN': 'Administrador',
  'ROLE_GUEST': 'Invitado',
};

// Iconos SVG para acciones
const ViewIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="2.2" fill="#e0e7ff"/><circle cx="12" cy="12" r="4" stroke="#2563eb" strokeWidth="2.2" fill="#fff"/></svg>
);
const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="4" y="17" width="16" height="3" rx="1.5" fill="#ede9fe"/><path d="M16.5 6.5l1 1a2 2 0 0 1 0 2.8l-7.5 7.5-3 1 1-3 7.5-7.5a2 2 0 0 1 2.8 0z" fill="#fff" stroke="#7c3aed"/></svg>
);
const DeleteIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="5" y="7" width="14" height="12" rx="2" fill="#fee2e2"/><path d="M10 11v4M14 11v4" stroke="#dc2626"/><path d="M9 7V5a3 3 0 0 1 6 0v2" stroke="#dc2626"/></svg>
);

const UsersTable: React.FC<UsersTableProps> = ({ onRefresh }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [profileTypeFilter, setProfileTypeFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  
  // Modales
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminService.listUsers();
      setAllUsers(response.users);
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  // Filtrado local de usuarios
  useEffect(() => {
    let filteredUsers = [...allUsers];

    // Filtro por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.email.toLowerCase().includes(term) ||
        user.name?.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term)
      );
    }

    // Filtro por rol
    if (roleFilter) {
      filteredUsers = filteredUsers.filter(user => 
        user.roles.includes(roleFilter === 'admin' ? 'ROLE_ADMIN' : 'ROLE_USER')
      );
    }

    // Filtro por tipo de perfil
    if (profileTypeFilter) {
      filteredUsers = filteredUsers.filter(user => 
        user.profileType === profileTypeFilter
      );
    }

    // Filtro por estado
    if (stateFilter !== 'all') {
      const isActive = stateFilter === 'active';
      filteredUsers = filteredUsers.filter(user => user.state === isActive);
    }

    setUsers(filteredUsers);
  }, [allUsers, searchTerm, roleFilter, profileTypeFilter, stateFilter]);

  useEffect(() => {
    loadUsers();
  }, []);

  const handleReset = () => {
    setSearchTerm('');
    setRoleFilter('');
    setProfileTypeFilter('');
    setStateFilter('all');
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
      loadUsers();
      onRefresh?.();
    } catch (err: any) {
      alert(err.message || 'Error al desactivar usuario');
    }
  };

  const handleUserUpdated = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    loadUsers();
    onRefresh?.();
  };

  const handleUserCreated = () => {
    setIsCreateModalOpen(false);
    loadUsers();
    onRefresh?.();
  };

  const handleToggleState = async (user: User) => {
    const newState = !user.state;
    const action = newState ? 'activar' : 'desactivar';
    if (!confirm(`¿Estás seguro de que quieres ${action} al usuario "${user.username}"?`)) {
      return;
    }
    try {
      await adminService.updateUser(user.id.toString(), { state: newState });
      loadUsers();
      onRefresh?.();
    } catch (err: any) {
      alert(err.message || `Error al ${action} usuario`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading && users.length === 0) {
    return (
      <div className="neo-container">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b91c1c]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="neo-container">
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => loadUsers()}
            className="neo-button neo-button-primary"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="neo-container">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, email o rol..."
            className="neo-input w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rol
          </label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="neo-select w-full"
          >
            <option value="all">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="user">Usuario</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Perfil
          </label>
          <select
            value={profileTypeFilter}
            onChange={(e) => setProfileTypeFilter(e.target.value)}
            className="neo-select w-full"
          >
            <option value="">Todos los perfiles</option>
            {Object.values(ProfileType).map((type) => (
              <option key={type} value={type}>{ProfileTypeLabels[type]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="neo-select w-full"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
        <div className="flex flex-col justify-end">
          <button
            onClick={handleReset}
            className="neo-button w-full"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Información de resultados y botón crear */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          Mostrando {users.length} usuarios
          {searchTerm || roleFilter !== 'all' || stateFilter !== 'all' 
            ? ` de ${allUsers.length} total` 
            : ''
          }
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="neo-button neo-button-primary flex items-center gap-2"
        >
          <span>+</span>
          Nuevo Usuario
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="neo-table table-fixed w-full">
          <thead>
            <tr>
              <th className="px-4">Nombre</th>
              <th className="px-4">Email</th>
              <th className="px-4">Rol</th>
              <th className="px-4">Estado</th>
              <th className="px-4">Fecha de Creación</th>
              <th className="px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="neo-avatar h-10 w-10 bg-[#b91c1c] text-white flex items-center justify-center font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {user.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4">
                  <span className="text-sm text-gray-900" title={user.email}>
                    {user.email}
                  </span>
                </td>
                <td className="px-4">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <span key={role} className={`neo-badge ${role === 'ROLE_ADMIN' ? 'neo-badge-purple' : role === 'ROLE_GUEST' ? 'neo-badge-gray' : 'neo-badge-blue'}`}>{RoleLabels[role] || role}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4">
                  <span className={`neo-badge ${user.state ? 'neo-badge-green' : 'neo-badge-red'}`}> 
                    {user.state ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 text-sm text-gray-900">{formatDate(user.createdAt)}</td>
                <td className="px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="neo-button text-blue-600 hover:text-blue-900"
                    >
                      <ViewIcon />
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="neo-button text-indigo-600 hover:text-indigo-900"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => handleToggleState(user)}
                      className={`neo-button ${user.state ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                    >
                      {user.state ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="neo-button text-red-600 hover:text-red-900"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mensaje si no hay usuarios */}
      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron usuarios que coincidan con los filtros seleccionados.
        </div>
      )}

      {/* Modales */}
      {selectedUser && (
        <>
          <UserViewModal
            user={selectedUser}
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            onEdit={() => {
              setIsViewModalOpen(false);
              setIsEditModalOpen(true);
            }}
          />
          <UserEditModal
            user={selectedUser}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleUserUpdated}
          />
        </>
      )}
      <UserCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleUserCreated}
      />
    </div>
  );
};

export default UsersTable;
