import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTracking } from "../../hooks/useTracking";
import { useViewport } from "../../hooks/useViewport";
import { apiFetch } from "../../utils/httpClient";
import { API_ROUTES } from "../../config/apiRoutes";
import AvatarPreview from "../avatarBuilder/AvatarPreview";
import NeomorphicToast from "../ui/NeomorphicToast";

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

    console.log("Calendar API Response:", response);
    console.log("Looking for userId:", userId, "as hostId");

    if (response && response.hostCycles && response.hostCycles.length > 0) {
      console.log("Found hostCycles:", response.hostCycles);
      
      const hostData = response.hostCycles.find(
        (host: any) => host.hostId === parseInt(userId)
      );
      
      console.log("Found hostData for userId", userId, ":", hostData);
      return hostData || null;
    }
    
    if (response && response.userCycles && response.userCycles.length > 0) {
      console.log("No hostCycles found, but found userCycles:", response.userCycles);
      console.log("Note: This might indicate the selected user is yourself or permissions issue");
      
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

// Generador de calendario de muestra de 30 días
function generateSampleCalendar() {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const days = [];
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    days.push({
      date: date.toISOString().slice(0, 10),
      phase: i < 5 ? 'menstrual' : i < 13 ? 'folicular' : i < 17 ? 'ovulacion' : 'lutea',
      dayNumber: i + 1,
      isSample: true,
    });
  }
  return days;
}

// Componente de calendario de 30 días con estilo neomórfico
const NeomorphicMiniCalendar: React.FC<{ 
  days: any[], 
  onShowToast: (message: string, variant: "success" | "error") => void 
}> = ({ days, onShowToast }) => {
  const { isMobile } = useViewport();
  
  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'menstrual': return '#F8B4B4';
      case 'folicular': return '#FDF6B2';
      case 'ovulacion': return '#B4E1FA';
      case 'lutea': return '#C3DDFD';
      default: return '#E7E0D5';
    }
  };

  const getPhaseTextColor = (phase: string) => {
    return '#7a2323';
  };

  const handleDayClick = (day: any) => {
    const phaseNames = {
      menstrual: 'Menstrual',
      folicular: 'Folicular',
      ovulacion: 'Ovulación',
      lutea: 'Lútea'
    };
    
    const phaseName = phaseNames[day.phase as keyof typeof phaseNames] || day.phase;
    onShowToast(
      `Día ${day.dayNumber} - Fase ${phaseName}`,
      day.isSample ? "error" : "success"
    );
  };

  return (
    <div 
      className="p-4 rounded-2xl"
      style={{
        background: '#E7E0D5',
        boxShadow: 'inset 4px 4px 12px #d1c7b6, inset -4px -4px 12px #fff',
        border: '1px solid rgba(199, 35, 40, 0.1)',
      }}
    >
      <h4 className="text-center text-[#7a2323] font-medium mb-3 text-sm">
        Calendario de Ciclo (30 días)
      </h4>
      <div className={`grid gap-1 ${isMobile ? 'grid-cols-6' : 'grid-cols-7'}`}>
        {days.map((day, idx) => (
          <motion.button
            key={day.date}
            className="relative rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-200 hover:scale-105"
            style={{
              width: isMobile ? '28px' : '32px',
              height: isMobile ? '28px' : '32px',
              backgroundColor: getPhaseColor(day.phase),
              color: getPhaseTextColor(day.phase),
              boxShadow: '2px 2px 6px rgba(209, 199, 182, 0.8), -1px -1px 3px rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(199, 35, 40, 0.1)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleDayClick(day);
            }}
            whileHover={{
              boxShadow: '3px 3px 8px rgba(209, 199, 182, 0.9), -2px -2px 4px rgba(255, 255, 255, 1)',
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.02, duration: 0.3 }}
          >
            {day.dayNumber}
            {day.isSample && (
              <div 
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                style={{ backgroundColor: '#C62328', opacity: 0.7 }}
              />
            )}
          </motion.button>
        ))}
      </div>
      <p className="text-xs text-[#7a2323] opacity-60 text-center mt-2">
        Toca un día para ver detalles
      </p>
    </div>
  );
};

const CommunityBox: React.FC<{ expanded: boolean }> = ({ expanded }) => {
  const { following } = useTracking();
  const { isMobile, isTablet, isDesktop } = useViewport();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [calendarData, setCalendarData] = useState<any>(null);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [showToast, setShowToast] = useState<{
    message: string;
    variant: "success" | "error";
    show: boolean;
  }>({ message: "", variant: "success", show: false });
  
  const USERS_PER_PAGE = 2;
  const community = [...following];
  const totalPages = Math.ceil(community.length / USERS_PER_PAGE);
  const paginatedCommunity = community.slice(page * USERS_PER_PAGE, (page + 1) * USERS_PER_PAGE);

  console.log("Community data:", {
    followingCount: following.length,
    community: community.map(user => ({
      id: user.id,
      name: user.ownerName,
      username: user.ownerUsername
    })),
    selectedId
  });

  const handleShowToast = (message: string, variant: "success" | "error") => {
    setShowToast({ message, variant, show: true });
  };

  const handleCloseToast = () => {
    setShowToast(prev => ({ ...prev, show: false }));
  };

  useEffect(() => {
    if (community.length > 0 && !selectedId) {
      console.log("Community users:", community);
      setSelectedId(community[0].id);
    }
  }, [community, selectedId]);

  useEffect(() => {
    if (selectedId && !calendarLoading) {
      setCalendarLoading(true);
      
      // Añadir un pequeño delay para evitar múltiples llamadas
      const timeoutId = setTimeout(() => {
        fetchUserCalendar(selectedId)
          .then((data) => {
            setCalendarData(data);
          })
          .catch((error) => {
            console.error("Error fetching calendar:", error);
          })
          .finally(() => {
            setCalendarLoading(false);
          });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedId]);

  // Vista NO expandida
  if (!expanded) {
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

  // Función para renderizar avatares con estilo neomórfico
  const renderAvatars = () => {
    const avatarSize = isMobile ? 'w-20 h-20' : 'w-24 h-24'; // Tamaño más grande
    
    const NeomorphicButton: React.FC<{ 
      onClick: () => void, 
      disabled?: boolean, 
      children: React.ReactNode,
      ariaLabel: string 
    }> = ({ onClick, disabled, children, ariaLabel }) => (
      <motion.button
        aria-label={ariaLabel}
        className="p-2 rounded-full cursor-pointer transition-all duration-200"
        style={{
          background: '#E7E0D5',
          boxShadow: disabled 
            ? 'inset 2px 2px 6px #d1c7b6, inset -2px -2px 6px #fff'
            : '4px 4px 12px #d1c7b6, -4px -4px 12px #fff',
          border: '1px solid rgba(199, 35, 40, 0.1)',
          opacity: disabled ? 0.5 : 1,
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) onClick();
        }}
        disabled={disabled}
        whileHover={!disabled ? {
          boxShadow: '6px 6px 16px #d1c7b6, -6px -6px 16px #fff',
        } : {}}
        whileTap={!disabled ? {
          boxShadow: 'inset 2px 2px 6px #d1c7b6, inset -2px -2px 6px #fff',
        } : {}}
      >
        <div style={{ color: '#7a2323' }}>
          {children}
        </div>
      </motion.button>
    );

    if (isMobile || isTablet) {
      return (
        <div className="flex flex-row items-center gap-4 w-full justify-center mb-6">
          <NeomorphicButton
            onClick={() => setPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1))}
            disabled={totalPages <= 1}
            ariaLabel="Anterior"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </NeomorphicButton>
          
          <div className="flex flex-row gap-4 overflow-x-auto">
            {paginatedCommunity.map((user: any) => {
              const userName = user.name || user.ownerName;
              const userUsername = user.username || user.ownerUsername;
              const avatarConfig = user.avatar;
              const hasValidAvatarConfig = avatarConfig && typeof avatarConfig === "object" && 
                Object.keys(avatarConfig).length > 0 && 
                Object.values(avatarConfig).some((value) => value !== "" && value !== null);
              const isSelected = selectedId === user.id;
              
              return (
                <motion.div
                  key={user.id}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button
                    className={`${avatarSize} rounded-full cursor-pointer transition-all duration-300 relative`}
                    style={{
                      background: '#E7E0D5',
                      boxShadow: isSelected
                        ? 'inset 3px 3px 8px #d1c7b6, inset -3px -3px 8px #fff'
                        : '4px 4px 12px #d1c7b6, -4px -4px 12px #fff',
                      border: isSelected ? '2px solid #C62328' : '1px solid rgba(199, 35, 40, 0.1)',
                      padding: '2px',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(user.id);
                    }}
                    whileHover={!isSelected ? {
                      boxShadow: '6px 6px 16px #d1c7b6, -6px -6px 16px #fff',
                    } : {}}
                    whileTap={{
                      boxShadow: 'inset 2px 2px 6px #d1c7b6, inset -2px -2px 6px #fff',
                    }}
                  >
                    {hasValidAvatarConfig ? (
                      <AvatarPreview 
                        config={avatarConfig} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <img 
                        src="/img/avatar-default.png" 
                        alt="Avatar por defecto" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    )}
                    
                    {/* Círculo de selección centrado */}
                    {isSelected && (
                      <motion.div
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full"
                        style={{ backgroundColor: '#C62328' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.button>
                  
                  <span className="block text-xs text-[#7a2323] font-medium mt-2 max-w-[80px] truncate text-center">
                    {userName || userUsername}
                  </span>
                </motion.div>
              );
            })}
          </div>
          
          <NeomorphicButton
            onClick={() => setPage((prev) => (prev + 1) % totalPages)}
            disabled={totalPages <= 1}
            ariaLabel="Siguiente"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </NeomorphicButton>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center gap-4">
          <NeomorphicButton
            onClick={() => setPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1))}
            disabled={totalPages <= 1}
            ariaLabel="Arriba"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </NeomorphicButton>
          
          <div className="flex flex-col gap-4">
            {paginatedCommunity.map((user: any) => {
              const userName = user.name || user.ownerName;
              const userUsername = user.username || user.ownerUsername;
              const avatarConfig = user.avatar;
              const hasValidAvatarConfig = avatarConfig && typeof avatarConfig === "object" && 
                Object.keys(avatarConfig).length > 0 && 
                Object.values(avatarConfig).some((value) => value !== "" && value !== null);
              const isSelected = selectedId === user.id;
              
              return (
                <motion.div
                  key={user.id}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button
                    className={`${avatarSize} rounded-full cursor-pointer transition-all duration-300 relative`}
                    style={{
                      background: '#E7E0D5',
                      boxShadow: isSelected
                        ? 'inset 3px 3px 8px #d1c7b6, inset -3px -3px 8px #fff'
                        : '4px 4px 12px #d1c7b6, -4px -4px 12px #fff',
                      border: isSelected ? '2px solid #C62328' : '1px solid rgba(199, 35, 40, 0.1)',
                      padding: '2px',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(user.id);
                    }}
                    whileHover={!isSelected ? {
                      boxShadow: '6px 6px 16px #d1c7b6, -6px -6px 16px #fff',
                    } : {}}
                    whileTap={{
                      boxShadow: 'inset 2px 2px 6px #d1c7b6, inset -2px -2px 6px #fff',
                    }}
                  >
                    {hasValidAvatarConfig ? (
                      <AvatarPreview 
                        config={avatarConfig} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <img 
                        src="/img/avatar-default.png" 
                        alt="Avatar por defecto" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    )}
                    
                    {/* Círculo de selección centrado */}
                    {isSelected && (
                      <motion.div
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full"
                        style={{ backgroundColor: '#C62328' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.button>
                  
                  <span className="block text-xs text-[#7a2323] font-medium mt-2 max-w-[80px] truncate text-center">
                    {userName || userUsername}
                  </span>
                </motion.div>
              );
            })}
          </div>
          
          <NeomorphicButton
            onClick={() => setPage((prev) => (prev + 1) % totalPages)}
            disabled={totalPages <= 1}
            ariaLabel="Abajo"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </NeomorphicButton>
        </div>
      );
    }
  };

  // Vista expandida
  return (
    <>
      <div
        className={`h-full flex ${
          isMobile || isTablet ? "flex-col" : "flex-row"
        } px-6 py-8 w-full`}
      >
        {/* Carrusel de avatares */}
        <motion.div
          className={`flex ${
            isMobile || isTablet
              ? "flex-row overflow-x-auto gap-4 mb-6"
              : "flex-col gap-4 mr-8"
          } items-center justify-center`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ minWidth: isMobile || isTablet ? undefined : 120 }}
        >
          {renderAvatars()}
        </motion.div>

        {/* Área del calendario */}
        <div
          className={`flex-1 flex flex-col items-center justify-center ${
            isMobile || isTablet ? "mt-4" : "ml-8"
          }`}
        >
          <AnimatePresence mode="wait">
            {calendarLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-sm rounded-2xl p-6 text-center"
                style={{
                  background: '#E7E0D5',
                  boxShadow: 'inset 4px 4px 12px #d1c7b6, inset -4px -4px 12px #fff',
                  border: '1px solid rgba(199, 35, 40, 0.1)',
                }}
              >
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C62328] mx-auto mb-2"></div>
                <p className="text-[#7a2323] font-medium">Cargando calendario...</p>
              </motion.div>
            ) : (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-sm"
              >
                <div className="text-center mb-4">
                  <div className="text-[#7a2323] text-sm opacity-70 mb-4">
                    {calendarData && calendarData.cycles && calendarData.cycles.length > 0 
                      ? `Calendario de ${calendarData.hostName}` 
                      : "Calendario de muestra - Sin datos reales disponibles"}
                  </div>
                  <NeomorphicMiniCalendar 
                    days={calendarData && calendarData.cycles && calendarData.cycles.length > 0 
                      ? calendarData.cycles 
                      : generateSampleCalendar()} 
                    onShowToast={handleShowToast}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Toast de notificaciones */}
      {showToast.show && (
        <NeomorphicToast
          message={showToast.message}
          variant={showToast.variant}
          onClose={handleCloseToast}
          duration={3000}
        />
      )}
    </>
  );
};

export default CommunityBox;