import { Link } from 'react-router-dom';
import { ROUTES } from '../router/paths';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1A0B2E] to-[#2D0A31] p-4">
      <div className="max-w-4xl text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold">
          <span className="text-white">Bienvenida a </span>
          <span className="bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] bg-clip-text text-transparent">
            EYRA
          </span>
        </h1>
        
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Tu compañera para el seguimiento y análisis del ciclo menstrual.
          Toma el control de tu bienestar con información personalizada.
        </p>
        
        <div className="pt-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            to={ROUTES.REGISTER}
            className="px-8 py-3 bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] rounded-lg text-white font-semibold 
                     transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(255,45,175,0.5)] 
                     transform hover:scale-105"
          >
            Comenzar
          </Link>
          
          <Link
            to={ROUTES.LOGIN}
            className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 
                     rounded-lg text-white font-semibold transition-all duration-300"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        <div className="bg-[#ffffff08] backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-[#FF2DAF]/30 transition-all duration-300">
          <div className="w-12 h-12 mb-4 rounded-lg bg-gradient-to-r from-[#FF2DAF]/20 to-[#9B4DFF]/20 
                         flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF2DAF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Seguimiento del Ciclo</h3>
          <p className="text-white/70">Registra tu ciclo menstrual y síntomas para obtener información personalizada.</p>
        </div>
        
        <div className="bg-[#ffffff08] backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-[#FF2DAF]/30 transition-all duration-300">
          <div className="w-12 h-12 mb-4 rounded-lg bg-gradient-to-r from-[#FF2DAF]/20 to-[#9B4DFF]/20 
                         flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#9B4DFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Análisis Inteligente</h3>
          <p className="text-white/70">Obtén análisis detallados de tus patrones y predicciones personalizadas.</p>
        </div>
        
        <div className="bg-[#ffffff08] backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-[#FF2DAF]/30 transition-all duration-300">
          <div className="w-12 h-12 mb-4 rounded-lg bg-gradient-to-r from-[#FF2DAF]/20 to-[#9B4DFF]/20 
                         flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF2DAF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Privacidad Garantizada</h3>
          <p className="text-white/70">Tu información es confidencial y segura. Tú tienes el control total de tus datos.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;