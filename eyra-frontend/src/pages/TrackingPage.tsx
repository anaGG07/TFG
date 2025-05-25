import React, { useState } from "react";
import { motion } from "framer-motion";
import CircularNavigation from "../components/CircularNavigation";

// Interfaces
interface Companion {
  id: string;
  name: string;
  role: "partner" | "parent" | "friend";
  status: "active" | "pending" | "inactive";
  lastActivity: string;
  permissions: string[];
}

interface Invitation {
  id: string;
  code: string;
  type: "partner" | "parent" | "friend";
  createdAt: string;
  expiresAt: string;
}

// Iconos SVG
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

const TrackingPage: React.FC = () => {
  // Estados mockup
  const [companions] = useState<Companion[]>([
    {
      id: "1",
      name: "Alex",
      role: "partner",
      status: "active",
      lastActivity: "2h ago",
      permissions: ["cycle", "symptoms", "mood"],
    },
  ]);

  const [following] = useState<Companion[]>([]);
  const [invitations] = useState<Invitation[]>([]);
  const [messages] = useState(0);
  const [recentActivity] = useState(3);

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const hoverVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  // Función para obtener el rol en español
  const getRoleInSpanish = (role: string) => {
    switch (role) {
      case "partner":
        return "Pareja";
      case "parent":
        return "Parental";
      case "friend":
        return "Amigo/a";
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5ede6] relative overflow-hidden">
      <CircularNavigation />

      <motion.div
        className="pl-72 pr-8 py-8 h-screen"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-3 grid-rows-2 gap-8 h-full max-w-7xl mx-auto">
          {/* Mis Acompañantes */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer"
            style={{
              background: "#e7e0d5",
              boxShadow: `
                inset 4px 4px 8px rgba(91, 1, 8, 0.1),
                inset -4px -4px 8px rgba(255, 255, 255, 0.8),
                4px 4px 16px rgba(91, 1, 8, 0.05)
              `,
            }}
          >
            <motion.div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
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
              <CompanionsIcon className="w-8 h-8" />
            </motion.div>

            <h3 className="text-2xl font-serif font-bold text-[#7a2323] mb-4">
              Mis Acompañantes
            </h3>
            <p className="text-base text-[#5b0108] mb-6">
              Personas que siguen tu ciclo y te acompañan
            </p>

            <div className="w-full">
              {companions.length > 0 ? (
                <div className="space-y-4">
                  {companions.map((companion) => (
                    <div
                      key={companion.id}
                      className="bg-white/50 rounded-xl p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-[#5b0108]">
                          {companion.name}
                        </p>
                        <p className="text-sm text-[#a62c2c]">
                          {getRoleInSpanish(companion.role)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block w-3 h-3 rounded-full ${
                            companion.status === "active"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        ></span>
                        <p className="text-xs text-gray-500 mt-1">
                          {companion.lastActivity}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-[#C62328]/20">
                    <p className="text-sm text-[#C62328] font-medium">
                      🔴 {companions.length}{" "}
                      {companions.length === 1
                        ? "persona conectada"
                        : "personas conectadas"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-[#C62328] font-medium">
                    🔴 Ningún acompañante aún
                  </p>
                  <button className="mt-4 px-6 py-2 bg-[#C62328] text-white rounded-lg text-sm hover:bg-[#9d0d0b] transition-colors">
                    Invitar primera persona
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Personas que Sigo */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer"
            style={{
              background: "#e7e0d5",
              boxShadow: `
                inset 4px 4px 8px rgba(91, 1, 8, 0.1),
                inset -4px -4px 8px rgba(255, 255, 255, 0.8),
                4px 4px 16px rgba(91, 1, 8, 0.05)
              `,
            }}
          >
            <motion.div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
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
              <FollowingIcon className="w-8 h-8" />
            </motion.div>

            <h3 className="text-2xl font-serif font-bold text-[#7a2323] mb-4">
              Personas que Sigo
            </h3>
            <p className="text-base text-[#5b0108] mb-6">
              Cuando acompañas a alguien más
            </p>

            <div className="w-full">
              {following.length > 0 ? (
                <div className="space-y-3">
                  {following.map((person) => (
                    <div key={person.id} className="bg-white/50 rounded-xl p-4">
                      <p className="font-semibold text-[#5b0108]">
                        {person.name}
                      </p>
                      <p className="text-sm text-[#a62c2c]">
                        Última actualización: {person.lastActivity}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-[#C62328] font-medium">
                    🔴 No sigues a nadie actualmente
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Configuración de Privacidad */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer"
            style={{
              background: "#e7e0d5",
              boxShadow: `
                inset 4px 4px 8px rgba(91, 1, 8, 0.1),
                inset -4px -4px 8px rgba(255, 255, 255, 0.8),
                4px 4px 16px rgba(91, 1, 8, 0.05)
              `,
            }}
          >
            <motion.div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
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
              <PrivacyIcon className="w-8 h-8" />
            </motion.div>

            <h3 className="text-2xl font-serif font-bold text-[#7a2323] mb-4">
              Privacidad
            </h3>
            <p className="text-base text-[#5b0108] mb-6">
              Controla qué información compartes
            </p>

            <div className="w-full space-y-3">
              <div className="bg-white/50 rounded-xl p-3">
                <p className="text-sm font-medium text-[#5b0108]">
                  Información del ciclo
                </p>
                <p className="text-xs text-[#a62c2c]">Fechas y predicciones</p>
              </div>
              <div className="bg-white/50 rounded-xl p-3">
                <p className="text-sm font-medium text-[#5b0108]">
                  Síntomas y estado
                </p>
                <p className="text-xs text-[#a62c2c]">Registro de bienestar</p>
              </div>
              <div className="bg-white/50 rounded-xl p-3">
                <p className="text-sm font-medium text-[#5b0108]">
                  Alertas y recordatorios
                </p>
                <p className="text-xs text-[#a62c2c]">
                  Notificaciones compartidas
                </p>
              </div>

              <div className="pt-3 border-t border-[#C62328]/20">
                <p className="text-sm text-[#C62328] font-medium">
                  🔴 Configurar permisos detallados
                </p>
              </div>
            </div>
          </motion.div>

          {/* Invitaciones */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer"
            style={{
              background: "#e7e0d5",
              boxShadow: `
                inset 4px 4px 8px rgba(91, 1, 8, 0.1),
                inset -4px -4px 8px rgba(255, 255, 255, 0.8),
                4px 4px 16px rgba(91, 1, 8, 0.05)
              `,
            }}
          >
            <motion.div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
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
              <InvitationsIcon className="w-8 h-8" />
            </motion.div>

            <h3 className="text-2xl font-serif font-bold text-[#7a2323] mb-4">
              Invitaciones
            </h3>
            <p className="text-base text-[#5b0108] mb-6">
              Códigos de invitación y solicitudes
            </p>

            <div className="w-full">
              {invitations.length > 0 ? (
                <div className="space-y-3">
                  {invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="bg-white/50 rounded-xl p-4"
                    >
                      <p className="font-mono text-sm text-[#5b0108]">
                        {invitation.code}
                      </p>
                      <p className="text-xs text-[#a62c2c]">
                        {getRoleInSpanish(invitation.type)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-[#C62328] font-medium">
                    🔴 No hay invitaciones pendientes
                  </p>
                  <button className="mt-4 px-6 py-2 bg-[#C62328] text-white rounded-lg text-sm hover:bg-[#9d0d0b] transition-colors">
                    Crear invitación
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Comunicación */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer"
            style={{
              background: "#e7e0d5",
              boxShadow: `
                inset 4px 4px 8px rgba(91, 1, 8, 0.1),
                inset -4px -4px 8px rgba(255, 255, 255, 0.8),
                4px 4px 16px rgba(91, 1, 8, 0.05)
              `,
            }}
          >
            <motion.div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6 relative"
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
              <CommunicationIcon className="w-8 h-8" />
              {messages > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C62328] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {messages}
                </span>
              )}
            </motion.div>

            <h3 className="text-2xl font-serif font-bold text-[#7a2323] mb-4">
              Comunicación
            </h3>
            <p className="text-base text-[#5b0108] mb-6">
              Mensajes y notificaciones del círculo
            </p>

            <div className="w-full text-center">
              <p className="text-sm text-[#C62328] font-medium">
                🔴{" "}
                {messages > 0
                  ? `${messages} mensajes nuevos`
                  : "Sin mensajes nuevos"}
              </p>
            </div>
          </motion.div>

          {/* Actividad Reciente */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer"
            style={{
              background: "#e7e0d5",
              boxShadow: `
                inset 4px 4px 8px rgba(91, 1, 8, 0.1),
                inset -4px -4px 8px rgba(255, 255, 255, 0.8),
                4px 4px 16px rgba(91, 1, 8, 0.05)
              `,
            }}
          >
            <motion.div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
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
              <ActivityIcon className="w-8 h-8" />
            </motion.div>

            <h3 className="text-2xl font-serif font-bold text-[#7a2323] mb-4">
              Actividad Reciente
            </h3>
            <p className="text-base text-[#5b0108] mb-6">
              Timeline de interacciones y cambios
            </p>

            <div className="w-full text-center">
              <p className="text-sm text-[#C62328] font-medium">
                🔴{" "}
                {recentActivity > 0
                  ? `${recentActivity} interacciones recientes`
                  : "Sin actividad reciente"}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default TrackingPage;
