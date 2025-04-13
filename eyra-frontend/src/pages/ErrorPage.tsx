import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError() as any;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1A0B2E] to-[#2D0A31]">
      <div className="max-w-lg p-8 bg-[#13071d]/50 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-4">Oops!</h1>
        <p className="text-white/80 mb-4">Lo sentimos, ha ocurrido un error inesperado.</p>
        <p className="p-4 bg-[#ffffff08] rounded-lg text-red-400/90 font-mono text-sm">
          {error?.statusText || error?.message || "Error desconocido"}
        </p>
        <div className="mt-6 flex justify-center">
          <a
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-[#FF2DAF]/80 to-[#9B4DFF]/80 
                     hover:from-[#FF2DAF] hover:to-[#9B4DFF] rounded-lg text-white font-semibold
                     transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(255,45,175,0.5)]"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;