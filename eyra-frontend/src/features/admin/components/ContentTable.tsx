// ! 01/06/2025 - Componente tabla de contenido para administración
// ! 01/06/2025 - Reutilizando patrón del CRUD de condiciones para consistencia

import React, { useState, useEffect } from 'react';
import { Content, ContentType } from '../../../types/domain';
import { adminContentService } from '../../../services/adminContentService';
import ContentEditModal from './ContentEditModal';
import ContentViewModal from './ContentViewModal';
import ContentCreateModal from './ContentCreateModal';

type SafeContent = Content & { description?: string; summary?: string };

interface ContentTableProps {
  onRefresh?: () => void;
}

// Hook para calcular registros por página según pantalla - REDUCIDO PARA MÁS ESPACIO
function useAutoRowsPerPage(min = 1, max = 50) {
  const [rows, setRows] = useState(5); // Reducido de 8 a 5
  useEffect(() => {
    function updateRows() {
      const height = window.innerHeight;
      // Reducido: 5 filas en escritorio, 3 en tablet, 1 en móvil
      if (height < 500) setRows(Math.max(min, 1));
      else if (height < 800) setRows(Math.max(min, 3));
      else setRows(Math.max(min, 5));
    }
    updateRows();
    window.addEventListener('resize', updateRows);
    return () => window.removeEventListener('resize', updateRows);
  }, [min]);
  return rows;
}

const ContentTable: React.FC<ContentTableProps> = ({ onRefresh }) => {
  const [contents, setContents] = useState<SafeContent[]>([]);
  const [allContents, setAllContents] = useState<SafeContent[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros locales
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  
  // Modales
  const [selectedContent, setSelectedContent] = useState<SafeContent | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const rowsPerPage = useAutoRowsPerPage(1, 50);
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(contents.length / rowsPerPage);
  const paginatedContents = contents.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const loadContents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const contentsData = await adminContentService.listContent();
      setAllContents(contentsData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar contenido');
    } finally {
      setLoading(false);
    }
  };

  // Filtrado local de contenido
  useEffect(() => {
    let filteredContents = [...allContents];

    // Filtro por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredContents = filteredContents.filter(content =>
        content.title.toLowerCase().includes(term) ||
        (content.summary || content.description || "").toLowerCase().includes(term) ||
        content.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Filtro por tipo
    if (typeFilter !== 'all') {
      filteredContents = filteredContents.filter(content => content.type === typeFilter);
    }

    // Filtro por fase
    if (phaseFilter !== 'all') {
      filteredContents = filteredContents.filter(content => content.targetPhase === phaseFilter);
    }

    setContents(filteredContents);
  }, [allContents, searchTerm, typeFilter, phaseFilter]);

  useEffect(() => {
    loadContents();
  }, []);

  const handleReset = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setPhaseFilter('all');
  };

  const handleViewContent = (content: SafeContent) => {
    setSelectedContent(content);
    setIsViewModalOpen(true);
  };

  const handleEditContent = (content: SafeContent) => {
    setSelectedContent(content);
    setIsEditModalOpen(true);
  };

  const handleDeleteContent = async (content: SafeContent) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el contenido "${content.title}"?`)) {
      return;
    }

    try {
      await adminContentService.deleteContent(content.id.toString());
      loadContents();
      onRefresh?.();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar contenido');
    }
  };

  const handleContentUpdated = () => {
    setIsEditModalOpen(false);
    setSelectedContent(null);
    loadContents();
    onRefresh?.();
  };

  const handleContentCreated = () => {
    setIsCreateModalOpen(false);
    loadContents();
    onRefresh?.();
  };

  const getContentTypeName = (type: ContentType) => {
    switch (type) {
      case ContentType.NUTRITION:
        return 'Nutrición';
      case ContentType.EXERCISE:
        return 'Ejercicio';
      case ContentType.ARTICLE:
        return 'Artículo';
      case ContentType.SELFCARE:
        return 'Autocuidado';
      case ContentType.RECOMMENDATION:
        return 'Recomendación';
      default:
        return 'Contenido';
    }
  };

  const getContentTypeColor = (type: ContentType) => {
    switch (type) {
      case ContentType.NUTRITION:
        return 'bg-emerald-100 text-emerald-800';
      case ContentType.EXERCISE:
        return 'bg-blue-100 text-blue-800';
      case ContentType.ARTICLE:
        return 'bg-purple-100 text-purple-800';
      case ContentType.SELFCARE:
        return 'bg-pink-100 text-pink-800';
      case ContentType.RECOMMENDATION:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  if (loading && contents.length === 0) {
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
            onClick={() => loadContents()}
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
            placeholder="Buscar por título o descripción..."
            className="neo-input w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Contenido
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as ContentType | 'all')}
            className="neo-select w-full"
          >
            <option value="all">Todos los tipos</option>
            <option value={ContentType.NUTRITION}>Nutrición</option>
            <option value={ContentType.EXERCISE}>Ejercicio</option>
            <option value={ContentType.ARTICLE}>Artículo</option>
            <option value={ContentType.SELFCARE}>Autocuidado</option>
            <option value={ContentType.RECOMMENDATION}>Recomendación</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fase del Ciclo
          </label>
          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className="neo-select w-full"
          >
            <option value="all">Todas las fases</option>
            <option value="menstrual">Menstrual</option>
            <option value="folicular">Folicular</option>
            <option value="ovulacion">Ovulación</option>
            <option value="lutea">Lútea</option>
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
          Mostrando {contents.length} contenidos
          {searchTerm || typeFilter !== 'all' || phaseFilter !== 'all' 
            ? ` de ${allContents.length} total` 
            : ''
          }
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="neo-button neo-button-primary flex items-center gap-2"
        >
          <span>+</span>
          Nuevo Contenido
        </button>
      </div>

      {/* Tabla */}
      <div className="space-y-3 w-full max-w-full px-0">
        {paginatedContents.map((content) => (
          <div key={content.id} className="neo-card p-4 w-full">
            <div className="flex items-center">
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">
                  {content.title}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-900" title={content.summary || content.description || ""}>
              {(content.summary || content.description || "").length > 100 
                ? (content.summary || content.description || "").substring(0, 100) + '...' 
                : (content.summary || content.description || "")}
            </div>
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => handleViewContent(content)}
                className="neo-button text-blue-600 hover:text-blue-900"
              >
                <ViewIcon />
              </button>
              <button
                onClick={() => handleEditContent(content)}
                className="neo-button text-indigo-600 hover:text-indigo-900"
              >
                <EditIcon />
              </button>
              <button
                onClick={() => handleDeleteContent(content)}
                className="neo-button text-red-600 hover:text-red-900"
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje si no hay contenido */}
      {contents.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron contenidos que coincidan con los filtros seleccionados.
        </div>
      )}

      {/* Modales */}
      {selectedContent && (
        <>
          <ContentViewModal
            content={selectedContent}
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            onEdit={() => {
              setIsViewModalOpen(false);
              setIsEditModalOpen(true);
            }}
          />
          <ContentEditModal
            content={selectedContent}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleContentUpdated}
          />
        </>
      )}
      <ContentCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleContentCreated}
      />

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

export default ContentTable; 