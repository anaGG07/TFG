import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import EYRAEntrancePage from "../components/EYRAEntrancePage";
import { motion } from "framer-motion";

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
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Solo mostrar la animación si no hay sesión y nunca se ha mostrado
    const alreadyShown = localStorage.getItem(ENTRANCE_KEY) === "1";
    if (!isAuthenticated && !alreadyShown) {
      setShowEntrance(true);
      setShowContent(false);
      window.__SHOW_NAVBAR__ = false; // Ocultar Navbar durante la animación
    } else {
      setShowEntrance(false);
      setShowContent(true);
      window.__SHOW_NAVBAR__ = true; // Mostrar Navbar en todas las demás situaciones
    }
  }, [isAuthenticated]);

  const handleEntranceFinish = () => {
    setShowEntrance(false);
    window.__SHOW_NAVBAR__ = true; // Mostrar Navbar al terminar la animación
    setTimeout(() => setShowContent(true), 400); // Contenido aparece un poco después
    localStorage.setItem(ENTRANCE_KEY, "1");
  };

  if (showEntrance) {
    return <EYRAEntrancePage onFinish={handleEntranceFinish} />;
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full h-full"
      initial={{ opacity: 0, filter: "blur(8px)" }}
      animate={{ opacity: showContent ? 1 : 0, filter: showContent ? "blur(0px)" : "blur(8px)" }}
      transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <h1 className="text-6xl md:text-7xl font-serif font-bold text-primary mb-6 tracking-tight drop-shadow-lg">EYRA</h1>
      <h2 className="text-3xl md:text-4xl font-serif text-primary/80 mb-8 max-w-2xl text-center leading-tight">
        Tu compañera para el seguimiento y análisis del ciclo menstrual
      </h2>
      <p className="text-xl text-primary/70 max-w-xl text-center mb-12 font-['Inter']">
        Toma el control de tu bienestar con información personalizada adaptada a tu ciclo único.
      </p>
    </motion.div>
  );
};

export default HomePage;
