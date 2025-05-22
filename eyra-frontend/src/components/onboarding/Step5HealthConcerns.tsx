import React from "react";

const healthOptions = [
  "Síndrome de ovario poliquístico",
  "Endometriosis",
  "Migrañas menstruales",
  "Anemia",
  "Diabetes",
  "Hipertensión",
  "Problemas tiroideos",
  "Fibromas",
  "Depresión",
  "Ansiedad",
  "Otro",
];

interface Step5HealthConcerns {
  isSubmitting: boolean;
  watch: any;
  setValue: any;
  register: any;
  errors: any;
  onSubmit: () => void;
  onPreviousStep?: () => void;
}

const Step5HealthConcerns: React.FC<Step5HealthConcerns> = ({
  isSubmitting,
  watch,
  setValue,
  register,
  errors,
  onSubmit,
  onPreviousStep,
}) => {
  const selected = watch("healthConcerns") || [];

  const toggleConcern = (item: string) => {
    const updated = selected.includes(item)
      ? selected.filter((c: string) => c !== item)
      : [...selected, item];
    setValue("healthConcerns", updated, { shouldValidate: true });
  };

  return (
    <div className="w-full flex flex-col items-center gap-8 animate-fade-in">
      <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#7a2323] mb-2 text-center">Salud y bienestar</h3>
      <p className="text-[#3a1a1a] text-lg text-center mb-4">¿Hay algo de tu salud que quieras que tengamos en cuenta?<br/><span className="text-[#a62c2c] text-base">Tu bienestar es nuestra prioridad.</span></p>

      <div className="grid grid-cols-2 gap-4">
        {healthOptions.map((item) => {
          const isChecked = selected.includes(item);
          return (
            <label
              key={item}
              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                isChecked
                  ? "bg-[#fceced] border-[#5b0108]/60"
                  : "hover:bg-[#5b010810] hover:border-[#5b0108]/30"
              }`}
              onClick={() => toggleConcern(item)}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isChecked}
                  readOnly
                  className="mr-3"
                />
                <span>{item}</span>
              </div>
              {isChecked && <span className="text-[#5b0108] text-lg">✓</span>}
            </label>
          );
        })}
      </div>

      {selected.length === 0 && (
        <p className="text-sm text-[#5b0108] mt-4 text-center">
          Este paso es completamente opcional. Si no aplican estas condiciones,
          puedes continuar sin seleccionar nada.
        </p>
      )}

      <div className="mt-6">
        <label className="block text-[#300808] mb-2 font-medium">
          ¿Quieres añadir algún otro detalle o contexto? (opcional)
        </label>
        <textarea
          {...register("accessCode")}
          className="w-full bg-white border border-[#300808]/20 rounded-lg py-2 px-3 text-[#5b0108]"
          rows={3}
          placeholder="Especifica cualquier otra cosa que creas importante..."
        />
        {errors.accessCode && (
          <p className="text-red-500 text-sm mt-1">
            {errors.accessCode.message}
          </p>
        )}
      </div>

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
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-8 py-3 bg-[#5b0108] text-white rounded-lg font-medium transition-all hover:bg-[#9d0d0b] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Enviando..." : "Finalizar"}
        </button>
      </div>

      <div className="mt-8 text-center animate-fade-in">
        <h3 className="text-2xl font-serif text-[#C62328] font-bold mb-2">¡Onboarding completado!</h3>
        <p className="text-[#7a2323] text-lg">Estás lista para descubrir, conectar y evolucionar con EYRA.<br/>Recuerda: <span className="font-semibold">tu ciclo, tu poder</span>.</p>
      </div>
    </div>
  );
};

export default Step5HealthConcerns;
