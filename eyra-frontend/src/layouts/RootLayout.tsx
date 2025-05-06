import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../router/paths";

const RootLayout = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.REGISTER;
  const isHome = location.pathname === ROUTES.HOME;
  const isTransparentNav = isAuthPage || isHome;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Nav con posicionamiento absoluto para no interferir con el fondo */}
      <nav
        className={`absolute top-5 left-0 right-0 z-50 transition-all duration-300 ${
          isTransparentNav ? "bg-transparent" : "bg-primary-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            {/* Sección izquierda del nav */}
            <div className="flex items-center">
              <NavLink
                to={ROUTES.HOME}
                className="flex items-center gap-2 group"
              >
                {/* Icono del logo - Flor menstrual */}
                <div className="relative">
                  <div
                    className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 
                                  flex items-center justify-center transform group-hover:scale-105 
                                  transition-all duration-300 shadow-[0_0_15px_rgba(225,29,72,0.5)]"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-white"
                    >
                      <path d="M12 2c2.5 0 4 1.5 4 4 0 1.5-1 2.5-2 3 1 .5 2 1.5 2 3 0 2.5-1.5 4-4 4-2.5 0-4-1.5-4-4 0-1.5 1-2.5 2-3-1-.5-2-1.5-2-3 0-2.5 1.5-4 4-4zm0 2c-1.25 0-2 .75-2 2s.75 2 2 2 2-.75 2-2-.75-2-2-2zm0 6c-1.25 0-2 .75-2 2s.75 2 2 2 2-.75 2-2-.75-2-2-2z" />
                    </svg>
                  </div>
                  {/* Efecto de brillo detrás del logo */}
                  <div
                    className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 
                                  rounded-lg blur opacity-30 group-hover:opacity-40 
                                  transition-opacity duration-300"
                  ></div>
                </div>

                {/* Texto del logo */}
                <div className="flex items-center">
                  <span
                    className="text-xl font-bold bg-gradient-to-r from-white to-white/80 
                                   bg-clip-text text-transparent"
                  >
                    E
                  </span>
                  <span
                    className="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 
                                   bg-clip-text text-transparent"
                  >
                    YRA
                  </span>
                </div>
              </NavLink>
              {isAuthenticated && (
                <div className="flex space-x-4 ml-10">
                  <NavLink
                    to={ROUTES.DASHBOARD}
                    className={({ isActive }) =>
                      `hover:text-purple-400 ${
                        isTransparentNav
                          ? "text-white/80 hover:text-white"
                          : "text-white"
                      } ${isActive ? "text-primary-500 font-medium" : ""}`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to={ROUTES.CALENDAR}
                    className={({ isActive }) =>
                      `hover:text-purple-400 ${
                        isTransparentNav
                          ? "text-white/80 hover:text-white"
                          : "text-white"
                      } ${isActive ? "text-[#FF2DAF]" : ""}`
                    }
                  >
                    Calendario
                  </NavLink>
                  <NavLink
                    to={ROUTES.INSIGHTS}
                    className={({ isActive }) =>
                      `hover:text-purple-400 ${
                        isTransparentNav
                          ? "text-white/80 hover:text-white"
                          : "text-white"
                      } ${isActive ? "text-[#FF2DAF]" : ""}`
                    }
                  >
                    Análisis
                  </NavLink>
                  <NavLink
                    to={ROUTES.PROFILE}
                    className={({ isActive }) =>
                      `hover:text-purple-400 ${
                        isTransparentNav
                          ? "text-white/80 hover:text-white"
                          : "text-white"
                      }`
                    }
                  >
                    Perfil
                  </NavLink>
                </div>
              )}
            </div>

            {/* Sección derecha del nav */}
            <div className="flex items-center">
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className={`${
                    isTransparentNav
                      ? "bg-primary-500/20 shadow-md text-white hover:bg-primary-500"
                      : "bg-primary-500/20 shadow-md text-white hover:bg-primary-500"
                  } font-bold py-2 px-4 rounded-lg transition-colors duration-300`}
                >
                  Cerrar Sesión
                </button>
              ) : location.pathname === ROUTES.LOGIN ? (
                <NavLink
                  to={ROUTES.REGISTER}
                  className={`${
                    isTransparentNav
                      ? "bg-[#ff2dae51] shadow-2xl text-white hover:bg-[#FF2DAF]"
                      : "bg-[#ff2dae51] shadow-2xl text-white hover:bg-[#FF2DAF]"
                  } font-bold py-2 px-4 rounded-lg transition-colors duration-300`}
                >
                  Regístrate
                </NavLink>
              ) : location.pathname === ROUTES.REGISTER ? (
                <NavLink
                  to={ROUTES.LOGIN}
                  className={`${
                    isTransparentNav
                      ? "bg-[#ff2dae51] shadow-2xl text-white hover:bg-[#FF2DAF]"
                      : "bg-[#ff2dae51] shadow-2xl text-white hover:bg-[#FF2DAF]"
                  } font-bold py-2 px-4 rounded-lg transition-colors duration-300`}
                >
                  Inicia Sesión
                </NavLink>
              ) : (
                <NavLink
                  to={ROUTES.LOGIN}
                  className={`${
                    isTransparentNav
                      ? "bg-[#ff2dae51] shadow-2xl text-white hover:bg-[#FF2DAF]"
                      : "bg-[#ff2dae51] shadow-2xl text-white hover:bg-[#FF2DAF]"
                  } font-bold py-2 px-4 rounded-lg transition-colors duration-300`}
                >
                  Iniciar Sesión
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main con clase condicional */}
      <main className="flex-grow relative">
        <Outlet />
      </main>

      {/* Footer con posicionamiento absoluto */}
      <footer
        className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300
               backdrop-blur-md border-t border-white/10
               ${isTransparentNav ? "bg-[#1A0B2E]/5" : "bg-[#1A0B2E]/30"}`}
      >
        <div className="max-w-7xl mx-auto px-8 py-5">
          <div className="flex items-center justify-center gap-6">
            <p className="text-white/90 font-medium">
              <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                EYRA
              </span>
              <span className="mx-2 text-white/60">©</span>
              <span className="text-white/80">2025 by</span>
              <span className="ml-2 text-white font-semibold hover:text-primary-500 transition-colors">
                Ana María García
              </span>
            </p>
            <div className="h-4 w-[1px] bg-gradient-to-b from-primary-500 to-secondary-500 opacity-50"></div>
            <a
              href="https://github.com/anaGG07"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2 rounded-xl
                       bg-white/5 hover:bg-white/10 border border-white/10
                       hover:border-primary-500/40 transition-all duration-300
                       group"
            >
              <svg
                className="w-5 h-5 text-white/70 group-hover:text-primary-500 transition-colors"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <span className="font-medium text-white/70 group-hover:text-white transition-colors">
                GitHub
              </span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;