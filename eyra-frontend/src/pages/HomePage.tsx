import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import EYRAEntrancePage from "../components/EYRAEntrancePage";

// Declaración global para evitar error de TypeScript con window.__SHOW_NAVBAR__
declare global {
  interface Window {
    __SHOW_NAVBAR__?: boolean;
  }
}

const ENTRANCE_KEY = "eyra_entrance_shown";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [showEntrance, setShowEntrance] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Solo mostrar la animación si no hay sesión y nunca se ha mostrado
    const alreadyShown = localStorage.getItem(ENTRANCE_KEY) === "1";
    if (!isAuthenticated && !alreadyShown) {
      setShowEntrance(true);
      setShowNavbar(false);
      setShowContent(false);
    } else {
      setShowEntrance(false);
      setShowNavbar(true);
      setShowContent(true);
    }
  }, [isAuthenticated]);

  const handleEntranceFinish = () => {
    setShowEntrance(false);
    setTimeout(() => setShowNavbar(true), 200); // Navbar aparece suavemente tras la animación
    setTimeout(() => setShowContent(true), 400); // Contenido aparece un poco después
    localStorage.setItem(ENTRANCE_KEY, "1");
  };

  // Pasar showNavbar como prop global (puedes usar contexto si RootLayout lo requiere)
  window.__SHOW_NAVBAR__ = showNavbar;

  if (showEntrance) {
    return <EYRAEntrancePage onFinish={handleEntranceFinish} />;
  }

  return (
    <div className={`flex flex-col items-center justify-center w-full h-full transition-opacity duration-700 ${showContent ? 'opacity-100 fade-in' : 'opacity-0'}`}>
      <h1 className="text-6xl md:text-7xl font-serif font-bold text-primary mb-6 tracking-tight drop-shadow-lg">EYRA</h1>
      <h2 className="text-3xl md:text-4xl font-serif text-primary/80 mb-8 max-w-2xl text-center leading-tight">
        Tu compañera para el seguimiento y análisis del ciclo menstrual
      </h2>
      <p className="text-xl text-primary/70 max-w-xl text-center mb-12 font-['Inter']">
        Toma el control de tu bienestar con información personalizada adaptada a tu ciclo único.
      </p>
    </div>
  );
};

export default HomePage;
