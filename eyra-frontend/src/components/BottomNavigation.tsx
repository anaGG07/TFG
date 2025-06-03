import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../router/paths";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
}

// Iconos simplificados para bottom nav
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
  </svg>
);

const InsightsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 21H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4l2 3h11a1 1 0 0 1 1 1z" />
    <path d="M12 8v8m-4-4h8" />
  </svg>
);

const LibraryIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const ProfileIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Inicio",
    icon: HomeIcon,
    route: ROUTES.DASHBOARD,
  },
  {
    id: "calendar",
    label: "Ciclo",
    icon: CalendarIcon,
    route: ROUTES.CALENDAR,
  },
  {
    id: "library",
    label: "Refugio",
    icon: LibraryIcon,
    route: ROUTES.LIBRARY,
  },
  {
    id: "insights",
    label: "Análisis",
    icon: InsightsIcon,
    route: ROUTES.INSIGHTS,
  },
  {
    id: "profile",
    label: "Perfil",
    icon: ProfileIcon,
    route: ROUTES.PROFILE,
  },
];

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  const isActive = (route: string) => {
    return location.pathname === route || location.pathname.startsWith(route + "/");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#C62328]/10 px-2 py-2 safe-area-pb">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigationItems.map((item) => {
          const active = isActive(item.route);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.route)}
              className={`flex flex-col items-center justify-center px-2 py-1 rounded-xl transition-all duration-200 min-w-[60px] ${
                active
                  ? "bg-[#C62328]/10 text-[#C62328]"
                  : "text-[#5b0108]/60 hover:text-[#5b0108] active:scale-95"
              }`}
              style={{
                boxShadow: active
                  ? "inset 2px 2px 4px rgba(198, 35, 40, 0.1)"
                  : "none",
              }}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;