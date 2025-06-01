import React from "react";

interface TattoosProps {
  type: string;
  color: string;
}

const Tattoos: React.FC<TattoosProps> = ({ type, color }) => {
  switch (type) {
    case "harry":
      // Cicatriz Harry Potter (rayo en la frente) - Mejorada
      return (
        <g>
          <path
            fill={color}
            fillOpacity="0.8"
            stroke={color}
            strokeWidth="1"
            d="M177 84 L185 95 L179 98 L187 110 L180 113 L185 125 L179 128 L175 115 L170 118 L175 105 L167 102 L175 90 Z"
          />
          {/* Sombra para dar profundidad */}
          <path
            fill="rgba(0,0,0,0.2)"
            d="M178 85 L186 96 L180 99 L188 111 L181 114 L186 126 L180 129 L176 116 L171 119 L176 106 L168 103 L176 91 Z"
          />
        </g>
      );

    case "airbender":
      // Flecha Avatar (Air Nomad) - Mejorada
      return (
        <g>
          <path
            fill={color}
            fillOpacity="0.8"
            stroke={color}
            strokeWidth="1.5"
            strokeLinejoin="round"
            d="M180 50 L180 85 M163 85 L180 105 L197 85 M163 85 L180 85 L197 85"
          />
          {/* Base de la flecha */}
          <circle
            cx="180"
            cy="50"
            r="8"
            fill={color}
            fillOpacity="0.6"
            stroke={color}
            strokeWidth="2"
          />
          {/* Puntas laterales */}
          <path
            fill={color}
            fillOpacity="0.7"
            d="M163 85 L170 78 L170 92 Z M197 85 L190 78 L190 92 Z"
          />
        </g>
      );

    case "krilin":
      // Puntos de Krilin (Dragon Ball) - Mejorados
      return (
        <g>
          {/* Patrón de 6 puntos más visible y organizado */}
          <circle
            cx="169"
            cy="75"
            r="4"
            fill={color}
            fillOpacity="0.8"
            stroke={color}
            strokeWidth="1"
          />
          <circle
            cx="180"
            cy="75"
            r="4"
            fill={color}
            fillOpacity="0.8"
            stroke={color}
            strokeWidth="1"
          />
          <circle
            cx="191"
            cy="75"
            r="4"
            fill={color}
            fillOpacity="0.8"
            stroke={color}
            strokeWidth="1"
          />

          <circle
            cx="169"
            cy="90"
            r="4"
            fill={color}
            fillOpacity="0.8"
            stroke={color}
            strokeWidth="1"
          />
          <circle
            cx="180"
            cy="90"
            r="4"
            fill={color}
            fillOpacity="0.8"
            stroke={color}
            strokeWidth="1"
          />
          <circle
            cx="191"
            cy="90"
            r="4"
            fill={color}
            fillOpacity="0.8"
            stroke={color}
            strokeWidth="1"
          />

          {/* Sombras sutiles */}
          <circle cx="170" cy="76" r="3" fill="rgba(0,0,0,0.1)" />
          <circle cx="181" cy="76" r="3" fill="rgba(0,0,0,0.1)" />
          <circle cx="192" cy="76" r="3" fill="rgba(0,0,0,0.1)" />

          <circle cx="170" cy="91" r="3" fill="rgba(0,0,0,0.1)" />
          <circle cx="181" cy="91" r="3" fill="rgba(0,0,0,0.1)" />
          <circle cx="192" cy="91" r="3" fill="rgba(0,0,0,0.1)" />
        </g>
      );

    case "front":
      // Tatuaje frontal simplificado y más visible
      return (
        <g>
          <path
            fill={color}
            fillOpacity="0.6"
            stroke={color}
            strokeWidth="1"
            d="M140 200 Q160 180 180 200 Q200 180 220 200 Q200 220 180 240 Q160 220 140 200 Z"
          />
          <path
            fill={color}
            fillOpacity="0.4"
            d="M160 190 Q180 170 200 190 Q180 210 160 190 Z"
          />
          {/* Detalles decorativos */}
          <circle cx="150" cy="195" r="3" fill={color} fillOpacity="0.7" />
          <circle cx="180" cy="185" r="3" fill={color} fillOpacity="0.7" />
          <circle cx="210" cy="195" r="3" fill={color} fillOpacity="0.7" />
        </g>
      );

    case "tribal":
      // Tatuaje tribal simplificado y más elegante
      return (
        <g>
          {/* Lado izquierdo */}
          <path
            fill={color}
            fillOpacity="0.7"
            stroke={color}
            strokeWidth="1"
            d="M120 190 Q130 180 140 190 Q150 200 140 210 Q130 220 120 210 Q110 200 120 190 Z"
          />
          <path
            fill={color}
            fillOpacity="0.5"
            d="M125 195 Q135 185 145 195 Q135 205 125 195 Z"
          />

          {/* Lado derecho (simétrico) */}
          <path
            fill={color}
            fillOpacity="0.7"
            stroke={color}
            strokeWidth="1"
            d="M240 190 Q230 180 220 190 Q210 200 220 210 Q230 220 240 210 Q250 200 240 190 Z"
          />
          <path
            fill={color}
            fillOpacity="0.5"
            d="M235 195 Q225 185 215 195 Q225 205 235 195 Z"
          />

          {/* Conexiones */}
          <path
            fill={color}
            fillOpacity="0.4"
            d="M150 200 Q180 190 210 200 Q180 210 150 200 Z"
          />
        </g>
      );

    case "tribal2":
      // Segundo diseño tribal mejorado
      return (
        <g>
          <path
            fill={color}
            fillOpacity="0.7"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M130 180 Q140 160 160 170 Q180 160 200 170 Q220 160 230 180 Q220 200 200 190 Q180 200 160 190 Q140 200 130 180 Z"
          />
          {/* Detalles internos */}
          <path
            fill={color}
            fillOpacity="0.5"
            d="M145 175 Q160 165 175 175 Q190 165 205 175 Q190 185 175 175 Q160 185 145 175 Z"
          />
          {/* Puntos decorativos */}
          <circle cx="140" cy="175" r="2" fill={color} fillOpacity="0.8" />
          <circle cx="180" cy="165" r="2" fill={color} fillOpacity="0.8" />
          <circle cx="220" cy="175" r="2" fill={color} fillOpacity="0.8" />
        </g>
      );

    case "throat":
      // Tatuaje de garganta simplificado y más visible
      return (
        <g>
          <path
            fill={color}
            fillOpacity="0.6"
            stroke={color}
            strokeWidth="1"
            d="M160 240 Q180 230 200 240 Q220 250 200 260 Q180 270 160 260 Q140 250 160 240 Z"
          />
          {/* Detalles centrales */}
          <path
            fill={color}
            fillOpacity="0.8"
            d="M170 245 Q180 240 190 245 Q180 250 170 245 Z"
          />
          {/* Líneas decorativas */}
          <path
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
            d="M165 250 Q180 245 195 250"
          />
          <path
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
            d="M170 255 Q180 252 190 255"
          />
        </g>
      );

    case "none":
    default:
      return null;
  }
};

export default Tattoos;
