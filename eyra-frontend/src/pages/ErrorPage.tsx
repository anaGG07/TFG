import { useRouteError, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Importar el contexto de autenticación

const ErrorPage = () => {
  const error = useRouteError() as any;
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Usar el contexto de autenticación

  const handleReturn = () => {
    // Si está autenticado, navegar al dashboard preservando el estado de autenticación
    if (isAuthenticated) {
      navigate('/dashboard', { 
        replace: true, 
        state: { preserveAuth: true } // Flag especial para indicar que se debe preservar la autenticación
      });
    } else {
      // Si no está autenticado, ir a la página de inicio
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#300808] to-[#5b0108]">
      <div className="max-w-lg p-8 bg-white/5 backdrop-blur-md rounded-xl border border-[#5b010820] shadow-2xl">
        <h1 className="text-3xl font-bold text-[#e7e0d5] mb-4">Oops...</h1>
        <p className="text-[#e7e0d5]/80 mb-4">
          Lo sentimos, ha ocurrido un error inesperado.
        </p>
        <p className="p-4 bg-[#9d0d0b]/10 border border-[#9d0d0b]/40 rounded-lg text-[#9d0d0b] font-mono text-sm">
          {error?.statusText || error?.message || "Error desconocido"}
        </p>
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleReturn}
            className="px-6 py-3 bg-[#5b0108] text-[#e7e0d5] rounded-lg font-semibold 
                     hover:bg-[#9d0d0b] transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
