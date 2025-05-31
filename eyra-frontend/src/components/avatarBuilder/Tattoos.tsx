import React from "react";

interface TattoosProps {
  type: string;
  color: string;
}

const Tattoos: React.FC<TattoosProps> = ({ type, color }) => {
  switch (type) {
    case "harry":
      // Cicatriz Harry Potter (rayo en la frente, centrado)
      return (
        <path
          d="M160 112 L164 116 L160 120 L164 124"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      );
    case "airbender":
      // Flecha en la frente, centrada
      return (
        <path
          d="M160 104 L160 120 M155 112 L160 104 L165 112"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      );
    case "krilin":
      // Puntos en la frente, centrados
      return (
        <>
          <circle cx="156" cy="112" r="2" fill={color} />
          <circle cx="160" cy="110" r="2" fill={color} />
          <circle cx="164" cy="112" r="2" fill={color} />
        </>
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
