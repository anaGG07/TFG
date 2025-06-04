// ! 01/06/2025 - Modal para editar condición médica en administración
// ! 01/06/2025 - Basado en el patrón de UserEditModal para consistencia

import React, { useState, useEffect } from 'react';
import { Condition, ConditionUpdateData } from '../../../types/condition';
import { adminConditionService } from '../../../services/adminConditionService';

interface ConditionEditModalProps {
  condition: Condition;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface FormData {
  name: string;
  description: string;
  isChronic: boolean;
  state: boolean;
}

const ConditionEditModal: React.FC<ConditionEditModalProps> = ({ 
  condition, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [formData, setFormData] = React.useState<FormData>({
    name: condition?.name || '',
    description: condition?.description || '',
    isChronic: condition?.isChronic || false,
    state: condition?.state || false
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Cargar datos de la condición cuando se abre el modal
  useEffect(() => {
    if (isOpen && condition) {
      setFormData({
        name: condition.name,
        description: condition.description,
        isChronic: condition.isChronic,
        state: condition.state,
      });
      setError(null);
    }
  }, [isOpen, condition]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validaciones básicas
      if (!formData.name?.trim()) {
        throw new Error('El nombre de la condición es obligatorio');
      }

      if (!formData.description?.trim()) {
        throw new Error('La descripción de la condición es obligatoria');
      }

      if (formData.name.length < 3) {
        throw new Error('El nombre debe tener al menos 3 caracteres');
      }

      if (formData.description.length < 10) {
        throw new Error('La descripción debe tener al menos 10 caracteres');
      }

      // Actualizar condición
      await adminConditionService.updateCondition(condition.id.toString(), {
        name: formData.name.trim(),
        description: formData.description.trim(),
        isChronic: formData.isChronic,
        state: formData.state,
      });

      onSave();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar condición médica');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="neo-modal">
      <div className="neo-modal-header">
        <h2 className="text-xl font-semibold text-gray-900">
          Editar Condición
        </h2>
        <button
          onClick={handleClose}
          className="neo-button"
        >
          ×
        </button>
      </div>

      <div className="neo-modal-content">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información de identificación */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Información de la Condición
            </h3>
            <div className="text-sm text-gray-600">
              <p><span className="font-medium">ID:</span> {condition.id}</p>
              <p><span className="font-medium">Creada:</span> {new Date(condition.createdAt).toLocaleDateString('es-ES')}</p>
              {condition.updatedAt && (
                <p><span className="font-medium">Última actualización:</span> {new Date(condition.updatedAt).toLocaleDateString('es-ES')}</p>
              )}
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="neo-input w-full"
              placeholder="Nombre de la condición"
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="neo-input w-full"
              placeholder="Descripción detallada de la condición"
            />
          </div>

          {/* Tipo y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="isChronic" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                id="isChronic"
                name="isChronic"
                value={formData.isChronic ? 'true' : 'false'}
                onChange={handleChange}
                required
                className="neo-select w-full"
              >
                <option value="true">Crónica</option>
                <option value="false">Aguda</option>
              </select>
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="state"
                name="state"
                value={formData.state ? 'true' : 'false'}
                onChange={handleChange}
                required
                className="neo-select w-full"
              >
                <option value="true">Activa</option>
                <option value="false">Inactiva</option>
              </select>
            </div>
          </div>

          {/* Mensajes de error */}
          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}
        </form>
      </div>

      <div className="neo-modal-footer">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="neo-button neo-button-primary"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Guardando...
            </div>
          ) : (
            'Guardar'
          )}
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
    </div>
  );
};

export default ConditionEditModal;
