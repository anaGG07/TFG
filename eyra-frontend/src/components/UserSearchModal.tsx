import React, { useState, useEffect } from "react";
import { userSearchService } from "../services/userSearchService";
import NeomorphicToast from "./ui/NeomorphicToast";

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

const BugIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m8 2 1.88 1.88" />
    <path d="M14.12 3.88 16 2" />
    <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
    <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
    <path d="M12 20v-9" />
    <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
    <path d="M6 13H2" />
    <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
    <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
    <path d="M22 13h-4" />
    <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
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
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [showDebugMode, setShowDebugMode] = useState(false);
  const [showToast, setShowToast] = useState<{
    message: string;
    variant: "success" | "error";
    show: boolean;
  }>({ message: "", variant: "success", show: false });

  const showToastMessage = (message: string, variant: "success" | "error") => {
    setShowToast({ message, variant, show: true });
  };

  const hideToast = () => {
    setShowToast(prev => ({ ...prev, show: false }));
  };

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

  useEffect(() => {
    setSearchQuery("");
    setSearchResult(null);
    setError(null);
    setDebugInfo(null);
  }, [searchType]);

  const resetForm = () => {
    setSearchQuery("");
    setSearchResult(null);
    setError(null);
    setDebugInfo(null);
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
    setDebugInfo(null);
    
    if (!validateSearchQuery()) return;

    setSearching(true);
    
    try {
      // Información de debug detallada
      const debugData = {
        timestamp: new Date().toISOString(),
        searchType,
        searchQuery: searchQuery.trim(),
        userAgent: navigator.userAgent,
        currentUrl: window.location.href,
        authToken: localStorage.getItem('authToken') ? 'Present' : 'Missing',
      };

      console.log('🔍 INICIANDO BÚSQUEDA DE USUARIO', debugData);

      let result;
      
      if (searchType === "email") {
        console.log('📧 Buscando por email:', searchQuery.trim());
        result = await userSearchService.searchByEmail(searchQuery.trim());
      } else {
        console.log('👤 Buscando por username:', searchQuery.trim());
        result = await userSearchService.searchByUsername(searchQuery.trim());
      }

      console.log('✅ RESULTADO DE BÚSQUEDA:', result);
      
      setSearchResult(result);
      setDebugInfo(JSON.stringify(debugData, null, 2));
      
      // Mostrar toast de éxito
      if (result.found || result.exists) {
        showToastMessage('Usuario encontrado exitosamente', 'success');
      } else {
        showToastMessage('Usuario no encontrado', 'error');
      }

    } catch (err: any) {
      console.error('❌ ERROR EN BÚSQUEDA:', err);
      
      // Análisis detallado del error
      const errorAnalysis = {
        message: err.message || 'Error desconocido',
        status: err.status || 'Sin status',
        response: err.response?.data || 'Sin response data',
        stack: err.stack || 'Sin stack trace',
        type: typeof err,
        isNetworkError: !err.response,
        isAuthError: err.status === 401 || err.status === 403,
        isServerError: err.status >= 500,
        isClientError: err.status >= 400 && err.status < 500,
      };

      console.log('🔍 ANÁLISIS DEL ERROR:', errorAnalysis);

      // Mensajes de error más específicos
      let userMessage = 'Error en la búsqueda';
      
      if (errorAnalysis.isNetworkError) {
        userMessage = 'Error de conexión - Verifica tu internet';
      } else if (errorAnalysis.isAuthError) {
        userMessage = 'Error de autenticación - Inicia sesión nuevamente';
      } else if (errorAnalysis.isServerError) {
        userMessage = 'Error del servidor - Intenta más tarde';
      } else if (err.message.includes('404')) {
        userMessage = 'Servicio de búsqueda no disponible';
      } else if (err.message.includes('CORS')) {
        userMessage = 'Error de configuración del servidor';
      }

      setError(userMessage);
      setDebugInfo(JSON.stringify(errorAnalysis, null, 2));
      showToastMessage(userMessage, 'error');
      
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
      showToastMessage('Invitación enviada exitosamente', 'success');
      onClose();
    } catch (err: any) {
      const errorMessage = err.message || "Error al enviar invitación";
      setError(errorMessage);
      showToastMessage(errorMessage, 'error');
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
      showToastMessage('Invitación por email enviada', 'success');
      onClose();
    } catch (err: any) {
      const errorMessage = err.message || "Error al enviar invitación";
      setError(errorMessage);
      showToastMessage(errorMessage, 'error');
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
    <>
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
        <div 
          className="relative rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl pointer-events-auto"
          style={{
            background: '#360001',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
        >
          {/* Header con botón de debug */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-center flex-1">
              <h2 className="font-serif text-2xl font-bold text-[#E7E0D5] mb-2">
                Buscar Usuario
              </h2>
              <p className="text-[#E7E0D5] text-sm">
                Encuentra usuarios existentes para invitar
              </p>
            </div>
            
            {/* Botón de debug */}
            <button
              type="button"
              onClick={() => setShowDebugMode(!showDebugMode)}
              className="ml-4 p-2 text-[#E7E0D5] hover:text-white transition-colors"
              title="Mostrar información de debug"
            >
              <BugIcon className="w-5 h-5" />
            </button>
            
            {/* Botón cerrar */}
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading || searching}
              className="ml-2 text-[#E7E0D5] hover:text-white transition-colors disabled:opacity-50"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6 pointer-events-auto">
            {/* Información de debug */}
            {showDebugMode && debugInfo && (
              <div className="bg-[#E7E0D5]/10 rounded-lg p-3 text-xs">
                <div className="flex items-center space-x-2 mb-2">
                  <BugIcon className="w-4 h-4 text-[#E7E0D5]" />
                  <span className="text-[#E7E0D5] font-medium">Información de Debug</span>
                </div>
                <pre className="text-[#E7E0D5] overflow-x-auto whitespace-pre-wrap">
                  {debugInfo}
                </pre>
              </div>
            )}

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

            {/* Input de búsqueda mejorado */}
            <div>
              <label className="block text-[#E7E0D5] text-sm mb-2">
                {searchType === "email" ? "Email del usuario" : "Nombre de usuario"}
              </label>
              <div className="flex gap-2">
                <input
                  type={searchType === "email" ? "email" : "text"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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

            {/* Error mejorado */}
            {error && (
              <div className="bg-[#9d0d0b]/20 border border-[#9d0d0b]/40 text-[#E7E0D5] rounded-lg p-3 text-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <XIcon className="w-4 h-4 text-red-400" />
                  <span className="font-medium">Error en la búsqueda</span>
                </div>
                <p>{error}</p>
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

      {/* Toast de notificaciones */}
      {showToast.show && (
        <NeomorphicToast
          message={showToast.message}
          variant={showToast.variant}
          onClose={hideToast}
          duration={3000}
        />
      )}
    </>
  );
};

export default UserSearchModal;