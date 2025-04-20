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
      const success = await login({ email, password });
      if (!success) {
        setError("Credenciales incorrectas");
        return;
      }
      console.log("Login completado, redirigiendo a dashboard");
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      setError(error.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A0B2E] to-[#2D0A31] p-4">
      <div className="bg-[#ffffff08] backdrop-blur-md rounded-xl border border-white/10 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Iniciar Sesión</h1>
          <p className="text-white/60 mt-2">
            Accede a tu cuenta para continuar
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white rounded-lg p-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
          <div>
            <label
              htmlFor="email"
              className="block text-white/90 mb-2 font-medium"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              autoComplete="email" // ✅ Mejora accesibilidad
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#ffffff15] border border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF2DAF]/50"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-white/90 mb-2 font-medium"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password" // ✅ Corrige el warning
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#ffffff15] border border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF2DAF]/50"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                name="remember"
                className="h-4 w-4 bg-[#ffffff15] border border-white/20 rounded focus:ring-[#FF2DAF]/50 focus:ring-offset-0"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-white/70"
              >
                Recordarme
              </label>
            </div>

            <a
              href="#"
              className="text-sm text-[#FF2DAF] hover:text-[#FF2DAF]/80"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] rounded-lg text-white font-medium 
                     transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(255,45,175,0.5)] 
                     disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white/70">
            ¿No tienes una cuenta?{" "}
            <Link
              to={ROUTES.REGISTER}
              className="text-[#FF2DAF] hover:text-[#FF2DAF]/80 font-medium"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
