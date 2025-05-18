import React from "react";
import { StepProps } from "../../types/components/StepProps";

const Step3Preferences: React.FC<StepProps> = ({
  isSubmitting,
  register,
  watch,
  onNextStep,
  onPreviousStep,
}) => {
  const wantsAI = watch("wantAiCompanion");
  const wantsPartner = watch("shareCycleWithPartner");

  return (
    <div className="space-y-6">
      <p className="text-[#300808] mb-8 text-center text-lg">
        ¿Cómo quieres que EYRA te acompañe durante tu experiencia? Selecciona
        las opciones que más se ajusten a tus necesidades.
      </p>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm text-[#300808] font-medium mb-2">
            Notificaciones y seguimiento
          </h3>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("receiveAlerts")}
              className="mr-2"
            />
            Recibir alertas relacionadas con mi ciclo o seguimiento
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("receiveRecommendations")}
              className="mr-2"
            />
            Recibir recomendaciones personalizadas
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("receiveCyclePhaseTips")}
              className="mr-2"
            />
            Consejos según cada fase del ciclo
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("receiveWorkoutSuggestions")}
              className="mr-2"
            />
            Sugerencias de actividad física
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("receiveNutritionAdvice")}
              className="mr-2"
            />
            Consejos de alimentación
          </label>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-sm text-[#300808] font-medium mb-2">
            Acompañamiento y asistencia
          </h3>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("shareCycleWithPartner")}
              className="mr-2"
            />
            Compartir el seguimiento con otra persona (pareja, tutor,
            acompañante)
          </label>

          {wantsPartner && (
            <p className="text-sm text-[#5b0108] ml-6">
              Podrás invitar a una persona para que te acompañe y reciba
              actualizaciones.
            </p>
          )}

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("wantAiCompanion")}
              className="mr-2"
            />
            Usar asistente IA para resolver dudas y acompañar procesos
          </label>

          {wantsAI && (
            <p className="text-sm text-[#5b0108] ml-6">
              EYRA incluirá un asistente de IA con respaldo científico para
              ayudarte en el día a día.
            </p>
          )}
        </div>
      </div>

      <p className="text-sm text-[#5b0108] text-center mt-4">
        Todas estas preferencias son opcionales y podrás cambiarlas más
        adelante.
      </p>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onPreviousStep}
          className="px-6 py-3 bg-gray-300 text-[#300808] rounded-lg font-medium hover:bg-gray-400"
        >
          Atrás
        </button>

        <button
          type="button"
          onClick={onNextStep}
          disabled={isSubmitting}
          className="px-8 py-3 bg-[#5b0108] text-white rounded-lg font-medium transition-all hover:bg-[#9d0d0b] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Guardando..." : "Siguiente"}
        </button>
      </div>
    </div>
  );
};

export default Step3Preferences;
