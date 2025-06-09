import React from "react";
import { motion } from "framer-motion";
import type { Notification } from "../../services/notificationService";
import { useViewport } from "../../hooks/useViewport";

interface NotificationsData {
  all: Notification[];
  total: number;
  unread: number;
  highPriority: number;
}

interface RemindersExpandedProps {
  notifications: NotificationsData | null;
  markAllAsRead: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

const RemindersExpanded: React.FC<RemindersExpandedProps> = ({
  notifications,
  markAllAsRead,
  markAsRead,
}) => {
  const { isMobile, isTablet } = useViewport(); // ! 08/06/2025 - Añadir responsive
  // Validar que notifications existe y tiene la estructura esperada
  const notificationsList = notifications?.all || [];

  // Filtrar recordatorios pendientes (no leídos y tipo reminder/cycle_prediction)
  const pendingReminders = notificationsList.filter(
    (n: Notification) =>
      !n.read && ["reminder", "cycle_prediction"].includes(n.type)
  );

  // Buscar notificación de ciclo próximo
  const cyclePrediction = notificationsList.find(
    (n: Notification) => !n.read && n.type === "cycle_prediction"
  );

  // Buscar notificación de acompañante
  const partnerJoined = notificationsList.find(
    (n: Notification) => !n.read && n.type === "partner"
  );

  // Formatear fecha amigable
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "";

      const now = new Date();
      const diff = (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      if (diff < 0.5 && diff > -0.5) return "Hoy";
      if (diff < 1.5 && diff > 0.5) return "Mañana";
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
      });
    } catch {
      return "";
    }
  };

  // ! 08/06/2025 - Manejar errores en las acciones con stopPropagation
  const handleMarkAsRead = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevenir cierre de la caja
    try {
      await markAsRead(id.toString());
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir cierre de la caja
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"
      style={{
        background: "transparent",
        borderRadius: isMobile ? 18 : 24,
        padding: isMobile ? 20 : isTablet ? 28 : 32,
        minHeight: isMobile ? 360 : isTablet ? 420 : 480,
        width: "100%",
      }}
    >
      {/* ! 08/06/2025 - Header neomórfico */}
      <div
        style={{
          background: "linear-gradient(145deg, #fafaf9, #e7e5e4)",
          boxShadow: `
            8px 8px 16px rgba(91, 1, 8, 0.1),
            -8px -8px 16px rgba(255, 255, 255, 0.8),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `,
          borderRadius: isMobile ? 16 : 20,
          padding: isMobile ? 16 : 20,
          marginBottom: isMobile ? 20 : 24,
          textAlign: "center" as const,
        }}
      >
        <h3
          style={{
            fontSize: isMobile ? 18 : 20,
            fontWeight: 700,
            color: "#C62328",
            marginBottom: 8,
            textShadow: "0 1px 2px rgba(255,255,255,0.8)",
          }}
        >
          Tus recordatorios
        </h3>

        {pendingReminders.length > 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontSize: isMobile ? 12 : 14,
              color: "#7a2323",
            }}
          >
            <span>💌</span>
            <span>¡Todo al día!</span>
          </div>
        ) : (
          <div
            style={{
              fontSize: isMobile ? 12 : 14,
              color: "#7a2323",
            }}
          >
            No tienes recordatorios pendientes
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="flex-1 space-y-4">
        {/* Lista de recordatorios pendientes */}
        {pendingReminders.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {pendingReminders.map((r: Notification, index: number) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background: "linear-gradient(145deg, #fff, #f5f4f3)",
                  boxShadow: `
                    4px 4px 8px rgba(91, 1, 8, 0.08),
                    -4px -4px 8px rgba(255, 255, 255, 0.9),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3)
                  `,
                  borderRadius: isMobile ? 12 : 16,
                  padding: isMobile ? 12 : 16,
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "default",
                }}
              >
                {/* Icono */}
                <div
                  style={{
                    width: isMobile ? 32 : 36,
                    height: isMobile ? 32 : 36,
                    borderRadius: "50%",
                    background: "linear-gradient(145deg, #FFE6E6, #FFCCCC)",
                    boxShadow: `
                      2px 2px 4px rgba(91, 1, 8, 0.1),
                      -2px -2px 4px rgba(255, 255, 255, 0.8)
                    `,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: isMobile ? 16 : 18,
                  }}
                >
                  {r.type === "cycle_prediction"
                    ? "🔴"
                    : r.type === "reminder"
                    ? "�"
                    : "📩"}
                </div>

                {/* Contenido */}
                <div className="flex-1">
                  <div
                    style={{
                      fontSize: isMobile ? 14 : 15,
                      fontWeight: 600,
                      color: "#5b0108",
                      marginBottom: 4,
                      lineHeight: 1.3,
                    }}
                  >
                    {r.title}
                  </div>
                  {r.message && (
                    <div
                      style={{
                        fontSize: isMobile ? 12 : 13,
                        color: "#7a2323",
                        lineHeight: 1.4,
                      }}
                    >
                      {r.message}
                    </div>
                  )}
                </div>

                {/* Fecha y botón */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: isMobile ? 11 : 12,
                      color: "#C62328",
                      fontWeight: 600,
                    }}
                  >
                    {formatDate(r.scheduledFor || r.createdAt)}
                  </span>

                  <motion.button
                    onClick={(e) => handleMarkAsRead(e, r.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      width: isMobile ? 24 : 28,
                      height: isMobile ? 24 : 28,
                      borderRadius: "50%",
                      background: "linear-gradient(145deg, #E8F5E8, #D4EDD4)",
                      border: "none",
                      boxShadow: `
                        2px 2px 4px rgba(76, 175, 80, 0.2),
                        -2px -2px 4px rgba(255, 255, 255, 0.8)
                      `,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#4CAF50",
                      fontSize: isMobile ? 12 : 14,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    title="Marcar como leído"
                  >
                    ✓
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: isMobile ? 32 : 40,
              textAlign: "center" as const,
            }}
          >
            <div
              style={{
                width: isMobile ? 60 : 80,
                height: isMobile ? 60 : 80,
                borderRadius: "50%",
                background: "linear-gradient(145deg, #FFE6E6, #FFCCCC)",
                boxShadow: `
                  8px 8px 16px rgba(91, 1, 8, 0.1),
                  -8px -8px 16px rgba(255, 255, 255, 0.8)
                `,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: isMobile ? 24 : 32,
                marginBottom: 16,
              }}
            >
              😌
            </div>

            <div
              style={{
                fontSize: isMobile ? 16 : 18,
                fontWeight: 600,
                color: "#C62328",
                marginBottom: 8,
              }}
            >
              ¡Todo al día!
            </div>

            <div
              style={{
                fontSize: isMobile ? 14 : 15,
                color: "#7a2323",
                marginBottom: 20,
                lineHeight: 1.4,
              }}
            >
              No tienes recordatorios pendientes
            </div>
          </motion.div>
        )}

        {/* Avisos especiales */}
        {cyclePrediction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: "linear-gradient(145deg, #FFF8F5, #F5F0EB)",
              boxShadow: `
                inset 2px 2px 4px rgba(91, 1, 8, 0.05),
                inset -2px -2px 4px rgba(255, 255, 255, 0.8)
              `,
              borderRadius: isMobile ? 12 : 16,
              padding: isMobile ? 16 : 20,
              marginTop: 16,
            }}
          >
            <div
              style={{
                fontSize: isMobile ? 14 : 15,
                fontWeight: 600,
                color: "#C62328",
                marginBottom: 8,
              }}
            >
              🔴 Próximo ciclo:
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#7a2323",
                marginBottom: 12,
                lineHeight: 1.4,
              }}
            >
              {cyclePrediction.message}
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontSize: isMobile ? 12 : 13,
                color: "#7a2323",
              }}
            >
              <li
                style={{
                  marginBottom: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>•</span> Asegúrate de tener productos menstruales
              </li>
              <li
                style={{
                  marginBottom: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>•</span> Prepara analgésicos si los usas
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>•</span> Planifica actividades relajantes
              </li>
            </ul>
          </motion.div>
        )}

        {/* Aviso de acompañante */}
        {partnerJoined && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              background: "linear-gradient(145deg, #F0F8F0, #E8F5E8)",
              boxShadow: `
                inset 2px 2px 4px rgba(76, 175, 80, 0.1),
                inset -2px -2px 4px rgba(255, 255, 255, 0.8)
              `,
              borderRadius: isMobile ? 12 : 16,
              padding: isMobile ? 16 : 20,
              marginTop: 16,
            }}
          >
            <div
              style={{
                fontSize: isMobile ? 14 : 15,
                fontWeight: 600,
                color: "#4CAF50",
                marginBottom: 8,
              }}
            >
              🎉 ¡Nuevo acompañante!
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#2E7D32",
                lineHeight: 1.4,
              }}
            >
              {partnerJoined.message}
            </div>
          </motion.div>
        )}

        {/* Botón marcar todos como leídos */}
        {pendingReminders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{ textAlign: "center" as const, marginTop: 20 }}
          >
            <motion.button
              onClick={handleMarkAllAsRead}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "linear-gradient(145deg, #C62328, #A81D22)",
                color: "white",
                border: "none",
                borderRadius: isMobile ? 12 : 16,
                padding: `${isMobile ? 12 : 14}px ${isMobile ? 24 : 32}px`,
                fontSize: isMobile ? 14 : 15,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: `
                  4px 4px 8px rgba(91, 1, 8, 0.2),
                  -2px -2px 4px rgba(255, 255, 255, 0.1)
                `,
                transition: "all 0.2s ease",
              }}
            >
              Marcar todos como leídos
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Footer info */}
      <div
        style={{
          textAlign: "center" as const,
          fontSize: isMobile ? 11 : 12,
          color: "#a62c2c",
          fontStyle: "italic",
          marginTop: 16,
          opacity: 0.8,
        }}
      >
        Los recordatorios aparecerán aquí cuando tengas notificaciones
        pendientes
      </div>
    </motion.div>
  );
};

export default RemindersExpanded;
