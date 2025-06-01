import React from "react";

const FacialHair: React.FC<{ type: string; color?: string }> = ({ type, color = "#7a2323" }) => {
  switch (type) {
    case "none":
      return null;
    case "magnum":
      return (
        <g>
          <path fill={color} d="M110 210 Q140 180 170 210 Q180 220 190 210 Q220 180 250 210 Q220 200 170 220 Q120 200 110 210 Z" />
        </g>
      );
    case "fancy":
      return (
        <g>
          <path d="M120 210 Q140 200 160 210 Q150 205 140 210 Q130 215 120 210 Z" fill={color} />
          <path d="M220 210 Q200 200 180 210 Q190 205 200 210 Q210 215 220 210 Z" fill={color} />
        </g>
      );
    case "magestic":
      return (
        <path
          d="M140 215 Q180 220 220 215 Q180 225 140 215 M150 215 L150 225 M170 215 L170 225"
          stroke={color}
          strokeWidth="3"
          fill="none"
        />
      );
    case "light":
      return (
        <path
          d="M140 215 Q180 220 220 215"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      );
    default:
      return null;
  }
};

export default FacialHair;
