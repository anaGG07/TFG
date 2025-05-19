import { Outlet } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { AuthProvider } from "../context/AuthContext";
import { CycleProvider } from "../context/CycleContext";

const RootLayout = () => {
  return (
    <AuthProvider>
      <CycleProvider>
        <div className="min-h-screen bg-[#e7e0d5] text-[#5b0108] font-sans flex flex-col">
          <Navbar />

          <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
            <Outlet />
          </main>

          <footer className="text-center text-sm text-[#5b0108]/60 py-6 border-t border-[#5b010820]">
            &copy; {new Date().getFullYear()} EYRA — Todos los derechos reservados
          </footer>
        </div>
      </CycleProvider>
    </AuthProvider>
  );
};

export default RootLayout;
