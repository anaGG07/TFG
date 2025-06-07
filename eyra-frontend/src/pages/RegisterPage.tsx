import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../router/paths";
import Blob from "../components/Blob";
import { getRandomAvatarConfig } from '../components/avatarBuilder/randomAvatar';
import { Eye, EyeOff, User, Mail, Calendar, Lock } from "lucide-react";
import { toast } from "react-hot-toast";
import NeomorphicToast from "../components/ui/NeomorphicToast";
import Button from "../components/Button";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [activeToast, setActiveToast] = useState<string | null>(null);

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

  // Validaciones en tiempo real
  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const isPasswordComplex = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  useEffect(() => {
    setPasswordStrength(getPasswordStrength(password));
  }, [password]);

  // Funciones de validación individuales para onBlur
  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      if (activeToast !== "email") {
        toast.custom((t) => (
          <NeomorphicToast
            message="Introduce un email válido"
            variant="error"
            duration={3500}
            onClose={() => {
              toast.dismiss(t.id);
              setActiveToast(null);
            }}
          />
        ));
        setActiveToast("email");
      }
    } else if (activeToast === "email") {
      setActiveToast(null);
    }
  };

  const handlePasswordBlur = () => {
    if (password && password.length < 8) {
      if (activeToast !== "password-length") {
        toast.custom((t) => (
          <NeomorphicToast
            message="La contraseña debe tener al menos 8 caracteres"
            variant="error"
            duration={3500}
            onClose={() => {
              toast.dismiss(t.id);
              setActiveToast(null);
            }}
          />
        ));
        setActiveToast("password-length");
      }
    } else if (password && !isPasswordComplex(password)) {
      if (activeToast !== "password-complex") {
        toast.custom((t) => (
          <NeomorphicToast
            message="La contraseña debe tener mayúscula, minúscula, número y símbolo"
            variant="error"
            duration={3500}
            onClose={() => {
              toast.dismiss(t.id);
              setActiveToast(null);
            }}
          />
        ));
        setActiveToast("password-complex");
      }
    } else if (activeToast && activeToast.startsWith("password")) {
      setActiveToast(null);
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (confirmPassword && password !== confirmPassword) {
      if (activeToast !== "confirm-password") {
        toast.custom((t) => (
          <NeomorphicToast
            message="Las contraseñas no coinciden"
            variant="error"
            duration={3500}
            onClose={() => {
              toast.dismiss(t.id);
              setActiveToast(null);
            }}
          />
        ));
        setActiveToast("confirm-password");
      }
    } else if (activeToast === "confirm-password") {
      setActiveToast(null);
    }
  };

  // Función para traducir errores técnicos a mensajes UX amigables
  const getFriendlyRegisterError = (
    error: any
  ): { message: string; subtitle?: string } => {
    if (!error || typeof error !== "object") {
      return { message: "Ha ocurrido un error inesperado. Intenta de nuevo." };
    }
    // Errores de red
    if (error.message === "Failed to fetch") {
      return {
        message: "",
        subtitle: "Verifica tu conexión a internet o inténtalo más tarde.",
      };
    }
    // Errores de backend conocidos
    if (typeof error.message === "string") {
      if (error.message.includes("409")) {
        return {
          message: "",
          subtitle: "El email o usuario ya está registrado",
        };
      }
      if (error.message.includes("401")) {
        return {
          message: "",
          subtitle: "No tienes permisos para realizar esta acción.",
        };
      }
      if (error.message.includes("403")) {
        return {
          message: "",
          subtitle: "No tienes permisos para registrarte.",
        };
      }
      if (error.message.includes("404")) {
        return {
          message: "",
          subtitle: "El servicio no está disponible.",
        };
      }
      if (error.message.includes("500")) {
        return {
          message: "",
          subtitle: "Nuestro equipo ya está trabajando en ello.",
        };
      }
      // Mensaje personalizado del backend
      if (error.message.startsWith("Error en la petición:")) {
        return {
          message: "",
          subtitle: "Verifica tus datos o intenta más tarde.",
        };
      }
    }
    // Fallback
    return {
      message:
        error && error.message
          ? error.message
          : "No se pudo crear la cuenta. Intenta de nuevo.",
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword || !birthDate || !name || !lastName) {
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
        name,
        lastName,
        profileType: "profile_women",
        birthDate,
        avatar: getRandomAvatarConfig(),
      };

      await register(formattedRequest);
      navigate(ROUTES.LOGIN);
    } catch (error: any) {
      const friendly = getFriendlyRegisterError(error);
      setError(friendly.message + (friendly.subtitle ? `\n${friendly.subtitle}` : ""));
      toast.custom((t) => (
        <NeomorphicToast
          message={friendly.message}
          subtitle={friendly.subtitle}
          variant="error"
          duration={6000}
          onClose={() => toast.dismiss(t.id)}
        />
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    username &&
    email &&
    password &&
    confirmPassword &&
    birthDate &&
    name &&
    lastName &&
    acceptTerms &&
    validateEmail(email) &&
    password.length >= 8 &&
    isPasswordComplex(password) &&
    password === confirmPassword;

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
          autoComplete="off"
        >
          <div className="flex flex-row gap-4 w-full">
            <div className="flex flex-col gap-2 w-1/2">
              <div className="relative">
                <User
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-[#E7E0D5]"
                  size={18}
                />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full text-center pt-2 pl-8 px-4 text-[#E7E0D5] text-lg focus:outline-none focus:bg-none transition-all duration-300"
                  style={{
                    background: "transparent",
                    WebkitTextFillColor: "#E7E0D5",
                    WebkitBoxShadow: "0 0 0px 1000px transparent inset",
                    WebkitBackgroundClip: "text",
                    caretColor: "#E7E0D5",
                  }}
                  placeholder="Nombre de usuario"
                  required
                  autoComplete="username"
                />
              </div>
              <div className="relative">
                <Mail
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-[#E7E0D5]"
                  size={18}
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                  className="w-full text-center pt-2 pl-8 px-4 text-[#E7E0D5] text-lg focus:outline-none focus:bg-none transition-all duration-300"
                  style={{
                    background: "transparent",
                    WebkitTextFillColor: "#E7E0D5",
                    WebkitBoxShadow: "0 0 0px 1000px transparent inset",
                    WebkitBackgroundClip: "text",
                    caretColor: "#E7E0D5",
                  }}
                  placeholder="Email"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="w-full flex justify-center relative">
                <Calendar
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-[#E7E0D5]"
                  size={18}
                />
                <input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="pt-2 pl-8 text-[#E7E0D5] text-lg focus:outline-none focus:bg-none transition-all duration-300 [color-scheme:dark] w-full"
                  style={{
                    textAlign: "center",
                    border: "none",
                    background: "transparent",
                  }}
                  required
                  autoComplete="bday"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 w-1/2">
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-center pt-2 px-4 text-[#E7E0D5] text-lg focus:outline-none focus:bg-none transition-all duration-300"
                style={{
                  background: "transparent",
                  WebkitTextFillColor: "#E7E0D5",
                  WebkitBoxShadow: "0 0 0px 1000px transparent inset",
                  WebkitBackgroundClip: "text",
                  caretColor: "#E7E0D5",
                }}
                placeholder="Nombre"
                required
                autoComplete="given-name"
              />
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full text-center pt-2 px-4 text-[#E7E0D5] text-lg focus:outline-none focus:bg-none transition-all duration-300"
                style={{
                  background: "transparent",
                  WebkitTextFillColor: "#E7E0D5",
                  WebkitBoxShadow: "0 0 0px 1000px transparent inset",
                  WebkitBackgroundClip: "text",
                  caretColor: "#E7E0D5",
                }}
                placeholder="Apellidos"
                required
                autoComplete="family-name"
              />
              <div className="relative">
                <Lock
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-[#E7E0D5]"
                  size={18}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handlePasswordBlur}
                  className="w-full text-center pt-2 pl-8 pr-10 px-4 text-[#E7E0D5] text-lg focus:outline-none focus:bg-none transition-all duration-300"
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
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#E7E0D5] focus:outline-none"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  style={{ background: "none" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Indicador de fuerza de contraseña */}
              <div className="w-full h-2 rounded-full bg-[#E7E0D5]/30 mb-1">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(passwordStrength / 5) * 100}%`,
                    background:
                      passwordStrength < 3
                        ? "#C62328"
                        : passwordStrength < 5
                        ? "#e7b800"
                        : "#7ac77a",
                  }}
                ></div>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-[#E7E0D5]"
                  size={18}
                />
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={handleConfirmPasswordBlur}
                  className="w-full text-center pt-2 pl-8 pr-10 px-4 text-[#E7E0D5] text-lg focus:outline-none focus:bg-none transition-all duration-300"
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
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#E7E0D5] focus:outline-none"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={
                    showConfirmPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                  style={{ background: "none" }}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center w-full mb-2">
            <div className="w-full max-w-md h-[2px] bg-[#E7E0D5]/30 relative overflow-hidden rounded-full">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#E7E0D5] to-transparent animate-[shimmer_2s_infinite]"></span>
            </div>
          </div>
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
          
          {/* Botón con diseño moderno */}
          <div className="flex justify-center mt-2">
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="shadow-[0_5px_10px_0_#00000079] hover:shadow-[0_4px_24px_0_#E7E0D540] text-[#e7e0d5] cursor-pointer group relative px-12 py-3 font-semibold rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
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
          <p className="text-sm mb-5 text-[#E7E0D5]">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to={ROUTES.LOGIN}
              className="hover:underline  font-medium transition-all duration-200 hover:text-white pointer-events-auto"
              style={{ color: "#E7E0D5", textDecorationColor: "#fff" }}
            >
              Iniciar Sesión
            </Link>
          </p>
          {/* Enlace HOME */}
          <Link
            to={ROUTES.HOME}
            className="text-2xl text-[#E7E0D5] hover:text-3xl pointer-events-auto transition-all duration-600 ease-in-out"
          >
            EYRA
          </Link>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
