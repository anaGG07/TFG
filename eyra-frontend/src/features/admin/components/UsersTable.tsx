// ! 31/05/2025 - Componente tabla de usuarios para administración
// ! 31/05/2025 - Agregada funcionalidad de crear usuarios y corregidos errores de formato

import React, { useState, useEffect } from 'react';
import { User } from '../../../types/user';
import { ProfileType } from '../../../types/enums';
import { adminService } from '../../../services/adminService';
import { useViewport } from '../../../hooks/useViewport';
import UserEditModal from './UserEditModal';
import UserViewModal from './UserViewModal';
import UserCreateModal from './UserCreateModal';
import UserAvatar from '../../../components/UserAvatar';

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

// Nuevo icono de ver detalles (ojo)
const ViewIcon = () => (
  <svg className="w-5 h-5 neo-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
    <circle cx="12" cy="12" r="3.5" />
  </svg>
);
// Nuevo icono de editar (lápiz)
const EditIcon = () => (
  <svg className="w-5 h-5 neo-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="#a21caf" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
  </svg>
);
// Icono toggle (papelera y check) mejorados, estilo neomorphic
const ToggleActiveIcon = ({ active }: { active: boolean }) => (
  active ? (
    <svg className="w-5 h-5 neo-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="7" width="14" height="12" rx="2" fill="#fee2e2" stroke="#dc2626" />
      <path d="M10 11v4M14 11v4" stroke="#dc2626" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" stroke="#dc2626" />
    </svg>
  ) : (
    <svg className="w-5 h-5 neo-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#bbf7d0" stroke="#16a34a" />
      <path d="M8 12l3 3 5-5" stroke="#16a34a" strokeWidth="2.2" />
    </svg>
  )
);

// Hook para calcular registros por página según pantalla
function useAutoRowsPerPage(min = 1, max = 50) {
  const [rows, setRows] = useState(8);
  useEffect(() => {
    function updateRows() {
      const height = window.innerHeight;
      // Estimación: caben 8 filas en escritorio, 4 en tablet, 1 en móvil
      if (height < 500) setRows(Math.max(min, 1));
      else if (height < 800) setRows(Math.max(min, 4));
      else setRows(Math.max(min, 8));
    }
    updateRows();
    window.addEventListener('resize', updateRows);
    return () => window.removeEventListener('resize', updateRows);
  }, [min]);
  return rows;
}

const UsersTable: React.FC<UsersTableProps> = ({ onRefresh }) => {
  const { isMobile, isTablet } = useViewport();
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [profileTypeFilter, setProfileTypeFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  
  // Estado para filtros colapsables en móvil
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  
  // Modales
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const rowsPerPage = useAutoRowsPerPage(1, 50);
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(users.length / rowsPerPage);
  const paginatedUsers = users.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

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
      <div className={`${isMobile ? "mb-4" : "mb-6"}`}>
        {/* Búsqueda principal */}
        <div className={`${isMobile ? "mb-3" : "mb-4"}`}>
          <label className={`block font-medium text-gray-700 mb-2 ${
            isMobile ? "text-sm" : "text-sm"
          }`}>
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

        {/* Filtros adicionales */}
        {isMobile ? (
          <div>
            <button
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              className="neo-button w-full flex items-center justify-between mb-3"
            >
              <span>Filtros avanzados</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  filtersExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {filtersExpanded && (
              <div className="grid grid-cols-1 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Perfil</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
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
                <button
                  onClick={handleReset}
                  className="neo-button w-full"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Perfil</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
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
        )}
      </div>

      {/* Información de resultados y botón crear */}
      <div className={`flex items-center mb-4 ${
        isMobile ? "flex-col gap-2" : "justify-between"
      }`}>
        <div className={`text-gray-600 ${
          isMobile ? "text-sm text-center" : "text-sm"
        }`}>
          Mostrando {users.length} usuarios
          {searchTerm || roleFilter !== 'all' || stateFilter !== 'all' 
            ? ` de ${allUsers.length} total` 
            : ''
          }
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className={`neo-button neo-button-primary flex items-center gap-2 ${
            isMobile ? "w-full justify-center" : ""
          }`}
        >
          <span>+</span>
          Nuevo Usuario
        </button>
      </div>

      {/* Contenido principal: Tabla en desktop/tablet, Cards en móvil */}
      {isMobile ? (
        // Vista de cards para móvil
        <div className="space-y-3 w-full max-w-full px-0">
          {paginatedUsers.map((user) => (
            <div key={user.id} className="neo-card p-4 w-full">
              {/* Header de la card */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <UserAvatar user={user} size="sm" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
                    <p className="text-xs text-gray-500 truncate max-w-[120px]">{user.email}</p>
                  </div>
                </div>
                <span className={`neo-badge text-xs ${user.state ? 'neo-badge-green' : 'neo-badge-red'}`}>
                  {user.state ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              
              {/* Información adicional */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div>
                  <span className="text-gray-500">Roles:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.roles.map((role) => (
                      <span key={role} className={`neo-badge text-xs ${
                        role === 'ROLE_ADMIN' ? 'neo-badge-purple' : 
                        role === 'ROLE_GUEST' ? 'neo-badge-gray' : 'neo-badge-blue'
                      }`}>
                        {RoleLabels[role] || role}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Creado:</span>
                  <p className="text-gray-900 mt-1">{formatDate(user.createdAt)}</p>
                </div>
              </div>
              
              {/* Acciones */}
              <div className="flex justify-center space-x-3 pt-2 border-t border-gray-100">
                <button
                  onClick={() => handleViewUser(user)}
                  className="neo-button text-blue-600 hover:text-blue-900 p-2"
                  aria-label="Ver detalles del usuario"
                >
                  <ViewIcon />
                </button>
                <button
                  onClick={() => handleEditUser(user)}
                  className="neo-button text-purple-700 hover:text-purple-900 p-2"
                  aria-label="Editar usuario"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => handleToggleState(user)}
                  className={`neo-button p-2 ${user.state ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                  aria-label={user.state ? 'Desactivar usuario' : 'Activar usuario'}
                >
                  <ToggleActiveIcon active={user.state} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Vista de tabla para desktop/tablet
        <div className="overflow-x-auto">
          <table className="neo-table table-fixed w-full">
            <thead>
              <tr>
                <th className="px-4 text-center">Nombre</th>
                <th className="px-4 text-center">Email</th>
                <th className="px-4 text-center">Rol</th>
                <th className="px-4 text-center">Estado</th>
                <th className="px-4 text-center">Fecha de Creación</th>
                <th className="px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user, idx) => (
                <>
                  <tr key={user.id}>
                    <td className="px-4">
                      <div className="flex items-center justify-start gap-4">
                        <UserAvatar user={user} size="md" />
                        <span className="text-sm font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 text-center">
                      <span className="text-sm text-gray-900" title={user.email}>
                        {user.email}
                      </span>
                    </td>
                    <td className="px-4 text-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {user.roles.map((role) => (
                          <span key={role} className={`neo-badge ${role === 'ROLE_ADMIN' ? 'neo-badge-purple' : role === 'ROLE_GUEST' ? 'neo-badge-gray' : 'neo-badge-blue'}`}>{RoleLabels[role] || role}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 text-center">
                      <span className={`neo-badge ${user.state ? 'neo-badge-green' : 'neo-badge-red'}`}> 
                        {user.state ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 text-center text-sm text-gray-900">{formatDate(user.createdAt)}</td>
                    <td className="px-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="neo-button text-blue-600 hover:text-blue-900"
                          aria-label="Ver detalles del usuario"
                        >
                          <ViewIcon />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="neo-button text-purple-700 hover:text-purple-900"
                          aria-label="Editar usuario"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleToggleState(user)}
                          className={`neo-button ${user.state ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          aria-label={user.state ? 'Desactivar usuario' : 'Activar usuario'}
                        >
                          <ToggleActiveIcon active={user.state} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {idx < paginatedUsers.length - 1 && (
                    <tr className="neo-divider-row">
                      <td colSpan={6} className="p-0"><div className="neo-divider mx-auto" /></td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mensaje si no hay usuarios */}
      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron usuarios que coincidan con los filtros seleccionados.
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6 mb-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className={`p-2 rounded-lg ${page === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#C62328]/10 cursor-pointer'} transition-all duration-200`}
            style={{
              background: page === 0 ? 'transparent' : 'linear-gradient(145deg, #fafaf9, #e7e5e4)',
              boxShadow: page === 0 ? 'none' : '3px 3px 6px rgba(91, 1, 8, 0.06), -3px -3px 6px rgba(255, 255, 255, 0.4)',
            }}
            aria-label="Página anterior"
          >
            <svg className="w-4 h-4 text-[#C62328]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => {
              // Mostrar solo primeras 2, últimas 2 y 2 alrededor de la actual
              if (i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 1 || (page < 3 && i < 4) || (page > totalPages - 4 && i > totalPages - 5)) {
                return (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-8 h-8 rounded-lg transition-all duration-200 flex items-center justify-center text-sm font-medium ${i === page ? 'text-white' : 'text-[#C62328] hover:text-white'}`}
                    style={{
                      background: i === page ? 'linear-gradient(135deg, #C62328, #9d0d0b)' : 'linear-gradient(145deg, #fafaf9, #e7e5e4)',
                      boxShadow: i === page ? 'inset 2px 2px 4px rgba(91, 1, 8, 0.3), inset -2px -2px 4px rgba(255, 108, 92, 0.2)' : '3px 3px 6px rgba(91, 1, 8, 0.06), -3px -3px 6px rgba(255, 255, 255, 0.4)',
                    }}
                    aria-label={`Página ${i + 1}`}
                  >
                    {i + 1}
                  </button>
                );
              } else if (
                (i === page - 2 && page > 2) ||
                (i === page + 2 && page < totalPages - 3)
              ) {
                return <span key={i} className="w-8 h-8 flex items-center justify-center text-[#C62328]">...</span>;
              }
              return null;
            })}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className={`p-2 rounded-lg ${page === totalPages - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#C62328]/10 cursor-pointer'} transition-all duration-200`}
            style={{
              background: page === totalPages - 1 ? 'transparent' : 'linear-gradient(145deg, #fafaf9, #e7e5e4)',
              boxShadow: page === totalPages - 1 ? 'none' : '3px 3px 6px rgba(91, 1, 8, 0.06), -3px -3px 6px rgba(255, 255, 255, 0.4)',
            }}
            aria-label="Página siguiente"
          >
            <svg className="w-4 h-4 text-[#C62328]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          </button>
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
