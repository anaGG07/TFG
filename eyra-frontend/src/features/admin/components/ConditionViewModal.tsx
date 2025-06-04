// ! 01/06/2025 - Modal para ver detalles de condición médica en administración
// ! 01/06/2025 - Basado en el patrón de UserViewModal para consistencia

import React from 'react';
import { Condition } from '../../../types/condition';
import { ContentType } from '../../../types/content';

interface ConditionViewModalProps {
  condition: Condition;
  categories: Record<string, Array<{
    id: string;
    title: string;
    summary: string;
    type: ContentType;
  }>>;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

const getCategoryName = (category: string): string => {
  const categoryNames: Record<string, string> = {
    nutrition: 'Nutrición',
    exercise: 'Ejercicios',
    article: 'Artículos',
    selfCare: 'Autocuidado',
    recommendation: 'Recomendaciones'
  };
  return categoryNames[category] || category;
};

const getContentTypeName = (type: ContentType): string => {
  const typeNames: Record<ContentType, string> = {
    nutrition: 'Nutrición',
    exercise: 'Ejercicio',
    article: 'Artículo',
    selfCare: 'Autocuidado',
    recommendation: 'Recomendación'
  };
  return typeNames[type];
};

const getContentTypeClass = (type: ContentType): string => {
  const typeClasses: Record<ContentType, string> = {
    nutrition: 'neo-badge-green',
    exercise: 'neo-badge-blue',
    article: 'neo-badge-purple',
    selfCare: 'neo-badge-pink',
    recommendation: 'neo-badge-yellow'
  };
  return typeClasses[type];
};

const formatDate = (date: string | null): string => {
  if (!date) return 'No disponible';
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ConditionViewModal: React.FC<ConditionViewModalProps> = ({ 
  condition, 
  categories,
  isOpen, 
  onClose, 
  onEdit 
}) => {
  // ! 01/06/2025 - Eliminada funcionalidad de categorías (no implementada en backend)

  if (!isOpen) return null;

  return (
    <div className="neo-modal">
      <div className="neo-modal-header">
        <h2 className="text-xl font-semibold text-gray-900">
          Detalles de la Condición
        </h2>
        <button
          onClick={onClose}
          className="neo-button"
        >
          ×
        </button>
      </div>

      <div className="neo-modal-content">
        {/* Información básica */}
        <div className="neo-card mb-6">
          <div className="flex items-center mb-4">
            <div className="neo-avatar h-12 w-12 bg-[#b91c1c] text-white flex items-center justify-center font-semibold text-lg">
              {condition.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                {condition.name}
              </h3>
              <p className="text-sm text-gray-500">
                ID: {condition.id}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <span className={`neo-badge ${
                condition.isChronic 
                  ? 'neo-badge-orange' 
                  : 'neo-badge-blue'
              }`}>
                {condition.isChronic ? 'Crónica' : 'Aguda'}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <span className={`neo-badge ${
                condition.state 
                  ? 'neo-badge-green' 
                  : 'neo-badge-red'
              }`}>
                {condition.state ? 'Activa' : 'Inactiva'}
              </span>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {condition.description}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Creación
              </label>
              <p className="text-sm text-gray-900">
                {formatDate(condition.createdAt)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Última Actualización
              </label>
              <p className="text-sm text-gray-900">
                {formatDate(condition.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Contenido relacionado */}
        {Object.keys(categories).length > 0 && (
          <div className="neo-card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Contenido Relacionado
            </h3>
            <div className="space-y-4">
              {Object.entries(categories).map(([category, items]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    {getCategoryName(category)}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                      <div key={item.id} className="neo-card">
                        <div className="flex items-center mb-2">
                          <span className={`neo-badge ${getContentTypeClass(item.type)}`}>
                            {getContentTypeName(item.type)}
                          </span>
                        </div>
                        <h5 className="text-sm font-medium text-gray-900 mb-1">
                          {item.title}
                        </h5>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {item.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="neo-modal-footer">
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
  );
};

export default ConditionViewModal;
