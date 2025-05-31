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
        <path
          d="M160 110 L165 115 L160 120 L165 125"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      );
    case "airbender":
      // Flecha en la frente
      return (
        <path
          d="M160 100 L160 120 M155 110 L160 100 L165 110"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      );
    case "krilin":
      // Puntos en la frente
      return (
        <>
          <circle cx="155" cy="110" r="2" fill={color} />
          <circle cx="160" cy="108" r="2" fill={color} />
          <circle cx="165" cy="110" r="2" fill={color} />
        </>
      );
    case "front":
      // Tatuaje frontal (línea decorativa)
      return (
        <path
          d="M150 115 Q160 105 170 115"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      );
    case "tribal":
      // Tribal lado izquierdo
      return (
        <path
          d="M135 140 Q130 150 140 155 Q145 150 140 145"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      );
    case "tribal2":
      // Tribal lado derecho
      return (
        <path
          d="M185 140 Q190 150 180 155 Q175 150 180 145"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      );
    case "throat":
      // Tatuaje en la garganta
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
