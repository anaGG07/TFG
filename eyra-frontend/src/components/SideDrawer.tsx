import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useIsAdmin } from "../hooks/useIsAdmin";
import { useLogout } from "../hooks/useLogout";
import { ROUTES } from "../router/paths";
import { motion, AnimatePresence } from "framer-motion";
import UserAvatar from "./UserAvatar";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
}

// Iconos replicados exactamente del CircularNavigation
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <circle cx="8" cy="16" r="1" />
    <circle cx="12" cy="16" r="1" />
    <circle cx="16" cy="16" r="1" />
  </svg>
);

const TrackingIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const LibraryIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <path d="M8 7h8" />
    <path d="M8 11h6" />
    <path d="M8 15h4" />
  </svg>
);

const ProfileIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const MenuIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Icono de Admin
const AdminIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 15v2" />
    <path d="M12 3v4" />
    <path d="M3 12h4" />
    <path d="M17 12h4" />
    <path d="M18.364 5.636l-2.828 2.828" />
    <path d="M8.464 15.536l-2.828 2.828" />
    <path d="M5.636 5.636l2.828 2.828" />
    <path d="M15.536 15.536l2.828 2.828" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: HomeIcon,
    route: ROUTES.DASHBOARD,
  },
  {
    id: "calendar",
    label: "Calendario",
    icon: CalendarIcon,
    route: ROUTES.CALENDAR,
  },
  {
    id: "library",
    label: "Red Tent",
    icon: LibraryIcon,
    route: ROUTES.LIBRARY,
  },
  {
    id: "tracking",
    label: "Seguimiento",
    icon: TrackingIcon,
    route: "/tracking",
  },
  {
    id: "profile",
    label: "Perfil",
    icon: ProfileIcon,
    route: ROUTES.PROFILE,
  },
];

const SideDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const logout = useLogout();

  // Agregar item de admin condicionalmente
  const allNavigationItems = React.useMemo(() => {
    const baseItems = [...navigationItems];
    if (isAdmin) {
      // Insertar admin antes del profile (último elemento)
      baseItems.splice(-1, 0, {
        id: "admin",
        label: "Administración",
        icon: AdminIcon,
        route: "/admin",
      });
    }
    return baseItems;
  }, [isAdmin]);

  const handleNavigation = (route: string) => {
    navigate(route);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const isActive = (route: string) => {
    return location.pathname === route || location.pathname.startsWith(route + "/");
  };

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-[#C62328]/20 text-[#C62328] hover:bg-[#C62328]/10 transition-all duration-200"
        style={{
          boxShadow: `
            4px 4px 8px rgba(91, 1, 8, 0.06),
            -4px -4px 8px rgba(255, 255, 255, 0.7)
          `,
        }}
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Side Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 left-0 h-full w-80 z-50 bg-white shadow-2xl"
            style={{
              background: "linear-gradient(145deg, #fafaf9, #e7e5e4)",
              boxShadow: `
                20px 0 40px rgba(91, 1, 8, 0.1),
                inset -1px 0 0 rgba(255, 255, 255, 0.2)
              `,
            }}
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#C62328]/10">
              <h2 className="text-xl font-serif font-bold text-[#5b0108]">
                EYRA
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-[#5b0108]/60 hover:text-[#C62328] hover:bg-[#C62328]/5 transition-all duration-200"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-[#C62328]/10">
              <div className="flex items-center gap-3">
                <UserAvatar 
                  user={user} 
                  size="md" 
                />
                <div>
                  <p className="font-medium text-[#5b0108]">
                    {user?.name || "Usuario"}
                  </p>
                  <p className="text-sm text-[#5b0108]/60">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="p-4">
              {allNavigationItems.map((item) => {
                const active = isActive(item.route);
                const Icon = item.icon;
                const isAdminButton = item.id === "admin";

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.route)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 mb-2 ${
                      active
                        ? "bg-[#C62328]/10 text-[#C62328]"
                        : isAdminButton
                        ? "text-[#C62328] hover:text-[#C62328] hover:bg-[#C62328]/10"
                        : "text-[#5b0108]/70 hover:text-[#5b0108] hover:bg-[#C62328]/5"
                    }`}
                    style={{
                      boxShadow: active
                        ? "inset 2px 2px 4px rgba(198, 35, 40, 0.1)"
                        : "none",
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {isAdminButton && (
                      <div className="ml-auto w-2 h-2 bg-[#C62328] rounded-full animate-pulse" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-[#C62328]/10 mt-auto">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-[#5b0108]/70 hover:text-[#C62328] hover:bg-[#C62328]/5"
              >
                <LogoutIcon className="w-5 h-5" />
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SideDrawer;