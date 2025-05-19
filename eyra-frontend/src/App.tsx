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
    <RouterProvider router={router} />
  );
}

export default App;
