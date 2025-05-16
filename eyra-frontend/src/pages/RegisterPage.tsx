import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../router/paths";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("woman");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  
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
        genderIdentity: gender,
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
    <div className="min-h-screen flex items-center justify-center bg-[#e7e0d5] p-4 py-12 font-sans">
      <div className="bg-white/60 backdrop-blur-md border border-[#5b010820] rounded-xl p-8 w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#5b0108] tracking-wide">
            Crear Cuenta
          </h1>
          <p className="text-[#5b0108]/70 mt-2">Comienza tu camino con EYRA</p>
        </div>

        {error && (
          <div className="bg-[#9d0d0b]/10 border border-[#9d0d0b]/40 text-[#9d0d0b] rounded-lg p-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-[#300808] mb-2 font-medium"
            >
              Nombre de usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/30 border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108] placeholder-[#5b0108]/40 focus:outline-none focus:ring-2 focus:ring-[#9d0d0b]/50"
              placeholder="Tu nombre"
              required
            />
          </div>

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
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/30 border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108] placeholder-[#5b0108]/40 focus:outline-none focus:ring-2 focus:ring-[#9d0d0b]/50"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="birthDate"
              className="block text-[#300808] mb-2 font-medium"
            >
              Fecha de Nacimiento
            </label>
            <input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-white/30 border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108] focus:outline-none focus:ring-2 focus:ring-[#9d0d0b]/50"
              required
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-[#300808] mb-2 font-medium"
            >
              Género
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-white/30 border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108] focus:outline-none focus:ring-2 focus:ring-[#9d0d0b]/50"
              required
            >
              <option value="woman">Mujer</option>
              <option value="man">Trans</option>
              <option value="non-binary">No binario</option>
              <option value="other">Otro</option>
            </select>
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/30 border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108] placeholder-[#5b0108]/40 focus:outline-none focus:ring-2 focus:ring-[#9d0d0b]/50"
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-[#300808] mb-2 font-medium"
            >
              Confirmar Contraseña
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/30 border border-[#300808]/20 rounded-lg py-3 px-4 text-[#5b0108] placeholder-[#5b0108]/40 focus:outline-none focus:ring-2 focus:ring-[#9d0d0b]/50"
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </div>

          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 mt-1 bg-white/30 border border-[#5b0108]/30 rounded focus:ring-[#9d0d0b]/50"
              required
            />
            <label htmlFor="terms" className="ml-3 text-sm text-[#5b0108]/80">
              Acepto los{" "}
              <a href="#" className="text-[#9d0d0b] font-medium">
                Términos de Servicio
              </a>{" "}
              y la{" "}
              <a href="#" className="text-[#9d0d0b] font-medium">
                Política de Privacidad
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#5b0108] text-[#e7e0d5] rounded-lg font-semibold tracking-wide transition-all hover:bg-[#9d0d0b] hover:shadow-lg disabled:opacity-60"
          >
            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[#5b0108]/70">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to={ROUTES.LOGIN}
              className="text-[#9d0d0b] font-semibold hover:underline"
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