import React, { useState, useEffect } from "react";
import { userSearchService } from "../services/userSearchService";

// Iconos SVG consistentes con el estilo de la aplicación
const EmailIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

const AlertIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m21 16-4-4-4 4" />
    <path d="M21 21H3" />
    <path d="M7 21V7" />
    <path d="M17 21V7" />
    <circle cx="12" cy="3" r="1" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const LockIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export interface UserSearchData {
  searchType: "email" | "username";
  searchQuery: string;
  guestType: "partner" | "parental" | "friend" | "healthcare_provider";
  accessPermissions: string[];
  expirationHours: number;
}

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteUser: (data: UserSearchData) => Promise<void>;
  onInviteEmail: (data: { invitedEmail: string; guestType: "partner" | "parental" | "friend" | "healthcare_provider"; accessPermissions: string[]; expirationHours: number }) => Promise<void>;
  isLoading?: boolean;
}

const UserSearchModal: React.FC<UserSearchModalProps> = ({
  isOpen,
  onClose,
  onInviteUser,
  onInviteEmail,
  isLoading = false,
}) => {
  const [searchType, setSearchType] = useState<"email" | "username">("email");
  const [searchQuery, setSearchQuery] = useState("");
  const [guestType, setGuestType] = useState<"partner" | "parental" | "friend" | "healthcare_provider">("friend");
  const [searchResult, setSearchResult] = useState<{
    found: boolean;
    exists?: boolean;
    canInvite?: boolean;
    displayName?: string;
    username?: string;
    message?: string;
  } | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPermissionsForGuestType = (type: "partner" | "parental" | "friend" | "healthcare_provider"): string[] => {
    switch (type) {
      case "friend":
        return ["view_cycle", "view_symptoms"];
      case "partner":
        return ["view_cycle", "view_symptoms", "view_moods", "view_predictions"];
      case "healthcare_provider":
        return ["view_cycle", "view_symptoms", "view_analytics", "view_predictions"];
      case "parental":
        return ["view_cycle", "view_calendar"];
      default:
        return ["view_cycle", "view_symptoms"];
    }
  };

  const guestTypeOptions = [
    { value: "friend", label: "Amigo/a" },
    { value: "partner", label: "Pareja" },
    { value: "healthcare_provider", label: "Médico" },
    { value: "parental", label: "Parental" },
  ];

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Nuevo useEffect para limpiar cuando cambia el tipo de búsqueda
  useEffect(() => {
    // Limpiar solo el query, resultado y error cuando cambia el tipo de búsqueda
    setSearchQuery("");
    setSearchResult(null);
    setError(null);
  }, [searchType]);

  const resetForm = () => {
    setSearchQuery("");
    setSearchResult(null);
    setError(null);
    setSearchType("email");
    setGuestType("friend");
  };

  const validateSearchQuery = (): boolean => {
    if (!searchQuery.trim()) {
      setError("Ingresa un email o nombre de usuario");
      return false;
    }

    if (searchType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(searchQuery)) {
        setError("Formato de email inválido");
        return false;
      }
    } else {
      if (searchQuery.length < 3) {
        setError("El nombre de usuario debe tener al menos 3 caracteres");
        return false;
      }
    }

    return true;
  };

  const handleSearch = async () => {
    setError(null);
    
    if (!validateSearchQuery()) return;

    setSearching(true);
    try {
      let result;
      
      if (searchType === "email") {
        result = await userSearchService.searchByEmail(searchQuery.trim());
      } else {
        result = await userSearchService.searchByUsername(searchQuery.trim());
      }

      setSearchResult(result);
    } catch (err: any) {
      setError(err.message || "Error en la búsqueda");
    } finally {
      setSearching(false);
    }
  };

  const handleInviteFound = async () => {
    if (!searchResult?.canInvite) return;

    try {
      await onInviteUser({
        searchType,
        searchQuery: searchQuery.trim(),
        guestType,
        accessPermissions: getPermissionsForGuestType(guestType),
        expirationHours: 48,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al enviar invitación");
    }
  };

  const handleInviteByEmail = async () => {
    if (searchType !== "email") return;

    try {
      await onInviteEmail({
        invitedEmail: searchQuery.trim(),
        guestType,
        accessPermissions: getPermissionsForGuestType(guestType),
        expirationHours: 48,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al enviar invitación");
    }
  };

  const handleClose = () => {
    if (!isLoading && !searching) {
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading && !searching) {
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
          disabled={isLoading || searching}
          className="absolute top-4 right-4 text-[#E7E0D5] hover:text-white transition-colors pointer-events-auto z-10 disabled:opacity-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Contenido */}
        <div className="text-center mb-6">
          <h2 className="font-serif text-2xl font-bold text-[#E7E0D5] mb-2">
            Buscar Usuario
          </h2>
          <p className="text-[#E7E0D5] text-sm">
            Encuentra usuarios existentes para invitar
          </p>
        </div>

        <div className="space-y-6 pointer-events-auto">
          {/* Selector de tipo de búsqueda */}
          <div>
            <label className="block text-[#E7E0D5] text-sm mb-2">
              Buscar por
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSearchType("email")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                  searchType === "email"
                    ? "bg-[#E7E0D5] text-[#C62328]"
                    : "bg-transparent border border-[#E7E0D5]/20 text-[#E7E0D5]"
                }`}
                disabled={isLoading || searching}
              >
                <EmailIcon className="w-4 h-4" />
                <span>Email</span>
              </button>
              <button
                type="button"
                onClick={() => setSearchType("username")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                  searchType === "username"
                    ? "bg-[#E7E0D5] text-[#C62328]"
                    : "bg-transparent border border-[#E7E0D5]/20 text-[#E7E0D5]"
                }`}
                disabled={isLoading || searching}
              >
                <UserIcon className="w-4 h-4" />
                <span>Usuario</span>
              </button>
            </div>
          </div>

          {/* Input de búsqueda */}
          <div>
            <label className="block text-[#E7E0D5] text-sm mb-2">
              {searchType === "email" ? "Email del usuario" : "Nombre de usuario"}
            </label>
            <div className="flex gap-2">
              <input
                type={searchType === "email" ? "email" : "text"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-transparent rounded-2xl shadow-[0_4px_8px_-2px_rgba(0,0,0,0.3)] text-base py-3 px-4 text-[#E7E0D5] placeholder-[#E7E0D5] focus:outline-none transition pointer-events-auto"
                placeholder={searchType === "email" ? "usuario@ejemplo.com" : "@nombreusuario"}
                required
                disabled={isLoading || searching}
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={!searchQuery.trim() || searching || isLoading}
                className="px-4 py-3 bg-[#E7E0D5] text-[#C62328] font-semibold rounded-2xl hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors pointer-events-auto flex items-center justify-center"
              >
                {searching ? (
                  <SearchIcon className="w-4 h-4 animate-pulse" />
                ) : (
                  <SearchIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Resultado de búsqueda */}
          {searchResult && (
            <div className="bg-[#E7E0D5]/10 rounded-lg p-4">
              {searchResult.found && searchResult.canInvite ? (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckIcon className="w-5 h-5 text-green-400" />
                    <span className="text-[#E7E0D5] font-medium">Usuario encontrado</span>
                  </div>
                  {searchResult.displayName && (
                    <p className="text-[#E7E0D5] text-sm mb-3">
                      {searchResult.displayName} {searchResult.username && `(@${searchResult.username})`}
                    </p>
                  )}
                  
                  {/* Selector de tipo de relación */}
                  <div className="mb-4">
                    <label className="block text-[#E7E0D5] text-sm mb-2">
                      Tipo de relación
                    </label>
                    <select
                      value={guestType}
                      onChange={(e) => setGuestType(e.target.value as any)}
                      className="w-full bg-[#360001] border border-[#E7E0D5]/20 rounded-lg text-sm py-2 px-3 text-[#E7E0D5] focus:outline-none focus:border-[#E7E0D5]/40 transition pointer-events-auto"
                      disabled={isLoading}
                    >
                      {guestTypeOptions.map((option) => (
                        <option key={option.value} value={option.value} className="bg-[#360001]">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleInviteFound}
                    disabled={isLoading}
                    className="w-full py-2 bg-[#E7E0D5] text-[#C62328] font-semibold rounded-lg hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors pointer-events-auto"
                  >
                    {isLoading ? "Enviando..." : "Enviar Invitación"}
                  </button>
                </div>
              ) : searchResult.exists === false && searchType === "email" ? (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertIcon className="w-5 h-5 text-yellow-400" />
                    <span className="text-[#E7E0D5] font-medium">Usuario no registrado</span>
                  </div>
                  <p className="text-[#E7E0D5] text-sm mb-4">
                    Este email no está registrado en EYRA. ¿Quieres enviar una invitación por email?
                  </p>
                  
                  {/* Selector de tipo de relación para email */}
                  <div className="mb-4">
                    <label className="block text-[#E7E0D5] text-sm mb-2">
                      Tipo de relación
                    </label>
                    <select
                      value={guestType}
                      onChange={(e) => setGuestType(e.target.value as any)}
                      className="w-full bg-[#360001] border border-[#E7E0D5]/20 rounded-lg text-sm py-2 px-3 text-[#E7E0D5] focus:outline-none focus:border-[#E7E0D5]/40 transition pointer-events-auto"
                      disabled={isLoading}
                    >
                      {guestTypeOptions.map((option) => (
                        <option key={option.value} value={option.value} className="bg-[#360001]">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleInviteByEmail}
                    disabled={isLoading}
                    className="w-full py-2 bg-[#E7E0D5] text-[#C62328] font-semibold rounded-lg hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors pointer-events-auto"
                  >
                    {isLoading ? "Enviando..." : "Invitar por Email"}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <XIcon className="w-5 h-5 text-red-400" />
                    <span className="text-[#E7E0D5] font-medium">
                      {searchResult.message || "No se puede invitar"}
                    </span>
                  </div>
                  {searchResult.message && (
                    <p className="text-[#E7E0D5] text-sm">{searchResult.message}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-[#9d0d0b]/20 border border-[#9d0d0b]/40 text-[#E7E0D5] rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Información de privacidad */}
          <div className="bg-[#E7E0D5]/10 rounded-lg p-3 text-xs text-[#E7E0D5] flex items-start space-x-2">
            <LockIcon className="w-4 h-4 text-[#E7E0D5] mt-0.5 flex-shrink-0" />
            <p>Solo puedes buscar usuarios que permiten ser encontrados</p>
          </div>

          {/* Botón cancelar */}
          <button
            type="button"
            onClick={handleClose}
            className="w-full px-4 py-2 border border-[#E7E0D5] text-[#E7E0D5] font-semibold rounded-full hover:bg-[#E7E0D5] hover:text-[#C62328] transition-colors pointer-events-auto disabled:opacity-50"
            disabled={isLoading || searching}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSearchModal;
