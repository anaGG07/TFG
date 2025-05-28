import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../router/paths";
import Blob from "../components/Blob";
import GlassmorphicButton from "../components/Button";
import { getRandomAvatarConfig } from '../components/avatarBuilder/randomAvatar';

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Tamaño de la ventana para el Blob
  const [dimensions, setDimensions] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  React.useEffect(() => {
    const handleResize = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword || !birthDate) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (!acceptTerms) {
      setError("Debes aceptar los términos y condiciones");
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
        avatar: getRandomAvatarConfig(),
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
      <main className="w-full max-w-md z-10 relative p-6 md:p-8 bg-none pointer-events-none flex flex-col justify-center">
        <div className="text-center mb-6">
          <h1
            className="font-serif text-3xl md:text-5xl font-bold"
            style={{ color: "#E7E0D5" }}
          >
            Crear Cuenta
          </h1>
          <p className="text-base md:text-lg" style={{ color: "#E7E0D5" }}>
            Comienza tu camino con EYRA
          </p>
        </div>

        {error && (
          <div className="bg-[#9d0d0b]/10 border border-[#9d0d0b]/40 text-[#9d0d0b] rounded-lg p-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 pointer-events-auto"
        >
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full text-center pt-2 px-4 text-[#E7E0D5] text-lg focus:outline-none focus:bg-none transition-all duration-300"
            style={{
              background: "transparent",
              WebkitTextFillColor: "#E7E0D5",
              WebkitBoxShadow: "0 0 0px 1000px transparent inset",
              WebkitBackgroundClip: "text",
              caretColor: "#E7E0D5",
            }}
            placeholder="Nombre de usuario"
            required
          />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-center pt-2 px-4 text-[#E7E0D5] text-lg focus:outline-none focus:bg-none transition-all duration-300"
            style={{
              background: "transparent",
              WebkitTextFillColor: "#E7E0D5",
              WebkitBoxShadow: "0 0 0px 1000px transparent inset",
              WebkitBackgroundClip: "text",
              caretColor: "#E7E0D5",
            }}
            placeholder="Email"
            required
          />
          <div className="w-full flex justify-center">
            <input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="pt-2 pl-5 text-[#E7E0D5] text-lg focus:outline-none focus:bg-none transition-all duration-300 [color-scheme:dark]"
              style={{
                textAlign: "center",
                width: "170px", // ancho fijo para centrarlo mejor
                border: "none",
                background: "transparent",
              }}
              required
            />
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-center pt-2 px-4 text-[#E7E0D5] text-lg focus:outline-none focus:bg-none transition-all duration-300"
            style={{
              background: "transparent",
              WebkitTextFillColor: "#E7E0D5",
              WebkitBoxShadow: "0 0 0px 1000px transparent inset",
              WebkitBackgroundClip: "text",
              caretColor: "#E7E0D5",
            }}
            placeholder="Contraseña"
            autoComplete="new-password"
            required
          />
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full text-center pt-2 mb-10 px-4 text-[#E7E0D5] text-lg focus:outline-none focus:bg-none transition-all duration-300"
            style={{
              background: "transparent",
              WebkitTextFillColor: "#E7E0D5",
              WebkitBoxShadow: "0 0 0px 1000px transparent inset",
              WebkitBackgroundClip: "text",
              caretColor: "#E7E0D5",
            }}
            placeholder="Confirmar contraseña"
            autoComplete="new-password"
            required
          />
          <div className="flex items-center justify-center w-full mb-2">
            <div className="w-full max-w-md h-[2px] bg-[#E7E0D5]/30 relative overflow-hidden rounded-full">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#E7E0D5] to-transparent animate-[shimmer_2s_infinite]"></span>
            </div>
          </div>
          {/* Checkbox personalizado */}
          
          {/* Checkbox personalizado */}
          <div className="flex items-start gap-3">
            <div
              className={`w-5 h-5 mt-0.5 rounded-full border-2 border-[#E7E0D5] cursor-pointer transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
                acceptTerms ? "bg-[#E7E0D5] border-[#E7E0D5]" : "bg-transparent"
              }`}
              onClick={() => setAcceptTerms(!acceptTerms)}
            >
              {acceptTerms && (
                <svg
                  className="w-3 h-3 text-[#C62328]"
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
              className="text-sm cursor-pointer leading-relaxed"
              style={{ color: "#E7E0D5" }}
              onClick={() => setAcceptTerms(!acceptTerms)}
            >
              Acepto los{" "}
              <a
                href="#"
                className="font-medium hover:underline transition-all duration-200 hover:text-white"
                style={{ color: "#E7E0D5" }}
                onClick={(e) => e.stopPropagation()}
              >
                Términos de Servicio
              </a>{" "}
              y la{" "}
              <a
                href="#"
                className="font-medium hover:underline transition-all duration-200 hover:text-white"
                style={{ color: "#E7E0D5" }}
                onClick={(e) => e.stopPropagation()}
              >
                Política de Privacidad
              </a>
            </label>
          </div>
          {/* Botón con diseño moderno y control de términos */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={isLoading || !acceptTerms}
              className={`cursor-pointer group relative px-12 py-3 font-semibold text-base rounded-full overflow-hidden transition-all duration-300 transform active:scale-95 ${
                acceptTerms && !isLoading
                  ? "hover:scale-105 shadow-[0_5px_10px_0_#00000079] hover:shadow-[0_4px_24px_0_#E7E0D540]"
                  : "opacity-50 cursor-not-allowed transform-none hover:transform-none"
              }`}
              style={{
                color: "#E7E0D5",
              }}
            >
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
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    Crear cuenta
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${
                        acceptTerms && !isLoading
                          ? "group-hover:translate-x-1"
                          : ""
                      }`}
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
            ¿Ya tienes una cuenta?{" "}
            <Link
              to={ROUTES.LOGIN}
              className="hover:underline font-medium transition-all duration-200 hover:text-white pointer-events-auto"
              style={{ color: "#E7E0D5", textDecorationColor: "#fff" }}
            >
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
