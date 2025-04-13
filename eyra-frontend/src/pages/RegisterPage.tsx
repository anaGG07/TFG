import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../router/paths';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('woman');
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword || !birthDate) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // Formatear la fecha en un formato compatible con el backend
      const formattedRequest = {
        username,
        email,
        password,
        name: username, // Usando el username como nombre por defecto
        lastName: 'Apellido',
        profileType: 'profile_women',
        genderIdentity: gender,
        birthDate
      };
      
      console.log('Datos a enviar:', formattedRequest);
      
      await register(formattedRequest);
      navigate(ROUTES.LOGIN);
    } catch (error: any) {
      setError(error.message || 'Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A0B2E] to-[#2D0A31] p-4 py-12">
      <div className="bg-[#ffffff08] backdrop-blur-md rounded-xl border border-white/10 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Crear Cuenta</h1>
          <p className="text-white/60 mt-2">Crea tu cuenta para comenzar a usar EYRA</p>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white rounded-lg p-3 mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-white/90 mb-2 font-medium">
              Nombre de usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#ffffff15] border border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF2DAF]/50"
              placeholder="Tu nombre"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-white/90 mb-2 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#ffffff15] border border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF2DAF]/50"
              placeholder="tu@email.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="birthDate" className="block text-white/90 mb-2 font-medium">
              Fecha de Nacimiento
            </label>
            <input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-[#ffffff15] border border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF2DAF]/50"
              required
            />
          </div>
          
          <div>
            <label htmlFor="gender" className="block text-white/90 mb-2 font-medium">
              Género
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-[#ffffff15] border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#FF2DAF]/50"
              required
            >
              <option value="woman">Mujer</option>
              <option value="man">Hombre</option>
              <option value="non-binary">No binario</option>
              <option value="other">Otro</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-white/90 mb-2 font-medium">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#ffffff15] border border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF2DAF]/50"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="block text-white/90 mb-2 font-medium">
              Confirmar Contraseña
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#ffffff15] border border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF2DAF]/50"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 bg-[#ffffff15] border border-white/20 rounded focus:ring-[#FF2DAF]/50 focus:ring-offset-0"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-white/70">
              Acepto los <a href="#" className="text-[#FF2DAF]">Términos de Servicio</a> y la <a href="#" className="text-[#FF2DAF]">Política de Privacidad</a>
            </label>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] rounded-lg text-white font-medium 
                     transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(255,45,175,0.5)] 
                     disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-white/70">
            ¿Ya tienes una cuenta?{' '}
            <Link
              to={ROUTES.LOGIN}
              className="text-[#FF2DAF] hover:text-[#FF2DAF]/80 font-medium"
            >
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;