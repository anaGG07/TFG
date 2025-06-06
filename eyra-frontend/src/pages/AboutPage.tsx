import React from "react";
import Blob from "../components/Blob";
import { Link } from "react-router-dom";
import { ROUTES } from "../router/paths";

const AboutPage = () => {
  const [dimensions, setDimensions] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  React.useEffect(() => {
    const handleResize = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-screen h-screen relative overflow-hidden flex items-center justify-center">
      {/* Blob de fondo */}
      <div className="absolute inset-0 z-0">
        <Blob
          width={dimensions.width}
          height={dimensions.height}
          color="#C62328"
          radius={dimensions.width < 700 ? Math.max(dimensions.width, dimensions.height) * 0.5 : Math.max(dimensions.width, dimensions.height) * 0.4}
        />
        {/* SVG decorativo centrado */}
        <img
          src="/img/10.svg"
          alt="Decoración EYRA"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{
            width: dimensions.width > 900 ? "700px" : "90vw",
            maxWidth: "100vw",
            opacity: 0.5,
            zIndex: 1,
          }}
        />
      </div>

      <main className="p-2 md:p-6 w-full max-w-xl z-10 relative text-center flex flex-col gap-2 md:gap-6">
        <h1
          className="font-serif text-2xl md:text-4xl font-extrabold mb-2 md:mb-4 drop-shadow-[0_4px_24px_rgba(198,35,40,0.5)]"
          style={{
            color: "#E7E0D5",
            letterSpacing: "0.04em",
            textShadow: "0 2px 24px #C62328, 0 1px 0 #fff",
          }}
        >
          Sobre EYRA
        </h1>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-6 mb-2 md:mb-4">
          <div className="bg-[#E7E0D5]/10 backdrop-blur-sm rounded-2xl p-2 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300">
            <h2
              className="text-base md:text-xl font-bold mb-1 md:mb-2"
              style={{ color: "#E7E0D5" }}
            >
              Nuestra Misión
            </h2>
            <p className="text-xs md:text-base" style={{ color: "#E7E0D5" }}>
              EYRA nace como un espacio seguro y completo para el seguimiento y
              comprensión del ciclo femenino. Más que una app, somos tu
              compañera en cada fase de tu vida.
            </p>
          </div>

          <div className="bg-[#E7E0D5]/10 backdrop-blur-sm rounded-2xl p-2 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300">
            <h2
              className="text-base md:text-xl font-bold mb-1 md:mb-2"
              style={{ color: "#E7E0D5" }}
            >
              Características Principales
            </h2>
            <ul className="text-xs md:text-base space-y-1 md:space-y-2" style={{ color: "#E7E0D5" }}>
              <li>• Seguimiento personalizado del ciclo</li>
              <li>• Alertas inteligentes y recordatorios</li>
              <li>• Recomendaciones nutricionales y de ejercicio</li>
              <li>• Asistente IA especializado en salud femenina</li>
            </ul>
          </div>
        </div>

        <div className="bg-[#E7E0D5]/10 backdrop-blur-sm rounded-2xl p-2 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300 mb-2 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4" style={{ color: "#E7E0D5" }}>
            Compromiso con la Inclusividad
          </h2>
          <p className="text-xs md:text-base" style={{ color: "#E7E0D5" }}>
            EYRA es un espacio para todas las personas. Acompañamos a mujeres,
            personas en transición, parejas y familias en su viaje hacia una
            mejor comprensión y cuidado de la salud femenina.
          </p>
        </div>

        <Link
          to={ROUTES.HOME}
          className="inline-block bg-[#E7E0D5] px-4 py-1 md:px-6 md:py-2 text-[#5b0108] font-bold text-xs md:text-base rounded-full shadow-lg transition-all hover:shadow-[0_4px_24px_0_#E7E0D540]"
          style={{
            letterSpacing: "0.02em",
          }}
        >
          Volver al Inicio
        </Link>
      </main>
    </div>
  );
};

export default AboutPage; 
