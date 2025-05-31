import React from "react";

interface TattoosProps {
  type: string;
  color: string;
}

const Tattoos: React.FC<TattoosProps> = ({ type, color }) => {
  switch (type) {
    case "harry":
      // Cicatriz Harry Potter (rayo en la frente)
      return (
        <polygon fill={color} fillOpacity="0.7" points="177,84 193,120 177,117 179,139 167,110 185,113" />
      );
    case "airbender":
      // Flecha en la frente
      return (
        <path fill={color} fillOpacity="0.7" d="M194 61c-4,-1 -9,-2 -14,-2l0 0c-5,0 -10,1 -14,2l0 36 -17 0 31 30 31 -30 -17 0 0 -36z" />
      );
    case "krilin":
      // Puntos en la frente
      return (
        <path fill={color} fillOpacity="0.7" d="M191 71c3,0 6,3 6,7 0,3 -3,6 -6,6 -4,0 -6,-3 -6,-6 0,-4 2,-7 6,-7zm0 32c3,0 6,3 6,7 0,3 -3,6 -6,6 -4,0 -6,-3 -6,-6 0,-4 2,-7 6,-7zm-22 0c4,0 6,3 6,7 0,3 -2,6 -6,6 -3,0 -6,-3 -6,-6 0,-4 3,-7 6,-7zm22 -16c3,0 6,3 6,7 0,3 -3,6 -6,6 -4,0 -6,-3 -6,-6 0,-4 2,-7 6,-7zm-22 0c4,0 6,3 6,7 0,3 -2,6 -6,6 -3,0 -6,-3 -6,-6 0,-4 3,-7 6,-7zm0 -16c4,0 6,3 6,7 0,3 -2,6 -6,6 -3,0 -6,-3 -6,-6 0,-4 3,-7 6,-7z" />
      );
    case "front":
      // Línea decorativa centrada en la frente
      return (
        <path
          d="M152 118 Q160 108 168 118"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      );
    case "tribal":
      // Tribal izquierdo, más cerca del centro
      return (
        <path
          d="M148 140 Q146 148 152 152 Q154 148 152 144"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      );
    case "tribal2":
      // Tribal derecho, simétrico
      return (
        <path
          d="M172 140 Q174 148 168 152 Q166 148 168 144"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      );
    case "throat":
      // Garganta centrada
      return (
        <ellipse
          cx="160"
          cy="200"
          rx="12"
          ry="4"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
      );
    case "none":
    default:
      return null;
  }
};

export default Tattoos;
