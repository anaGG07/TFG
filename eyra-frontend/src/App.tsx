import { AuthProvider } from './context/AuthContext';
import { CycleProvider } from './context/CycleContext';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './App.css';
import './styles/pageStyles.css'; // Importando los estilos unificados
import { useEffect, useState } from 'react';

function App() {
  const [appReady, setAppReady] = useState(false);

  // Crear y configurar evento para notificar cuando la app esté lista
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Crear evento personalizado para notificar que la app está lista
      window.appReadyEvent = new Event('app-ready');
      
      // Escuchar evento de que la app está lista
      const handleAppReady = () => {
        console.log('App está lista para renderizar');
        setAppReady(true);
      };
      
      window.addEventListener('app-ready', handleAppReady);
      
      // Limpiar al desmontar
      return () => {
        window.removeEventListener('app-ready', handleAppReady);
      };
    }
  }, []);
  
  return (
    <AuthProvider>
      <CycleProvider>
        {/* Mostrar spinner mientras se carga la app */}
        {!appReady && (
          <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5b0108] mb-4"></div>
              <p className="text-[#5b0108]">Cargando EYRA...</p>
            </div>
          </div>
        )}
        <RouterProvider router={router} />
      </CycleProvider>
    </AuthProvider>
  );
}

export default App;
