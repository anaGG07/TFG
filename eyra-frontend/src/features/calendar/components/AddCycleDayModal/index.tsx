import { useState, useEffect } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { useCycle } from '../../../../context/CycleContext';
import { CyclePhase } from '../../../../types/domain';

interface AddCycleDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
}

export const AddCycleDayModal = ({ isOpen, onClose, selectedDate }: AddCycleDayModalProps) => {
  const { addCycleDay, startNewCycle } = useCycle();
  const [isNewCycle, setIsNewCycle] = useState(false);
  const [flowIntensity, setFlowIntensity] = useState<number>(0);
  const [phase, setPhase] = useState<CyclePhase>(CyclePhase.MENSTRUAL);
  const [mood, setMood] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Resetear formulario cuando cambia la fecha seleccionada
  useEffect(() => {
    if (selectedDate) {
      // Si es el primer día de un nuevo ciclo menstrual por defecto
      const isFirstDayOfCycle = flowIntensity > 0 && phase === CyclePhase.MENSTRUAL;
      setIsNewCycle(isFirstDayOfCycle);
    }
  }, [selectedDate, flowIntensity, phase]);

  // Opciones de síntomas comunes
  const symptomOptions = [
    'Dolor abdominal', 'Dolor de cabeza', 'Fatiga', 'Náuseas', 
    'Sensibilidad en los senos', 'Hinchazón', 'Acné', 'Antojos',
    'Diarrea', 'Estreñimiento', 'Cambios en el apetito'
  ];

  // Opciones de estados de ánimo
  const moodOptions = [
    'Irritable', 'Ansiosa', 'Deprimida', 'Feliz', 
    'Tranquila', 'Enérgica', 'Sensible', 'Cansada',
    'Motivada', 'Distraída', 'Creativa'
  ];

  // Manejar cambios en síntomas
  const handleSymptomChange = (symptom: string) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };

  // Manejar cambios en estado de ánimo
  const handleMoodChange = (moodItem: string) => {
    if (mood.includes(moodItem)) {
      setMood(mood.filter(m => m !== moodItem));
    } else {
      setMood([...mood, moodItem]);
    }
  };

  // Guardar la información
  const handleSave = async () => {
    if (!selectedDate) return;

    setIsLoading(true);
    try {
      if (isNewCycle) {
        // Iniciar un nuevo ciclo
        await startNewCycle({
          startDate: selectedDate.toISOString().split('T')[0],
          flowIntensity,
          phase,
          mood,
          symptoms,
          notes
        });
      } else {
        // Añadir información a un día del ciclo existente
        await addCycleDay({
          date: selectedDate.toISOString().split('T')[0],
          flowIntensity,
          phase,
          mood,
          symptoms,
          notes
        });
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar información:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={selectedDate 
        ? `Información para ${selectedDate.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}`
        : 'Añadir información'
      }
    >
      <div className="space-y-6">
        {/* Selector de fase */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fase del ciclo
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`px-4 py-2 border rounded-md ${phase === CyclePhase.MENSTRUAL ? 'bg-red-100 border-red-500' : 'bg-white border-gray-300'}`}
              onClick={() => setPhase(CyclePhase.MENSTRUAL)}
            >
              Menstrual
            </button>
            <button
              type="button"
              className={`px-4 py-2 border rounded-md ${phase === CyclePhase.FOLICULAR ? 'bg-yellow-100 border-yellow-500' : 'bg-white border-gray-300'}`}
              onClick={() => setPhase(CyclePhase.FOLICULAR)}
            >
              Folicular
            </button>
            <button
              type="button"
              className={`px-4 py-2 border rounded-md ${phase === CyclePhase.OVULACION ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'}`}
              onClick={() => setPhase(CyclePhase.OVULACION)}
            >
              Ovulación
            </button>
            <button
              type="button"
              className={`px-4 py-2 border rounded-md ${phase === CyclePhase.LUTEA ? 'bg-green-100 border-green-500' : 'bg-white border-gray-300'}`}
              onClick={() => setPhase(CyclePhase.LUTEA)}
            >
              Lútea
            </button>
          </div>
        </div>

        {/* Intensidad del flujo (solo visible para fase menstrual) */}
        {phase === CyclePhase.MENSTRUAL && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intensidad del flujo
            </label>
            <div className="flex space-x-3">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    flowIntensity >= level ? 'bg-red-500 text-white' : 'bg-gray-200'
                  }`}
                  onClick={() => setFlowIntensity(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Inicio de nuevo ciclo (checkbox) */}
        {phase === CyclePhase.MENSTRUAL && flowIntensity > 0 && (
          <div className="flex items-center">
            <input
              id="new-cycle"
              type="checkbox"
              className="h-4 w-4 text-purple-600 rounded border-gray-300"
              checked={isNewCycle}
              onChange={(e) => setIsNewCycle(e.target.checked)}
            />
            <label htmlFor="new-cycle" className="ml-2 block text-sm text-gray-700">
              Este es el primer día de mi periodo (inicia un nuevo ciclo)
            </label>
          </div>
        )}

        {/* Selector de síntomas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Síntomas
          </label>
          <div className="grid grid-cols-2 gap-2">
            {symptomOptions.map((symptom) => (
              <div key={symptom} className="flex items-center">
                <input
                  id={`symptom-${symptom}`}
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 rounded border-gray-300"
                  checked={symptoms.includes(symptom)}
                  onChange={() => handleSymptomChange(symptom)}
                />
                <label htmlFor={`symptom-${symptom}`} className="ml-2 block text-sm text-gray-700">
                  {symptom}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Selector de estado de ánimo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado de ánimo
          </label>
          <div className="flex flex-wrap gap-2">
            {moodOptions.map((moodItem) => (
              <button
                key={moodItem}
                type="button"
                className={`px-3 py-1 rounded-full text-sm ${
                  mood.includes(moodItem)
                    ? 'bg-purple-100 text-purple-800 border border-purple-300'
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}
                onClick={() => handleMoodChange(moodItem)}
              >
                {moodItem}
              </button>
            ))}
          </div>
        </div>

        {/* Notas */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notas adicionales
          </label>
          <textarea
            id="notes"
            rows={3}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="Escribe aquí cualquier observación..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3">
          <Button
            variant="light"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            loading={isLoading}
          >
            Guardar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
