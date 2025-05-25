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
  const wantsAI = watch("wantAiCompanion");
  const wantsPartner = watch("shareCycleWithPartner");

  return (
    <div className="w-full flex flex-col items-center gap-4 animate-fade-in max-w-4xl mx-auto py-2">
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#7a2323] mb-1 text-center drop-shadow-sm animate-fade-in">
        Bienvenida a EYRA
      </h2>
      <p className="text-base text-[#3a1a1a] mb-4 text-center animate-fade-in">
        Elige cómo quieres que EYRA te acompañe.{" "}
        <span className="block text-sm text-[#a62c2c] mt-1">
          Tú decides el ritmo y la compañía.
        </span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <div
          className="p-4 rounded-2xl"
          style={{
            background: "#e7e0d5",
            boxShadow: `
              inset 4px 4px 8px rgba(91, 1, 8, 0.1),
              inset -4px -4px 8px rgba(255, 255, 255, 0.8)
            `,
          }}
        >
          <h3 className="text-sm text-[#300808] font-medium mb-3">
            Notificaciones y seguimiento
          </h3>

          <div className="space-y-2">
            <label className="flex items-center p-2 rounded-lg hover:bg-white/50 transition-colors">
              <input
                type="checkbox"
                {...register("receiveAlerts")}
                checked={watch("receiveAlerts")}
                onChange={(e) => setValue("receiveAlerts", e.target.checked)}
                className="mr-2 w-4 h-4 accent-[#C62328] rounded"
              />
              <span className="text-[#300808] text-sm">
                Recibir alertas relacionadas con mi ciclo o seguimiento
              </span>
            </label>

            <label className="flex items-center p-2 rounded-lg hover:bg-white/50 transition-colors">
              <input
                type="checkbox"
                {...register("receiveRecommendations")}
                checked={watch("receiveRecommendations")}
                onChange={(e) =>
                  setValue("receiveRecommendations", e.target.checked)
                }
                className="mr-2 w-4 h-4 accent-[#C62328] rounded"
              />
              <span className="text-[#300808] text-sm">
                Recibir recomendaciones personalizadas
              </span>
            </label>

            <label className="flex items-center p-2 rounded-lg hover:bg-white/50 transition-colors">
              <input
                type="checkbox"
                {...register("receiveCyclePhaseTips")}
                checked={watch("receiveCyclePhaseTips")}
                onChange={(e) =>
                  setValue("receiveCyclePhaseTips", e.target.checked)
                }
                className="mr-2 w-4 h-4 accent-[#C62328] rounded"
              />
              <span className="text-[#300808] text-sm">
                Consejos según cada fase del ciclo
              </span>
            </label>

            <label className="flex items-center p-2 rounded-lg hover:bg-white/50 transition-colors">
              <input
                type="checkbox"
                {...register("receiveWorkoutSuggestions")}
                checked={watch("receiveWorkoutSuggestions")}
                onChange={(e) =>
                  setValue("receiveWorkoutSuggestions", e.target.checked)
                }
                className="mr-2 w-4 h-4 accent-[#C62328] rounded"
              />
              <span className="text-[#300808] text-sm">
                Sugerencias de actividad física
              </span>
            </label>

            <label className="flex items-center p-2 rounded-lg hover:bg-white/50 transition-colors">
              <input
                type="checkbox"
                {...register("receiveNutritionAdvice")}
                checked={watch("receiveNutritionAdvice")}
                onChange={(e) =>
                  setValue("receiveNutritionAdvice", e.target.checked)
                }
                className="mr-2 w-4 h-4 accent-[#C62328] rounded"
              />
              <span className="text-[#300808] text-sm">Consejos de alimentación</span>
            </label>
          </div>
        </div>

        <div
          className="p-4 rounded-2xl"
          style={{
            background: "#e7e0d5",
            boxShadow: `
              inset 4px 4px 8px rgba(91, 1, 8, 0.1),
              inset -4px -4px 8px rgba(255, 255, 255, 0.8)
            `,
          }}
        >
          <h3 className="text-sm text-[#300808] font-medium mb-3">
            Acompañamiento y asistencia
          </h3>

          <div className="space-y-2">
            <label className="flex items-start p-2 rounded-lg hover:bg-white/50 transition-colors">
              <input
                type="checkbox"
                {...register("shareCycleWithPartner")}
                checked={watch("shareCycleWithPartner")}
                onChange={(e) =>
                  setValue("shareCycleWithPartner", e.target.checked)
                }
                className="mr-2 w-4 h-4 accent-[#C62328] rounded mt-0.5"
              />
              <span className="text-[#300808] text-sm">
                Compartir el seguimiento con otra persona (pareja, tutor, acompañante)
              </span>
            </label>

            {wantsPartner && (
              <p className="text-xs text-[#5b0108] ml-6 bg-white/50 p-2 rounded-lg">
                Podrás invitar a una persona para que te acompañe y reciba actualizaciones.
              </p>
            )}

            <label className="flex items-start p-2 rounded-lg hover:bg-white/50 transition-colors">
              <input
                type="checkbox"
                {...register("wantAiCompanion")}
                checked={watch("wantAiCompanion")}
                onChange={(e) => setValue("wantAiCompanion", e.target.checked)}
                className="mr-2 w-4 h-4 accent-[#C62328] rounded mt-0.5"
              />
              <span className="text-[#300808] text-sm">
                Usar asistente IA para resolver dudas y acompañar procesos
              </span>
            </label>

            {wantsAI && (
              <p className="text-xs text-[#5b0108] ml-6 bg-white/50 p-2 rounded-lg">
                EYRA incluirá un asistente de IA con respaldo científico para ayudarte en el día a día.
              </p>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-[#5b0108] text-center mt-2">
        Todas estas preferencias son opcionales y podrás cambiarlas más adelante.
      </p>

      <div className="flex justify-between mt-4 w-full max-w-sm">
        <button
          type="button"
          onClick={onPreviousStep}
          className="px-5 py-2.5 bg-gray-300 text-[#300808] rounded-lg font-medium hover:bg-gray-400 text-sm"
          style={{
            boxShadow: `
              4px 4px 8px rgba(91, 1, 8, 0.1),
              -4px -4px 8px rgba(255, 255, 255, 0.1)
            `,
          }}
        >
          Atrás
        </button>

        <button
          type="button"
          onClick={onNextStep}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#5b0108] text-white rounded-lg font-medium transition-all hover:bg-[#9d0d0b] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
  );
};

export default Step3Preferences;