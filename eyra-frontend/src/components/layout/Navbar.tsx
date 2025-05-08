import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // Primero realizar el logout y luego la navegación
      await logout();
      // Añadir un breve retraso antes de la navegación
      setTimeout(() => {
        navigate('/login', { state: { justLoggedOut: true } });
      }, 300);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // En caso de error también intentar navegar
      navigate('/login');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-white text-2xl font-bold">EYRA</Link>
        
        <div className="hidden md:flex space-x-6">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-white hover:text-purple-200 transition">
                Inicio
              </Link>
              <Link to="/calendar" className="text-white hover:text-purple-200 transition">
                Calendario
              </Link>
              <Link to="/insights" className="text-white hover:text-purple-200 transition">
                Insights
              </Link>
              <Link to="/content" className="text-white hover:text-purple-200 transition">
                Contenido
              </Link>
              <Link to="/assistant" className="text-white hover:text-purple-200 transition">
                Asistente IA
              </Link>
              <div className="relative group">
                <button className="text-white hover:text-purple-200 transition focus:outline-none">
                  {user?.name || 'Perfil'}
                </button>
                <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-purple-100">
                    Mi Perfil
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-gray-800 hover:bg-purple-100">
                    Configuración
                  </Link>
                  <Link to="/guests" className="block px-4 py-2 text-gray-800 hover:bg-purple-100">
                    Invitados
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-purple-100"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-purple-200 transition">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="text-white hover:text-purple-200 transition">
                Registrarse
              </Link>
              <Link to="/about" className="text-white hover:text-purple-200 transition">
                Acerca de
              </Link>
            </>
          )}
        </div>
        
        {/* Menú móvil */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Menú móvil desplegable */}
      {isMenuOpen && (
        <div className="md:hidden pt-2 pb-4 space-y-2">
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className="block text-white hover:bg-purple-400 px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                to="/calendar" 
                className="block text-white hover:bg-purple-400 px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Calendario
              </Link>
              <Link 
                to="/insights" 
                className="block text-white hover:bg-purple-400 px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Insights
              </Link>
              <Link 
                to="/content" 
                className="block text-white hover:bg-purple-400 px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contenido
              </Link>
              <Link 
                to="/assistant" 
                className="block text-white hover:bg-purple-400 px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Asistente IA
              </Link>
              <Link 
                to="/profile" 
                className="block text-white hover:bg-purple-400 px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Mi Perfil
              </Link>
              <Link 
                to="/settings" 
                className="block text-white hover:bg-purple-400 px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Configuración
              </Link>
              <Link 
                to="/guests" 
                className="block text-white hover:bg-purple-400 px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Invitados
              </Link>
              <button 
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left text-white hover:bg-purple-400 px-4 py-2"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="block text-white hover:bg-purple-400 px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className="block text-white hover:bg-purple-400 px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Registrarse
              </Link>
              <Link 
                to="/about" 
                className="block text-white hover:bg-purple-400 px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Acerca de
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
