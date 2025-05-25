import React from "react";
import { StepProps } from "../../types/components/StepProps";

const Step3Preferences: React.FC<StepProps> = ({
  isSubmitting,
  register,
  watch,
  onNextStep,
  onPreviousStep,
  setValue,
}) => {

  const wantsPartner = watch("shareCycleWithPartner");

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full flex flex-col items-center gap-6 animate-fade-in max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#7a2323] mb-2 text-center drop-shadow-sm animate-fade-in">
          Bienvenida a EYRA
        </h2>
        <p className="text-lg text-[#3a1a1a] mb-6 text-center animate-fade-in">
          Elige cómo quieres que EYRA te acompañe.{" "}
          <span className="block text-base text-[#a62c2c] mt-2">
            Tú decides el ritmo y la compañía.
          </span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          <div
            className="p-6 rounded-2xl"
            style={{
              background: "#e7e0d5",
              boxShadow: `
                inset 4px 4px 8px rgba(91, 1, 8, 0.1),
                inset -4px -4px 8px rgba(255, 255, 255, 0.8)
              `,
            }}
          >
            <h3 className="text-lg text-[#300808] font-medium mb-4">
              Notificaciones y seguimiento
            </h3>

            <div className="space-y-3">
              <label className="flex items-center p-3 rounded-lg hover:bg-white/50 transition-colors">
                <input
                  type="checkbox"
                  {...register("receiveAlerts")}
                  checked={watch("receiveAlerts")}
                  onChange={(e) => setValue("receiveAlerts", e.target.checked)}
                  className="mr-3 w-5 h-5 text-[#C62328] border-2 border-[#C62328]/40 focus:ring-2 focus:ring-[#C62328]/30 focus:ring-offset-0 rounded flex-shrink-0"
                  style={{
                    accentColor: '#C62328',
                    filter: 'drop-shadow(2px 2px 4px rgba(91, 1, 8, 0.1))',
                    minWidth: '20px',
                    minHeight: '20px'
                  }}
                />
                <span className="text-[#300808] text-base">
                  Recibir alertas relacionadas con mi ciclo o seguimiento
                </span>
              </label>

              <label className="flex items-center p-3 rounded-lg hover:bg-white/50 transition-colors">
                <input
                  type="checkbox"
                  {...register("receiveRecommendations")}
                  checked={watch("receiveRecommendations")}
                  onChange={(e) => setValue("receiveRecommendations", e.target.checked)}
                  className="mr-3 w-5 h-5 text-[#C62328] border-2 border-[#C62328]/40 focus:ring-2 focus:ring-[#C62328]/30 focus:ring-offset-0 rounded flex-shrink-0"
                  style={{
                    accentColor: '#C62328',
                    filter: 'drop-shadow(2px 2px 4px rgba(91, 1, 8, 0.1))',
                    minWidth: '20px',
                    minHeight: '20px'
                  }}
                />
                <span className="text-[#300808] text-base">
                  Recibir recomendaciones personalizadas
                </span>
              </label>

              <label className="flex items-center p-3 rounded-lg hover:bg-white/50 transition-colors">
                <input
                  type="checkbox"
                  {...register("receiveCyclePhaseTips")}
                  checked={watch("receiveCyclePhaseTips")}
                  onChange={(e) => setValue("receiveCyclePhaseTips", e.target.checked)}
                  className="mr-3 w-5 h-5 text-[#C62328] border-2 border-[#C62328]/40 focus:ring-2 focus:ring-[#C62328]/30 focus:ring-offset-0 rounded flex-shrink-0"
                  style={{
                    accentColor: '#C62328',
                    filter: 'drop-shadow(2px 2px 4px rgba(91, 1, 8, 0.1))',
                    minWidth: '20px',
                    minHeight: '20px'
                  }}
                />
                <span className="text-[#300808] text-base">
                  Consejos según cada fase del ciclo
                </span>
              </label>

              <label className="flex items-center p-3 rounded-lg hover:bg-white/50 transition-colors">
                <input
                  type="checkbox"
                  {...register("receiveWorkoutSuggestions")}
                  checked={watch("receiveWorkoutSuggestions")}
                  onChange={(e) => setValue("receiveWorkoutSuggestions", e.target.checked)}
                  className="mr-3 w-5 h-5 text-[#C62328] border-2 border-[#C62328]/40 focus:ring-2 focus:ring-[#C62328]/30 focus:ring-offset-0 rounded flex-shrink-0"
                  style={{
                    accentColor: '#C62328',
                    filter: 'drop-shadow(2px 2px 4px rgba(91, 1, 8, 0.1))',
                    minWidth: '20px',
                    minHeight: '20px'
                  }}
                />
                <span className="text-[#300808] text-base">
                  Sugerencias de actividad física
                </span>
              </label>

              <label className="flex items-center p-3 rounded-lg hover:bg-white/50 transition-colors">
                <input
                  type="checkbox"
                  {...register("receiveNutritionAdvice")}
                  checked={watch("receiveNutritionAdvice")}
                  onChange={(e) => setValue("receiveNutritionAdvice", e.target.checked)}
                  className="mr-3 w-5 h-5 text-[#C62328] border-2 border-[#C62328]/40 focus:ring-2 focus:ring-[#C62328]/30 focus:ring-offset-0 rounded flex-shrink-0"
                  style={{
                    accentColor: '#C62328',
                    filter: 'drop-shadow(2px 2px 4px rgba(91, 1, 8, 0.1))',
                    minWidth: '20px',
                    minHeight: '20px'
                  }}
                />
                <span className="text-[#300808] text-base">
                  Consejos de alimentación
                </span>
              </label>
            </div>
          </div>

          <div
            className="p-6 rounded-2xl"
            style={{
              background: "#e7e0d5",
              boxShadow: `
                inset 4px 4px 8px rgba(91, 1, 8, 0.1),
                inset -4px -4px 8px rgba(255, 255, 255, 0.8)
              `,
            }}
          >
            <h3 className="text-lg text-[#300808] font-medium mb-4">
              Acompañamiento y asistencia
            </h3>

            <div className="space-y-3">
              <label className="flex items-start p-3 rounded-lg hover:bg-white/50 transition-colors">
                <input
                  type="checkbox"
                  {...register("shareCycleWithPartner")}
                  checked={watch("shareCycleWithPartner")}
                  onChange={(e) => setValue("shareCycleWithPartner", e.target.checked)}
                  className="mr-3 w-5 h-5 text-[#C62328] border-2 border-[#C62328]/40 focus:ring-2 focus:ring-[#C62328]/30 focus:ring-offset-0 rounded flex-shrink-0 mt-0.5"
                  style={{
                    accentColor: '#C62328',
                    filter: 'drop-shadow(2px 2px 4px rgba(91, 1, 8, 0.1))',
                    minWidth: '20px',
                    minHeight: '20px'
                  }}
                />
                <span className="text-[#300808] text-base">
                  Compartir el seguimiento con otra persona (pareja, tutor,
                  acompañante)
                </span>
              </label>

              {wantsPartner && (
                <p className="text-sm text-[#5b0108] ml-8 bg-white/50 p-3 rounded-lg">
                  Podrás invitar a una persona para que te acompañe y reciba
                  actualizaciones.
                </p>
              )}

              <label className="flex items-start p-3 rounded-lg bg-gray-100/50 transition-colors opacity-60">
                <div className="mr-3 w-5 h-5 mt-0.5 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-gray-400 rounded bg-gray-200"></div>
                </div>
                <div className="flex-1">
                  <span className="text-[#300808] text-base line-through">
                    Usar asistente IA para resolver dudas y acompañar procesos
                  </span>
                  <div className="mt-1">
                    <span className="text-xs bg-[#C62328]/20 text-[#5b0108] px-2 py-1 rounded-full font-medium">
                      🚧 Disponible próximamente
                    </span>
                    <p className="text-xs text-[#5b0108] mt-1">
                      Esta funcionalidad se encuentra actualmente en desarrollo y estará disponible en futuras actualizaciones.
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <p className="text-sm text-[#5b0108] text-center mt-4">
          Todas estas preferencias son opcionales y podrás cambiarlas más
          adelante.
        </p>

        <div className="flex justify-between mt-6 w-full max-w-sm">
          <button
            type="button"
            onClick={onPreviousStep}
            className="px-6 py-3 bg-[#C62328]/20 text-[#5b0108] rounded-lg font-medium hover:bg-[#C62328]/30 text-base border border-[#C62328]/30"
            style={{
              boxShadow: `
                4px 4px 8px rgba(91, 1, 8, 0.1),
                -4px -4px 8px rgba(255, 255, 255, 0.3)
              `,
            }}
          >
            Atrás
          </button>

          <button
            type="button"
            onClick={onNextStep}
            disabled={isSubmitting}
            className="px-8 py-3 bg-[#5b0108] text-white rounded-lg font-medium transition-all hover:bg-[#9d0d0b] disabled:opacity-50 disabled:cursor-not-allowed text-base"
            style={{
              boxShadow: `
                4px 4px 8px rgba(91, 1, 8, 0.2),
                -4px -4px 8px rgba(255, 255, 255, 0.1)
              `,
            }}
          >
            {isSubmitting ? "Guardando..." : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3Preferences;
