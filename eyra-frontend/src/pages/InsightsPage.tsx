import React from 'react';

const InsightsPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-gradient-to-br from-[#1A0B2E] to-[#2D0A31]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Análisis</h1>
        
        <div className="bg-[#ffffff08] backdrop-blur-md p-6 rounded-xl border border-white/10 mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">Resumen de Ciclos</h2>
          <p className="text-white/70">
            Visualización de datos en desarrollo
          </p>
        </div>
        
        <div className="bg-[#ffffff08] backdrop-blur-md p-6 rounded-xl border border-white/10 mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">Patrones de Síntomas</h2>
          <p className="text-white/70">
            Visualización de datos en desarrollo
          </p>
        </div>
        
        <div className="bg-[#ffffff08] backdrop-blur-md p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-3">Predicciones</h2>
          <p className="text-white/70">
            Visualización de datos en desarrollo
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;