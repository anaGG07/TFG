import React from "react";
import { Outlet } from "react-router-dom";
import CircularNavigation from "../components/CircularNavigation";

const AuthenticatedLayout: React.FC = () => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#f5ede6] relative">
      {/* Navegación circular */}
      <CircularNavigation />

      {/* Contenido principal */}
      <main className="w-full h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
