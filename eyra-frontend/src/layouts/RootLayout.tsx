import { Outlet, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { CycleProvider } from "../context/CycleContext";
import CircularNavigation from "../components/CircularNavigation";
import BottomNavigation from "../components/BottomNavigation";
import SideDrawer from "../components/SideDrawer";
import { useState, useEffect, useMemo } from "react";

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
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Detect viewport size - optimized to prevent re-renders
  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      let newViewport: 'mobile' | 'tablet' | 'desktop';
      
      if (width < 640) {
        newViewport = 'mobile';
      } else if (width < 1024) {
        newViewport = 'tablet';
      } else {
        newViewport = 'desktop';
      }
      
      // Only update if viewport actually changed
      setViewport(prev => prev !== newViewport ? newViewport : prev);
    };

    checkViewport();
    
    // Debounce resize events to prevent excessive re-renders
    let timeoutId: NodeJS.Timeout;
    const debouncedCheckViewport = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkViewport, 100);
    };
    
    window.addEventListener('resize', debouncedCheckViewport);
    return () => {
      window.removeEventListener('resize', debouncedCheckViewport);
      clearTimeout(timeoutId);
    };
  }, []); // Empty dependency array

  // Determinar si mostrar navegación - memoized to prevent excessive checks
  const shouldShowNavigation = useMemo(() => 
    isAuthenticated &&
    user?.onboardingCompleted &&
    needsNavigation(location.pathname),
    [isAuthenticated, user?.onboardingCompleted, location.pathname]
  );

  console.log("RootLayout: Navegación responsive:", {
    shouldShow: shouldShowNavigation,
    viewport,
    path: location.pathname,
    isAuthenticated,
    onboardingCompleted: user?.onboardingCompleted,
  });

  return (
    <CycleProvider>
      {shouldShowNavigation ? (
        <>
          {/* Desktop Layout - Navegación circular lateral */}
          {viewport === 'desktop' && (
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
          )}

          {/* Tablet Layout - Side drawer */}
          {viewport === 'tablet' && (
            <div className="w-screen h-screen overflow-hidden bg-bg text-primary font-sans">
              <SideDrawer />
              <main className="w-full h-full pt-16">
                <Outlet />
              </main>
            </div>
          )}

          {/* Mobile Layout - Bottom navigation */}
          {viewport === 'mobile' && (
            <div className="w-screen h-screen overflow-hidden bg-bg text-primary font-sans">
              <main className="w-full h-full pb-20">
                <Outlet />
              </main>
              <BottomNavigation />
            </div>
          )}
        </>
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
