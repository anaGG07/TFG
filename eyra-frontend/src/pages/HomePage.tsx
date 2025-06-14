import React from "react";
import Blob from "../components/Blob";
import { Link } from "react-router-dom";
import { ROUTES } from "../router/paths";

const EYRAEntrancePage = () => {
  // Tamaño de la ventana para el Blob
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
          radius={dimensions.height / 2.1}
        />
      </div>
      {/* Contenido encima, pero no bloquea el canvas salvo los botones */}
      <main className="p-6 md:p-8 w-full max-w-md z-10 relative text-center pointer-events-none flex flex-col items-center">
        {/* Título con sombra y animación */}
        <h1
          className="font-serif text-6xl md:text-7xl font-extrabold mb-2 drop-shadow-[0_4px_24px_rgba(198,35,40,0.5)] animate-fade-in"
          style={{
            color: "#E7E0D5",
            letterSpacing: "0.04em",
            textShadow: "0 2px 24px #C62328, 0 1px 0 #fff",
          }}
        >
          EYRA
        </h1>
        {/* Separador decorativo */}
        <div className="w-16 h-1 rounded-full bg-[#E7E0D5] mb-6 animate-grow" />
        {/* Subtítulo inspirador */}
        <p
          className="text-xl md:text-2xl font-light mb-15 animate-fade-in"
          style={{
            color: "#E7E0D5",
            letterSpacing: "0.01em",
          }}
        >
          Tu ciclo, tu poder. Descubre, conecta y evoluciona con EYRA.
        </p>
        {/* Botones glassmorphism */}
        <div className="flex gap-5 mb-8 w-full">
          <Link
            to="/login"
            className="px-8 py-3 mb-10  text-[#E7E0D5] font-bold text-lg rounded-full shadow-lg transition-all  hover:shadow-[0_4px_24px_0_#E7E0D540] mx-auto pointer-events-auto"
            style={{
              letterSpacing: "0.02em",
            }}
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="px-10 py-3 mb-10  text-[#E7E0D5] font-bold text-lg rounded-full shadow-lg transition-all  hover:shadow-[0_4px_24px_0_#E7E0D540] mx-auto pointer-events-auto"
            style={{
              letterSpacing: "0.02em",
            }}
          >
            Registrarse
          </Link>
        </div>
        {/* Enlace About */}
        <Link
          to={ROUTES.ABOUT}
          className="text-xl hover:text-2xl pointer-events-auto transition-all duration-600 ease-in-out"
          style={{ color: "#E7E0D5" }}
        >
          Sobre EYRA
        </Link>

        {/* Animaciones keyframes */}
        <style>
          {`
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(24px);}
              to { opacity: 1; transform: translateY(0);}
            }
            .animate-fade-in {
              animation: fade-in 1.2s cubic-bezier(.4,0,.2,1) both;
            }
            @keyframes grow {
              from { width: 0; opacity: 0;}
              to { width: 4rem; opacity: 1;}
            }
            .animate-grow {
              animation: grow 1.2s 0.5s cubic-bezier(.4,0,.2,1) both;
            }
          `}
        </style>
      </main>
    </div>
  );
};

export default EYRAEntrancePage;
