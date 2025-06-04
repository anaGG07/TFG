// ! 01/06/2025 - Corregidos campos: summary → description, body → content y enum actualizado
import React from 'react';
import { Content, ContentType } from '../../../types/domain';

interface ContentViewModalProps {
  content: Content;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

const ContentViewModal: React.FC<ContentViewModalProps> = ({
  content,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="neo-modal max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="neo-modal-header flex items-center justify-between">
          <h2 className="text-2xl font-serif text-[#b91c1c]">
            Detalles del Contenido: {content.title}
          </h2>
          <button
            onClick={onClose}
            className="neo-button text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="neo-modal-content space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="neo-card text-center">
              <div className="text-2xl mb-2">
                <span className={`neo-avatar inline-flex p-2 ${getContentTypeColor(content.type)}`}>
                  {content.title.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-sm font-medium text-gray-700">Tipo</div>
              <div className={`text-sm ${getContentTypeColor(content.type)}`}>
                {getContentTypeName(content.type)}
              </div>
            </div>

            <div className="neo-card text-center">
              <div className="text-2xl mb-2">📅</div>
              <div className="text-sm font-medium text-gray-700">Fase del Ciclo</div>
              <div className="text-sm text-gray-600">
                {content.targetPhase || 'Todas las fases'}
              </div>
            </div>

            <div className="neo-card text-center">
              <div className="text-2xl mb-2">🏷️</div>
              <div className="text-sm font-medium text-gray-700">Etiquetas</div>
              <div className="flex flex-wrap justify-center gap-1 mt-1">
                {content.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="neo-badge neo-badge-gray"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <div className="neo-card">
              <p className="text-gray-900 leading-relaxed">
                {content.description}
              </p>
            </div>
          </div>

          {/* Contenido completo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido
            </label>
            <div className="neo-card">
              <div className="prose max-w-none">
                {content.content}
              </div>
            </div>
          </div>

          {/* Imagen (si existe) */}
          {content.imageUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen
              </label>
              <div className="neo-card">
                <img
                  src={content.imageUrl}
                  alt={content.title}
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="neo-modal-footer flex justify-end space-x-3">
            <button
              onClick={onEdit}
              className="neo-button neo-button-primary"
            >
              Editar
            </button>
            <button
              onClick={onClose}
              className="neo-button"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentViewModal; 