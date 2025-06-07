// ! 01/06/2025 - Modal para crear nueva condición médica en administración
// ! 01/06/2025 - Basado en el patrón de UserCreateModal para consistencia

import React, { useState } from 'react';
import { ConditionCreateData } from '../../../types/condition';
import { adminConditionService } from '../../../services/adminConditionService';
import NeoModal from '../../../components/ui/NeoModal';

interface ConditionCreateModalProps {
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

const ConditionCreateModal: React.FC<ConditionCreateModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    isChronic: false,
    state: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      isChronic: false,
      state: true,
    });
    setError(null);
  };

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
      if (!formData.name.trim()) {
        throw new Error('El nombre de la condición es obligatorio');
      }

      if (!formData.description.trim()) {
        throw new Error('La descripción de la condición es obligatoria');
      }

      if (formData.name.length < 3) {
        throw new Error('El nombre debe tener al menos 3 caracteres');
      }

      if (formData.description.length < 10) {
        throw new Error('La descripción debe tener al menos 10 caracteres');
      }

      // Crear condición
      await adminConditionService.createCondition({
        name: formData.name.trim(),
        description: formData.description.trim(),
        isChronic: formData.isChronic,
        state: formData.state,
      });

      resetForm();
      onSave();
    } catch (err: any) {
      setError(err.message || 'Error al crear condición médica');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <NeoModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nueva Condición"
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
            form="condition-create-form"
            disabled={loading}
            className="neo-button neo-button-primary"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creando...
              </div>
            ) : (
              'Crear'
            )}
          </button>
        </>
      }
    >
      <form id="condition-create-form" onSubmit={handleSubmit} className="space-y-6">
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
    </NeoModal>
  );
};

export default ConditionCreateModal;
