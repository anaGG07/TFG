import React from "react";
import { useAuth } from "../context/AuthContext";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  console.log("DashboardPage: Renderizando para usuario:", user?.email);

  return (
    <div className="w-full h-full overflow-hidden flex flex-col bg-[#f5ede6]">
      {/* Header con espacio para el blob */}
      <div className="flex-shrink-0 p-6 pl-44">
        <h1 className="text-3xl font-serif text-[#5b0108]">Dashboard</h1>
        <p className="text-[#7a2323] mt-2">
          Bienvenida, {user?.name || user?.email}
        </p>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-hidden p-6 pl-44">
        <div className="h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-[#5b0108]">Tu Ciclo</h3>
              <span className="text-2xl">🌸</span>
            </div>
            <p className="text-gray-600 mb-3">
              Información sobre tu ciclo menstrual actual
            </p>
            <div className="bg-[#f8f4f0] rounded-lg p-3">
              <p className="text-sm text-[#7a2323]">
                Estado:{" "}
                {user?.onboarding?.completed
                  ? "Configurado"
                  : "Pendiente configuración"}
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-[#5b0108]">Síntomas</h3>
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-gray-600 mb-3">Registro de síntomas recientes</p>
            <div className="bg-[#f8f4f0] rounded-lg p-3">
              <p className="text-sm text-[#7a2323]">
                Registros: 0 síntomas hoy
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-[#5b0108]">Insights</h3>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-gray-600 mb-3">
              Análisis y tendencias personalizadas
            </p>
            <div className="bg-[#f8f4f0] rounded-lg p-3">
              <p className="text-sm text-[#7a2323]">
                Datos disponibles próximamente
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-[#5b0108]">
                Recordatorios
              </h3>
              <span className="text-2xl">🔔</span>
            </div>
            <p className="text-gray-600 mb-3">Notificaciones y recordatorios</p>
            <div className="bg-[#f8f4f0] rounded-lg p-3">
              <p className="text-sm text-[#7a2323]">
                No hay recordatorios pendientes
              </p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-[#5b0108]">Bienestar</h3>
              <span className="text-2xl">💆‍♀️</span>
            </div>
            <p className="text-gray-600 mb-3">Consejos y recomendaciones</p>
            <div className="bg-[#f8f4f0] rounded-lg p-3">
              <p className="text-sm text-[#7a2323]">
                Explora contenido personalizado
              </p>
            </div>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-[#5b0108]">Comunidad</h3>
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-gray-600 mb-3">Conecta con otras usuarias</p>
            <div className="bg-[#f8f4f0] rounded-lg p-3">
              <p className="text-sm text-[#7a2323]">Próximamente disponible</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="flex-shrink-0 p-4 pl-44">
        <p className="text-xs text-gray-500">
          EYRA - Tu compañera en el autocuidado femenino
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
