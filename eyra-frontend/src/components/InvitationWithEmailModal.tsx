import React, { useState, useEffect } from "react";

export interface InvitationModalData {
  guestType: "partner" | "parental" | "friend" | "healthcare_provider";
  accessPermissions: string[];
  expirationHours: number;
  invitedEmail: string;
}

interface InvitationWithEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InvitationModalData) => Promise<void>;
  isLoading?: boolean;
}

const InvitationWithEmailModal: React.FC<InvitationWithEmailModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [email, setEmail] = useState("");
  const [guestType, setGuestType] = useState<"partner" | "parental" | "friend" | "healthcare_provider">("friend");
  const [error, setError] = useState<string | null>(null);

  const guestTypeOptions = [
    { value: "friend", label: "Amigo/a" },
    { value: "partner", label: "Pareja" },
    { value: "healthcare_provider", label: "Médico" },
    { value: "parental", label: "Parental" },
  ];

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setGuestType("friend");
      setError(null);
    }
  }, [isOpen]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("El email es requerido");
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor ingresa un email válido");
      return;
    }

    try {
      await onSubmit({
        guestType,
        accessPermissions: ["view_cycle", "view_symptoms"],
        expirationHours: 48,
        invitedEmail: email,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al enviar invitación");
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
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
          disabled={isLoading}
          className="absolute top-4 right-4 text-[#E7E0D5] hover:text-white transition-colors pointer-events-auto z-10 disabled:opacity-50"
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
            Invitar Acompañante
          </h2>
          <p className="text-[#E7E0D5] text-sm">
            Envía una invitación para compartir tu información del ciclo
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 pointer-events-auto"
        >
          {/* Input email */}
          <div>
            <label className="block text-[#E7E0D5] text-sm mb-2">
              Email del destinatario
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-transparent rounded-2xl shadow-[0_4px_8px_-2px_rgba(0,0,0,0.3)] text-base py-3 px-4 text-[#E7E0D5] placeholder-[#E7E0D5] focus:outline-none transition pointer-events-auto"
              placeholder="ejemplo@correo.com"
              required
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Selector de tipo de invitado */}
          <div>
            <label className="block text-[#E7E0D5] text-sm mb-2">
              Tipo de relación
            </label>
            <select
              value={guestType}
              onChange={(e) => setGuestType(e.target.value as any)}
              className="w-full bg-[#360001] border border-[#E7E0D5]/20 rounded-2xl text-base py-3 px-4 text-[#E7E0D5] focus:outline-none focus:border-[#E7E0D5]/40 transition pointer-events-auto"
              disabled={isLoading}
            >
              {guestTypeOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-[#360001]">
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-[#9d0d0b]/20 border border-[#9d0d0b]/40 text-[#E7E0D5] rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Información adicional */}
          <div className="bg-[#E7E0D5]/10 rounded-lg p-3 text-xs text-[#E7E0D5]">
            <p className="mb-1">📧 Se enviará un email a ambos participantes</p>
            <p className="mb-1">⏰ La invitación expirará en 48 horas</p>
            <p className="mb-1">🔒 Podrás gestionar los permisos posteriormente</p>
            <p className="mb-0">💡 Si no recibes el email, revisa tu carpeta de spam</p>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-[#E7E0D5] text-[#E7E0D5] font-semibold rounded-full hover:bg-[#E7E0D5] hover:text-[#C62328] transition-colors pointer-events-auto disabled:opacity-50"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !email}
              className="flex-1 px-4 py-2 bg-[#E7E0D5] text-[#C62328] font-semibold rounded-full hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors pointer-events-auto"
            >
              {isLoading ? "Enviando..." : "Enviar Invitación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvitationWithEmailModal;
