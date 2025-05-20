import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Opciones del menú para usuarios autenticados y no autenticados
const MENU_OPTIONS_PUBLIC = [
  {
    label: "Iniciar Sesión",
    route: "/login",
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
    route: "/register",
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

const MENU_OPTIONS_AUTH = [
  {
    label: "Dashboard",
    route: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <rect x="3" y="13" width="7" height="8" />
        <rect x="14" y="8" width="7" height="13" />
        <rect x="8" y="3" width="8" height="18" />
      </svg>
    ),
  },
  {
    label: "Perfil",
    route: "/profile",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="12" cy="8" r="4" />
        <path d="M16 16v2a4 4 0 0 1-8 0v-2" />
      </svg>
    ),
  },
  {
    label: "Cerrar Sesión",
    route: "/logout",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
    isLogout: true,
  },
];

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

export const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuIndex, setMenuIndex] = useState(0);
  const visibleOptions = 2;
  const menuOptions = isAuthenticated ? MENU_OPTIONS_AUTH : MENU_OPTIONS_PUBLIC;

  // Rotar menú
  const rotateMenu = (dir: 1 | -1) => {
    setMenuIndex((prev) => (prev + dir + menuOptions.length) % menuOptions.length);
  };

  // Opciones visibles (simula ciclo)
  const getVisibleOptions = () => {
    const opts = [];
    for (let i = 0; i < visibleOptions; i++) {
      opts.push(menuOptions[(menuIndex + i) % menuOptions.length]);
    }
    return opts;
  };

  const handleMenuClick = (opt: any) => {
    if (opt.isLogout) {
      logout();
      navigate('/login');
    } else {
      navigate(opt.route);
    }
  };

  return (
    <div className="absolute top-0 left-0 z-20 flex flex-col items-start justify-start h-[320px] w-[320px] pointer-events-none select-none">
      <OvuloSVG />
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
            onClick={() => navigate("/")}
            tabIndex={0}
          >
            EYRA
          </button>
          {getVisibleOptions().map((opt) => (
            <button
              key={opt.label}
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 border-2 border-primary text-primary font-semibold text-lg shadow hover:bg-primary hover:text-white transition pointer-events-auto"
              tabIndex={0}
              aria-label={opt.label}
              onClick={() => handleMenuClick(opt)}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
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
      <style>{`
        .border-primary { border-color: var(--color-primary); }
        .text-primary { color: var(--color-primary); }
        .hover\:bg-primary:hover { background-color: var(--color-primary); }
        .hover\:text-white:hover { color: #fff; }
        .animate-ovulo-spin {
          animation: ovulo-spin 18s linear infinite;
        }
        @keyframes ovulo-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
