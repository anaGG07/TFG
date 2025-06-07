// ! 01/06/2025 - Componente tabla de condiciones médicas para administración
// ! 01/06/2025 - Reutilizando patrón del CRUD de usuarios para consistencia

import React, { useState, useEffect } from 'react';
import { Condition } from '../../../types/condition';
import { adminConditionService } from '../../../services/adminConditionService';
import ConditionEditModal from './ConditionEditModal';
import ConditionViewModal from './ConditionViewModal';
import ConditionCreateModal from './ConditionCreateModal';

interface ConditionsTableProps {
  onRefresh?: () => void;
}

function useAutoRowsPerPage(min = 1, max = 50) {
  const [rows, setRows] = useState(8);
  useEffect(() => {
    function updateRows() {
      const height = window.innerHeight;
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

const ConditionsTable: React.FC<ConditionsTableProps> = ({ onRefresh }) => {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [allConditions, setAllConditions] = useState<Condition[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros locales (ya que no tenemos paginación en el backend para este endpoint)
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [chronicFilter, setChronicFilter] = useState('all'); // 'all', 'chronic', 'non-chronic'
  
  // Modales
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const rowsPerPage = useAutoRowsPerPage(1, 50);
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(conditions.length / rowsPerPage);
  const paginatedConditions = conditions.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const loadConditions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const conditionsData = await adminConditionService.listConditions();
      
      setAllConditions(conditionsData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar condiciones médicas');
    } finally {
      setLoading(false);
    }
  };

  // Filtrado local de condiciones
  useEffect(() => {
    let filteredConditions = [...allConditions];

    // Filtro por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredConditions = filteredConditions.filter(condition =>
        condition.name.toLowerCase().includes(term) ||
        condition.description.toLowerCase().includes(term)
      );
    }

    // Filtro por estado
    if (stateFilter !== 'all') {
      const isActive = stateFilter === 'active';
      filteredConditions = filteredConditions.filter(condition => condition.state === isActive);
    }

    // Filtro por condición crónica
    if (chronicFilter !== 'all') {
      const isChronic = chronicFilter === 'chronic';
      filteredConditions = filteredConditions.filter(condition => condition.isChronic === isChronic);
    }

    setConditions(filteredConditions);
  }, [allConditions, searchTerm, stateFilter, chronicFilter]);

  useEffect(() => {
    loadConditions();
  }, []);

  const handleReset = () => {
    setSearchTerm('');
    setStateFilter('all');
    setChronicFilter('all');
  };

  const handleViewCondition = (condition: Condition) => {
    setSelectedCondition(condition);
    setIsViewModalOpen(true);
  };

  const handleEditCondition = (condition: Condition) => {
    setSelectedCondition(condition);
    setIsEditModalOpen(true);
  };

  const handleDeleteCondition = async (condition: Condition) => {
    const action = condition.state ? 'desactivar' : 'eliminar';
    const confirmMessage = `¿Estás seguro de que quieres ${action} la condición "${condition.name}"?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const result = await adminConditionService.deleteCondition(condition.id.toString());
      
      // Mostrar mensaje si fue desactivada en lugar de eliminada
      if (result.activeUsers && result.activeUsers > 0) {
        alert(`La condición fue desactivada en lugar de eliminada porque ${result.activeUsers} usuario(s) la tienen asignada.`);
      }
      
      loadConditions();
      onRefresh?.();
    } catch (err: any) {
      alert(err.message || `Error al ${action} condición`);
    }
  };

  const handleToggleState = async (condition: Condition) => {
    const newState = !condition.state;
    const action = newState ? 'activar' : 'desactivar';
    
    if (!confirm(`¿Estás seguro de que quieres ${action} la condición "${condition.name}"?`)) {
      return;
    }

    try {
      await adminConditionService.toggleConditionState(condition.id.toString(), newState);
      loadConditions();
      onRefresh?.();
    } catch (err: any) {
      alert(err.message || `Error al ${action} condición`);
    }
  };

  const handleConditionUpdated = () => {
    setIsEditModalOpen(false);
    setSelectedCondition(null);
    loadConditions();
    onRefresh?.();
  };

  const handleConditionCreated = () => {
    setIsCreateModalOpen(false);
    loadConditions();
    onRefresh?.();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateDescription = (description: string, maxLength: number = 100) => {
    if (description.length <= maxLength) return description;
    return description.substr(0, maxLength) + '...';
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

  if (loading && conditions.length === 0) {
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
            onClick={() => loadConditions()}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o descripción..."
            className="neo-input w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo
          </label>
          <select
            value={chronicFilter}
            onChange={(e) => setChronicFilter(e.target.value as 'all' | 'chronic' | 'non-chronic')}
            className="neo-select w-full"
          >
            <option value="all">Todos los tipos</option>
            <option value="chronic">Crónicas</option>
            <option value="non-chronic">Agudas</option>
          </select>
        </div>

        <div className="flex flex-col justify-end">
          <label className="block text-sm font-medium text-gray-700 mb-2 invisible">
            Estado
          </label>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="neo-select w-full mb-2"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="inactive">Inactivas</option>
          </select>
          <button
            onClick={handleReset}
            className="neo-button w-full mt-2"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Información de resultados y botón crear */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          Mostrando {conditions.length} condiciones
          {searchTerm || chronicFilter !== 'all' || stateFilter !== 'all' 
            ? ` de ${allConditions.length} total` 
            : ''
          }
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="neo-button neo-button-primary flex items-center gap-2"
        >
          <span>+</span>
          Nueva Condición
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="neo-table table-fixed w-full">
          <thead>
            <tr>
              <th className="px-4 text-center">Nombre</th>
              <th className="px-4 text-center">Descripción</th>
              <th className="px-4 text-center">Tipo</th>
              <th className="px-4 text-center">Estado</th>
              <th className="px-4 text-center">Fecha de Creación</th>
              <th className="px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedConditions.map((condition) => (
              <tr key={condition.id}>
                <td className="px-4 text-center">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="neo-avatar h-10 w-10 bg-[#b91c1c] text-white flex items-center justify-center font-semibold">
                        {condition.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {condition.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {condition.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 text-center">
                  <span className="text-sm text-gray-900" title={condition.description}>
                    {truncateDescription(condition.description)}
                  </span>
                </td>
                <td className="px-4 text-center">
                  <span className={`neo-badge ${
                    condition.isChronic 
                      ? 'neo-badge-orange' 
                      : 'neo-badge-blue'
                  }`}>
                    {condition.isChronic ? 'Crónica' : 'Aguda'}
                  </span>
                </td>
                <td className="px-4 text-center">
                  <span className={`neo-badge ${
                    condition.state 
                      ? 'neo-badge-green' 
                      : 'neo-badge-red'
                  }`}>
                    {condition.state ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-4 text-center">
                  {formatDate(condition.createdAt)}
                </td>
                <td className="px-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleViewCondition(condition)}
                      className="neo-button text-blue-600 hover:text-blue-900"
                    >
                      <ViewIcon />
                    </button>
                    <button
                      onClick={() => handleEditCondition(condition)}
                      className="neo-button text-indigo-600 hover:text-indigo-900"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => handleToggleState(condition)}
                      className={`neo-button ${
                        condition.state 
                          ? 'text-orange-600 hover:text-orange-900'
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {condition.state ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      onClick={() => handleDeleteCondition(condition)}
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

      {/* Mensaje si no hay condiciones */}
      {conditions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron condiciones que coincidan con los filtros seleccionados.
        </div>
      )}

      {/* Modales */}
      {selectedCondition && (
        <>
          <ConditionViewModal
            condition={selectedCondition}
            categories={{}}
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            onEdit={() => {
              setIsViewModalOpen(false);
              setIsEditModalOpen(true);
            }}
          />
          <ConditionEditModal
            condition={selectedCondition}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleConditionUpdated}
          />
        </>
      )}
      <ConditionCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleConditionCreated}
      />

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
    </div>
  );
};

export default ConditionsTable;
