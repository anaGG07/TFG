import { useCycle } from '../../../context/CycleContext';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { CyclePhase } from '../../../types/domain';

export const CurrentCycleSummary = () => {
  const { currentCycle, currentDay, nextCyclePrediction, startNewCycle, isLoading } = useCycle();

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es', { day: 'numeric', month: 'long' });
  };

  // Función para calcular días restantes
  const getDaysRemaining = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Descripción según la fase del ciclo
  const getPhaseDescription = (phase?: CyclePhase) => {
    if (!phase) return '';
    
    switch (phase) {
      case CyclePhase.MENSTRUAL:
        return 'Durante la fase menstrual, tu cuerpo elimina el revestimiento uterino. Es normal experimentar sangrado, cólicos y fatiga.';
      case CyclePhase.FOLICULAR:
        return 'En la fase folicular, tus hormonas estimulan el crecimiento de folículos ováricos. Es común sentir un aumento de energía y mejor estado de ánimo.';
      case CyclePhase.OVULACION:
        return 'La ovulación es cuando liberas un óvulo. Puedes notar cambios en el flujo vaginal, ligero dolor abdominal y aumento del deseo sexual.';
      case CyclePhase.LUTEA:
        return 'Durante la fase lútea, tu cuerpo se prepara para un posible embarazo. Puedes experimentar síntomas premenstruales como sensibilidad en los senos, irritabilidad o hinchazón.';
      default:
        return '';
    }
  };

  // Color según la fase del ciclo
  const getPhaseColor = (phase?: CyclePhase) => {
    if (!phase) return 'bg-purple-100 text-purple-800';
    
    switch (phase) {
      case CyclePhase.MENSTRUAL:
        return 'bg-red-100 text-red-800';
      case CyclePhase.FOLICULAR:
        return 'bg-yellow-100 text-yellow-800';
      case CyclePhase.OVULACION:
        return 'bg-blue-100 text-blue-800';
      case CyclePhase.LUTEA:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  // Si no hay ciclo actual
  if (!currentCycle && !isLoading) {
    return (
      <Card>
        <div className="text-center py-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No hay un ciclo activo
          </h3>
          <p className="text-gray-600 mb-4">
            Registra el comienzo de tu ciclo menstrual para empezar a hacer seguimiento.
          </p>
          <Button 
            variant="primary"
            onClick={() => startNewCycle(new Date().toISOString().split('T')[0])}
            isLoading={isLoading}
          >
            Iniciar seguimiento
          </Button>
        </div>
      </Card>
    );
  }

  // Si está cargando
  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700"></div>
        </div>
      </Card>
    );
  }

  // Si hay ciclo actual
  return (
    <Card>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Tu ciclo actual
            </h3>
            <p className="text-gray-600">
              Comenzó el {currentCycle?.startDate ? formatDate(currentCycle.startDate) : ''}
            </p>
          </div>
          
          {currentDay && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPhaseColor(currentDay.phase)}`}>
              Día {currentDay.dayNumber} • Fase {currentDay.phase}
            </span>
          )}
        </div>
        
        {currentDay && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">¿Qué pasa en tu cuerpo ahora?</h4>
            <p className="text-gray-700">
              {getPhaseDescription(currentDay.phase)}
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nextCyclePrediction?.expectedStartDate && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-1">Próximo período</h4>
              <p className="text-purple-900 text-lg font-bold">
                {formatDate(nextCyclePrediction.expectedStartDate)}
              </p>
              <p className="text-purple-700 text-sm mt-1">
                En {getDaysRemaining(nextCyclePrediction.expectedStartDate)} días
              </p>
            </div>
          )}
          
          {currentCycle?.averageCycleLength && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-1">Duración del ciclo</h4>
              <p className="text-blue-900 text-lg font-bold">
                {currentCycle.averageCycleLength} días
              </p>
              <p className="text-blue-700 text-sm mt-1">
                Basado en tus últimos ciclos
              </p>
            </div>
          )}
          
          {currentCycle?.averageDuration && (
            <div className="bg-pink-50 p-4 rounded-lg">
              <h4 className="font-medium text-pink-800 mb-1">Duración del período</h4>
              <p className="text-pink-900 text-lg font-bold">
                {currentCycle.averageDuration} días
              </p>
              <p className="text-pink-700 text-sm mt-1">
                Promedio de tus últimos períodos
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="secondary"
            size="sm"
            onClick={() => startNewCycle(new Date().toISOString().split('T')[0])}
          >
            Registrar nuevo período
          </Button>
        </div>
      </div>
    </Card>
  );
};
