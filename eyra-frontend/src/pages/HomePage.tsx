import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import EYRAEntrancePage from "../components/EYRAEntrancePage";

const ENTRANCE_KEY = "eyra_entrance_shown";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [showEntrance, setShowEntrance] = useState(false);

  useEffect(() => {
    // Solo mostrar la animación si no hay sesión y nunca se ha mostrado
    const alreadyShown = localStorage.getItem(ENTRANCE_KEY) === "1";
    if (!isAuthenticated && !alreadyShown) {
      setShowEntrance(true);
    }
  }, [isAuthenticated]);

  const handleEntranceFinish = () => {
    setShowEntrance(false);
    localStorage.setItem(ENTRANCE_KEY, "1");
  };

  if (showEntrance) {
    return <EYRAEntrancePage onFinish={handleEntranceFinish} />;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full fade-in">
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
