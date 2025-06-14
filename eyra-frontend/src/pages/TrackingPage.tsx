import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import { PermissionsModal } from "../components/PermissionsManager";
import { useTracking } from "../hooks/useTracking";
import { Companion, Following, Invitation } from "../services/trackingService";

// Iconos SVG exactos de la web actual
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

// Función helper para roles en español
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

// Estilos neomórficos reutilizables
const neomorphicCardStyle = {
  background: "linear-gradient(145deg, #e7e0d5, #d4c7bb)",
  boxShadow: `
    8px 8px 16px rgba(91, 1, 8, 0.08),
    -8px -8px 16px rgba(255, 255, 255, 0.3)
  `,
};

const neomorphicInsetStyle = {
  background: "linear-gradient(145deg, #d4c7bb, #e7e0d5)",
  boxShadow: `
    inset 4px 4px 8px rgba(91, 1, 8, 0.05),
    inset -4px -4px 8px rgba(255, 255, 255, 0.8)
  `,
};

const TrackingPage: React.FC = () => {
  // Hooks reales del proyecto
  const {
    companions,
    following,
    invitations,
    unreadNotifications,
    loading,
    error,
    createInvitation,
    redeemInvitationCode,
    revokeCompanion,
    refresh,
  } = useTracking();

  // Estados locales para la UI
  const [activeTab, setActiveTab] = useState<
    "connections" | "privacy" | "activity"
  >("connections");
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null);
  const [inputCode, setInputCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [creatingInvitation, setCreatingInvitation] = useState(false);

  // Estado para el modal de permisos
  const [permissionsModal, setPermissionsModal] = useState<{
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

  // Handlers para eventos reales
  const handleCreateInvitation = async () => {
    if (creatingInvitation) return;

    try {
      setCreatingInvitation(true);
      await createInvitation({
        guestType: "partner",
        accessPermissions: ["view_cycle", "view_symptoms"],
        expirationHours: 48,
      });
    } catch (error) {
      console.error("Error creando invitación:", error);
      alert("Error al crear invitación. Inténtalo de nuevo.");
    } finally {
      setCreatingInvitation(false);
    }
  };

  const handleRedeemCode = async () => {
    if (!inputCode.trim() || isRedeeming) return;

    setIsRedeeming(true);
    try {
      await redeemInvitationCode(inputCode.trim());
      setInputCode("");
      alert("¡Código canjeado exitosamente!");
    } catch (error) {
      console.error("Error canjeando código:", error);
      alert("Error al canjear código. Verifica e inténtalo de nuevo.");
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleRevokeCompanion = async (
    companionId: string,
    username: string
  ) => {
    if (confirm(`¿Desvincular a @${username}?`)) {
      try {
        await revokeCompanion(companionId);
      } catch (error) {
        console.error("Error desvinculando:", error);
        alert("Error al desvincular. Inténtalo de nuevo.");
      }
    }
  };

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

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      alert(`Código copiado: ${code}`);
    }
  };

  const renderPersonCard = (
    person: Companion | Following,
    isOwner: boolean = false
  ) => (
    <motion.div
      key={person.id}
      layout
      className="rounded-xl overflow-hidden"
      style={neomorphicInsetStyle}
    >
      <div
        className="p-4 cursor-pointer hover:bg-white/20 transition-colors"
        onClick={() =>
          setExpandedPerson(expandedPerson === person.id ? null : person.id)
        }
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-semibold text-[#5b0108] text-sm">
              @{"username" in person ? person.username : person.ownerUsername}
            </p>
            <p className="text-xs text-[#a62c2c]">
              {getRoleInSpanish(person.role)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                "status" in person && person.status === "active"
                  ? "bg-green-500"
                  : "bg-gray-400"
              }`}
            ></div>
            <span className="text-xs text-gray-500">
              {expandedPerson === person.id ? "▲" : "▼"}
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expandedPerson === person.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-4 border-t border-[#C62328]/10"
          >
            <div className="pt-3 space-y-2">
              <div className="text-xs">
                <p className="text-[#5b0108] font-medium">
                  {isOwner ? "Nombre completo:" : "Propietario:"}
                </p>
                <p className="text-[#a62c2c]">
                  {"name" in person
                    ? person.name
                    : person.ownerName || "Sin nombre"}
                </p>
              </div>
              <div className="text-xs">
                <p className="text-[#5b0108] font-medium">
                  {isOwner ? "Permisos concedidos:" : "Permisos que tengo:"}
                </p>
                <p className="text-[#a62c2c]">
                  {person.permissions?.length > 0
                    ? person.permissions.join(", ")
                    : "Sin permisos definidos"}
                </p>
              </div>
              {isOwner && "username" in person && (
                <div className="pt-2 space-y-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openPermissionsModal(person as Companion);
                    }}
                    className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-colors"
                  >
                    🔧 Editar permisos
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRevokeCompanion(person.id, person.username);
                    }}
                    className="w-full px-3 py-2 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-colors"
                  >
                    ❌ Desvincular
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  // Mostrar loading mientras cargan los datos
  if (loading) {
    return <LoadingSpinner text="Cargando datos de seguimiento..." />;
  }

  // Mostrar error si algo falla
  if (error) {
    return (
      <div className="w-full h-full bg-[#e7e0d5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#C62328] font-medium mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-[#C62328] text-white rounded-lg hover:bg-[#9d0d0b] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-full bg-[#e7e0d5] p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-2xl font-serif font-bold text-[#7a2323] mb-2">
              Centro de Seguimiento
            </h1>
            <p className="text-[#5b0108] text-sm">
              Gestiona tus conexiones y privacidad
            </p>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl p-1"
            style={neomorphicCardStyle}
          >
            <div className="flex space-x-1">
              {[
                {
                  key: "connections",
                  label: "Mis Vínculos",
                  icon: CompanionsIcon,
                },
                { key: "privacy", label: "Privacidad", icon: PrivacyIcon },
                { key: "activity", label: "Actividad", icon: ActivityIcon },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === key
                      ? "bg-[#C62328] text-white shadow-lg"
                      : "text-[#5b0108] hover:bg-white/30"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {activeTab === "connections" && (
              <motion.div
                key="connections"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Mis Vínculos */}
                <div className="rounded-xl p-6" style={neomorphicCardStyle}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#C62328] flex items-center justify-center">
                      <CompanionsIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#7a2323]">
                        Mis Acompañantes
                      </h3>
                      <p className="text-xs text-[#5b0108]">
                        {companions.length} personas conectadas
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {companions.length > 0 ? (
                      companions.map((companion) =>
                        renderPersonCard(companion, true)
                      )
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-[#C62328] text-sm font-medium">
                          🔴 Ningún acompañante aún
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleCreateInvitation}
                    disabled={creatingInvitation}
                    className="w-full py-3 bg-[#C62328] text-white rounded-xl font-medium hover:bg-[#9d0d0b] transition-colors disabled:opacity-50"
                  >
                    {creatingInvitation
                      ? "Creando..."
                      : "+ Invitar Acompañante"}
                  </button>
                </div>

                {/* Conectar con Alguien */}
                <div className="rounded-xl p-6" style={neomorphicCardStyle}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#C62328] flex items-center justify-center">
                      <FollowingIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#7a2323]">
                        Conectar con Alguien
                      </h3>
                      <p className="text-xs text-[#5b0108]">
                        Canjea códigos y gestiona invitaciones
                      </p>
                    </div>
                  </div>

                  {/* Input de código */}
                  <div className="space-y-3 mb-4">
                    <div className="rounded-xl" style={neomorphicInsetStyle}>
                      <input
                        type="text"
                        value={inputCode}
                        onChange={(e) =>
                          setInputCode(e.target.value.toUpperCase())
                        }
                        placeholder="Introduce código de vinculación"
                        className="w-full bg-transparent border-none rounded-xl py-3 px-4 text-[#5b0108] focus:outline-none"
                        maxLength={10}
                        disabled={isRedeeming}
                      />
                    </div>
                    <button
                      onClick={handleRedeemCode}
                      disabled={!inputCode.trim() || isRedeeming}
                      className="w-full py-3 bg-[#C62328] text-white rounded-xl font-medium hover:bg-[#9d0d0b] transition-colors disabled:opacity-50"
                    >
                      {isRedeeming ? "Conectando..." : "Conectar"}
                    </button>
                  </div>

                  {/* Personas que sigo */}
                  {following.length > 0 && (
                    <>
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-[#5b0108] flex items-center justify-center">
                          <CompanionsIcon className="w-3 h-3 text-white" />
                        </div>
                        <h4 className="text-sm font-medium text-[#7a2323]">
                          Personas que Sigo
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {following.map((person) =>
                          renderPersonCard(person, false)
                        )}
                      </div>
                    </>
                  )}

                  {/* Invitaciones activas */}
                  {invitations.length > 0 && (
                    <>
                      <div className="flex items-center space-x-2 mb-3 mt-4">
                        <div className="w-6 h-6 rounded-full bg-[#C62328] flex items-center justify-center">
                          <InvitationsIcon className="w-3 h-3 text-white" />
                        </div>
                        <h4 className="text-sm font-medium text-[#7a2323]">
                          Mis Invitaciones
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {invitations.slice(0, 3).map((invitation) => (
                          <div
                            key={invitation.id}
                            className="p-3 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
                            style={neomorphicInsetStyle}
                            onClick={() => copyToClipboard(invitation.code)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
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
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "privacy" && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="rounded-xl p-6"
                style={neomorphicCardStyle}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#C62328] flex items-center justify-center">
                    <PrivacyIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#7a2323]">
                      Configuración de Privacidad
                    </h3>
                    <p className="text-sm text-[#5b0108]">
                      Controla qué información compartes
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Información del ciclo",
                      desc: "Fechas y predicciones",
                      icon: CompanionsIcon,
                    },
                    {
                      title: "Síntomas y estado",
                      desc: "Registro de bienestar",
                      icon: ActivityIcon,
                    },
                    {
                      title: "Alertas y recordatorios",
                      desc: "Notificaciones compartidas",
                      icon: CommunicationIcon,
                    },
                    {
                      title: "Datos médicos",
                      desc: "Información clínica",
                      icon: PrivacyIcon,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl"
                      style={neomorphicInsetStyle}
                    >
                      <div className="flex items-start space-x-3">
                        <item.icon className="w-6 h-6 text-[#C62328] mt-1" />
                        <div>
                          <h4 className="font-medium text-[#5b0108] mb-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-[#a62c2c] mb-3">
                            {item.desc}
                          </p>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              className="accent-[#C62328]"
                              defaultChecked
                            />
                            <span className="text-xs text-[#5b0108]">
                              Compartir
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-[#C62328]/10">
                  <p className="text-sm text-[#C62328] font-medium">
                    🔴 En desarrollo - Configuración avanzada próximamente
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === "activity" && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="rounded-xl p-6"
                style={neomorphicCardStyle}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#C62328] flex items-center justify-center">
                    <ActivityIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#7a2323]">
                      Actividad y Comunicación
                    </h3>
                    <p className="text-sm text-[#5b0108]">
                      Timeline de interacciones y mensajes
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div
                    className="text-center p-4 rounded-xl"
                    style={neomorphicInsetStyle}
                  >
                    <CommunicationIcon className="w-8 h-8 mx-auto mb-2 text-[#C62328]" />
                    <p className="text-lg font-bold text-[#C62328]">
                      {unreadNotifications}
                    </p>
                    <p className="text-xs text-[#5b0108]">Mensajes nuevos</p>
                  </div>
                  <div
                    className="text-center p-4 rounded-xl"
                    style={neomorphicInsetStyle}
                  >
                    <CompanionsIcon className="w-8 h-8 mx-auto mb-2 text-[#C62328]" />
                    <p className="text-lg font-bold text-[#C62328]">
                      {companions.length + following.length}
                    </p>
                    <p className="text-xs text-[#5b0108]">Conexiones activas</p>
                  </div>
                  <div
                    className="text-center p-4 rounded-xl"
                    style={neomorphicInsetStyle}
                  >
                    <ActivityIcon className="w-8 h-8 mx-auto mb-2 text-[#C62328]" />
                    <p className="text-lg font-bold text-[#C62328]">
                      {invitations.length}
                    </p>
                    <p className="text-xs text-[#5b0108]">
                      Invitaciones activas
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-[#7a2323] mb-3">
                    Actividad Reciente
                  </h4>
                  {companions.length > 0 || following.length > 0 ? (
                    [...companions, ...following]
                      .slice(0, 3)
                      .map((person, index) => (
                        <div
                          key={`${
                            "username" in person
                              ? person.username
                              : person.ownerUsername
                          }-${index}`}
                          className="flex items-center space-x-3 p-3 rounded-lg"
                          style={neomorphicInsetStyle}
                        >
                          <CompanionsIcon className="w-5 h-5 text-[#C62328]" />
                          <div className="flex-1">
                            <p className="text-sm text-[#5b0108]">
                              <span className="font-medium">
                                {"username" in person
                                  ? `@${person.username}`
                                  : `@${person.ownerUsername}`}
                              </span>{" "}
                              está conectado
                            </p>
                            <p className="text-xs text-[#a62c2c]">
                              {person.lastActivity
                                ? new Date(
                                    person.lastActivity
                                  ).toLocaleDateString()
                                : "Recientemente"}
                            </p>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-[#C62328] text-sm font-medium">
                        🔴 Sin actividad reciente
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal de permisos integrado */}
      <PermissionsModal
        isOpen={permissionsModal.isOpen}
        onClose={closePermissionsModal}
        companionId={permissionsModal.companionId}
        companionName={permissionsModal.companionName}
        currentPermissions={permissionsModal.permissions}
        currentGuestPreferences={permissionsModal.guestPreferences}
        isOwner={true}
        onUpdate={() => {
          refresh(); // Recargar datos después de actualizar permisos
        }}
      />
    </>
  );
};

export default TrackingPage;
