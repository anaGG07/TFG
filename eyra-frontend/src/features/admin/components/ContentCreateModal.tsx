// ! 01/06/2025 - Corregidos campos: summary → description, body → content
import React, { useState } from 'react';
import { Content, ContentType } from '../../../types/domain';
import { adminContentService } from '../../../services/adminContentService';
import NeoModal from '../../../components/ui/NeoModal';

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
    type: ContentType.NUTRITION,
    summary: '',
    body: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.title || !formData.type || !formData.summary || !formData.body) {
        throw new Error('Los campos título, tipo, resumen y contenido son obligatorios');
      }

      await adminContentService.createContent(formData);
      onSave();
      // Resetear el formulario
      setFormData({
        title: '',
        type: ContentType.NUTRITION,
        summary: '',
        body: '',
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
      type: ContentType.NUTRITION,
      summary: '',
      body: '',
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
    <NeoModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Crear Nuevo Contenido"
      loading={loading}
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="neo-button"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="content-create-form"
            disabled={loading}
            className="neo-button neo-button-primary"
          >
            {loading ? 'Creando...' : 'Crear Contenido'}
          </button>
        </>
      }
    >
      <form id="content-create-form" onSubmit={handleSubmit} className="neo-modal-content space-y-6">
        {error && (
          <div className="neo-alert neo-alert-danger">{error}</div>
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
            <option value={ContentType.NUTRITION}>Nutrición</option>
            <option value={ContentType.EXERCISE}>Ejercicio</option>
            <option value={ContentType.ARTICLE}>Artículo</option>
            <option value={ContentType.SELFCARE}>Autocuidado</option>
            <option value={ContentType.RECOMMENDATION}>Recomendación</option>
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
        {/* Resumen */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resumen
          </label>
          <textarea
            value={formData.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
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
            value={formData.body}
            onChange={(e) => handleChange('body', e.target.value)}
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
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleTagKeyPress}
              className="neo-input flex-1"
              placeholder="Añadir etiqueta..."
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleAddTag}
              disabled={loading}
              className="neo-button"
            >
              Añadir
            </button>
          </div>
          {/* Lista de etiquetas */}
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags?.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  disabled={loading}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* URL de la Imagen */}
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
      </form>
    </NeoModal>
  );
};

export default ContentCreateModal; 