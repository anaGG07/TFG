import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../router/paths";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Verificar si el usuario ya tiene una sesión válida al cargar la página
  useEffect(() => {
    // No verificamos la sesión en la página de login para evitar bucles
    console.log("LoginPage - No verificando sesión para evitar bucles");
    setCheckingSession(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      console.log("Iniciando login en LoginPage...");

      const user = await login({ email, password });
      if (!user) {
        setError("Credenciales incorrectas");
        return;
      }

      console.log("Login exitoso. Estado onboarding:", {
        completed: user.onboardingCompleted,
      });

      // Redirigir basado en el estado del onboarding
      if (!user.onboardingCompleted) {
        console.log("Redirigiendo a onboarding...");
        navigate(ROUTES.ONBOARDING, { replace: true });
      } else {
        console.log("Redirigiendo a dashboard...");
        navigate(ROUTES.DASHBOARD, { replace: true });
      }
    } catch (error: any) {
      console.error("Error en login:", error);
      setError(error.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e7e0d5] p-4">
      {checkingSession && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5b0108] mx-auto mb-4"></div>
            <p className="text-[#5b0108]">Verificando sesión...</p>
          </div>
        </div>
      )}

      <main className="bg-[#fefefe] rounded-xl border border-[#5b010820] shadow-md p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-serif text-[#5b0108] mb-2"
            id="login-title"
          >
            Iniciar Sesión
          </h1>
          <p className="text-[#5b0108]/70">Accede a tu cuenta para continuar</p>
        </div>

        {error && (
          <div
            className="bg-[#9d0d0b]/10 border border-[#9d0d0b]/40 text-[#9d0d0b] rounded-lg p-3 mb-6 text-sm"
            role="alert"
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
              className="block text-[#300808] mb-2 font-medium"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-[#300808]/30 rounded-lg py-3 px-4 text-[#5b0108] placeholder-[#5b0108]/40 focus:outline-none focus:ring-2 focus:ring-[#9d0d0b]/50"
              placeholder="tu@email.com"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[#300808] mb-2 font-medium"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-[#300808]/30 rounded-lg py-3 px-4 text-[#5b0108] placeholder-[#5b0108]/40 focus:outline-none focus:ring-2 focus:ring-[#9d0d0b]/50"
              placeholder="••••••••"
              required
              aria-required="true"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 border border-[#300808] rounded text-[#5b0108] focus:ring-[#9d0d0b] focus:ring-offset-0"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-[#5b0108]/70"
              >
                Recordarme
              </label>
            </div>

            <a
              href="#"
              className="text-sm text-[#9d0d0b] hover:underline font-medium"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#5b0108] rounded-lg text-[#e7e0d5] font-medium transition-all hover:bg-[#9d0d0b] hover:shadow-lg disabled:opacity-60"
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[#5b0108]/70">
            ¿No tienes una cuenta?{" "}
            <Link
              to={ROUTES.REGISTER}
              className="text-[#9d0d0b] hover:underline font-medium"
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
