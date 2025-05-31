import React from "react";
import { NeomorphicButton } from "../ui/NeomorphicComponents";

interface NotificationsFormProps {
  form: any;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: (e: React.FormEvent) => void;
}

const notificationOptions = [
  { name: "receiveAlerts", label: "Alertas importantes" },
  { name: "receiveRecommendations", label: "Recomendaciones" },
  { name: "receiveWorkoutSuggestions", label: "Ejercicio" },
  { name: "receiveNutritionAdvice", label: "Nutrición" },
];

const NotificationsForm: React.FC<NotificationsFormProps> = ({ form, loading, handleChange, handleSave }) => (
  <form onSubmit={handleSave} className="flex flex-col gap-4 py-2 w-full">
    {notificationOptions.map((r) => (
      <label
        key={r.name}
        className="flex items-center gap-2 cursor-pointer select-none"
      >
        <input
          type="checkbox"
          name={r.name}
          checked={form[r.name] as boolean}
          onChange={handleChange}
          className="sr-only"
        />
        <span
          className={`w-10 h-6 rounded-full flex items-center transition-all duration-200 ${
            form[r.name] ? "bg-[#C62328]/80" : "bg-[#f0e8dc]"
          }`}
          style={{ boxShadow: "inset 2px 2px 6px #c6232822" }}
        >
          <span
            className={`block w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200 ${
              form[r.name] ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </span>
        <span className="text-[#7a2323] text-sm font-medium">{r.label}</span>
      </label>
    ))}
    <div className="flex justify-center mt-4 w-full">
      <NeomorphicButton
        type="submit"
        variant="primary"
        className="max-w-xs w-full px-8 py-3 text-lg border-2 border-transparent"
        disabled={loading}
      >
        {loading ? "Guardando..." : "Guardar cambios"}
      </NeomorphicButton>
    </div>
  </form>
);

export default NotificationsForm; 