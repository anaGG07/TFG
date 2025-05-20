import { Outlet } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { CycleProvider } from "../context/CycleContext";
import SmartRedirector from "../router/SmartRedirector";

const RootLayout = () => {
  return (
    <AuthProvider>
      <CycleProvider>
        <SmartRedirector />
        <div className="w-screen h-screen overflow-hidden bg-bg text-primary font-sans flex flex-col items-center justify-center relative" style={{ minHeight: '100vh', minWidth: '100vw' }}>
          <main className="flex-1 w-full h-full flex items-center justify-center z-10">
            <Outlet />
          </main>
          <footer className="absolute bottom-0 left-0 w-full text-center text-sm text-primary/60 py-6 border-t border-[#5b010820] bg-bg z-30">
            &copy; {new Date().getFullYear()} EYRA — Todos los derechos reservados
          </footer>
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
    </AuthProvider>
  );
};

export default RootLayout;