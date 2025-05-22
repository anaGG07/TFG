import React from "react";
import { StepProps } from "../../types/components/StepProps";

const commonSymptoms = [
  "Cólicos menstruales",
  "Dolor de cabeza",
  "Cambios de humor",
  "Fatiga",
  "Sensibilidad en los senos",
  "Acné",
  "Insomnio",
  "Ansiedad",
  "Hinchazón",
  "Náuseas",
  "Otro",
];

const Step4Symptoms: React.FC<StepProps> = ({
  isSubmitting,
  watch,
  setValue,
  register,
  onNextStep,
  onPreviousStep,
}) => {
  const selected = watch("commonSymptoms") || [];

  const toggleSymptom = (item: string) => {
    const updated = selected.includes(item)
      ? selected.filter((s) => s !== item)
      : [...selected, item];
    setValue("commonSymptoms", updated, { shouldValidate: true });
  };

  return (
    <div className="w-full flex flex-col items-center gap-8 animate-fade-in max-w-md mx-auto">
      <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#7a2323] mb-2 text-center">Síntomas y sensaciones</h3>
      <p className="text-[#3a1a1a] text-lg text-center mb-4">¿Qué síntomas o sensaciones sueles experimentar?<br/><span className="text-[#a62c2c] text-base">Conocer tu cuerpo es el primer paso para cuidarlo.</span></p>

      <div className="grid grid-cols-2 gap-4 w-full">
        {commonSymptoms.map((item) => {
          const isChecked = selected.includes(item);
          return (
            <label
              key={item}
              className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                isChecked
                  ? "bg-[#fceced] border-[#5b0108]/60 shadow-sm"
                  : "hover:bg-[#5b010810] hover:border-[#5b0108]/30"
              }`}
              onClick={() => toggleSymptom(item)}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isChecked}
                  readOnly
                  className="mr-3 w-5 h-5 accent-[#5b0108]"
                />
                <span className="text-[#3a1a1a]">{item}</span>
              </div>
              {isChecked && (
                <span className="text-[#5b0108] text-lg font-medium">✓</span>
              )}
            </label>
          );
        })}
      </div>

      {selected.length === 0 && (
        <p className="text-sm text-[#5b0108] mt-4 text-center italic">
          No hay problema si no experimentas ninguno de estos síntomas. Cada cuerpo es único.
        </p>
      )}

      <div className="mt-6 w-full">
        <label className="block text-[#300808] mb-2 font-medium">
          ¿Quieres añadir algún otro síntoma o sensación? (opcional)
        </label>
        <textarea
          {...register("otherSymptoms")}
          className="w-full bg-white border border-[#300808]/20 rounded-xl py-3 px-4 text-[#5b0108] focus:ring-2 focus:ring-[#5b0108]/20 focus:border-[#5b0108] transition-all"
          rows={3}
          placeholder="Describe cualquier otro síntoma o sensación que experimentes..."
        />
      </div>

      <div className="flex justify-between mt-8 w-full">
        <button
          type="button"
          onClick={onPreviousStep}
          className="px-6 py-3 bg-gray-200 text-[#300808] rounded-xl font-medium hover:bg-gray-300 transition-all"
        >
          Atrás
        </button>

        <button
          type="button"
          onClick={onNextStep}
          disabled={isSubmitting}
          className="px-8 py-3 bg-[#5b0108] text-white rounded-xl font-medium transition-all hover:bg-[#9d0d0b] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Guardando..." : "Siguiente"}
        </button>
      </div>
    </div>
  );
};

export default Step4Symptoms; 