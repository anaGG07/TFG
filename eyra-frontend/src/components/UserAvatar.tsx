import React from "react";
import { AvatarConfig } from "../types/avatar";
import AvatarPreview from "./avatarBuilder/AvatarPreview";

interface UserAvatarProps {
  user: {
    name?: string;
    avatar?: AvatarConfig;
  } | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = "md", 
  className = "" 
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg"
  };

  // Si tiene avatar personalizado, mostrarlo
  if (user?.avatar) {
    return (
      <div className={`${sizeClasses[size]} ${className} overflow-hidden rounded-full`}>
        <AvatarPreview 
          config={user.avatar} 
          className="w-full h-full"
        />
      </div>
    );
  }

  // Fallback: iniciales con fondo de gradiente
  const initials = user?.name ? user.name[0].toUpperCase() : "U";
  
  return (
    <div
      className={`${sizeClasses[size]} ${className} rounded-full flex items-center justify-center text-white font-bold ${textSizeClasses[size]}`}
      style={{
        background: "linear-gradient(135deg, #C62328, #9d0d0b)",
      }}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;