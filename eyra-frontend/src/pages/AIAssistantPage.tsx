import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../router/paths";

const AIAssistantPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white rounded-2xl p-10 flex flex-col items-center shadow-neomorphic border border-[#f3f3f3]">
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C62328"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-6"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6" />
          <path d="M12 17v6" />
          <path d="M4.22 4.22l4.24 4.24" />
          <path d="M15.54 15.54l4.24 4.24" />
          <path d="M1 12h6" />
          <path d="M17 12h6" />
          <path d="M4.22 19.78l4.24-4.24" />
          <path d="M15.54 8.46l4.24-4.24" />
        </svg>
        <h1 className="text-3xl font-bold text-[#C62328] mb-2 font-serif">Asistente IA</h1>
        <p className="text-lg text-[#730003] mb-6 text-center max-w-md">
          ¡Muy pronto podrás conversar con nuestra IA para resolver tus dudas, recibir recomendaciones y mucho más!
        </p>
        <span className="inline-block bg-[#C62328]/10 text-[#C62328] px-4 py-2 rounded-full font-semibold mb-4">
          En construcción
        </span>
        <Link
          to={ROUTES.DASHBOARD}
          className="mt-4 px-6 py-2 bg-[#C62328] text-white rounded-full font-semibold shadow hover:bg-[#a81b1b] transition"
        >
          Volver
        </Link>
      </div>
    </div>
  );
};

export default AIAssistantPage; 