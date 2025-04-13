import React from 'react';

const DashboardPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-gradient-to-br from-[#1A0B2E] to-[#2D0A31]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#ffffff08] backdrop-blur-md p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-3">Ciclo Actual</h2>
            <p className="text-white/70">
              Información en desarrollo
            </p>
          </div>
          
          <div className="bg-[#ffffff08] backdrop-blur-md p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-3">Próximo Periodo</h2>
            <p className="text-white/70">
              Información en desarrollo
            </p>
          </div>
          
          <div className="bg-[#ffffff08] backdrop-blur-md p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-3">Síntomas Recientes</h2>
            <p className="text-white/70">
              Información en desarrollo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;