import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../router/paths";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const HomePage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si el usuario está autenticado, redirigir al dashboard
    if (isAuthenticated && !isLoading) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Si está cargando, mostrar un spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e7e0d5]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5b0108]"></div>
      </div>
    );
  }

  // Si no está autenticado, mostrar la página de inicio
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#e7e0d5] p-4">
      {/* Header con logo y nombre */}
      <div className="max-w-5xl w-full text-center space-y-8 mb-12">
        <div className="flex items-center justify-center gap-4 mb-8">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl w-full mb-12">
        {[
          {
            title: "Seguimiento Personalizado",
            iconPath: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
            description: "Registra y analiza tu ciclo menstrual con precisión, adaptado a tus necesidades específicas."
          },
          {
            title: "Insights Inteligentes",
            iconPath: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
            description: "Recibe análisis detallados y predicciones basadas en tus datos para entender mejor tu ciclo."
          },
          {
            title: "Contenido Adaptado",
            iconPath: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
            description: "Accede a recursos y recomendaciones personalizadas según tu fase del ciclo."
          }
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
