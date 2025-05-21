import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../router/paths";
import Blob from "../components/Blob";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  
  // Tamaño de la ventana para el Blob
  const [dimensions, setDimensions] = React.useState({ width: window.innerWidth, height: window.innerHeight });
  React.useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword || !birthDate) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const formattedRequest = {
        username,
        email,
        password,
        name: username,
        lastName: "Apellido",
        profileType: "profile_women",
        birthDate,
      };

      await register(formattedRequest);
      navigate(ROUTES.LOGIN);
    } catch (error: any) {
      setError(error.message || "Error al registrar usuario");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-none p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Blob
          width={dimensions.width}
          height={dimensions.height}
          color="#C62328"
          radius={dimensions.height / 2.1}
        />
      </div>
      <div className="w-full max-w-md z-10 relative p-6 md:p-8 bg-none pointer-events-none flex flex-col justify-center">
        <div className="text-center mb-6">
          <h1 className="font-serif text-3xl md:text-5xl font-bold" style={{ color: '#E7E0D5' }}>
            Crear Cuenta
          </h1>
          <p className="text-base md:text-lg" style={{ color: '#E7E0D5' }}>
            Comienza tu camino con EYRA
          </p>
        </div>

        {error && (
          <div className="bg-[#9d0d0b]/10 border border-[#9d0d0b]/40 text-[#9d0d0b] rounded-lg p-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-7 pointer-events-auto">
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-transparent border-transparent rounded-2xl shadow-[0_4px_8px_-2px_rgba(0,0,0,0.3)] text-base py-2 px-4 text-[#E7E0D5] placeholder-[#E7E0D5] focus:outline-none transition"
            placeholder="Nombre de usuario"
            required
          />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-transparent rounded-2xl shadow-[0_4px_8px_-2px_rgba(0,0,0,0.3)] text-base py-2 px-4 text-[#E7E0D5] placeholder-[#E7E0D5] focus:outline-none transition"
            placeholder="Email"
            required
          />
          <input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full bg-transparent border-transparent rounded-2xl shadow-[0_4px_8px_-2px_rgba(0,0,0,0.3)] text-base py-2 px-4 text-[#E7E0D5] placeholder-[#E7E0D5] focus:outline-none transition"
            placeholder="Fecha de nacimiento"
            required
          />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-transparent rounded-2xl shadow-[0_4px_8px_-2px_rgba(0,0,0,0.3)] text-base py-2 px-4 text-[#E7E0D5] placeholder-[#E7E0D5] focus:outline-none transition"
            placeholder="Contraseña"
            autoComplete="new-password"
            required
          />
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-transparent border-transparent rounded-2xl shadow-[0_4px_8px_-2px_rgba(0,0,0,0.3)] text-base py-2 px-4 text-[#E7E0D5] placeholder-[#E7E0D5] focus:outline-none transition"
            placeholder="Confirmar contraseña"
            autoComplete="new-password"
            required
          />
          <div className="flex items-start" style={{ color: '#E7E0D5' }}>
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 mt-1 bg-transparent border border-[#E7E0D5]/60 rounded focus:ring-[#E7E0D5]/50"
              required
            />
            <label htmlFor="terms" className="ml-3 text-sm" style={{ color: '#E7E0D5' }}>
              Acepto los{' '}
              <a href="#" className="font-medium hover:underline" style={{ color: '#E7E0D5' }}>
                Términos de Servicio
              </a>{' '}
              y la{' '}
              <a href="#" className="font-medium hover:underline" style={{ color: '#E7E0D5' }}>
                Política de Privacidad
              </a>
            </label>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-2 bg-[#E7E0D5] text-[#C62328] font-semibold text-base rounded-full shadow-md transition-all hover:bg-[#fff] hover:text-[#C62328] disabled:opacity-60 mx-auto block"
            style={{ width: 'fit-content' }}
          >
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: '#E7E0D5' }}>
            ¿Ya tienes una cuenta?{' '}
            <Link
              to={ROUTES.LOGIN}
              className="hover:underline font-medium"
              style={{ color: '#E7E0D5', textDecorationColor: '#fff' }}
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