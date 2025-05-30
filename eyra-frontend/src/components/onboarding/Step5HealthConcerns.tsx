// Step5HealthConcerns.tsx
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
    <div className="h-full flex items-center justify-center">
      <div className="w-full flex flex-col items-center gap-4 animate-fade-in max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#7a2323] mb-1 text-center drop-shadow-sm animate-fade-in">
          Bienvenida a EYRA
        </h2>
        <p className="text-lg text-[#3a1a1a] mb-4 text-center animate-fade-in">
          ¿Hay algún aspecto de tu salud que te preocupe?{" "}
          <span className="block text-base text-[#a62c2c] mt-1">
            Esta información nos ayudará a brindarte un mejor acompañamiento.
          </span>
        </p>

        <div className="w-full max-w-2xl">
          <div
            className="p-4 rounded-2xl flex flex-col"
            style={{
              background: "#e7e0d5",
              boxShadow: `
                inset 4px 4px 8px rgba(91, 1, 8, 0.1),
                inset -4px -4px 8px rgba(255, 255, 255, 0.8)
              `,
            }}
          >
            <h3 className="text-lg text-[#300808] font-medium mb-3">
              Condiciones médicas
            </h3>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 min-h-0">
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
                    className="mr-3 w-5 h-5 text-[#C62328] border-2 border-[#C62328]/40 focus:ring-2 focus:ring-[#C62328]/30 focus:ring-offset-0 rounded flex-shrink-0"
                    style={{
                      accentColor: "#C62328",
                      filter: "drop-shadow(2px 2px 4px rgba(91, 1, 8, 0.1))",
                      minWidth: "20px",
                      minHeight: "20px",
                    }}
                  />
                  <span className="text-[#300808] text-sm leading-tight">
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-[#5b0108] text-center mt-2">
          Esta información es confidencial y solo se utilizará para mejorar tu
          experiencia con EYRA.
        </p>

        <div className="flex justify-between mt-3 w-full max-w-sm">
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
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 bg-[#5b0108] text-white rounded-lg font-medium transition-all hover:bg-[#9d0d0b] disabled:opacity-50 disabled:cursor-not-allowed text-base"
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
    </div>
  );
};

export default Step5HealthConcerns;
