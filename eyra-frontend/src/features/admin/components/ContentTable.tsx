// ! 01/06/2025 - Componente tabla de contenido para administración
// ! 01/06/2025 - Reutilizando patrón del CRUD de condiciones para consistencia

import React, { useState, useEffect } from 'react';
import { Content, ContentType } from '../../../types/domain';
import { adminContentService } from '../../../services/adminContentService';
import ContentEditModal from './ContentEditModal';
import ContentViewModal from './ContentViewModal';
import ContentCreateModal from './ContentCreateModal';

interface ContentTableProps {
  onRefresh?: () => void;
}

const ContentTable: React.FC<ContentTableProps> = ({ onRefresh }) => {
  const [contents, setContents] = useState<Content[]>([]);
  const [allContents, setAllContents] = useState<Content[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros locales
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  
  // Modales
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
        content.description.toLowerCase().includes(term) ||
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

  const handleViewContent = (content: Content) => {
    setSelectedContent(content);
    setIsViewModalOpen(true);
  };

  const handleEditContent = (content: Content) => {
    setSelectedContent(content);
    setIsEditModalOpen(true);
  };

  const handleDeleteContent = async (content: Content) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getContentTypeName = (type: ContentType) => {
    switch (type) {
      case ContentType.RECIPE:
        return 'Receta';
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
      case ContentType.TIP:
        return 'Consejo';
      case ContentType.GUIDE:
        return 'Guía';
      case ContentType.WELLNESS:
        return 'Bienestar';
      default:
        return 'Contenido';
    }
  };

  const getContentTypeColor = (type: ContentType) => {
    switch (type) {
      case ContentType.RECIPE:
        return 'bg-green-100 text-green-800';
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
      case ContentType.TIP:
        return 'bg-orange-100 text-orange-800';
      case ContentType.GUIDE:
        return 'bg-indigo-100 text-indigo-800';
      case ContentType.WELLNESS:
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
            <option value={ContentType.RECIPE}>Receta</option>
            <option value={ContentType.NUTRITION}>Nutrición</option>
            <option value={ContentType.EXERCISE}>Ejercicio</option>
            <option value={ContentType.ARTICLE}>Artículo</option>
            <option value={ContentType.SELFCARE}>Autocuidado</option>
            <option value={ContentType.RECOMMENDATION}>Recomendación</option>
            <option value={ContentType.TIP}>Consejo</option>
            <option value={ContentType.GUIDE}>Guía</option>
            <option value={ContentType.WELLNESS}>Bienestar</option>
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
      <div className="overflow-x-auto">        
        <table className="neo-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Fase</th>
              <th>Etiquetas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contents.map((content) => (
              <tr key={content.id}>
                <td>
                  <div className="flex items-center">                    
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {content.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {content.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="text-sm text-gray-900" title={content.description}>
                    {content.description.length > 100 
                      ? content.description.substring(0, 100) + '...' 
                      : content.description}
                  </span>
                </td>
                <td>
                  <span className={`neo-badge ${getContentTypeColor(content.type).replace('bg-', 'neo-badge-').replace(' text-', '')}`}>
                    {getContentTypeName(content.type)}
                  </span>
                </td>
                <td className="text-sm text-gray-900">
                  {content.targetPhase || 'Todas'}
                </td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {content.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="neo-badge neo-badge-gray"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewContent(content)}
                      className="neo-button text-blue-600 hover:text-blue-900"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleEditContent(content)}
                      className="neo-button text-indigo-600 hover:text-indigo-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteContent(content)}
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
    </div>
  );
};

export default ContentTable; 