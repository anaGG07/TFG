import { AuthProvider } from './context/AuthContext';
import { CycleProvider } from './context/CycleContext';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './App.css';
import './styles/pageStyles.css'; // Importando los estilos unificados

function App() {
  return (
    <AuthProvider>
      <CycleProvider>
        <RouterProvider router={router} />
      </CycleProvider>
    </AuthProvider>
  );
}

export default App;
