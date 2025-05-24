import React, { useState, useEffect } from "react";
import { usePasswordReset } from "../hooks/usePasswordReset";

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const { requestReset, isLoading, isSuccess, error, resetStates } =
    usePasswordReset();

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      resetStates();
    }
  }, [isOpen, resetStates]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await requestReset(email);
  };

  const handleClose = () => {
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center pointer-events-auto"
      style={{ zIndex: 9999 }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[#E7E0D5] bg-opacity-50 pointer-events-auto"
        onClick={handleOverlayClick}
      />

      {/* Modal */}
      <div className="relative bg-[#360001] rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl pointer-events-auto">
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#E7E0D5] hover:text-white transition-colors pointer-events-auto z-10"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Contenido */}
        <div className="text-center mb-6">
          <h2 className="font-serif text-2xl font-bold text-[#E7E0D5] mb-2">
            Restablecer Contraseña
          </h2>
          <p className="text-[#E7E0D5] text-sm">
            Ingresa tu email para recibir instrucciones
          </p>
        </div>

        {/* Estado de éxito */}
        {isSuccess ? (
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-[#E7E0D5] mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-[#E7E0D5] mb-6 text-center leading-relaxed">
              Si el email está registrado, recibirás un correo en unos minutos
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 bg-[#E7E0D5] text-[#C62328] font-semibold rounded-full hover:bg-white transition-colors pointer-events-auto"
            >
              Entendido
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 pointer-events-auto"
          >
            {/* Input email */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-transparent rounded-2xl shadow-[0_4px_8px_-2px_rgba(0,0,0,0.3)] text-base py-3 px-4 text-[#E7E0D5] placeholder-[#E7E0D5] focus:outline-none transition pointer-events-auto"
                placeholder="Ingresa tu email"
                required
                disabled={isLoading}
                autoFocus
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-[#9d0d0b]/20 border border-[#9d0d0b]/40 text-[#E7E0D5] rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-[#E7E0D5] text-[#E7E0D5] font-semibold rounded-full hover:bg-[#E7E0D5] hover:text-[#C62328] transition-colors pointer-events-auto"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || !email}
                className="flex-1 px-4 py-2 bg-[#E7E0D5] text-[#C62328] font-semibold rounded-full hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors pointer-events-auto"
              >
                {isLoading ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PasswordResetModal;
