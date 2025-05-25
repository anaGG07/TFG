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
    <div className="w-full flex flex-col items-center gap-4 animate-fade-in max-w-5xl mx-auto py-2">
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#7a2323] mb-1 text-center drop-shadow-sm animate-fade-in">
        Bienvenida a EYRA
      </h2>
      <p className="text-base text-[#3a1a1a] mb-4 text-center animate-fade-in">
        ¿Hay algún aspecto de tu salud que te preocupe?{" "}
        <span className="block text-sm text-[#a62c2c] mt-1">
          Esta información nos ayudará a brindarte un mejor acompañamiento.
        </span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
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
            Condiciones médicas
          </h3>

          <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
            {healthOptions.map((item) => (
              <label
                key={item}
                className="flex items-center p-2 rounded-lg hover:bg-white/50 transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  {...register("healthConcerns")}
                  value={item}
                  checked={selected.includes(item)}
                  onChange={() => toggleConcern(item)}
                  className="mr-2 w-4 h-4 accent-[#C62328] rounded"
                />
                <span className="text-[#300808] text-xs">{item}</span>
              </label>
            ))}
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
            Medicamentos y tratamientos
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[#300808] text-xs mb-1">
                ¿Tomas algún medicamento regularmente?
              </label>
              <textarea
                {...register("medications")}
                placeholder="Lista los medicamentos que tomas..."
                className="w-full p-2 rounded-lg bg-white/50 border border-[#5b0108]/20 focus:border-[#5b0108] focus:ring-1 focus:ring-[#5b0108] outline-none transition-all text-xs resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-[#300808] text-xs mb-1">
                ¿Sigues algún tratamiento específico?
              </label>
              <textarea
                {...register("treatments")}
                placeholder="Describe los tratamientos que sigues..."
                className="w-full p-2 rounded-lg bg-white/50 border border-[#5b0108]/20 focus:border-[#5b0108] focus:ring-1 focus:ring-[#5b0108] outline-none transition-all text-xs resize-none"
                rows={3}
              />
            </div>
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
            Otras preocupaciones
          </h3>

          <textarea
            {...register("otherConcerns")}
            placeholder="Cuéntanos si hay algo más que quieras que sepamos..."
            className="w-full p-2 rounded-lg bg-white/50 border border-[#5b0108]/20 focus:border-[#5b0108] focus:ring-1 focus:ring-[#5b0108] outline-none transition-all text-xs resize-none"
            rows={8}
          />
          
          <p className="text-xs text-gray-500 mt-2">
            Información adicional relevante para tu seguimiento.
          </p>
        </div>
      </div>

      <p className="text-xs text-[#5b0108] text-center mt-2">
        Esta información es confidencial y solo se utilizará para mejorar tu experiencia con EYRA.
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
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#5b0108] text-white rounded-lg font-medium transition-all hover:bg-[#9d0d0b] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          style={{
            boxShadow: `
              4px 4px 8px rgba(91, 1, 8, 0.2),
              -4px -4px 8px rgba(255, 255, 255, 0.1)
            `,
          }}
        >
          {isSubmitting ? "Guardando..." : "Completar"}
        </button>
      </div>
    </div>
  );
};

export default Step5HealthConcerns;