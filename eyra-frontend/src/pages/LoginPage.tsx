import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../router/paths";
import Blob from "../components/Blob";
import LoadingSpinner from "../components/LoadingSpinner";
import PasswordResetModal from "../components/PasswordResetModal";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);

  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Tamaño de la ventana para el Blob
  const [dimensions, setDimensions] = React.useState({ width: window.innerWidth, height: window.innerHeight });
  React.useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Verificar si el usuario ya tiene una sesión válida al cargar la página
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

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

      console.log("Login exitoso. Estado onboarding:", user.onboardingCompleted);

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

  // Si está cargando la autenticación, mostrar spinner
  if (authLoading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center bg-none p-4 relative overflow-hidden">
        {/* Blob animado de fondo, cubre todo */}
        <div className="absolute inset-0 z-0">
          <Blob
            width={dimensions.width}
            height={dimensions.height}
            color="#C62328"
            radius={dimensions.height / 2.1}
          />
        </div>
        {/* Formulario transparente y sin pointer events en el main */}
        <main className="p-6 md:p-8 w-full max-w-md z-10 relative bg-none pointer-events-none">
          <div className="text-center mb-6">
            <h1
              className="font-serif text-3xl md:text-5xl font-bold"
              style={{ color: "#E7E0D5" }}
              id="login-title"
            >
              Iniciar Sesión
            </h1>
            <p className="text-base md:text-lg" style={{ color: "#E7E0D5" }}>
              Accede a tu cuenta para continuar
            </p>
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
            className="flex flex-col gap-7 pointer-events-auto"
            autoComplete="on"
            aria-labelledby="login-title"
            noValidate
          >
            <div>
              <input
                id="email"
                type="email"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-transparent rounded-2xl shadow-[0_4px_8px_-2px_rgba(0,0,0,0.3)] text-base py-2 px-4 text-[#E7E0D5] placeholder-[#E7E0D5] focus:outline-none transition"
                placeholder="Email"
                required
                aria-required="true"
              />
            </div>
            <div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-transparent rounded-2xl shadow-[0_4px_8px_-2px_rgba(0,0,0,0.3)] text-base py-2 px-4 text-[#E7E0D5] placeholder-[#E7E0D5] focus:outline-none transition"
                placeholder="Contraseña"
                required
                aria-required="true"
              />
            </div>
            <div
              className="flex items-center justify-between text-sm"
              style={{ color: "#E7E0D5" }}
            >
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full border-2 border-[#E7E0D5] cursor-pointer transition-all duration-200 flex items-center justify-center ${
                    isRememberMe
                      ? "bg-[#C62328] border-[#C62328]"
                      : "bg-transparent"
                  }`}
                  onClick={() => setIsRememberMe(!isRememberMe)}
                >
                  {isRememberMe && (
                    <svg
                      className="w-2 h-2 text-[#E7E0D5]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <label
                  className="ml-2 cursor-pointer"
                  style={{ color: "#E7E0D5" }}
                  onClick={() => setIsRememberMe(!isRememberMe)}
                >
                  Recordarme
                </label>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordResetModal(true)}
                className="hover:underline font-medium"
                style={{ color: "#E7E0D5" }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="pointer-cursor px-8 py-2 bg-[#E7E0D5] text-[#C62328] font-semibold text-base rounded-full shadow-md transition-all hover:bg-[#fff] hover:text-[#C62328] disabled:opacity-60 mx-auto block"
              style={{ width: "fit-content" }}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: "#E7E0D5" }}>
              ¿No tienes una cuenta?{" "}
              <Link
                to={ROUTES.REGISTER}
                className="hover:underline font-medium"
                style={{ color: "#E7E0D5", textDecorationColor: "#fff" }}
              >
                Regístrate
              </Link>
            </p>
          </div>
        </main>
      </div>

      {/* Modal fuera del contenedor principal */}
      <PasswordResetModal
        isOpen={showPasswordResetModal}
        onClose={() => setShowPasswordResetModal(false)}
      />
    </>
  );
};

export default LoginPage;
