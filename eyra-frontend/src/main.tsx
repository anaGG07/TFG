import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Importar la configuración de API primero para asegurar que se carga antes que cualquier otra cosa
import './config/setupApiUrl';

// Importar herramienta de diagnóstico en desarrollo
if (process.env.NODE_ENV !== 'production') {
  import('./utils/apiTester');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
