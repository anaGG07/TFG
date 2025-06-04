// ! 01/06/2025 - Corregidos campos: summary → description, body → content
import React, { useState } from 'react';
import { Content, ContentType } from '../../../types/domain';
import { adminContentService } from '../../../services/adminContentService';
import '../../../styles/neomorphic.css';

interface ContentCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const ContentCreateModal: React.FC<ContentCreateModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Omit<Content, 'id'>>({
    title: '',
    type: ContentType.RECIPE,
    description: '',
    content: '',
    targetPhase: undefined,
    tags: [],
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');

  const handleChange = (field: keyof Content, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.title || !formData.type || !formData.description || !formData.content) {
        throw new Error('Los campos título, tipo, descripción y contenido son obligatorios');
      }

      await adminContentService.createContent(formData);
      onSave();
      // Resetear el formulario
      setFormData({
        title: '',
        type: ContentType.RECIPE,
        description: '',
        content: '',
        targetPhase: undefined,
        tags: [],
        imageUrl: '',
      });
    } catch (err: any) {
      setError(err.message || 'Error al crear el contenido');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      type: ContentType.RECIPE,
      description: '',
      content: '',
      targetPhase: undefined,
      tags: [],
      imageUrl: '',
    });
    setError(null);
    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="neo-modal max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="neo-modal-header flex items-center justify-between">
          <h2 className="text-2xl font-serif text-[#b91c1c]">
            Crear Nuevo Contenido
          </h2>
          <button
            onClick={handleClose}
            className="neo-button text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="neo-modal-content space-y-6">
          {error && (
            <div className="neo-alert neo-alert-danger">
              {error}
            </div>
          )}

          {/* Tipo de contenido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Contenido
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value as ContentType)}
              className="neo-select w-full"
              required
              disabled={loading}
            >
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

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="neo-input w-full"
              required
              disabled={loading}
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="neo-input w-full h-24"
              required
              disabled={loading}
            />
          </div>

          {/* Contenido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              className="neo-input w-full h-64"
              required
              disabled={loading}
            />
          </div>

          {/* Fase del ciclo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fase del Ciclo
            </label>
            <select
              value={formData.targetPhase || ''}
              onChange={(e) => handleChange('targetPhase', e.target.value || null)}
              className="neo-select w-full"
              disabled={loading}
            >
              <option value="">Todas las fases</option>
              <option value="menstrual">Menstrual</option>
              <option value="folicular">Folicular</option>
              <option value="ovulacion">Ovulación</option>
              <option value="lutea">Lútea</option>
            </select>
          </div>

          {/* Etiquetas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiquetas
            </label>
            <div className="neo-card p-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="neo-badge neo-badge-gray flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="text-gray-500 hover:text-gray-700"
                      disabled={loading}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Añadir etiqueta..."
                  className="neo-input flex-1"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="neo-button"
                  disabled={loading || !newTag.trim()}
                >
                  Añadir
                </button>
              </div>
            </div>
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de la Imagen
            </label>
            <input
              type="url"
              value={formData.imageUrl || ''}
              onChange={(e) => handleChange('imageUrl', e.target.value || null)}
              className="neo-input w-full"
              placeholder="https://..."
              disabled={loading}
            />
          </div>

          {/* Footer */}
          <div className="neo-modal-footer flex justify-end space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="neo-button neo-button-primary"
            >
              {loading ? 'Creando...' : 'Crear Contenido'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="neo-button"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentCreateModal; 