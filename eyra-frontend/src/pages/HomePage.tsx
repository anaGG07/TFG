import { Link } from 'react-router-dom';
import { ROUTES } from '../router/paths';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFD0C9] p-4">
      {/* Header con logo y nombre */}
      <div className="max-w-5xl w-full text-center space-y-8 mb-12">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="relative w-20 h-20 md:w-24 md:h-24">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#C62328] flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 text-[#FFD0C9]" fill="currentColor">
                <path d="M50,20 C65,20 70,35 70,50 C70,65 65,80 50,80 C35,80 30,65 30,50 C30,35 35,20 50,20 Z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif tracking-tight text-primary-DEFAULT">
            EYRA<span className="block">CLUB</span>
          </h1>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-serif text-[#9f1239] max-w-3xl mx-auto leading-tight">
          Tu compañera para el seguimiento y análisis del ciclo menstrual
        </h2>
        
        <p className="text-xl text-[#701a29] max-w-2xl mx-auto font-['Inter']">
          Toma el control de tu bienestar con información personalizada
          adaptada a tu ciclo único.
        </p>
        
        <div className="pt-6 flex flex-col sm:flex-row gap-6 items-center justify-center">
          <Link
            to={ROUTES.REGISTER}
            className="px-8 py-4 bg-[#C62328] rounded-lg text-white font-medium 
                     transition-all duration-300 shadow-md hover:shadow-lg 
                     transform hover:scale-105 font-['Inter'] tracking-wide"
          >
            Comenzar
          </Link>
          
          <Link
            to={ROUTES.LOGIN}
            className="px-8 py-4 bg-transparent border-2 border-[#C62328]
                     rounded-lg text-[#C62328] font-medium transition-all duration-300 font-['Inter'] tracking-wide"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
      
      {/* Características principales */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-[#C62328]/10 hover:border-[#C62328]/30 transition-all duration-300">
          <div className="w-16 h-16 mb-6 rounded-full bg-[#C62328]/10
                       flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#C62328]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-serif text-[#9f1239] mb-3">Seguimiento del Ciclo</h3>
          <p className="text-[#701a29] font-['Inter']">Registra tu ciclo menstrual y síntomas para obtener información personalizada que te ayuda a conocer mejor tu cuerpo.</p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-sm border border-[#C62328]/10 hover:border-[#C62328]/30 transition-all duration-300">
          <div className="w-16 h-16 mb-6 rounded-full bg-[#C62328]/10
                       flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#C62328]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-serif text-[#9f1239] mb-3">Análisis Inteligente</h3>
          <p className="text-[#701a29] font-['Inter']">Obtén análisis detallados de tus patrones y predicciones personalizadas para anticipar cambios y planificar con confianza.</p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-sm border border-[#C62328]/10 hover:border-[#C62328]/30 transition-all duration-300">
          <div className="w-16 h-16 mb-6 rounded-full bg-[#C62328]/10
                       flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#C62328]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-2xl font-serif text-[#9f1239] mb-3">Privacidad Garantizada</h3>
          <p className="text-[#701a29] font-['Inter']">Tu información es confidencial y segura. Tú tienes el control total de tus datos en todo momento.</p>
        </div>
      </div>
      
      {/* Banner inferior */}
      <div className="w-full bg-[#C62328] py-12 px-4 rounded-xl max-w-5xl">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-serif text-white mb-4">Comienza tu viaje hacia el bienestar</h2>
          <p className="text-white/90 mb-8 font-['Inter']">Únete a miles de mujeres que han transformado su relación con su ciclo menstrual.</p>
          <Link
            to={ROUTES.REGISTER}
            className="inline-block px-8 py-4 bg-white rounded-lg text-[#C62328] font-medium 
                     transition-all duration-300 shadow-md hover:shadow-lg font-['Inter'] tracking-wide"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;