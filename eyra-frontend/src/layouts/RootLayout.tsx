import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../router/paths";

const RootLayout = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const isTransparentNav = location.pathname === ROUTES.HOME;

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-[#9d0d0b] underline font-semibold px-3 py-2"
      : `text-[#5b0108]/80 hover:text-[#9d0d0b] px-3 py-2 ${
          isTransparentNav ? "hover:text-[#9d0d0b]" : "text-[#5b0108]"
        }`;

  return (
    <div className="min-h-screen bg-[#e7e0d5] text-[#5b0108] font-sans flex flex-col">
      <header
        className={`${
          isTransparentNav ? "bg-transparent" : "bg-[#e7e0d5]"
        } border-b border-[#5b010820] shadow-sm`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-wide text-[#5b0108]">
            EYRA
          </h1>
          <nav className="space-x-4">
            <NavLink to={ROUTES.HOME} className={getLinkClass}>
              Inicio
            </NavLink>
            <NavLink to={ROUTES.CALENDAR} className={getLinkClass}>
              Calendario
            </NavLink>
            <NavLink to={ROUTES.INSIGHTS} className={getLinkClass}>
              Análisis
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to={ROUTES.PROFILE} className={getLinkClass}>
                  Perfil
                </NavLink>
                <button
                  onClick={logout}
                  className="text-[#5b0108]/70 hover:text-[#9d0d0b] font-medium transition-colors px-3 py-2"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <NavLink to={ROUTES.LOGIN} className={getLinkClass}>
                  Iniciar sesión
                </NavLink>
                <NavLink to={ROUTES.REGISTER} className={getLinkClass}>
                  Crear cuenta
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        <Outlet />
      </main>

      <footer className="text-center text-sm text-[#5b0108]/60 py-6 border-t border-[#5b010820]">
        &copy; {new Date().getFullYear()} EYRA — Todos los derechos reservados
      </footer>
    </div>
  );
};

export default RootLayout;
