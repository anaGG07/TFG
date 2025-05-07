import { Link } from "react-router-dom";
import { ROUTES } from "../router/paths";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#e7e0d5] p-4">
      {/* Header con logo y nombre */}
      <div className="max-w-5xl w-full text-center space-y-8 mb-12">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="relative w-20 h-20 md:w-24 md:h-24">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#5b0108] flex items-center justify-center">
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif tracking-tight text-[#5b0108]">
            EYRA
          </h1>
        </div>

        <h2 className="text-3xl md:text-4xl font-serif text-[#9d0d0b] max-w-3xl mx-auto leading-tight">
          Tu compañera para el seguimiento y análisis del ciclo menstrual
        </h2>

        <p className="text-xl text-[#300808] max-w-2xl mx-auto font-['Inter']">
          Toma el control de tu bienestar con información personalizada adaptada
          a tu ciclo único.
        </p>

        <div className="pt-6 flex flex-col sm:flex-row gap-6 items-center justify-center">
          <Link
            to={ROUTES.REGISTER}
            className="px-8 py-4 bg-[#5b0108] rounded-lg text-[#e7e0d5] font-medium 
                     transition-all duration-300 shadow-md hover:shadow-lg 
                     transform hover:scale-105 font-['Inter'] tracking-wide"
          >
            Comenzar
          </Link>

          <Link
            to={ROUTES.LOGIN}
            className="px-8 py-4 bg-transparent border-2 border-[#5b0108]
                     rounded-lg text-[#5b0108] font-medium transition-all duration-300 font-['Inter'] tracking-wide hover:bg-[#5b0108]/10"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>

      {/* Características principales */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          {
            title: "Seguimiento del Ciclo",
            iconPath:
              "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
            description:
              "Registra tu ciclo menstrual y síntomas para obtener información personalizada que te ayuda a conocer mejor tu cuerpo.",
          },
          {
            title: "Análisis Inteligente",
            iconPath:
              "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
            description:
              "Obtén análisis detallados de tus patrones y predicciones personalizadas para anticipar cambios y planificar con confianza.",
          },
          {
            title: "Privacidad Garantizada",
            iconPath:
              "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
            description:
              "Tu información es confidencial y segura. Tú tienes el control total de tus datos en todo momento.",
          },
        ].map(({ title, iconPath, description }) => (
          <div
            key={title}
            className="bg-white p-8 rounded-xl shadow-sm border border-[#5b0108]/10 hover:border-[#5b0108]/30 transition-all duration-300"
          >
            <div className="w-16 h-16 mb-6 rounded-full bg-[#5b0108]/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#5b0108]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d={iconPath}
                />
              </svg>
            </div>
            <h3 className="text-2xl font-serif text-[#9d0d0b] mb-3">{title}</h3>
            <p className="text-[#300808] font-['Inter']">{description}</p>
          </div>
        ))}
      </div>

      {/* Banner inferior */}
      <div className="w-full bg-[#5b0108] py-12 px-4 rounded-xl max-w-5xl">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-serif text-white mb-4">
            Comienza tu viaje hacia el bienestar
          </h2>
          <p className="text-white/90 mb-8 font-['Inter']">
            Únete a miles de mujeres que han transformado su relación con su
            ciclo menstrual.
          </p>
          <Link
            to={ROUTES.REGISTER}
            className="inline-block px-8 py-4 bg-white rounded-lg text-[#5b0108] font-medium 
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
