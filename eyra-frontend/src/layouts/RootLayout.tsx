import { Outlet } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { CycleProvider } from "../context/CycleContext";

// ✅ Componente interno que usa el AuthContext
const RootContent = () => {

  // ✅ FIX: Solo mostrar loading durante operaciones específicas, no inicialización
  // El loading de inicialización se maneja en las páginas individuales

  return (
    <CycleProvider>
      <div
        className="w-screen h-screen overflow-hidden bg-bg text-primary font-sans flex flex-col items-center justify-center relative"
        style={{ minHeight: "100vh", minWidth: "100vw" }}
      >
        <main className="flex-1 w-full h-full flex items-center justify-center z-10">
          <Outlet />
        </main>
        <style>{`
          :root {
            --color-primary: #5b0108;
            --color-bg: #e7e0d5;
          }
          .bg-bg { background-color: var(--color-bg); }
          .text-primary { color: var(--color-primary); }
        `}</style>
      </div>
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
