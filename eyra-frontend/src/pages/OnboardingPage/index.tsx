import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../router/paths';
import { useAuth } from '../../context/AuthContext';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    genderIdentity: '',
    isPersonal: true,
    lastPeriodDate: '',
    commonSymptoms: [] as string[],
    accessCode: '',
    receiveRecommendations: false,
    receiveAlerts: false
  });
  const [allFieldsCompleted, setAllFieldsCompleted] = useState(false);
  
  // Validar si todos los campos obligatorios están completos
  const validateFields = () => {
    const requiredFields = ['genderIdentity', 'lastPeriodDate'];
    const completed = requiredFields.every(field => 
      formData[field as keyof typeof formData] !== ''
    );
    setAllFieldsCompleted(completed);
    return completed;
  };

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Validar después de cualquier cambio
    setTimeout(validateFields, 0);
  };

  // Manejar selección de síntomas
  const handleSymptomToggle = (symptom: string) => {
    const updatedSymptoms = formData.commonSymptoms.includes(symptom)
      ? formData.commonSymptoms.filter(s => s !== symptom)
      : [...formData.commonSymptoms, symptom];
    
    setFormData({
      ...formData,
      commonSymptoms: updatedSymptoms
    });
  };

  // Avanzar al siguiente paso
  const handleNext = () => {
    if (validateFields()) {
      setStep(step + 1);
    }
  };

  // Finalizar onboarding
  const handleFinish = async () => {
    try {
      // Completar onboarding con los datos del formulario
      await completeOnboarding({
        genderIdentity: formData.genderIdentity,
        lastPeriodDate: formData.lastPeriodDate,
        commonSymptoms: formData.commonSymptoms,
        receiveRecommendations: formData.receiveRecommendations,
        receiveAlerts: formData.receiveAlerts,
      });
      
      // Redirigir al dashboard
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.error('Error al completar onboarding:', error);
      // Se podría mostrar un mensaje de error aquí
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8e9ea] to-[#f5dfc4] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-xl">
        <h1 className="text-3xl font-serif text-[#5b0108] text-center mb-6">Completa tu perfil</h1>
        
        {step === 1 && (
          <div className="space-y-6">
            <p className="text-[#300808] mb-8 text-center">
              Personalicemos tu experiencia para que EYRA se adapte mejor a ti
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[#300808] mb-2 font-medium">
                  ¿Cómo te identificas?
                </label>
                <select
                  name="genderIdentity"
                  value={formData.genderIdentity}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
                  required
                >
                  <option value="">Selecciona una opción</option>
                  <option value="woman">Mujer (con ciclo menstrual)</option>
                  <option value="trans">Persona en transición de género</option>
                  <option value="intersex">Persona intersexual</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[#300808] mb-2 font-medium">
                  ¿Usarás EYRA para ti o para acompañar a alguien?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isPersonal"
                      checked={formData.isPersonal}
                      onChange={() => setFormData({...formData, isPersonal: true})}
                      className="mr-2"
                    />
                    <span>Para mí</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isPersonal"
                      checked={!formData.isPersonal}
                      onChange={() => setFormData({...formData, isPersonal: false})}
                      className="mr-2"
                    />
                    <span>Para acompañar</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-[#300808] mb-2 font-medium">
                  Fecha de tu último periodo (si aplica)
                </label>
                <input
                  type="date"
                  name="lastPeriodDate"
                  value={formData.lastPeriodDate}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
                  required
                />
              </div>
              
              <div>
                <label className="block text-[#300808] mb-2 font-medium">
                  Código de acceso (si es limitado/invitación)
                </label>
                <input
                  type="text"
                  name="accessCode"
                  value={formData.accessCode}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
                  placeholder="Opcional"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-8">
              <button
                onClick={handleNext}
                disabled={!allFieldsCompleted}
                className="px-8 py-3 bg-[#5b0108] text-white rounded-lg font-medium transition-all hover:bg-[#9d0d0b] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-6">
            <p className="text-[#300808] mb-8 text-center">
              Selecciona los síntomas más comunes que experimentas
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                'Dolor de cabeza', 'Cansancio', 'Dolor abdominal', 'Cambios de humor',
                'Sensibilidad en los senos', 'Acné', 'Antojos', 'Hinchazón',
                'Insomnio', 'Náuseas', 'Mareos', 'Ansiedad'
              ].map((symptom) => (
                <label key={symptom} className="flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-[#5b010810]">
                  <input
                    type="checkbox"
                    checked={formData.commonSymptoms.includes(symptom)}
                    onChange={() => handleSymptomToggle(symptom)}
                    className="mr-3"
                  />
                  <span>{symptom}</span>
                </label>
              ))}
            </div>
            
            <div className="space-y-4 mt-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="receiveRecommendations"
                  name="receiveRecommendations"
                  checked={formData.receiveRecommendations}
                  onChange={handleChange}
                  className="mr-3"
                />
                <label htmlFor="receiveRecommendations">
                  Quiero recibir recomendaciones hormonales personalizadas
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="receiveAlerts"
                  name="receiveAlerts"
                  checked={formData.receiveAlerts}
                  onChange={handleChange}
                  className="mr-3"
                />
                <label htmlFor="receiveAlerts">
                  Quiero recibir alertas y notificaciones sobre mi ciclo
                </label>
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(1)}
                className="px-8 py-3 border border-[#5b0108] text-[#5b0108] rounded-lg font-medium transition-all hover:bg-[#5b010810]"
              >
                Atrás
              </button>
              <button
                onClick={handleFinish}
                className="px-8 py-3 bg-[#5b0108] text-white rounded-lg font-medium transition-all hover:bg-[#9d0d0b]"
              >
                Completar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;