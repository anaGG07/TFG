import { Outlet, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { CycleProvider } from "../context/CycleContext";
import CircularNavigation from "../components/CircularNavigation";

// Rutas donde mostrar la navegación circular
const AUTHENTICATED_ROUTES = [
  "/dashboard",
  "/calendar",
  "/insights",
  "/profile",
  "/settings",
  "/admin",
  "/tracking",
  "/library",
];

// Verificar si la ruta actual necesita navegación
const needsNavigation = (pathname: string) => {
  return AUTHENTICATED_ROUTES.some((route) => {
    // Exact match or starts with route followed by / or end of string
    return pathname === route || pathname.startsWith(route + "/");
  });
};

// Componente interno que maneja la navegación condicional
const RootContent = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Determinar si mostrar navegación circular
  const shouldShowNavigation =
    isAuthenticated &&
    user?.onboardingCompleted &&
    needsNavigation(location.pathname);

  console.log("RootLayout: Navegación circular:", {
    shouldShow: shouldShowNavigation,
    path: location.pathname,
    isAuthenticated,
    onboardingCompleted: user?.onboardingCompleted,
    userObject: user,
    routeMatches: AUTHENTICATED_ROUTES.map(route => ({ route, matches: location.pathname.startsWith(route) })),
    needsNavigationResult: needsNavigation(location.pathname),
  });

  return (
    <CycleProvider>
      {shouldShowNavigation ? (
        // Layout con dos columnas para páginas autenticadas
        <div className="w-screen h-screen overflow-hidden bg-bg text-primary font-sans flex">
          {/* Columna izquierda - Navegación fija */}
          <div className="w-[300px] h-full flex-shrink-0 relative">
            <CircularNavigation />
          </div>

          {/* Columna derecha - Contenido principal */}
          <div className="flex-1 h-full overflow-auto">
            <main className="w-full h-full">
              <Outlet />
            </main>
          </div>
        </div>
      ) : (
        // Layout original para páginas no autenticadas
        <div
          className="w-screen h-screen overflow-hidden bg-bg text-primary font-sans flex flex-col items-center justify-center relative"
          style={{ minHeight: "100vh", minWidth: "100vw" }}
        >
          <main className="flex-1 w-full h-full flex items-center justify-center z-10">
            <Outlet />
          </main>
        </div>
      )}

      <style>{`
        :root {
          --color-primary: #5b0108;
          --color-bg: #e7e0d5;
        }
        .bg-bg { background-color: var(--color-bg); }
        .text-primary { color: var(--color-primary); }
      `}</style>
    </CycleProvider>
  );
};

const RootLayout = () => {
  return (
    <AuthProvider>
      <RootContent />
    </AuthProvider>
  );
};

export default RootLayout;
