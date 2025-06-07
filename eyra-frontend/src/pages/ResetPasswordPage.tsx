// ARCHIVO: eyra-frontend/src/pages/ResetPasswordPage.tsx

import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ROUTES } from "../router/paths";
import { API_ROUTES } from "../config/apiRoutes";
import Blob from "../components/Blob";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-hot-toast";
import NeomorphicToast from "../components/ui/NeomorphicToast";

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tamaño de ventana para el Blob
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Validar que existe el token
  useEffect(() => {
    if (!token) {
      setError("Token de restablecimiento inválido o expirado");
    }
  }, [token]);

  const validatePasswords = (): boolean => {
    if (!password) {
      setError("La contraseña es requerida");
      return false;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Token de restablecimiento inválido");
      return;
    }

    if (!validatePasswords()) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(API_ROUTES.AUTH.PASSWORD_RESET_CONFIRM, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al restablecer contraseña");
      }

      setIsSuccess(true);

      // Mostrar toast de éxito
      toast.custom((t) => (
        <NeomorphicToast
          message="Contraseña restablecida exitosamente"
          variant="success"
          onClose={() => toast.dismiss(t.id)}
          duration={3000}
        />
      ));

      // Redirigir a login después de 3 segundos
      setTimeout(() => {
        navigate(ROUTES.LOGIN, { replace: true });
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Error al restablecer contraseña");

      toast.custom((t) => (
        <NeomorphicToast
          message={err.message || "Error al restablecer contraseña"}
          variant="error"
          onClose={() => toast.dismiss(t.id)}
          duration={6000}
        />
      ));
    } finally {
      setIsLoading(false);
    }
  };

  // Si no hay token, mostrar error
  if (!token) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#e7e0d5] p-4">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-[#C62328] mb-4">
            Enlace Inválido
          </h1>
          <p className="text-[#5b0108] mb-6">
            El enlace de restablecimiento es inválido o ha expirado.
          </p>
          <Link
            to={ROUTES.LOGIN}
            className="px-6 py-3 bg-[#C62328] text-white rounded-full hover:bg-[#9d0d0b] transition-colors"
          >
            Volver al Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center bg-none p-4 relative overflow-hidden">
        {/* Blob animado de fondo */}
        <div className="absolute inset-0 z-0">
          <Blob
            width={dimensions.width}
            height={dimensions.height}
            color="text-[#e7e0d5]"
            radius={dimensions.height / 2.1}
          />
        </div>

        {/* Formulario */}
        <main className="p-6 md:p-8 w-full max-w-md z-10 relative bg-none pointer-events-none">
          <div className="text-center mb-6">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#e7e0d5] mb-2">
              Nueva Contraseña
            </h1>
            <p className="text-[#e7e0d5] text-sm">
              Crea tu nueva contraseña segura
            </p>
          </div>

          {isSuccess ? (
            <div className="text-center pointer-events-auto">
              <div className="mb-6">
                <svg
                  className="w-16 h-16 text-[#e7e0d5] mx-auto mb-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <h2 className="text-xl font-semibold text-[#e7e0d5] mb-2">
                  ¡Contraseña actualizada!
                </h2>
                <p className="text-[#e7e0d5] text-sm">
                  Redirigiendo al login...
                </p>
              </div>
              <div className="w-full bg-[#e7e0d5]/20 rounded-full h-2">
                <div
                  className="bg-[#e7e0d5] h-2 rounded-full transition-all duration-3000 ease-out"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 pointer-events-auto"
              autoComplete="on"
            >
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-center w-full py-3 px-4 text-xl text-[#e7e0d5] placeholder-secondary bg-none focus:outline-none transition-all duration-300"
                  style={{
                    background: "transparent",
                    WebkitTextFillColor: "#e7e0d5",
                    WebkitBoxShadow: "0 0 0px 1000px transparent inset",
                    caretColor: "#e7e0d5",
                  }}
                  placeholder="Nueva contraseña"
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-center w-full py-3 px-4 text-xl text-[#e7e0d5] placeholder-secondary bg-none focus:outline-none transition-all duration-300"
                  style={{
                    background: "transparent",
                    WebkitTextFillColor: "#e7e0d5",
                    WebkitBoxShadow: "0 0 0px 1000px transparent inset",
                    caretColor: "#e7e0d5",
                  }}
                  placeholder="Confirmar contraseña"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-center w-full pt-4">
                <div className="w-full max-w-md h-[2px] bg-secondary/30 relative overflow-hidden rounded-full">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-secondary to-transparent animate-[shimmer_2s_infinite]"></span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="text-center text-[#ff6b6b] text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Botón */}
              <div className="flex justify-center mt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="shadow-[0_5px_10px_0_#00000079] hover:shadow-[0_4px_24px_0_#E7E0D540] text-[#e7e0d5] cursor-pointer group relative px-12 py-3 font-semibold rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
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
                        Actualizando...
                      </>
                    ) : (
                      "Actualizar Contraseña"
                    )}
                  </span>
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center pointer-events-auto">
            <Link
              to={ROUTES.LOGIN}
              className="text-sm text-[#e7e0d5] hover:underline"
            >
              ← Volver al login
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default ResetPasswordPage;
