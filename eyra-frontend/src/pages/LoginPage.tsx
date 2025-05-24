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
              className="shadow-md text-[#E7E0D5] text-center rounded-lg p-3 mb-6 text-md"
              role="alert"
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 pointer-events-auto"
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
                className="text-center w-full py-3 px-4 text-xl text-[#E7E0D5] placeholder-[#E7E0D5] bg-none active:bg-none focus:outline-none focus:bg-none transition-all duration-300 "
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
                className="text-center w-full  py-3 px-4 text-xl text-[#E7E0D5] placeholder-[#E7E0D5] active:bg-none focus:outline-none focus:bg-none transition-all duration-300 "
                placeholder="Contraseña"
                required
                aria-required="true"
              />
            </div>
            <div className="flex items-center justify-center w-full pt-4">
              <div className="w-full max-w-md h-[2px] bg-[#E7E0D5]/30 relative overflow-hidden rounded-full">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#E7E0D5] to-transparent animate-[shimmer_2s_infinite]"></span>
              </div>
            </div>
           
            <div
              className="flex items-center justify-between text-sm"
              style={{ color: "#E7E0D5" }}
            >
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full border-2 border-[#E7E0D5] cursor-pointer transition-all duration-200 flex items-center justify-center ${
                    isRememberMe
                      ? "bg-[#E7E0D5] border-[#E7E0D5]"
                      : "bg-transparent"
                  }`}
                  onClick={() => setIsRememberMe(!isRememberMe)}
                >
                  {isRememberMe && (
                    <svg
                      className="w-2 h-2 text-[#C62328]"
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
                className="cursor-pointer hover:underline font-medium transition-all duration-200 hover:text-white"
                style={{ color: "#E7E0D5" }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón con diseño moderno */}
            <div className="flex justify-center mt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer group relative px-12 py-3 font-semibold text-base rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  color: "#E7E0D5",
                  boxShadow:
                    "0 0px 20px rgba(231, 224, 213, 0.3), inset 0 0px 0 rgba(255, 255, 255, 0.6)",
                }}
              >
                {/* Efecto de hover */}
                <div className=" absolute inset-0 opacity-0 shadow-[0_0_30px_5px_rgba(231,224,213,1)] group-hover:opacity-100 transition-opacity duration-300 rounded-full pointer-events-none" />

                {/* Contenido del botón */}
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      Iniciar Sesión
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </>
                  )}
                </span>

                {/* Sombra interna */}
                <div className="absolute inset-0 rounded-full" />
              </button>
            </div>
          </form>
          <div className="mt-6 text-center pointer-events-auto">
            <p className="text-sm" style={{ color: "#E7E0D5" }}>
              ¿No tienes una cuenta?{" "}
              <Link
                to={ROUTES.REGISTER}
                className="hover:underline font-medium pointer-events-auto"
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
