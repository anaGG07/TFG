import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../router/paths";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

// Opciones del menú
const MENU_OPTIONS = [
  {
    label: "Iniciar Sesión",
    route: ROUTES.LOGIN,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <polyline points="10 17 15 12 10 7" />
        <line x1="15" y1="12" x2="3" y2="12" />
      </svg>
    ),
  },
  {
    label: "Registrarse",
    route: ROUTES.REGISTER,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="12" cy="8" r="4" />
        <path d="M16 16v2a4 4 0 0 1-8 0v-2" />
        <line x1="20" y1="21" x2="20" y2="17" />
        <line x1="20" y1="17" x2="16" y2="17" />
      </svg>
    ),
  },
  {
    label: "Acerca de",
    route: "/about",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="8" />
      </svg>
    ),
  },
];

// SVG sólido tipo óvulo animado
const OvuloSVG = () => (
  <svg
    className="absolute -top-32 -left-32 w-[420px] h-[420px] z-0 animate-ovulo-spin"
    viewBox="0 0 600 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: "blur(0.5px)" }}
  >
    <path
      d="M300,100
        C400,80 520,180 500,300
        C520,420 400,520 300,500
        C200,520 80,420 100,300
        C80,180 200,80 300,100Z"
      fill="var(--color-primary, #5b0108)"
      fillOpacity="0.18"
    />
  </svg>
);

const HomePage = () => {
  const { isAuthenticated, isLoading, refreshSession } = useAuth();
  const navigate = useNavigate();
  const [menuIndex, setMenuIndex] = useState(0);
  const visibleOptions = 2;

  useEffect(() => {
    // Verificar automáticamente si hay una sesión activa al cargar la página
    const checkExistingSession = async () => {
      // Verificar directamente si hay una cookie JWT
      const hasJwtCookie = document.cookie.includes('jwt_token=');
      
      console.log('HomePage: Verificando sesión existente', { 
        isAuthenticated, 
        isLoading, 
        hasJwtCookie,
        cookies: document.cookie
      });
      
      if (hasJwtCookie && !isAuthenticated && !isLoading) {
        console.log('HomePage: Cookie JWT detectada, intentando refrescar sesión');
        const success = await refreshSession();
        if (success) {
          console.log('HomePage: Sesión refrescada correctamente, redirigiendo a dashboard');
          navigate(ROUTES.DASHBOARD, { replace: true });
        } else {
          console.log('HomePage: No se pudo refrescar la sesión a pesar de tener cookie');
        }
      } else if (isAuthenticated && !isLoading) {
        console.log('HomePage: Usuario ya autenticado, redirigiendo a dashboard');
        navigate(ROUTES.DASHBOARD, { replace: true });
      }
    };
    
    checkExistingSession();
  }, [isAuthenticated, isLoading, navigate, refreshSession]);

  // Rotar menú
  const rotateMenu = (dir: 1 | -1) => {
    setMenuIndex((prev) => (prev + dir + MENU_OPTIONS.length) % MENU_OPTIONS.length);
  };

  // Opciones visibles (simula ciclo)
  const getVisibleOptions = () => {
    const opts = [];
    for (let i = 0; i < visibleOptions; i++) {
      opts.push(MENU_OPTIONS[(menuIndex + i) % MENU_OPTIONS.length]);
    }
    return opts;
  };

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
    <div className="w-screen h-screen overflow-hidden bg-bg flex items-center justify-center relative select-none">
      {/* Óvulo animado de fondo */}
      <OvuloSVG />

      {/* Menú circular */}
      <div className="absolute top-0 left-0 z-10 flex flex-col items-start justify-start h-[320px] w-[320px] pointer-events-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Flecha arriba */}
          <button
            aria-label="Anterior opción"
            className="absolute left-1/2 -translate-x-1/2 top-8 bg-white/70 rounded-full shadow p-1 border border-primary text-primary hover:bg-primary hover:text-white transition pointer-events-auto"
            onClick={() => rotateMenu(-1)}
            tabIndex={0}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
          </button>

          {/* Opciones del menú */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-6 items-center">
            {/* Botón EYRA (inicio) */}
            <button
              aria-label="Ir a inicio"
              className="mb-2 text-4xl font-serif font-bold tracking-tight text-primary drop-shadow-lg bg-white/80 rounded-full px-6 py-2 border-2 border-primary hover:bg-primary hover:text-white transition pointer-events-auto"
              onClick={() => navigate(ROUTES.HOME)}
              tabIndex={0}
            >
              EYRA
            </button>
            {getVisibleOptions().map((opt, idx) => (
              <Link
                key={opt.label}
                to={opt.route}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 border-2 border-primary text-primary font-semibold text-lg shadow hover:bg-primary hover:text-white transition pointer-events-auto"
                tabIndex={0}
                aria-label={opt.label}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </Link>
            ))}
          </div>

          {/* Flecha abajo */}
          <button
            aria-label="Siguiente opción"
            className="absolute left-1/2 -translate-x-1/2 bottom-8 bg-white/70 rounded-full shadow p-1 border border-primary text-primary hover:bg-primary hover:text-white transition pointer-events-auto"
            onClick={() => rotateMenu(1)}
            tabIndex={0}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="z-20 flex flex-col items-center justify-center w-full h-full fade-in">
        <h1 className="text-6xl md:text-7xl font-serif font-bold text-primary mb-6 tracking-tight drop-shadow-lg">EYRA</h1>
        <h2 className="text-3xl md:text-4xl font-serif text-primary/80 mb-8 max-w-2xl text-center leading-tight">
          Tu compañera para el seguimiento y análisis del ciclo menstrual
        </h2>
        <p className="text-xl text-primary/70 max-w-xl text-center mb-12 font-['Inter']">
          Toma el control de tu bienestar con información personalizada adaptada a tu ciclo único.
        </p>
      </main>

      {/* Animación personalizada para el óvulo */}
      <style>{`
        :root {
          --color-primary: #5b0108;
          --color-bg: #e7e0d5;
        }
        .bg-bg { background-color: var(--color-bg); }
        .text-primary { color: var(--color-primary); }
        .border-primary { border-color: var(--color-primary); }
        .hover\:bg-primary:hover { background-color: var(--color-primary); }
        .hover\:text-white:hover { color: #fff; }
        .animate-ovulo-spin {
          animation: ovulo-spin 18s linear infinite;
        }
        @keyframes ovulo-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .fade-in {
          animation: fadeIn 1.2s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
