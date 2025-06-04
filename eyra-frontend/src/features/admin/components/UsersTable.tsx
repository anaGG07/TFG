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
/*
const ProfileTypeLabels: Record<string, string> = {
  [ProfileType.PROFILE_WOMEN]: 'Mujer',
  [ProfileType.PROFILE_MEN]: 'Hombre',
  [ProfileType.PROFILE_NB]: 'No Binario',  
  [ProfileType.PROFILE_CUSTOM]: 'Personalizado',
  [ProfileType.PROFILE_PARENT]: 'Padre/Madre',
  [ProfileType.PROFILE_PARTNER]: 'Pareja',
  [ProfileType.PROFILE_PROVIDER]: 'Proveedor',
  [ProfileType.PROFILE_GUEST]: 'Invitado',
  // Compatibilidad con valores antiguos
  [ProfileType.PROFILE_TRANS]: 'Transgénero',
  [ProfileType.PROFILE_UNDERAGE]: 'Menor de Edad',
};
*/
const RoleLabels: Record<string, string> = {
  'ROLE_USER': 'Usuario',
  'ROLE_ADMIN': 'Administrador',
  'ROLE_GUEST': 'Invitado',
};

const UsersTable: React.FC<UsersTableProps> = ({ onRefresh }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
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
      
      const response = await adminService.listUsers({
        page: currentPage,
        limit,
      });
      
      setAllUsers(response.users);
      setTotalPages(response.pagination.totalPages);
      setTotalUsers(response.pagination.total);
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
  }, [currentPage]);

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

  const formatRoles = (roles: string[]) => {
    return roles.map(role => RoleLabels[role] || role).join(', ');
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
        <table className="neo-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
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
                <td>
                  <span className="text-sm text-gray-900" title={user.email}>
                    {user.email}
                  </span>
                </td>
                <td>
                  <span className={`neo-badge ${user.roles.includes('ROLE_ADMIN') ? 'neo-badge-purple' : 'neo-badge-blue'}`}> 
                    {user.roles.includes('ROLE_ADMIN') ? 'Administrador' : 'Usuario'}
                  </span>
                </td>
                <td>
                  <span className={`neo-badge ${user.state ? 'neo-badge-green' : 'neo-badge-red'}`}> 
                    {user.state ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="neo-button text-blue-600 hover:text-blue-900"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="neo-button text-indigo-600 hover:text-indigo-900"
                    >
                      Editar
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
                      Eliminar
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
