import React from "react";
import { motion } from "framer-motion";
import { useViewport } from "../../hooks/useViewport";
import RemindersExpanded from "./RemindersExpanded";

interface NotificationsData {
  all: any[];
  total: number;
  unread: number;
  highPriority: number;
}

interface RemindersViewProps {
  expanded?: boolean;
  notifications?: NotificationsData | null;
  markAllAsRead?: () => Promise<void>;
  markAsRead?: (id: string) => Promise<void>;
}

const RemindersView: React.FC<RemindersViewProps> = ({
  expanded = false,
  notifications,
  markAllAsRead,
  markAsRead,
}) => {
  const { isMobile, isTablet } = useViewport();

  // --- VISTA NO EXPANDIDA ---
  if (!expanded) {
    // Calcular el tamaño del SVG siguiendo el mismo patrón que SymptomsView
    const svgSize = isMobile
      ? { width: 240, height: 165 }
      : isTablet
      ? { width: 280, height: 192 }
      : { width: 320, height: 220 };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          borderRadius: 18,
          padding: isMobile ? 16 : 24,
          height: "100%",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <img
          src="/img/31.svg"
          alt="Recordatorios"
          style={{
            width: svgSize.width,
            height: svgSize.height,
            opacity: 0.97,
            objectFit: "contain",
          }}
        />
      </motion.div>
    );
  }

  // --- VISTA EXPANDIDA ---
  return (
    <RemindersExpanded
      notifications={notifications}
      markAllAsRead={markAllAsRead || (() => Promise.resolve())}
      markAsRead={markAsRead || (() => Promise.resolve())}
    />
  );
};

export default RemindersView;
