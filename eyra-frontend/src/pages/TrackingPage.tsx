import React, { useMemo } from "react";
import { motion } from "framer-motion";
import CircularNavigation from "../components/CircularNavigation";
import DraggableGrid from "../components/DraggableGrid";

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

// Variables de datos (puedes adaptar el contenido de cada card aquí)
const companions: Companion[] = [
  {
    id: "1",
    name: "Alex",
    role: "partner",
    status: "active",
    lastActivity: "2h ago",
    permissions: ["cycle", "symptoms", "mood"],
  },
];
const following: Companion[] = [];
const invitations: Invitation[] = [];
const messages = 0;
const recentActivity = 3;

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

// Componentes de las tarjetas (idénticos a los que ya tienes)
const CompanionsCard = () => (
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
        <div className="space-y-3">
          {companions.map((companion) => (
            <div
              key={companion.id}
              className="bg-white/50 rounded-xl p-3 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-[#5b0108] text-sm">
                  {companion.name}
                </p>
                <p className="text-xs text-[#a62c2c]">
                  {getRoleInSpanish(companion.role)}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
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
          <div className="pt-3 border-t border-[#C62328]/20">
            <p className="text-xs text-[#C62328] font-medium">
              🔴 {companions.length} {companions.length === 1 ? "persona conectada" : "personas conectadas"}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xs text-[#C62328] font-medium">
            🔴 Ningún acompañante aún
          </p>
          <button className="mt-3 px-4 py-2 bg-[#C62328] text-white rounded-lg text-xs hover:bg-[#9d0d0b] transition-colors">
            Invitar primera persona
          </button>
        </div>
      )}
    </div>
  </div>
);

const FollowingCard = () => (
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
      {following.length > 0 ? (
        <div className="space-y-3">
          {following.map((person) => (
            <div key={person.id} className="bg-white/50 rounded-xl p-3">
              <p className="font-semibold text-[#5b0108] text-sm">
                {person.name}
              </p>
              <p className="text-xs text-[#a62c2c]">
                Última actualización: {person.lastActivity}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xs text-[#C62328] font-medium">
            🔴 No sigues a nadie actualmente
          </p>
        </div>
      )}
    </div>
  </div>
);

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
        <p className="text-xs font-medium text-[#5b0108]">
          Síntomas y estado
        </p>
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
          🔴 Configurar permisos detallados
        </p>
      </div>
    </div>
  </div>
);

const InvitationsCard = () => (
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
        <div className="space-y-3">
          {invitations.map((invitation) => (
            <div key={invitation.id} className="bg-white/50 rounded-xl p-3">
              <p className="font-mono text-xs text-[#5b0108]">
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
          <p className="text-xs text-[#C62328] font-medium">
            🔴 No hay invitaciones pendientes
          </p>
          <button className="mt-3 px-4 py-2 bg-[#C62328] text-white rounded-lg text-xs hover:bg-[#9d0d0b] transition-colors">
            Crear invitación
          </button>
        </div>
      )}
    </div>
  </div>
);

const CommunicationCard = () => (
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
      {messages > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#C62328] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {messages}
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
        {messages > 0 ? `${messages} mensajes nuevos` : "Sin mensajes nuevos"}
      </p>
    </div>
  </div>
);

const ActivityCard = () => (
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
        {recentActivity > 0
          ? `${recentActivity} interacciones recientes`
          : "Sin actividad reciente"}
      </p>
    </div>
  </div>
);

const TrackingPage: React.FC = () => {
  // Define los items igual que en DashboardPage
  const trackingItems = useMemo(
    () => [
      {
        id: "companions",
        title: "Mis Acompañantes",
        component: <CompanionsCard />,
      },
      {
        id: "following",
        title: "Personas que Sigo",
        component: <FollowingCard />,
      },
      {
        id: "privacy",
        title: "Privacidad",
        component: <PrivacyCard />,
      },
      {
        id: "invitations",
        title: "Invitaciones",
        component: <InvitationsCard />,
      },
      {
        id: "communication",
        title: "Comunicación",
        component: <CommunicationCard />,
      },
      {
        id: "activity",
        title: "Actividad Reciente",
        component: <ActivityCard />,
      },
    ],
    []
  );

  return (
    <div className="w-full h-full bg-[#e7e0d5] overflow-hidden">
      <CircularNavigation />
      <DraggableGrid
        items={trackingItems}
        onItemsChange={() => {}}
      />
    </div>
  );
};

export default TrackingPage;
