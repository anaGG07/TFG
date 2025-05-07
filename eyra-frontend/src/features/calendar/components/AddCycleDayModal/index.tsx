import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';

interface CycleDayFormData {
  date: string;
  hasPeriod: boolean;
  flowIntensity?: number;
  hasPain: boolean;
  painLevel?: number;
  symptoms: string[];
  mood: string[];
  notes: string;
}

interface AddCycleDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CycleDayFormData) => void;
  date: Date;
  initialData?: Partial<CycleDayFormData>;
}

const symptomOptions = [
  'Dolor de cabeza',
  'Náuseas',
  'Fatiga',
  'Hinchazón',
  'Sensibilidad en los senos',
  'Cambios de apetito',
  'Insomnio',
  'Acné',
  'Mareos',
  'Diarrea',
  'Estreñimiento'
];

const moodOptions = [
  'Feliz',
  'Tranquila',
  'Ansiosa',
  'Irritable',
  'Triste',
  'Energética',
  'Sensible',
  'Emocionalmente estable',
  'Estresada',
  'Concentrada',
  'Distraída'
];

export const AddCycleDayModal: React.FC<AddCycleDayModalProps> = ({
  isOpen,
  onClose,
  onSave,
  date,
  initialData = {}
}) => {
  const [formData, setFormData] = useState<CycleDayFormData>({
    date: date.toISOString().split('T')[0],
    hasPeriod: initialData.hasPeriod || false,
    flowIntensity: initialData.flowIntensity || 0,
    hasPain: initialData.hasPain || false,
    painLevel: initialData.painLevel || 0,
    symptoms: initialData.symptoms || [],
    mood: initialData.mood || [],
    notes: initialData.notes || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  const handleSymptomChange = (symptom: string) => {
    setFormData(prev => {
      if (prev.symptoms.includes(symptom)) {
        return { ...prev, symptoms: prev.symptoms.filter(s => s !== symptom) };
      } else {
        return { ...prev, symptoms: [...prev.symptoms, symptom] };
      }
    });
  };

  const handleMoodChange = (mood: string) => {
    setFormData(prev => {
      if (prev.mood.includes(mood)) {
        return { ...prev, mood: prev.mood.filter(m => m !== mood) };
      } else {
        return { ...prev, mood: [...prev.mood, mood] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif text-eyraRed">
              {initialData.date ? 'Editar día' : 'Añadir día'} - {date.toLocaleDateString('es', { day: 'numeric', month: 'long' })}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Periodo menstrual */}
            <div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="hasPeriod"
                  name="hasPeriod"
                  checked={formData.hasPeriod}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-eyraRed rounded border-gray-300 focus:ring-eyraRed"
                />
                <label htmlFor="hasPeriod" className="ml-2 font-medium">
                  Período menstrual
                </label>
              </div>

              {formData.hasPeriod && (
                <div className="ml-7 mt-3">
                  <label htmlFor="flowIntensity" className="block mb-1 label-text">
                    Intensidad del flujo: {formData.flowIntensity}
                  </label>
                  <input
                    type="range"
                    id="flowIntensity"
                    name="flowIntensity"
                    min="1"
                    max="5"
                    value={formData.flowIntensity}
                    onChange={handleRangeChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Leve</span>
                    <span>Moderado</span>
                    <span>Intenso</span>
                  </div>
                </div>
              )}
            </div>

            {/* Dolor */}
            <div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="hasPain"
                  name="hasPain"
                  checked={formData.hasPain}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-eyraRed rounded border-gray-300 focus:ring-eyraRed"
                />
                <label htmlFor="hasPain" className="ml-2 font-medium">
                  Dolor o molestias
                </label>
              </div>

              {formData.hasPain && (
                <div className="ml-7 mt-3">
                  <label htmlFor="painLevel" className="block mb-1 label-text">
                    Nivel de dolor: {formData.painLevel}
                  </label>
                  <input
                    type="range"
                    id="painLevel"
                    name="painLevel"
                    min="1"
                    max="10"
                    value={formData.painLevel}
                    onChange={handleRangeChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Leve</span>
                    <span>Moderado</span>
                    <span>Severo</span>
                  </div>
                </div>
              )}
            </div>

            {/* Síntomas */}
            <div>
              <label className="block mb-2 font-medium">
                Síntomas
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {symptomOptions.map(symptom => (
                  <div key={symptom} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`symptom-${symptom}`}
                      checked={formData.symptoms.includes(symptom)}
                      onChange={() => handleSymptomChange(symptom)}
                      className="h-4 w-4 text-eyraRed rounded border-gray-300 focus:ring-eyraRed"
                    />
                    <label htmlFor={`symptom-${symptom}`} className="ml-2 text-sm">
                      {symptom}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Estado de ánimo */}
            <div>
              <label className="block mb-2 font-medium">
                Estado de ánimo
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {moodOptions.map(mood => (
                  <div key={mood} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`mood-${mood}`}
                      checked={formData.mood.includes(mood)}
                      onChange={() => handleMoodChange(mood)}
                      className="h-4 w-4 text-eyraRed rounded border-gray-300 focus:ring-eyraRed"
                    />
                    <label htmlFor={`mood-${mood}`} className="ml-2 text-sm">
                      {mood}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Notas */}
            <div>
              <label htmlFor="notes" className="block mb-2 font-medium">
                Notas
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-eyraRed focus:border-eyraRed"
                placeholder="Añade cualquier observación o nota personal..."
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="button-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="button-primary"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
