import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../router/paths';
import { useAuth } from '../context/AuthContext';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { ProfileType } from '../types/domain';

// Tipos de hormonas inferido de la entidad backend
enum HormoneType {
  ESTROGEN = 'estrogen',
  PROGESTERONE = 'progesterone',
  TESTOSTERONE = 'testosterone',
  LH = 'luteinizing_hormone',
  FSH = 'follicle_stimulating_hormone'
}

// Tipos de etapas de vida
type StageOfLife = 'menstrual' | 'pregnancy' | 'menopause' | 'hormonal';

// Interfaz para los datos del formulario de onboarding
interface OnboardingFormData {
  // Identidad
  profileType: ProfileType;
  genderIdentity: string;
  pronouns?: string;
  isPersonal: boolean;
  
  // Etapa de vida y propósito
  stageOfLife: StageOfLife;
  lastPeriodDate?: string;
  averageCycleLength?: number;
  averagePeriodLength?: number;
  hormoneType?: HormoneType;
  hormoneStartDate?: string;
  hormoneFrequencyDays?: number;
  
  // Preferencias
  receiveAlerts: boolean;
  receiveRecommendations: boolean;
  receiveCyclePhaseTips: boolean;
  receiveWorkoutSuggestions: boolean;
  receiveNutritionAdvice: boolean;
  shareCycleWithPartner: boolean;
  wantAICompanion: boolean;
  
  // Otros
  healthConcerns: string[];
  accessCode?: string;
  allowParentalMonitoring: boolean;
  commonSymptoms: string[];
}

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Usando react-hook-form para gestionar los datos del formulario
  const { register, control, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm<OnboardingFormData>({
    defaultValues: {
      // Identidad
      profileType: ProfileType.WOMEN,
      genderIdentity: '',
      pronouns: '',
      isPersonal: true,
      
      // Etapa de vida y propósito
      stageOfLife: 'menstrual',
      lastPeriodDate: '',
      averageCycleLength: 28,
      averagePeriodLength: 5,
      
      // Preferencias
      receiveAlerts: true,
      receiveRecommendations: true,
      receiveCyclePhaseTips: true,
      receiveWorkoutSuggestions: true,
      receiveNutritionAdvice: true,
      shareCycleWithPartner: false,
      wantAICompanion: true,
      
      // Otros
      healthConcerns: [],
      accessCode: '',
      allowParentalMonitoring: false,
      commonSymptoms: []
    },
    mode: 'onChange'
  });

  // Observar valores para lógica condicional
  const watchProfileType = watch('profileType');
  const watchIsPersonal = watch('isPersonal');
  const watchStageOfLife = watch('stageOfLife');

  // Si el usuario ya completó el onboarding, redirigir al dashboard
  useEffect(() => {
    if (user?.onboardingCompleted) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [user, navigate]);

  // Lista de síntomas comunes para seleccionar
  const commonSymptomsList = [
    'Dolor de cabeza', 'Cansancio', 'Dolor abdominal', 'Cambios de humor',
    'Sensibilidad en los senos', 'Acné', 'Antojos', 'Hinchazón',
    'Insomnio', 'Náuseas', 'Mareos', 'Ansiedad'
  ];

  // Lista de problemas de salud para seleccionar
  const healthConcernsList = [
    'Síndrome de ovario poliquístico', 'Endometriosis', 'Migrañas menstruales',
    'Anemia', 'Diabetes', 'Hipertensión', 'Problemas tiroideos', 'Fibromas',
    'Depresión', 'Ansiedad', 'Problema hormonal'
  ];

  // Manejar la selección de síntomas
  const handleSymptomToggle = (symptom: string) => {
    const currentSymptoms = watch('commonSymptoms');
    const updatedSymptoms = currentSymptoms.includes(symptom)
      ? currentSymptoms.filter(s => s !== symptom)
      : [...currentSymptoms, symptom];
    
    setValue('commonSymptoms', updatedSymptoms, { shouldValidate: true });
  };

  // Manejar la selección de problemas de salud
  const handleHealthConcernToggle = (concern: string) => {
    const currentConcerns = watch('healthConcerns');
    const updatedConcerns = currentConcerns.includes(concern)
      ? currentConcerns.filter(c => c !== concern)
      : [...currentConcerns, concern];
    
    setValue('healthConcerns', updatedConcerns, { shouldValidate: true });
  };

  // Avanzar al siguiente paso
  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  // Retroceder al paso anterior
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  // Procesar y enviar datos al backend de forma progresiva
  const saveOnboarding: SubmitHandler<OnboardingFormData> = async (data) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Si estamos completando el último paso, marcamos como completado
      const finalData = step === 5 ? { ...data, completed: true } : data;
      
      // Enviar datos al backend a través del servicio de autenticación
      const updatedUser = await completeOnboarding(finalData);
      console.log('Onboarding completado, usuario actualizado:', updatedUser);
      
      if (step < 5) {
        // Si no es el último paso, avanzamos al siguiente
        nextStep();
      } else {
        // Si es el último paso, verificamos que la autenticación se mantenga antes de redirigir
        if (updatedUser && updatedUser.onboardingCompleted) {
          console.log('Redirigiendo al dashboard con usuario autenticado:', updatedUser);
          // Usar timeout para garantizar que el estado se actualice completamente
          setTimeout(() => {
            navigate(ROUTES.DASHBOARD, { replace: true });
          }, 50);
        } else {
          console.warn('Usuario actualizado pero no marcado como onboarding completado');
          setError('Tu perfil se guardó pero ocurrió un error al completar el proceso. Por favor, contacta a soporte.');
        }
      }
    } catch (err) {
      console.error('Error al guardar datos de onboarding:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error al guardar tus datos. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8e9ea] to-[#f5dfc4] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-xl">
        <h1 className="text-3xl font-serif text-[#5b0108] text-center mb-6">Completa tu perfil</h1>
        
        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-[#5b0108] h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>
        
        {/* Mensajes de error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit(saveOnboarding)}>
          {/* Paso 1: Tipo de perfil */}
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
                  <Controller
                    name="profileType"
                    control={control}
                    rules={{ required: 'Este campo es obligatorio' }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
                      >
                        <option value={ProfileType.WOMEN}>Mujer</option>
                        <option value={ProfileType.TRANS}>Persona trans</option>
                        <option value={ProfileType.GUEST}>No binarie</option>
                        <option value={ProfileType.UNDERAGE}>Otro</option>
                      </select>
                    )}
                  />
                  {errors.profileType && (
                    <p className="text-red-500 text-sm mt-1">{errors.profileType.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-[#300808] mb-2 font-medium">
                    Identidad de género
                  </label>
                  <input
                    type="text"
                    {...register('genderIdentity', { required: 'Este campo es obligatorio' })}
                    className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
                    placeholder="Ej: Mujer, Hombre, No binario..."
                  />
                  {errors.genderIdentity && (
                    <p className="text-red-500 text-sm mt-1">{errors.genderIdentity.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-[#300808] mb-2 font-medium">
                    Pronombres (opcional)
                  </label>
                  <input
                    type="text"
                    {...register('pronouns')}
                    className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
                    placeholder="Ej: ella/ella, él/él, elle/elle..."
                  />
                </div>
                
                <div>
                  <label className="block text-[#300808] mb-2 font-medium">
                    ¿Usarás EYRA para ti o para acompañar a alguien?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register('isPersonal')}
                        value="true"
                        checked={watchIsPersonal === true}
                        onChange={() => setValue('isPersonal', true)}
                        className="mr-2"
                      />
                      <span>Para mí</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register('isPersonal')}
                        value="false"
                        checked={watchIsPersonal === false}
                        onChange={() => setValue('isPersonal', false)}
                        className="mr-2"
                      />
                      <span>Para acompañar</span>
                    </label>
                  </div>
                </div>
                
                {/* Campos condicionales para monitorio parental */}
                {!watchIsPersonal && (
                  <>
                    <div>
                      <label className="block text-[#300808] mb-2 font-medium">
                        Código de acceso
                      </label>
                      <input
                        type="text"
                        {...register('accessCode')}
                        className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
                        placeholder="Código de acceso para monitoreo"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="allowParentalMonitoring"
                        {...register('allowParentalMonitoring')}
                        className="mr-3"
                      />
                      <label htmlFor="allowParentalMonitoring">
                        Permitir monitoreo parental
                      </label>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  onClick={() => nextStep()}
                  className="px-8 py-3 bg-[#5b0108] text-white rounded-lg font-medium transition-all hover:bg-[#9d0d0b]"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
          
          {/* Paso 2: Etapa de vida */}
          {step === 2 && (
            <div className="space-y-6">
              <p className="text-[#300808] mb-8 text-center">
                Cuéntanos sobre tu etapa vital actual
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[#300808] mb-2 font-medium">
                    ¿En qué etapa te encuentras?
                  </label>
                  <Controller
                    name="stageOfLife"
                    control={control}
                    rules={{ required: 'Este campo es obligatorio' }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
                      >
                        <option value="menstrual">Ciclo menstrual</option>
                        <option value="pregnancy">Embarazo</option>
                        <option value="menopause">Menopausia</option>
                        <option value="hormonal">Hormonación</option>
                      </select>
                    )}
                  />
                  {errors.stageOfLife && (
                    <p className="text-red-500 text-sm mt-1">{errors.stageOfLife.message}</p>
                  )}
                </div>
                
                {/* Campos específicos según la etapa de vida */}
                {watchStageOfLife === 'menstrual' && (
                  <>
                    <div>
                      <label className="block text-[#300808] mb-2 font-medium">
                        Fecha de tu último periodo
                      </label>
                      <input
                        type="date"
                        {...register('lastPeriodDate', { required: 'Este campo es obligatorio' })}
                        className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
                      />
                      {errors.lastPeriodDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastPeriodDate.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-[#300808] mb-2 font-medium">
                        Duración promedio de tu ciclo (días)
                      </label>
                      <input
                        type="number"
                        {...register('averageCycleLength', { 
                          required: 'Este campo es obligatorio',
                          min: { value: 20, message: 'Mínimo 20 días' },
                          max: { value: 40, message: 'Máximo 40 días' }
                        })}
                        className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
                      />
                      {errors.averageCycleLength && (
                        <p className="text-red-500 text-sm mt-1">{errors.averageCycleLength.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-[#300808] mb-2 font-medium">
                        Duración promedio de tu periodo (días)
                      </label>
                      <input
                        type="number"
                        {...register('averagePeriodLength', { 
                          required: 'Este campo es obligatorio',
                          min: { value: 1, message: 'Mínimo 1 día' },
                          max: { value: 10, message: 'Máximo 10 días' }
                        })}
                        className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
                      />
                      {errors.averagePeriodLength && (
                        <p className="text-red-500 text-sm mt-1">{errors.averagePeriodLength.message}</p>
                      )}
                    </div>
                  </>
                )}
                
                {watchStageOfLife === 'hormonal' && (
                  <>
                    <div>
                      <label className="block text-[#300808] mb-2 font-medium">
                        Tipo de hormonación
                      </label>
                      <Controller
                        name="hormoneType"
                        control={control}
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
                          >
                            <option value="">Selecciona una opción</option>
                            <option value={HormoneType.ESTROGEN}>Estrógeno</option>
                            <option value={HormoneType.PROGESTERONE}>Progesterona</option>
                            <option value={HormoneType.TESTOSTERONE}>Testosterona</option>
                            <option value={HormoneType.LH}>Hormona Luteinizante (LH)</option>
                            <option value={HormoneType.FSH}>Hormona Folículo Estimulante (FSH)</option>
                          </select>
                        )}
                      />
                      {errors.hormoneType && (
                        <p className="text-red-500 text-sm mt-1">{errors.hormoneType.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-[#300808] mb-2 font-medium">
                        Fecha de inicio de hormonación
                      </label>
                      <input
                        type="date"
                        {...register('hormoneStartDate', { required: 'Este campo es obligatorio' })}
                        className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
                      />
                      {errors.hormoneStartDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.hormoneStartDate.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-[#300808] mb-2 font-medium">
                        Frecuencia (días entre dosis)
                      </label>
                      <input
                        type="number"
                        {...register('hormoneFrequencyDays', { 
                          required: 'Este campo es obligatorio',
                          min: { value: 1, message: 'Mínimo 1 día' },
                          max: { value: 90, message: 'Máximo 90 días' }
                        })}
                        className="w-full bg-white border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108]"
                      />
                      {errors.hormoneFrequencyDays && (
                        <p className="text-red-500 text-sm mt-1">{errors.hormoneFrequencyDays.message}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => prevStep()}
                  className="px-8 py-3 border border-[#5b0108] text-[#5b0108] rounded-lg font-medium transition-all hover:bg-[#5b010810]"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={() => saveOnboarding(watch())}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-[#5b0108] text-white rounded-lg font-medium transition-all hover:bg-[#9d0d0b] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar y continuar'}
                </button>
              </div>
            </div>
          )}
          
          {/* Paso 3: Preferencias */}
          {step === 3 && (
            <div className="space-y-6">
              <p className="text-[#300808] mb-8 text-center">
                Personaliza tu experiencia con estas preferencias
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="receiveAlerts"
                    {...register('receiveAlerts')}
                    className="mr-3"
                  />
                  <label htmlFor="receiveAlerts">
                    Recibir alertas sobre mi ciclo
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="receiveRecommendations"
                    {...register('receiveRecommendations')}
                    className="mr-3"
                  />
                  <label htmlFor="receiveRecommendations">
                    Recibir recomendaciones personalizadas
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="receiveCyclePhaseTips"
                    {...register('receiveCyclePhaseTips')}
                    className="mr-3"
                  />
                  <label htmlFor="receiveCyclePhaseTips">
                    Recibir consejos según la fase de mi ciclo
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="receiveWorkoutSuggestions"
                    {...register('receiveWorkoutSuggestions')}
                    className="mr-3"
                  />
                  <label htmlFor="receiveWorkoutSuggestions">
                    Recibir sugerencias de ejercicios
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="receiveNutritionAdvice"
                    {...register('receiveNutritionAdvice')}
                    className="mr-3"
                  />
                  <label htmlFor="receiveNutritionAdvice">
                    Recibir consejos de nutrición
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="shareCycleWithPartner"
                    {...register('shareCycleWithPartner')}
                    className="mr-3"
                  />
                  <label htmlFor="shareCycleWithPartner">
                    Compartir mi ciclo con mi pareja
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="wantAICompanion"
                    {...register('wantAICompanion')}
                    className="mr-3"
                  />
                  <label htmlFor="wantAICompanion">
                    Quiero usar la IA médica como acompañante
                  </label>
                </div>
              </div>
              
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => prevStep()}
                  className="px-8 py-3 border border-[#5b0108] text-[#5b0108] rounded-lg font-medium transition-all hover:bg-[#5b010810]"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={() => saveOnboarding(watch())}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-[#5b0108] text-white rounded-lg font-medium transition-all hover:bg-[#9d0d0b] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar y continuar'}
                </button>
              </div>
            </div>
          )}
          
          {/* Paso 4: Salud - Síntomas comunes */}
          {step === 4 && (
            <div className="space-y-6">
              <p className="text-[#300808] mb-8 text-center">
                Selecciona los síntomas que experimentas con mayor frecuencia
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {commonSymptomsList.map((symptom) => (
                  <label key={symptom} className="flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-[#5b010810]">
                    <input
                      type="checkbox"
                      checked={watch('commonSymptoms').includes(symptom)}
                      onChange={() => handleSymptomToggle(symptom)}
                      className="mr-3"
                    />
                    <span>{symptom}</span>
                  </label>
                ))}
              </div>
              
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => prevStep()}
                  className="px-8 py-3 border border-[#5b0108] text-[#5b0108] rounded-lg font-medium transition-all hover:bg-[#5b010810]"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={() => saveOnboarding(watch())}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-[#5b0108] text-white rounded-lg font-medium transition-all hover:bg-[#9d0d0b] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar y continuar'}
                </button>
              </div>
            </div>
          )}
          
          {/* Paso 5: Salud - Problemas de salud */}
          {step === 5 && (
            <div className="space-y-6">
              <p className="text-[#300808] mb-8 text-center">
                ¿Tienes alguna condición o preocupación de salud que quieras que EYRA tenga en cuenta?
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {healthConcernsList.map((concern) => (
                  <label key={concern} className="flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-[#5b010810]">
                    <input
                      type="checkbox"
                      checked={watch('healthConcerns').includes(concern)}
                      onChange={() => handleHealthConcernToggle(concern)}
                      className="mr-3"
                    />
                    <span>{concern}</span>
                  </label>
                ))}
              </div>
              
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => prevStep()}
                  className="px-8 py-3 border border-[#5b0108] text-[#5b0108] rounded-lg font-medium transition-all hover:bg-[#5b010810]"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-[#5b0108] text-white rounded-lg font-medium transition-all hover:bg-[#9d0d0b] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Completando...' : 'Completar onboarding'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;