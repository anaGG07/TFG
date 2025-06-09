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

    console.log("Calendar API Response:", response); // Debug log
    console.log("Looking for userId:", userId, "as hostId"); // Debug log

    if (response && response.hostCycles && response.hostCycles.length > 0) {
      console.log("Found hostCycles:", response.hostCycles); // Debug log
      
      // Filtrar los ciclos del anfitrión específico
      const hostData = response.hostCycles.find(
        (host: any) => host.hostId === parseInt(userId)
      );
      
      console.log("Found hostData for userId", userId, ":", hostData); // Debug log
      return hostData || null;
    }
    
    // Si no hay hostCycles, verificar si hay userCycles (fallback temporal)
    if (response && response.userCycles && response.userCycles.length > 0) {
      console.log("No hostCycles found, but found userCycles:", response.userCycles);
      console.log("Note: This might indicate the selected user is yourself or permissions issue");
      
      // Para depuración: mostrar que estos son datos propios
      return {
        hostId: parseInt(userId),
        hostName: "Tus propios datos",
        cycles: response.userCycles,
        currentPhase: response.userCycles.length > 0 ? response.userCycles[0].phase : null,
        note: "Showing your own data - check permissions or user selection"
      };
    }
    
    console.log("No calendar data found for userId:", userId);
    return null;
  } catch (error) {
    console.error("Error fetching shared calendar:", error);
    return null;
  }
};

// Función para generar un calendario de muestra
function renderSampleCalendar() {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const days = [];
  for (let i = 0; i < 28; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    days.push({
      date: date.toISOString().slice(0, 10),
      phase: i < 4 ? 'menstrual' : i < 14 ? 'folicular' : i < 18 ? 'ovulacion' : 'lutea',
      dayNumber: i + 1,
      isSample: true,
    });
  }
  return (
    <div className="flex flex-wrap justify-center gap-1 mt-2">
      {days.map((day, idx) => (
        <div
          key={day.date}
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-all
            ${day.phase === 'menstrual' ? 'bg-[#F8B4B4] text-[#7a2323]' :
              day.phase === 'folicular' ? 'bg-[#FDF6B2] text-[#7a2323]' :
              day.phase === 'ovulacion' ? 'bg-[#B4E1FA] text-[#7a2323]' :
              'bg-[#C3DDFD] text-[#7a2323]'}
            hover:scale-110 hover:shadow-md`}
          title={`Día ${day.dayNumber} (${day.phase})`}
          onClick={e => { e.stopPropagation(); alert(`Día ${day.dayNumber} (${day.phase})`); }}
        >
          {day.dayNumber}
        </div>
      ))}
    </div>
  );
}

const CommunityBox: React.FC<{ expanded: boolean }> = ({ expanded }) => {
  const { following } = useTracking();
  const { isMobile, isTablet, isDesktop } = useViewport();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [calendarData, setCalendarData] = useState<any>(null);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [page, setPage] = useState(0);
  const USERS_PER_PAGE = 2;
  const community = [...following];
  const totalPages = Math.ceil(community.length / USERS_PER_PAGE);
  const paginatedCommunity = community.slice(page * USERS_PER_PAGE, (page + 1) * USERS_PER_PAGE);

  // Debug: Log community data
  console.log("Community data:", {
    followingCount: following.length,
    community: community.map(user => ({
      id: user.id,
      name: user.ownerName,
      username: user.ownerUsername
    })),
    selectedId
  });

  // Seleccionar el primero por defecto
  useEffect(() => {
    if (community.length > 0 && !selectedId) {
      console.log("Community users:", community); // Debug log
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

  // Nueva función interna para renderizar avatares con paginación
  const renderAvatars = () => {
    if (isMobile || isTablet) {
      // Paginación horizontal móvil/tablet
      return (
        <div className="flex flex-row items-center gap-2 w-full justify-center mb-4">
          <button
            aria-label="Anterior"
            className="bg-white/70 rounded-full shadow p-1 border border-primary text-primary hover:bg-primary hover:text-white transition pointer-events-auto cursor-pointer"
            onClick={e => { e.stopPropagation(); setPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1)); }}
            disabled={totalPages <= 1}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div className="flex flex-row gap-3 overflow-x-auto">
            {paginatedCommunity.map((user: any) => {
              const userName = user.name || user.ownerName;
              const userUsername = user.username || user.ownerUsername;
              const avatarConfig = user.avatar;
              const hasValidAvatarConfig = avatarConfig && typeof avatarConfig === "object" && Object.keys(avatarConfig).length > 0 && Object.values(avatarConfig).some((value) => value !== "" && value !== null);
              return (
                <button
                  key={user.id}
                  className={`rounded-full shadow-md flex flex-col items-center cursor-pointer transition-all`}
                  onClick={e => { e.stopPropagation(); setSelectedId(user.id); }}
                >
                  {hasValidAvatarConfig ? (
                    <AvatarPreview config={avatarConfig} className="w-28 h-28 rounded-full shadow-lg border-2 border-[#C62328]" />
                  ) : (
                    <img src="/img/avatar-default.png" alt="Avatar por defecto" className="w-28 h-28 rounded-full object-cover shadow-lg border-2 border-[#C62328]" />
                  )}
                  <span className="block text-xs text-[#7a2323] mt-2 max-w-[90px] truncate">{userName || userUsername}</span>
                </button>
              );
            })}
          </div>
          <button
            aria-label="Siguiente"
            className="bg-white/70 rounded-full shadow p-1 border border-primary text-primary hover:bg-primary hover:text-white transition pointer-events-auto cursor-pointer"
            onClick={e => { e.stopPropagation(); setPage((prev) => (prev + 1) % totalPages); }}
            disabled={totalPages <= 1}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
          </button>
        </div>
      );
    } else {
      // Paginación vertical escritorio
      return (
        <div className="flex flex-col items-center gap-2">
          <button
            aria-label="Arriba"
            className="bg-white/70 rounded-full shadow p-1 border border-primary text-primary hover:bg-primary hover:text-white transition pointer-events-auto mb-2 cursor-pointer"
            onClick={e => { e.stopPropagation(); setPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1)); }}
            disabled={totalPages <= 1}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
          </button>
          <div className="flex flex-col gap-3">
            {paginatedCommunity.map((user: any) => {
              const userName = user.name || user.ownerName;
              const userUsername = user.username || user.ownerUsername;
              const avatarConfig = user.avatar;
              const hasValidAvatarConfig = avatarConfig && typeof avatarConfig === "object" && Object.keys(avatarConfig).length > 0 && Object.values(avatarConfig).some((value) => value !== "" && value !== null);
              return (
                <button
                  key={user.id}
                  className={`rounded-full shadow-md flex flex-col items-center cursor-pointer transition-all`}
                  onClick={e => { e.stopPropagation(); setSelectedId(user.id); }}
                >
                  {hasValidAvatarConfig ? (
                    <AvatarPreview config={avatarConfig} className="w-28 h-28 rounded-full shadow-lg border-2 border-[#C62328]" />
                  ) : (
                    <img src="/img/avatar-default.png" alt="Avatar por defecto" className="w-28 h-28 rounded-full object-cover shadow-lg border-2 border-[#C62328]" />
                  )}
                  <span className="block text-xs text-[#7a2323] mt-2 max-w-[90px] truncate">{userName || userUsername}</span>
                </button>
              );
            })}
          </div>
          <button
            aria-label="Abajo"
            className="bg-white/70 rounded-full shadow p-1 border border-primary text-primary hover:bg-primary hover:text-white transition pointer-events-auto mt-2 cursor-pointer"
            onClick={e => { e.stopPropagation(); setPage((prev) => (prev + 1) % totalPages); }}
            disabled={totalPages <= 1}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </button>
        </div>
      );
    }
  };

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
        {renderAvatars()}
      </motion.div>
      {/* Mini calendario o resumen a la derecha/abajo */}
      <div
        className={`flex-1 flex flex-col items-center justify-center ${
          isMobile || isTablet ? "mt-4" : "ml-8"
        }`}
      >
        <AnimatePresence>
          {/* Eliminar el motion.div vacío, solo mostrar loading si calendarLoading */}
          {calendarLoading ? (
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
        {/* Solo mostrar el mini calendario (real o de muestra) */}
        {!calendarData || !calendarData.cycles || calendarData.cycles.length === 0 ? (
          <div className="text-center text-[#7a2323] text-sm opacity-70">
            <div className="mb-2">No hay datos de ciclo disponibles para esta persona.</div>
            {renderSampleCalendar()}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CommunityBox;
