
const DashboardPage = () => {
  return (
    <div className="dashboard-page pt-24 pb-20 px-4">
      <div className="container">
        <h1>Panel de Inicio</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div className="card">
            <h2>Ciclo Actual</h2>
            <div className="mt-4">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 rounded-full bg-eyraRed mr-2"></div>
                <p>Día 8 de 28</p>
              </div>
              <div className="bg-gray-100 h-2 rounded-full w-full overflow-hidden">
                <div className="bg-eyraRed h-full rounded-full" style={{ width: '28.5%' }}></div>
              </div>
              <p className="text-sm mt-3">Fase folicular - 5 días hasta tu ventana fértil</p>
            </div>
          </div>
          
          <div className="card">
            <h2>Próximo Periodo</h2>
            <div className="flex items-center justify-between mt-4">
              <div className="text-center">
                <p className="text-sm label-text">Esperado</p>
                <p className="text-xl font-semibold text-eyraRed">21</p>
                <p className="text-sm">Mayo</p>
              </div>
              
              <div className="text-center">
                <p className="text-sm label-text">Días</p>
                <p className="text-3xl font-bold">14</p>
                <p className="text-sm">Restantes</p>
              </div>
              
              <div className="text-center">
                <p className="text-sm label-text">Duración</p>
                <p className="text-xl font-semibold">5</p>
                <p className="text-sm">Días (est.)</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h2>Síntomas Recientes</h2>
            <div className="space-y-3 mt-4">
              <div className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-eyraRed mr-2"></span>
                <span>Dolor de cabeza</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-eyraLightRed mr-2"></span>
                <span>Fatiga</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-eyraDeepRed mr-2"></span>
                <span>Sensibilidad en los senos</span>
              </div>
              <button className="button-secondary text-sm mt-2">
                Ver más síntomas
              </button>
            </div>
          </div>
        </div>
        
        {/* Segunda fila de tarjetas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="card">
            <h2>Resumen de Estado de Ánimo</h2>
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#FFF0F0] text-eyraRed rounded-full text-sm">Estresada</span>
                <span className="px-3 py-1 bg-[#FFF0F0] text-eyraRed rounded-full text-sm">Sensible</span>
                <span className="px-3 py-1 bg-[#FFF0F0] text-eyraRed rounded-full text-sm">Irritable</span>
                <span className="px-3 py-1 bg-[#F0FFF0] text-green-700 rounded-full text-sm">Tranquila</span>
                <span className="px-3 py-1 bg-[#F0FFF0] text-green-700 rounded-full text-sm">Feliz</span>
              </div>
              <div className="mt-4">
                <p>Tu estado de ánimo ha sido principalmente equilibrado este mes. Has experimentado algunos días de mayor sensibilidad coincidiendo con cambios hormonales.</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h2>Recomendaciones Personalizadas</h2>
            <div className="space-y-4 mt-4">
              <div className="flex">
                <div className="flex-shrink-0 w-10 h-10 bg-[#FFF0F0] rounded-full flex items-center justify-center text-eyraRed mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Hidratación Aumentada</h3>
                  <p className="text-sm">Aumenta tu ingesta de agua durante los próximos 3-5 días para ayudar a reducir la hinchazón.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 w-10 h-10 bg-[#FFF0F0] rounded-full flex items-center justify-center text-eyraRed mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Ejercicio Recomendado</h3>
                  <p className="text-sm">Es un buen momento para incorporar ejercicios de intensidad media como yoga o natación.</p>
                </div>
              </div>
              
              <button className="button-primary text-sm w-full">
                Ver todas las recomendaciones
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;