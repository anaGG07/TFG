import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTracking } from "../../hooks/useTracking";
import { useViewport } from "../../hooks/useViewport";
import { NeomorphicCalendar } from "../../features/calendar/components/NeomorphicCalendar";
import { apiFetch } from "../../utils/httpClient";
import { API_ROUTES } from "../../config/apiRoutes";
import AvatarPreview from "../avatarBuilder/AvatarPreview";

// Implementación real de obtención de calendario compartido
const fetchUserCalendar = async (userId: string) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const response = await apiFetch<any>(
      `${API_ROUTES.CYCLES.CALENDAR}?start=${
        startOfMonth.toISOString().split("T")[0]
      }&end=${endOfMonth.toISOString().split("T")[0]}`
    );

    if (response && response.hostCycles) {
      // Filtrar los ciclos del anfitrión específico
      const hostData = response.hostCycles.find(
        (host: any) => host.hostId === parseInt(userId)
      );
      return hostData || null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching shared calendar:", error);
    return null;
  }
};

const CommunityBox: React.FC<{ expanded: boolean }> = ({ expanded }) => {
  const { companions, following } = useTracking();
  const { isMobile, isTablet, isDesktop } = useViewport();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [calendarData, setCalendarData] = useState<any>(null);
  const [calendarLoading, setCalendarLoading] = useState(false);

  // Unir comunidad (puedes personalizar el orden)
  const community = [...companions, ...following];

  // Seleccionar el primero por defecto
  useEffect(() => {
    if (community.length > 0 && !selectedId) {
      setSelectedId(community[0].id);
    }
  }, [community, selectedId]);

  // Cargar calendario al seleccionar usuario
  useEffect(() => {
    if (selectedId) {
      setCalendarLoading(true);
      fetchUserCalendar(selectedId).then((data) => {
        setCalendarData(data);
        setCalendarLoading(false);
      });
    }
  }, [selectedId]);

  // Vista NO expandida: solo SVG portada
  if (!expanded) {
    // Ajustar tamaño igual que otras cajas
    const svgSize = isMobile
      ? { width: 240, height: 165 }
      : isTablet
      ? { width: 280, height: 192 }
      : { width: 320, height: 220 };
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <img
          src="/img/32.svg"
          alt="Comunidad"
          style={{
            width: svgSize.width,
            height: svgSize.height,
            opacity: 0.97,
            objectFit: "contain",
          }}
        />
      </div>
    );
  }

  // Vista expandida
  return (
    <div
      className={`h-full flex ${
        isMobile || isTablet ? "flex-col" : "flex-row"
      } px-6 py-8 w-full`}
    >
      {/* Carrusel vertical/horizontal de avatares */}
      <motion.div
        className={`flex ${
          isMobile || isTablet
            ? "flex-row overflow-x-auto gap-4 mb-6"
            : "flex-col gap-4 mr-8"
        } items-center justify-center`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{ minWidth: isMobile || isTablet ? undefined : 80 }}
      >
        {community.length > 0 ? (
          community.map((user) => {
            const avatarUrl = (user as any).avatarUrl;
            const avatarConfig = (user as any).avatar;
            const hasAvatarConfig =
              avatarConfig &&
              typeof avatarConfig === "object" &&
              Object.keys(avatarConfig).length > 0;
            return (
              <motion.button
                key={user.id}
                className={`rounded-full border-2 ${
                  selectedId === user.id
                    ? "border-[#C62328] scale-110 shadow-lg"
                    : "border-[#f8f4f1]"
                } transition-all bg-white flex flex-col items-center`}
                onClick={() => setSelectedId(user.id)}
                whileHover={{ scale: 1.1 }}
              >
                {hasAvatarConfig ? (
                  <AvatarPreview
                    config={avatarConfig}
                    className="w-14 h-14 rounded-full"
                  />
                ) : avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={
                      (user as any).name ||
                      (user as any).username ||
                      (user as any).ownerName
                    }
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <img
                    src="/img/avatar-default.png"
                    alt="Avatar por defecto"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                )}
                <span className="block text-xs text-[#7a2323] mt-1 max-w-[70px] truncate">
                  {(user as any).name ||
                    (user as any).username ||
                    (user as any).ownerName}
                </span>
              </motion.button>
            );
          })
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center py-8 w-full h-full min-h-[180px]">
            <div className="text-center text-[#7a2323] text-sm mb-2">
              ¡Todavía no sigues a nadie! <br />
              Empieza a construir tu comunidad.
            </div>
            <button className="bg-[#C62328] text-white rounded-xl px-4 py-2 text-xs font-semibold shadow hover:bg-[#a81d22] transition mt-2">
              Explorar comunidad
            </button>
          </div>
        )}
      </motion.div>
      {/* Mini calendario o resumen a la derecha/abajo */}
      <div
        className={`flex-1 flex flex-col items-center justify-center ${
          isMobile || isTablet ? "mt-4" : "ml-8"
        }`}
      >
        <AnimatePresence>
          {selectedId && !calendarLoading ? (
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-xs bg-[#f8f4f1] rounded-2xl shadow-inner p-4"
            >
              <h4 className="text-center text-[#C62328] font-bold mb-2">
                {(community.find((u) => u.id === selectedId) as any)?.name ||
                  (community.find((u) => u.id === selectedId) as any)
                    ?.username ||
                  (community.find((u) => u.id === selectedId) as any)
                    ?.ownerName}
              </h4>
              {isDesktop ? (
                calendarData ? (
                  <NeomorphicCalendar />
                ) : (
                  <div className="text-center text-[#7a2323] text-sm opacity-70">
                    No hay datos de ciclo para esta persona.
                  </div>
                )
              ) : (
                <div className="text-center text-[#7a2323] text-sm opacity-70">
                  {calendarData && calendarData.currentPhase
                    ? `Fase actual: ${calendarData.currentPhase}`
                    : "No hay datos de ciclo para esta persona."}
                </div>
              )}
            </motion.div>
          ) : calendarLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-xs bg-[#f8f4f1] rounded-2xl shadow-inner p-4 text-center text-[#C62328]"
            >
              Cargando calendario...
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CommunityBox;
