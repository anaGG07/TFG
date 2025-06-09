import React from "react";
import type { Notification } from "../../services/notificationService";

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
  // Validar que notifications existe y tiene la estructura esperada
  const notificationsList = notifications?.all || [];
  
  // Filtrar recordatorios pendientes (no leídos y tipo reminder/cycle_prediction)
  const pendingReminders = notificationsList
    .filter((n: Notification) =>
      !n.read && ["reminder", "cycle_prediction"].includes(n.type)
    );

  // Buscar notificación de ciclo próximo
  const cyclePrediction = notificationsList
    .find((n: Notification) =>
      !n.read && n.type === "cycle_prediction"
    );

  // Buscar notificación de acompañante
  const partnerJoined = notificationsList
    .find((n: Notification) =>
      !n.read && n.type === "partner"
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
      return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
    } catch {
      return "";
    }
  };

  // Manejar errores en las acciones
  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id.toString());
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <div className="h-full flex flex-col px-6 py-8">
      <h3 className="text-center text-lg font-bold text-[#C62328] mb-4">Tus recordatorios</h3>
      <div className="flex-1 space-y-4">
        {/* Lista de recordatorios pendientes */}
        {pendingReminders.length > 0 ? (
          <ul>
            {pendingReminders.map((r: Notification) => (
              <li key={r.id} className="flex items-center gap-2 bg-[#fff7f7] rounded-lg px-3 py-2 shadow-sm mb-1">
                <span className="text-[#C62328]">🔔</span>
                <span className="text-sm text-[#7a2323] flex-1">{r.title}</span>
                <span className="text-xs text-[#C62328] font-semibold">{formatDate(r.scheduledFor || r.createdAt)}</span>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handleMarkAsRead(r.id); 
                  }} 
                  className="ml-2 text-xs text-green-600 font-bold hover:text-green-800 transition-colors"
                  title="Marcar como leído"
                >
                  ✓
                </button>
              </li>
            ))}
          </ul>
        ) : (
          // Contenido por defecto cuando no hay recordatorios
          <div className="flex flex-col justify-center py-4 h-full">
            <div className="text-center mb-6">
              <div className="text-2xl mb-2">🌸</div>
              <h4 className="text-sm font-semibold text-[#C62328] mb-2">¡Todo al día!</h4>
              <p className="text-xs text-[#7a2323] mb-4">No tienes recordatorios pendientes</p>
            </div>

            {/* Consejos útiles por defecto */}
            <div className="space-y-3">
              <div className="bg-[#fff7f7] rounded-lg px-3 py-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[#C62328]">💧</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-[#7a2323]">Mantente hidratada</p>
                    <p className="text-xs text-[#a62c2c]">Bebe al menos 8 vasos de agua al día</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#fff7f7] rounded-lg px-3 py-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[#C62328]">🥗</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-[#7a2323]">Alimentación balanceada</p>
                    <p className="text-xs text-[#a62c2c]">Incluye hierro y vitaminas en tu dieta</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#fff7f7] rounded-lg px-3 py-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[#C62328]">🧘‍♀️</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-[#7a2323]">Ejercicio suave</p>
                    <p className="text-xs text-[#a62c2c]">Yoga y estiramientos ayudan con calambres</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#fff7f7] rounded-lg px-3 py-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[#C62328]">😴</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-[#7a2323]">Descanso reparador</p>
                    <p className="text-xs text-[#a62c2c]">7-8 horas de sueño mejoran tu bienestar</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#fff7f7] rounded-lg px-3 py-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[#C62328]">📝</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-[#7a2323]">Registra tu ciclo</p>
                    <p className="text-xs text-[#a62c2c]">Anota síntomas para mejor seguimiento</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-[#a62c2c] italic">
                Los recordatorios aparecerán aquí cuando tengas notificaciones pendientes
              </p>
            </div>
          </div>
        )}

        {/* Aviso de ciclo próximo */}
        {cyclePrediction && (
          <div className="mt-3 bg-[#f8f4f1] rounded-xl p-3 text-xs text-[#7a2323] shadow-inner">
            <span className="font-semibold text-[#C62328]">Próximo ciclo:</span> {cyclePrediction.message}
            <ul className="list-disc ml-5 mt-1 text-xs">
              <li>Asegúrate de tener productos menstruales</li>
              <li>Prepara analgésicos si los usas</li>
              <li>Planifica actividades relajantes</li>
            </ul>
          </div>
        )}

        {/* Aviso de acompañante */}
        {partnerJoined && (
          <div className="mt-3 bg-[#f8f4f1] rounded-xl p-3 text-xs text-[#7a2323] shadow-inner">
            <span className="font-semibold text-[#C62328]">¡Nuevo acompañante!</span> {partnerJoined.message}
          </div>
        )}

        {/* Botón marcar todos como leídos */}
        {pendingReminders.length > 0 && (
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              handleMarkAllAsRead(); 
            }}
            className="mt-4 bg-[#C62328] text-white rounded-xl px-4 py-2 text-xs font-semibold shadow hover:bg-[#a81d22] transition"
          >
            Marcar todos como leídos
          </button>
        )}
      </div>
    </div>
  );
};

export default RemindersExpanded; 