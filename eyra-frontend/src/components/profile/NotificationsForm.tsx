import React from "react";
import { NeomorphicButton } from "../ui/NeomorphicComponents";

interface NotificationsFormProps {
  form: {
    receiveAlerts: boolean;
    receiveRecommendations: boolean;
    receiveWorkoutSuggestions: boolean;
    receiveNutritionAdvice: boolean;
  };
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: (e: React.FormEvent) => void;
}

const notificationOptions = [
  { 
    name: "receiveAlerts", 
    label: "Alertas importantes",
    description: "Recibe notificaciones sobre eventos importantes y actualizaciones críticas"
  },
  { 
    name: "receiveRecommendations", 
    label: "Recomendaciones",
    description: "Recibe sugerencias personalizadas basadas en tu actividad"
  },
  { 
    name: "receiveWorkoutSuggestions", 
    label: "Ejercicio",
    description: "Recibe recordatorios y consejos sobre tu rutina de ejercicios"
  },
  { 
    name: "receiveNutritionAdvice", 
    label: "Nutrición",
    description: "Recibe consejos y recordatorios sobre tu plan nutricional"
  },
];

const NotificationsForm: React.FC<NotificationsFormProps> = ({ form, loading, handleChange, handleSave }) => {
  const validateForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que al menos una opción esté seleccionada
    const hasAnySelected = Object.values(form).some(value => value === true);
    if (!hasAnySelected) {
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (validateForm(e)) {
      handleSave(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-2 w-full max-w-md mx-auto items-center">
      {notificationOptions.map((option) => (
        <div key={option.name} className="w-full">
          <label className="flex flex-col gap-2 cursor-pointer select-none">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name={option.name}
                checked={form[option.name as keyof typeof form] as boolean}
                onChange={handleChange}
                className="sr-only"
              />
              <span
                className={`w-10 h-6 rounded-full flex items-center transition-all duration-200 ${
                  form[option.name as keyof typeof form] ? "bg-[#C62328]/80" : "bg-[#f0e8dc]"
                }`}
                style={{ boxShadow: "inset 2px 2px 6px #c6232822" }}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200 ${
                    form[option.name as keyof typeof form] ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </span>
              <span className="text-[#7a2323] text-sm font-medium">
                {option.label}
              </span>
            </div>
            <span className="text-[#7a2323]/60 text-xs ml-13">
              {option.description}
            </span>
          </label>
        </div>
      ))}
      <div className="flex justify-center mt-4 w-full">
        <NeomorphicButton
          type="submit"
          variant="primary"
          className="max-w-xs w-full px-6 py-2 text-base border-2 border-transparent"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </NeomorphicButton>
      </div>
    </form>
  );
};

export default NotificationsForm; 