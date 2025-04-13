import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { TextField } from '../../../components/forms/TextField';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h1>
        <p className="text-gray-600 mt-2">Accede a tu cuenta de EYRA</p>
      </div>

      {error && (
        <Alert 
          variant="error" 
          className="mb-4"
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          id="email"
          type="email"
          label="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nombre@ejemplo.com"
          fullWidth
          required
          disabled={isLoading}
        />

        <TextField
          id="password"
          type="password"
          label="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Tu contraseña"
          fullWidth
          required
          disabled={isLoading}
        />

        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-500">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Iniciar Sesión
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-purple-600 hover:text-purple-500">
            Regístrate
          </Link>
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-center text-gray-500 text-sm">
          Al iniciar sesión, aceptas nuestros{' '}
          <Link to="/terms" className="text-purple-600 hover:text-purple-500">
            Términos de servicio
          </Link>{' '}
          y{' '}
          <Link to="/privacy" className="text-purple-600 hover:text-purple-500">
            Política de privacidad
          </Link>
        </p>
      </div>
    </div>
  );
};
