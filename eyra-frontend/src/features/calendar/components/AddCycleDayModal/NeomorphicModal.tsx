import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { X, Heart, Droplets, Frown, AlertCircle, FileText, Calendar } from 'lucide-react';
import { CyclePhase } from '../../../../types/domain';
import { phaseConfig } from '../../config/phaseConfig';

interface CycleDayFormData {
  date: string;
  hasPeriod: boolean;
  flowIntensity?: number;
  hasPain: boolean;
  painLevel?: number;
  symptoms: string[];
  mood: string[];
  notes: string;
  phase?: CyclePhase;
}

interface NeomorphicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CycleDayFormData) => void;
  date: Date;
  initialData?: Partial<CycleDayFormData>;
  currentPhase?: CyclePhase;
  nextPhaseDate?: Date;
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
  'Estreñimiento',
  'Dolor de espalda'
];

const moodOptions = [
  'Feliz',
  'Tranquila',
  'Ansiosa', 
  'Irritable',
  'Triste',
  'Energética',
  'Sensible',
  'Estable',
  'Estresada',
  'Concentrada',
  'Distraída',
  'Optimista'
];

// COMPONENTE NEOMORPHIC CHECKBOX
const NeomorphicCheckbox: React.FC<{
  checked: boolean;
  onChange: () => void;
  label: string;
  id: string;
  icon?: React.ReactNode;
}> = ({ checked, onChange, label, id, icon }) => (
  <motion.div
    className="relative"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <label
      htmlFor={id}
      className={`
        flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
        ${checked 
          ? 'bg-[#7a2323] text-[#e7e0d5] shadow-[inset_2px_2px_6px_rgba(122,35,35,0.3)]' 
          : 'bg-[#e7e0d5] text-[#7a2323] shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[1px_1px_4px_rgba(122,35,35,0.1)]'
        }
      `}
    >
      <div className={`
        w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200
        ${checked 
          ? 'bg-[#e7e0d5] shadow-[inset_1px_1px_3px_rgba(199,191,180,0.5)]' 
          : 'bg-[#f5f5f4] shadow-[1px_1px_3px_rgba(199,191,180,0.3),-1px_-1px_3px_rgba(255,255,255,0.7)]'
        }
      `}>
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-[#7a2323] text-xs"
          >
            ✓
          </motion.div>
        )}
      </div>
      
      {icon && (
        <div className={`${checked ? 'text-[#e7e0d5]' : 'text-[#7a2323]'} opacity-80`}>
          {icon}
        </div>
      )}
      
      <span className={`text-sm font-medium ${checked ? 'text-[#e7e0d5]' : 'text-[#7a2323]'}`}>
        {label}
      </span>
      
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
    </label>
  </motion.div>
);

// COMPONENTE NEOMORPHIC SLIDER
const NeomorphicSlider: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label: string;
  icon?: React.ReactNode;
}> = ({ value, onChange, min, max, label, icon }) => (
  <motion.div
    className="p-4 rounded-xl bg-[#e7e0d5] shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)]"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex items-center gap-2 mb-3">
      {icon && <div className="text-[#7a2323]">{icon}</div>}
      <span className="text-sm font-medium text-[#7a2323]">
        {label}: {value}
      </span>
    </div>
    
    <div className="relative">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="
          w-full h-2 bg-[#f5f5f4] rounded-full appearance-none cursor-pointer
          shadow-[inset_1px_1px_3px_rgba(199,191,180,0.4)]
          focus:outline-none focus:ring-2 focus:ring-[#7a2323] focus:ring-opacity-30
        "
        style={{
          background: `linear-gradient(to right, #7a2323 0%, #7a2323 ${((value - min) / (max - min)) * 100}%, #f5f5f4 ${((value - min) / (max - min)) * 100}%, #f5f5f4 100%)`
        }}
      />
      
      <div className="flex justify-between text-xs text-[#7a2323] opacity-60 mt-2">
        <span>Mín</span>
        <span>Medio</span>
        <span>Máx</span>
      </div>
    </div>
  </motion.div>
);

// COMPONENTE PRINCIPAL DEL MODAL
export const NeomorphicModal: React.FC<NeomorphicModalProps> = ({
  isOpen,
  onClose,
  onSave,
  date,
  initialData = {},
  currentPhase,
  nextPhaseDate
}) => {
  const [formData, setFormData] = useState<CycleDayFormData>({
    date: date.toISOString().split('T')[0],
    hasPeriod: initialData.hasPeriod || false,
    flowIntensity: initialData.flowIntensity || 1,
    hasPain: initialData.hasPain || false,
    painLevel: initialData.painLevel || 1,
    symptoms: initialData.symptoms || [],
    mood: initialData.mood || [],
    notes: initialData.notes || '',
    phase: initialData.phase || currentPhase
  });

  const [activeTab, setActiveTab] = useState<'period' | 'symptoms' | 'mood' | 'notes'>('period');

  // Actualizar formData cuando cambian los initialData
  useEffect(() => {
    if (isOpen) {
      setFormData({
        date: date.toISOString().split('T')[0],
        hasPeriod: initialData.hasPeriod || false,
        flowIntensity: initialData.flowIntensity || 1,
        hasPain: initialData.hasPain || false,
        painLevel: initialData.painLevel || 1,
        symptoms: initialData.symptoms || [],
        mood: initialData.mood || [],
        notes: initialData.notes || '',
        phase: initialData.phase || currentPhase
      });
      console.log('Modal abierto con datos:', {
        initialData,
        currentPhase,
        date: format(date, 'yyyy-MM-dd')
      });
    }
  }, [isOpen, initialData, date, currentPhase]);

  const handleSymptomChange = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleMoodChange = (mood: string) => {
    setFormData(prev => ({
      ...prev,
      mood: prev.mood.includes(mood)
        ? prev.mood.filter(m => m !== mood)
        : [...prev.mood, mood]
    }));
  };

  const handleSubmit = () => {
    console.log('Enviando datos del modal:', formData);
    onSave(formData);
    onClose();
  };

  const tabs = [
    { id: 'period' as const, label: 'Período', icon: <Droplets className="w-4 h-4" /> },
    { id: 'symptoms' as const, label: 'Síntomas', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'mood' as const, label: 'Ánimo', icon: <Heart className="w-4 h-4" /> },
    { id: 'notes' as const, label: 'Notas', icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          style={{
            background: 'rgba(122, 35, 35, 0.6)'
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="
              w-full max-w-2xl max-h-[90vh] overflow-hidden
              bg-gradient-to-br from-[#e7e0d5] to-[#d7d0c4] 
              rounded-3xl
              shadow-[15px_15px_30px_rgba(120,113,108,0.2),-15px_-15px_30px_rgba(255,255,255,0.9)]
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="relative p-6 border-b border-[#e7e0d5]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="
                    w-12 h-12 rounded-xl bg-[#e7e0d5] 
                    shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)]
                    flex items-center justify-center
                  ">
                    <Calendar className="w-6 h-6 text-[#7a2323]" />
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-serif text-[#7a2323] font-bold">
                      {initialData.date ? 'Editar día' : 'Añadir día'}
                    </h2>
                    <p className="text-sm text-[#7a2323] opacity-70 capitalize">
                      {format(date, "eeee, d 'de' MMMM", { locale: es })}
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="
                    w-10 h-10 rounded-xl bg-[#e7e0d5] text-[#7a2323]
                    shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)]
                    hover:shadow-[1px_1px_4px_rgba(122,35,35,0.15)]
                    flex items-center justify-center transition-all duration-200
                  "
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* INFORMACIÓN DE FASE */}
              {currentPhase && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl bg-[#e7e0d5] shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${phaseConfig[currentPhase].fullBackground} flex items-center justify-center`}>
                      {phaseConfig[currentPhase].icon(
                        currentPhase === CyclePhase.MENSTRUAL ? "#dc2626" :
                        currentPhase === CyclePhase.FOLICULAR ? "#059669" :
                        currentPhase === CyclePhase.OVULACION ? "#7c3aed" :
                        "#d97706"
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[#7a2323]">{phaseConfig[currentPhase].description}</p>
                      {nextPhaseDate && (
                        <p className="text-sm text-[#7a2323] opacity-70">
                          Próxima fase: {format(nextPhaseDate, "d 'de' MMMM", { locale: es })}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* TABS NAVIGATION */}
            <div className="px-6 pt-4">
              <div className="flex gap-2 p-1 rounded-xl bg-[#e7e0d5] shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)]">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300
                      ${activeTab === tab.id
                        ? 'bg-[#7a2323] text-[#e7e0d5] shadow-[2px_2px_8px_rgba(122,35,35,0.3)]'
                        : 'text-[#7a2323] hover:bg-[#f5ede6]'
                      }
                    `}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <AnimatePresence mode="wait">
                {activeTab === 'period' && (
                  <motion.div
                    key="period"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <NeomorphicCheckbox
                      checked={formData.hasPeriod}
                      onChange={() => setFormData(prev => ({ ...prev, hasPeriod: !prev.hasPeriod }))}
                      label="Período menstrual"
                      id="hasPeriod"
                      icon={<Droplets className="w-4 h-4" />}
                    />

                    {formData.hasPeriod && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <NeomorphicSlider
                          value={formData.flowIntensity || 1}
                          onChange={(value) => setFormData(prev => ({ ...prev, flowIntensity: value }))}
                          min={1}
                          max={5}
                          label="Intensidad del flujo"
                          icon={<Droplets className="w-4 h-4" />}
                        />
                      </motion.div>
                    )}

                    <NeomorphicCheckbox
                      checked={formData.hasPain}
                      onChange={() => setFormData(prev => ({ ...prev, hasPain: !prev.hasPain }))}
                      label="Dolor o molestias"
                      id="hasPain"
                      icon={<Frown className="w-4 h-4" />}
                    />

                    {formData.hasPain && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <NeomorphicSlider
                          value={formData.painLevel || 1}
                          onChange={(value) => setFormData(prev => ({ ...prev, painLevel: value }))}
                          min={1}
                          max={10}
                          label="Nivel de dolor"
                          icon={<Frown className="w-4 h-4" />}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'symptoms' && (
                  <motion.div
                    key="symptoms"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <h3 className="text-lg font-medium text-[#7a2323] mb-4">Selecciona tus síntomas</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {symptomOptions.map((symptom) => (
                        <NeomorphicCheckbox
                          key={symptom}
                          checked={formData.symptoms.includes(symptom)}
                          onChange={() => handleSymptomChange(symptom)}
                          label={symptom}
                          id={`symptom-${symptom}`}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'mood' && (
                  <motion.div
                    key="mood"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <h3 className="text-lg font-medium text-[#7a2323] mb-4">¿Cómo te sientes hoy?</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {moodOptions.map((mood) => (
                        <NeomorphicCheckbox
                          key={mood}
                          checked={formData.mood.includes(mood)}
                          onChange={() => handleMoodChange(mood)}
                          label={mood}
                          id={`mood-${mood}`}
                          icon={<Heart className="w-4 h-4" />}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'notes' && (
                  <motion.div
                    key="notes"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-medium text-[#7a2323] mb-4">Notas personales</h3>
                    <div className="p-4 rounded-xl bg-[#e7e0d5] shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)]">
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Añade cualquier observación o nota personal..."
                        rows={6}
                        className="
                          w-full bg-transparent text-[#7a2323] placeholder-[#7a2323] placeholder-opacity-50
                          resize-none focus:outline-none
                        "
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FOOTER */}
            <div className="p-6 border-t border-[#e7e0d5] flex gap-3 justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="
                  px-6 py-3 rounded-xl bg-[#e7e0d5] text-[#7a2323] font-medium
                  shadow-[inset_2px_2px_6px_rgba(199,191,180,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.7)]
                  hover:shadow-[1px_1px_4px_rgba(122,35,35,0.1)]
                  transition-all duration-200
                "
              >
                Cancelar
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="
                  px-6 py-3 rounded-xl bg-[#7a2323] text-[#e7e0d5] font-medium
                  shadow-[2px_2px_8px_rgba(122,35,35,0.3)]
                  hover:shadow-[4px_4px_12px_rgba(122,35,35,0.4)]
                  transition-all duration-200
                "
              >
                Guardar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
