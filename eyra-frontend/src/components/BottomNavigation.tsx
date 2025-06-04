import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useIsAdmin } from "../hooks/useIsAdmin";
import { ROUTES } from "../router/paths";

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

const InsightsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6" />
    <path d="M12 17v6" />
    <path d="M4.22 4.22l4.24 4.24" />
    <path d="M15.54 15.54l4.24 4.24" />
    <path d="M1 12h6" />
    <path d="M17 12h6" />
    <path d="M4.22 19.78l4.24-4.24" />
    <path d="M15.54 8.46l4.24-4.24" />
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
    label: "",
    icon: HomeIcon,
    route: ROUTES.DASHBOARD,
  },
  {
    id: "calendar",
    label: "",
    icon: CalendarIcon,
    route: ROUTES.CALENDAR,
  },
  {
    id: "library",
    label: "",
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
    label: "",
    icon: ProfileIcon,
    route: ROUTES.PROFILE,
  },
];

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = useIsAdmin();

  // Agregar item de admin condicionalmente
  const allNavigationItems = React.useMemo(() => {
    const baseItems = [...navigationItems];
    if (isAdmin) {
      // Insertar admin antes del profile (último elemento)
      baseItems.splice(-1, 0, {
        id: "admin",
        label: "",
        icon: AdminIcon,
        route: "/admin",
      });
    }
    return baseItems;
  }, [isAdmin]);

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  const isActive = (route: string) => {
    return location.pathname === route || location.pathname.startsWith(route + "/");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#C62328]/10 px-2 py-2 safe-area-pb">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {allNavigationItems.map((item) => {
          const active = isActive(item.route);
          const Icon = item.icon;
          const isAdminButton = item.id === "admin";

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.route)}
              className={`flex items-center justify-center p-3 rounded-xl transition-all duration-200 ${
                active
                  ? "bg-[#C62328]/10 text-[#C62328] scale-110"
                  : isAdminButton
                  ? "text-[#C62328] hover:text-[#C62328] hover:bg-[#C62328]/10 active:scale-95"
                  : "text-[#5b0108]/60 hover:text-[#5b0108] active:scale-95"
              }`}
              style={{
                boxShadow: active
                  ? "inset 2px 2px 4px rgba(198, 35, 40, 0.1)"
                  : "none",
              }}
            >
              <Icon className="w-6 h-6" />
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;