import React, { useMemo } from "react";
import { motion } from "framer-motion";
import DraggableGrid from "../components/DraggableGrid";
import LoadingSpinner from "../components/LoadingSpinner";
import { PermissionsModal } from "../components/PermissionsManager";
import { useTracking } from "../hooks/useTracking";
import { Companion, Following, Invitation } from "../services/trackingService";

// Iconos SVG reutilizados
const CompanionsIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C62328"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const FollowingIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C62328"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <path d="M20 8v6" />
    <path d="M23 11h-6" />
  </svg>
);

const PrivacyIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C62328"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const InvitationsIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C62328"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const CommunicationIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C62328"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ActivityIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C62328"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

// Función para obtener el rol en español
const getRoleInSpanish = (role: string) => {
  switch (role) {
    case "partner":
      return "Pareja";
    case "parental":
      return "Parental";
    case "friend":
      return "Amigo/a";
    case "healthcare_provider":
      return "Médico";
    default:
      return role;
  }
};

// Componentes de las tarjetas
const CompanionsCard = ({
  companions,
  onCreateInvitation,
  creatingInvitation,
  onRevokeCompanion,
  onRefresh,
}: {
  companions: Companion[];
  onCreateInvitation: (e?: React.MouseEvent) => void;
  creatingInvitation?: boolean;
  onRevokeCompanion?: (id: string) => void;
  onRefresh?: () => void;
}) => {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [permissionsModal, setPermissionsModal] = React.useState<{
    isOpen: boolean;
    companionId: string;
    companionName: string;
    permissions: string[];
    guestPreferences: string[];
  }>({
    isOpen: false,
    companionId: "",
    companionName: "",
    permissions: [],
    guestPreferences: [],
  });

  const openPermissionsModal = (companion: Companion) => {
    setPermissionsModal({
      isOpen: true,
      companionId: companion.id,
      companionName: companion.username,
      permissions: companion.permissions,
      guestPreferences: companion.guestPreferences || [],
    });
  };

  const closePermissionsModal = () => {
    setPermissionsModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center h-full">
        <motion.div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{
            background: "#f5ede6",
            boxShadow: `
          inset 2px 2px 4px rgba(91, 1, 8, 0.1),
          inset -2px -2px 4px rgba(255, 255, 255, 0.8)
        `,
          }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <CompanionsIcon className="w-6 h-6" />
        </motion.div>
        <h3 className="text-lg font-serif font-bold text-[#7a2323] mb-3">
          Mis Acompañantes
        </h3>
        <p className="text-sm text-[#5b0108] mb-4">
          Personas que siguen tu ciclo y te acompañan
        </p>
        <div className="w-full">
          {companions.length > 0 ? (
            <div className="space-y-2 mb-4">
              {companions.map((companion) => (
                <div
                  key={companion.id}
                  className="bg-white/60 rounded-xl border border-[#C62328]/10"
                >
                  {/* Card base clickeable */}
                  <div
                    className="p-3 cursor-pointer hover:bg-white/80 transition-colors"
                    onClick={() =>
                      setExpandedId(
                        expandedId === companion.id ? null : companion.id
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-[#5b0108] text-sm">
                          @{companion.username}
                        </p>
                        <p className="text-xs text-[#a62c2c]">
                          {getRoleInSpanish(companion.role)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            companion.status === "active"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        ></span>
                        <span className="text-xs text-gray-500">
                          {expandedId === companion.id ? "▲" : "▼"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Panel expandido */}
                  {expandedId === companion.id && (
                    <div className="px-3 pb-3 border-t border-[#C62328]/10">
                      <div className="pt-3 space-y-2">
                        <div className="text-xs">
                          <p className="text-[#5b0108] font-medium">
                            Nombre completo:
                          </p>
                          <p className="text-[#a62c2c]">
                            {companion.name || "Sin nombre"}
                          </p>
                        </div>
                        <div className="text-xs">
                          <p className="text-[#5b0108] font-medium">
                            Permisos:
                          </p>
                          <p className="text-[#a62c2c]">
                            {companion.permissions.length > 0
                              ? companion.permissions.join(", ")
                              : "Sin permisos definidos"}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-[#C62328]/10 space-y-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log(
                                "Botón Editar permisos clickeado",
                                companion
                              );
                              openPermissionsModal(companion);
                            }}
                            className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-colors"
                          >
                            🔧 Editar permisos
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onRevokeCompanion) {
                                if (
                                  confirm(
                                    `¿Desvincular a @${companion.username}?`
                                  )
                                ) {
                                  onRevokeCompanion(companion.id);
                                }
                              }
                            }}
                            className="w-full px-3 py-2 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-colors"
                          >
                            ❌ Desvincular
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center mb-4">
              <p className="text-xs text-[#C62328] font-medium">
                🔴 Ningún acompañante aún
              </p>
            </div>
          )}

          {/* Botón siempre visible para añadir más */}
          <button
            onClick={onCreateInvitation}
            disabled={creatingInvitation}
            className="w-full px-4 py-2 bg-[#C62328] text-white rounded-lg text-xs hover:bg-[#9d0d0b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creatingInvitation
              ? "Creando..."
              : companions.length > 0
              ? "+ Añadir más acompañantes"
              : "Invitar primera persona"}
          </button>

          {companions.length > 0 && (
            <div className="pt-3 border-t border-[#C62328]/20 mt-3">
              <p className="text-xs text-[#C62328] font-medium text-center">
                🔴 {companions.length}{" "}
                {companions.length === 1
                  ? "persona conectada"
                  : "personas conectadas"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de permisos */}
      <PermissionsModal
        isOpen={permissionsModal.isOpen}
        onClose={closePermissionsModal}
        companionId={permissionsModal.companionId}
        companionName={permissionsModal.companionName}
        currentPermissions={permissionsModal.permissions}
        currentGuestPreferences={permissionsModal.guestPreferences}
        isOwner={true}
        onUpdate={() => {
          // Recargar datos después de actualizar permisos
          if (onRefresh) {
            onRefresh();
          }
        }}
      />
    </>
  );
};

const FollowingCard = ({
  following,
  onRedeemCode,
}: {
  following: Following[];
  onRedeemCode: (code: string) => void;
}) => {
  const [inputCode, setInputCode] = React.useState("");
  const [isRedeeming, setIsRedeeming] = React.useState(false);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim() && !isRedeeming) {
      setIsRedeeming(true);
      try {
        await onRedeemCode(inputCode.trim().toUpperCase());
        setInputCode("");
      } catch (error) {
        // El error ya se maneja en el componente padre
      } finally {
        setIsRedeeming(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center h-full">
      <motion.div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{
          background: "#f5ede6",
          boxShadow: `
            inset 2px 2px 4px rgba(91, 1, 8, 0.1),
            inset -2px -2px 4px rgba(255, 255, 255, 0.8)
          `,
        }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        <FollowingIcon className="w-6 h-6" />
      </motion.div>

      <h3 className="text-lg font-serif font-bold text-[#7a2323] mb-3">
        Personas que Sigo
      </h3>
      <p className="text-sm text-[#5b0108] mb-4">
        Cuando acompañas a alguien más
      </p>

      <div className="w-full">
        {following.length > 0 && (
          <div className="space-y-2 mb-4">
            {following.map((person) => (
              <div
                key={person.id}
                className="bg-white/60 rounded-xl border border-[#C62328]/10"
              >
                {/* Card base clickeable */}
                <div
                  className="p-3 cursor-pointer hover:bg-white/80 transition-colors"
                  onClick={() =>
                    setExpandedId(expandedId === person.id ? null : person.id)
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-[#5b0108] text-sm">
                        @{person.ownerUsername}
                      </p>
                      <p className="text-xs text-[#a62c2c]">
                        {getRoleInSpanish(person.role)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-xs text-gray-500">
                        {expandedId === person.id ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Panel expandido */}
                {expandedId === person.id && (
                  <div className="px-3 pb-3 border-t border-[#C62328]/10">
                    <div className="pt-3 space-y-2">
                      <div className="text-xs">
                        <p className="text-[#5b0108] font-medium">
                          Nombre completo:
                        </p>
                        <p className="text-[#a62c2c]">
                          {person.ownerName || "Sin nombre"}
                        </p>
                      </div>
                      <div className="text-xs">
                        <p className="text-[#5b0108] font-medium">
                          Permisos que tengo:
                        </p>
                        <p className="text-[#a62c2c]">
                          {person.permissions.length > 0
                            ? person.permissions.join(", ")
                            : "Sin permisos definidos"}
                        </p>
                      </div>
                      <div className="text-xs">
                        <p className="text-[#5b0108] font-medium">
                          Última actividad:
                        </p>
                        <p className="text-[#a62c2c]">{person.lastActivity}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="Introduce código de vinculación"
              className="w-full px-4 py-3 text-sm border-2 border-[#C62328]/30 rounded-xl focus:outline-none focus:border-[#C62328] bg-white/90 transition-colors"
              maxLength={10}
              disabled={isRedeeming}
            />
            {inputCode && (
              <button
                type="button"
                onClick={() => setInputCode("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={!inputCode.trim() || isRedeeming}
            className="w-full px-4 py-3 bg-[#C62328] text-white rounded-xl text-sm font-medium hover:bg-[#9d0d0b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRedeeming ? "Conectando..." : "Conectar"}
          </button>
        </form>

        {following.length === 0 && (
          <p className="text-xs text-[#C62328] font-medium mt-3 text-center">
            🔴 No sigues a nadie actualmente
          </p>
        )}
      </div>
    </div>
  );
};

const PrivacyCard = () => (
  <div className="flex flex-col items-center justify-center text-center h-full">
    <motion.div
      className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
      style={{
        background: "#f5ede6",
        boxShadow: `
          inset 2px 2px 4px rgba(91, 1, 8, 0.1),
          inset -2px -2px 4px rgba(255, 255, 255, 0.8)
        `,
      }}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.2 }}
    >
      <PrivacyIcon className="w-6 h-6" />
    </motion.div>

    <h3 className="text-lg font-serif font-bold text-[#7a2323] mb-3">
      Privacidad
    </h3>
    <p className="text-sm text-[#5b0108] mb-4">
      Controla qué información compartes
    </p>

    <div className="w-full space-y-2">
      <div className="bg-white/50 rounded-xl p-2">
        <p className="text-xs font-medium text-[#5b0108]">
          Información del ciclo
        </p>
        <p className="text-xs text-[#a62c2c]">Fechas y predicciones</p>
      </div>
      <div className="bg-white/50 rounded-xl p-2">
        <p className="text-xs font-medium text-[#5b0108]">Síntomas y estado</p>
        <p className="text-xs text-[#a62c2c]">Registro de bienestar</p>
      </div>
      <div className="bg-white/50 rounded-xl p-2">
        <p className="text-xs font-medium text-[#5b0108]">
          Alertas y recordatorios
        </p>
        <p className="text-xs text-[#a62c2c]">Notificaciones compartidas</p>
      </div>

      <div className="pt-2 border-t border-[#C62328]/20">
        <p className="text-xs text-[#C62328] font-medium">
          🔴 En desarrollo - Configuración avanzada próximamente
        </p>
      </div>
    </div>
  </div>
);

const InvitationsCard = ({
  invitations,
  onCreateInvitation,
  creatingInvitation,
  totalInvitations,
}: {
  invitations: Invitation[];
  onCreateInvitation: (e?: React.MouseEvent) => void;
  creatingInvitation?: boolean;
  totalInvitations?: number;
}) => {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const copyToClipboard = async (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Intentar usar clipboard API moderno
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback para navegadores más antiguos o HTTP
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      // Mostrar feedback visual
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Error copiando al portapapeles:", err);
      alert(
        "Error al copiar. Intenta seleccionar y copiar manualmente: " + code
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center h-full">
      <motion.div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{
          background: "#f5ede6",
          boxShadow: `
            inset 2px 2px 4px rgba(91, 1, 8, 0.1),
            inset -2px -2px 4px rgba(255, 255, 255, 0.8)
          `,
        }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        <InvitationsIcon className="w-6 h-6" />
      </motion.div>

      <h3 className="text-lg font-serif font-bold text-[#7a2323] mb-3">
        Invitaciones
      </h3>
      <p className="text-sm text-[#5b0108] mb-4">
        Códigos de invitación y solicitudes
      </p>

      <div className="w-full">
        {invitations.length > 0 ? (
          <div className="space-y-2">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="bg-white/60 rounded-lg p-3 cursor-pointer hover:bg-white/80 transition-colors border border-[#C62328]/10"
                onClick={(e) => copyToClipboard(invitation.code, e)}
                title="Clic para copiar código"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-mono text-sm font-bold text-[#5b0108]">
                      📋 {invitation.code}
                    </p>
                    <p className="text-xs text-[#a62c2c]">
                      {getRoleInSpanish(invitation.type)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-blue-600 font-medium">
                      {copiedCode === invitation.code
                        ? "✅ Copiado!"
                        : "Copiar"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(invitation.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-2 border-t border-[#C62328]/20">
              {totalInvitations && totalInvitations > 3 && (
                <p className="text-xs text-gray-600">
                  {totalInvitations - 3} más...
                </p>
              )}
              <button
                onClick={onCreateInvitation}
                disabled={creatingInvitation}
                className="px-3 py-1.5 bg-[#C62328] text-white rounded-lg text-xs hover:bg-[#9d0d0b] transition-colors disabled:opacity-50"
              >
                {creatingInvitation ? "..." : "+ Nueva"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xs text-[#C62328] font-medium mb-3">
              🔴 No hay invitaciones activas
            </p>
            <button
              onClick={onCreateInvitation}
              disabled={creatingInvitation}
              className="px-4 py-2 bg-[#C62328] text-white rounded-lg text-xs hover:bg-[#9d0d0b] transition-colors disabled:opacity-50"
            >
              {creatingInvitation ? "Creando..." : "Crear invitación"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const CommunicationCard = ({ messageCount }: { messageCount: number }) => (
  <div className="flex flex-col items-center justify-center text-center h-full">
    <motion.div
      className="w-16 h-16 rounded-full flex items-center justify-center mb-4 relative"
      style={{
        background: "#f5ede6",
        boxShadow: `
          inset 2px 2px 4px rgba(91, 1, 8, 0.1),
          inset -2px -2px 4px rgba(255, 255, 255, 0.8)
        `,
      }}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.2 }}
    >
      <CommunicationIcon className="w-6 h-6" />
      {messageCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#C62328] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {messageCount}
        </span>
      )}
    </motion.div>

    <h3 className="text-lg font-serif font-bold text-[#7a2323] mb-3">
      Comunicación
    </h3>
    <p className="text-sm text-[#5b0108] mb-4">
      Mensajes y notificaciones del círculo
    </p>

    <div className="w-full text-center">
      <p className="text-xs text-[#C62328] font-medium">
        🔴{" "}
        {messageCount > 0
          ? `${messageCount} mensajes nuevos`
          : "Sin mensajes nuevos"}
      </p>
    </div>
  </div>
);

const ActivityCard = ({ activityCount }: { activityCount: number }) => (
  <div className="flex flex-col items-center justify-center text-center h-full">
    <motion.div
      className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
      style={{
        background: "#f5ede6",
        boxShadow: `
          inset 2px 2px 4px rgba(91, 1, 8, 0.1),
          inset -2px -2px 4px rgba(255, 255, 255, 0.8)
        `,
      }}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.2 }}
    >
      <ActivityIcon className="w-6 h-6" />
    </motion.div>

    <h3 className="text-lg font-serif font-bold text-[#7a2323] mb-3">
      Actividad Reciente
    </h3>
    <p className="text-sm text-[#5b0108] mb-4">
      Timeline de interacciones y cambios
    </p>

    <div className="w-full text-center">
      <p className="text-xs text-[#C62328] font-medium">
        🔴{" "}
        {activityCount > 0
          ? `${activityCount} interacciones recientes`
          : "Sin actividad reciente"}
      </p>
    </div>
  </div>
);

const TrackingPage: React.FC = () => {
  console.log(
    "TrackingPage: Renderizando página de seguimiento - SIN CircularNavigation"
  );

  const {
    companions,
    following,
    invitations,
    unreadNotifications,
    loading,
    createInvitation,
    redeemInvitationCode,
    revokeCompanion,
    refresh,
  } = useTracking();
  const [creatingInvitation, setCreatingInvitation] = React.useState(false);

  const handleCreateInvitation = async (e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevenir expansión del card
    if (creatingInvitation) return; // Evitar clicks múltiples

    try {
      setCreatingInvitation(true);
      console.log("Creando invitación...");
      const newInvitation = await createInvitation({
        guestType: "partner",
        accessPermissions: ["view_cycle", "view_symptoms"],
        expirationHours: 48,
      });
      console.log("Invitación creada exitosamente:", newInvitation);
    } catch (error) {
      console.error("Error creando invitación:", error);
    } finally {
      setCreatingInvitation(false);
    }
  };

  const handleRevokeCompanion = async (id: string) => {
    try {
      await revokeCompanion(id);
      console.log("Acompañante desvinculado exitosamente");
    } catch (error) {
      console.error("Error desvinculando acompañante:", error);
      alert("Error al desvincular. Inténtalo de nuevo.");
    }
  };

  const handleRedeemCode = async (code: string) => {
    try {
      console.log("Canjeando código:", code);
      await redeemInvitationCode(code);
      console.log("Código canjeado exitosamente");
    } catch (error) {
      console.error("Error canjeando código:", error);
      alert("Error al conectar. Verifica el código e inténtalo de nuevo.");
    }
  };

  // Valores para comunicación y actividad
  const messageCount = unreadNotifications;
  const activityCount = companions.length + following.length;

  // Filtrar y limitar invitaciones a las 3 últimas activas
  const activeInvitations = invitations
    .filter((inv) => inv.status === "active")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  // Define los items igual que en DashboardPage
  const trackingItems = useMemo(
    () => [
      {
        id: "companions",
        title: "Mis Acompañantes",
        component: (
          <CompanionsCard
            companions={companions}
            onCreateInvitation={handleCreateInvitation}
            creatingInvitation={creatingInvitation}
            onRevokeCompanion={handleRevokeCompanion}
            onRefresh={refresh}
          />
        ),
      },
      {
        id: "following",
        title: "Personas que Sigo",
        component: (
          <FollowingCard
            following={following}
            onRedeemCode={handleRedeemCode}
          />
        ),
      },
      {
        id: "privacy",
        title: "Privacidad",
        component: <PrivacyCard />,
      },
      {
        id: "invitations",
        title: "Invitaciones",
        component: (
          <InvitationsCard
            invitations={activeInvitations}
            onCreateInvitation={handleCreateInvitation}
            creatingInvitation={creatingInvitation}
            totalInvitations={
              invitations.filter((inv) => inv.status === "active").length
            }
          />
        ),
      },
      {
        id: "communication",
        title: "Comunicación",
        component: <CommunicationCard messageCount={messageCount} />,
      },
      {
        id: "activity",
        title: "Actividad Reciente",
        component: <ActivityCard activityCount={activityCount} />,
      },
    ],
    [
      companions,
      following,
      activeInvitations,
      invitations.length,
      messageCount,
      activityCount,
      creatingInvitation,
    ]
  );

  if (loading) {
    return <LoadingSpinner text="Cargando datos de tracking..." />;
  }

  return (
    <div className="w-full h-full bg-[#e7e0d5] overflow-hidden">
      <DraggableGrid
        items={trackingItems}
        onItemsChange={() => {}}
      />
    </div>
  );
};

export default TrackingPage;
