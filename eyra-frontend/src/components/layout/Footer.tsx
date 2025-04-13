import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">EYRA</h3>
            <p className="text-gray-300">
              Tu compañera en el viaje de salud reproductiva, ofreciendo seguimiento personalizado y apoyo a lo largo de todas las etapas de la vida.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-3">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="text-gray-300 hover:text-white transition">
                  Calendario
                </Link>
              </li>
              <li>
                <Link to="/content" className="text-gray-300 hover:text-white transition">
                  Contenido
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="text-gray-300 hover:text-white transition">
                  Asistente IA
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-3">Recursos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-300 hover:text-white transition">
                  Soporte
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-3">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition">
                  Términos de Uso
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-300 hover:text-white transition">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {currentYear} EYRA. Todos los derechos reservados.</p>
          <p className="mt-2">
            Creado para el TFG de Desarrollo de Aplicaciones Web.
          </p>
        </div>
      </div>
    </footer>
  );
};
