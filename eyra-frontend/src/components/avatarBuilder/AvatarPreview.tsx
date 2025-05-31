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
      viewBox="0 0 360 360"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block" }} // Asegurar que no hay problemas de display
    >
      <g transform="translate(180, 180)">
        {/* Capa 1: Fondo y piel */}
        <Background color={safeValue(config.backgroundColor, "#E7E0D5")} />
        <Skin color={safeValue(config.skinColor, "#F5D0A9")} />
        
        {/* Capa 2: Pelo trasero */}
        <g className="hair-back">
          <Hair
            style={safeValue(config.hairStyle, "short")}
            color={safeValue(config.hairColor, "#4A4A4A")}
            isBack={true}
          />
        </g>

        {/* Capa 3: Ropa y cuerpo */}
        <Clothes
          type={safeValue(config.clothes, "tshirt")}
          color={safeValue(config.fabricColor, "#C62328")}
        />

        {/* Capa 4: Cara y características faciales */}
        <Eyes type={safeValue(config.eyes, "default")} />
        <Eyebrows type={safeValue(config.eyebrows, "default")} />
        <Mouth type={safeValue(config.mouth, "default")} />
        <FacialHair type={safeValue(config.facialHair, "none")} />

        {/* Capa 5: Pelo delantero */}
        <g className="hair-front">
          <Hair
            style={safeValue(config.hairStyle, "short")}
            color={safeValue(config.hairColor, "#4A4A4A")}
            isBack={false}
          />
        </g>

        {/* Capa 6: Accesorios y detalles finales */}
        <Glasses
          type={safeValue(config.glasses, "none")}
          opacity={safeValue(config.glassOpacity, "0.8")}
        />
        <Accessories 
          type={safeValue(config.accessories, "none")} 
          color={safeValue(config.accessoryColor, "#FFD700")}
        />
        <Tattoos 
          type={safeValue(config.tattoos, "none")} 
          color={safeValue(config.tattooColor, "#000000")}
        />
      </g>
    </svg>
  );
};

export default AvatarPreview;
