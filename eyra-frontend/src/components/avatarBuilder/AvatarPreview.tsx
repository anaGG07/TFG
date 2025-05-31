import React from "react";
import { AvatarConfig } from "../../types/avatar";
import Background from "./Background";
import Skin from "./Skin";
import Hair from "./Hair";
import Eyes from "./Eyes";
import Eyebrows from "./Eyebrows";
import Mouth from "./Mouth";
import FacialHair from "./FacialHair";
import Clothes from "./Clothes";
import Glasses from "./Glasses";
import Accessories from "./Accessories";
import Tattoos from "./Tattoos";

interface AvatarPreviewProps {
  config: AvatarConfig;
  className?: string;
}

const AvatarPreview: React.FC<AvatarPreviewProps> = ({ config, className }) => {
  // Función helper para proveer valores por defecto solo para renderizado
  const safeValue = (value: string | undefined, defaultValue: string) => {
    return value && value.trim() !== "" ? value : defaultValue;
  };

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 320 320" 
      className={className}
      preserveAspectRatio="xMidYMid meet" 
    >
      <Background color={safeValue(config.backgroundColor, "#E7E0D5")} />
      <Skin color={safeValue(config.skinColor, "#F5D0A9")} />
      <Hair
        style={safeValue(config.hairStyle, "short")}
        color={safeValue(config.hairColor, "#4A4A4A")}
      />
      <FacialHair type={safeValue(config.facialHair, "none")} />
      <Clothes
        type={safeValue(config.clothes, "tshirt")}
        color={safeValue(config.fabricColor, "#C62328")}
      />
      <Eyes type={safeValue(config.eyes, "default")} />
      <Eyebrows type={safeValue(config.eyebrows, "default")} />
      <Mouth type={safeValue(config.mouth, "default")} />
      <Glasses
        type={safeValue(config.glasses, "none")}
        opacity={safeValue(config.glassOpacity, "0.8")}
      />
      <Accessories type={safeValue(config.accessories, "none")} />
      <Tattoos type={safeValue(config.tattoos, "none")} />
    </svg>
  );
};

export default AvatarPreview;
