import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../router/paths";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      console.log("LoginPage: Intentando iniciar sesión...");
      const success = await login({ email, password });
      
      if (!success) {
        setError("Credenciales incorrectas");
        return;
      }
      
      console.log("Login completado, redirigiendo a dashboard");
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      console.error("Error en login:", error);
      setError(error.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFD0C9] p-4">
      {/* Logo grande para la página de login */}
      <div className="fixed top-6 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <div className="w-full h-full rounded-full overflow-hidden bg-primary-DEFAULT flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 text-secondary-100" fill="currentColor">
                <path d="M50,20 C65,20 70,35 70,50 C70,65 65,80 50,80 C35,80 30,65 30,50 C30,35 35,20 50,20 Z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-serif tracking-tight text-primary-DEFAULT">
            EYRA<span>CLUB</span>
          </h2>
        </div>
      </div>

      <main className="bg-white rounded-xl border border-gray-200 shadow-md p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-primary-DEFAULT mb-2" id="login-title">Iniciar Sesión</h1>
          <p className="text-gray-600">
            Accede a tu cuenta para continuar
          </p>
        </div>

        {error && (
          <div 
            className="bg-accent-100 border border-accent-500 text-accent-700 rounded-lg p-3 mb-6"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        <form 
          onSubmit={handleSubmit} 
          className="space-y-6" 
          autoComplete="on"
          aria-labelledby="login-title"
          noValidate
        >
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 mb-2 font-medium"
              id="email-label"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="tu@email.com"
              required
              aria-required="true"
              aria-labelledby="email-label"
              aria-invalid={!!error && !email}
              data-testid="email-input"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 mb-2 font-medium"
              id="password-label"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••"
              required
              aria-required="true"
              aria-labelledby="password-label"
              aria-invalid={!!error && !password}
              data-testid="password-input"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                name="remember"
                className="h-4 w-4 border border-gray-300 rounded text-primary-DEFAULT focus:ring-primary-500 focus:ring-offset-0"
                aria-label="Recordar mi sesión"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-600"
              >
                Recordarme
              </label>
            </div>

            <a
              href="#"
              className="text-sm text-primary-DEFAULT hover:text-primary-600 font-medium"
              aria-label="Recuperar contraseña olvidada"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-primary-DEFAULT rounded-lg text-white font-medium 
                     transition-all duration-300 shadow-sm hover:shadow-md hover:bg-primary-600
                     disabled:opacity-70 disabled:cursor-not-allowed"
            id="login-submit"
            data-testid="login-submit"
            aria-label={isLoading ? "Iniciando sesión, por favor espera" : "Iniciar sesión"}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link
              to={ROUTES.REGISTER}
              className="text-primary-DEFAULT hover:text-primary-600 font-medium"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
