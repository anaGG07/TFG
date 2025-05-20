import { useState, useEffect } from 'react';
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
    className="absolute -top-32 -left-32 w-[120px] h-[120px] z-0 transition-all duration-700"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: "blur(1.5px)" }}
  >
    <path
      d="M60,10
        C90,5 115,35 110,60
        C115,85 90,115 60,110
        C30,115 5,85 10,60
        C5,35 30,5 60,10Z"
      fill="var(--color-primary, #5b0108)"
      fillOpacity="0.22"
    />
  </svg>
);

export const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuIndex, setMenuIndex] = useState(0);
  const visibleOptions = 2;
  const menuOptions = isAuthenticated ? MENU_OPTIONS_AUTH : MENU_OPTIONS_PUBLIC;

  // Controlar visibilidad desde window.__SHOW_NAVBAR__
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    // @ts-ignore
    setVisible(window.__SHOW_NAVBAR__ !== false);
    const interval = setInterval(() => {
      // @ts-ignore
      setVisible(window.__SHOW_NAVBAR__ !== false);
    }, 200);
    return () => clearInterval(interval);
  }, []);

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

  if (!visible) return null;

  return (
    <div className="absolute top-0 left-0 z-20 flex flex-col items-start justify-start h-[120px] w-[120px] pointer-events-none select-none transition-opacity duration-700 opacity-100">
      <OvuloSVG />
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Flecha arriba */}
        <button
          aria-label="Anterior opción"
          className="absolute left-1/2 -translate-x-1/2 top-2 bg-white/70 rounded-full shadow p-1 border border-primary text-primary hover:bg-primary hover:text-white transition pointer-events-auto"
          onClick={() => rotateMenu(-1)}
          tabIndex={0}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
        </button>
        {/* Opciones del menú */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-3 items-center">
          {/* Botón EYRA (inicio) */}
          <button
            aria-label="Ir a inicio"
            className="mb-1 text-2xl font-serif font-bold tracking-tight text-primary drop-shadow-lg bg-white/80 rounded-full px-4 py-1 border-2 border-primary hover:bg-primary hover:text-white transition pointer-events-auto"
            onClick={() => navigate("/")}
            tabIndex={0}
          >
            EYRA
          </button>
          {getVisibleOptions().map((opt) => (
            <button
              key={opt.label}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border-2 border-primary text-primary font-semibold text-base shadow hover:bg-primary hover:text-white transition pointer-events-auto"
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
          className="absolute left-1/2 -translate-x-1/2 bottom-2 bg-white/70 rounded-full shadow p-1 border border-primary text-primary hover:bg-primary hover:text-white transition pointer-events-auto"
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
      `}</style>
    </div>
  );
};
