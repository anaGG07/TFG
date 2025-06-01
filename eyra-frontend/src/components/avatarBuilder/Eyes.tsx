import React from "react";

const Eyes: React.FC<{ type: string; color?: string }> = ({ type, color = "#000000" }) => {
  switch (type) {
    case "default":
      return (
        <g>
          <circle cx="140" cy="143" r="16" fill="#fff" />
          <circle cx="140" cy="143" r="7" fill="#222" />
          <circle cx="220" cy="143" r="16" fill="#fff" />
          <circle cx="220" cy="143" r="7" fill="#222" />
        </g>
      );
    case "dizzy":
      return (
        <g>
          <path
            fill={color}
            fillOpacity="0.7"
            d="M139 131l7 8 8 -8 3 4 -7 7 7 8 -3 3 -7 -7 -7 7 -4 -3 8 -7 -8 -7 4 -4zm67 0l7 8 8 -8 3 4 -7 7 7 8 -3 3 -7 -7 -7 7 -4 -3 8 -7 -8 -7 4 -4z"
          />
        </g>
      );
    case "blank":
      return (
        <g>
          <circle cx="140" cy="143" r="16" fill="#fff" />
          <circle cx="220" cy="143" r="16" fill="#fff" />
          <circle cx="134" cy="137" r="7" fill="#555" />
          <circle cx="214" cy="137" r="7" fill="#555" />
        </g>
      );
    case "happy":
      return (
        <g>
          <path
            d="M132 143 Q140 136 148 143"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M212 143 Q220 136 228 143"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      );
    case "close":
      return (
        <g>
          <path
            d="M134 143 Q140 148 146 143"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M214 143 Q220 148 226 143"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      );
    case "hearts":
      return (
        <g>
          {/* Ojo izquierdo */}
          <path
            d="M140 143
            C140 135, 148 131, 152 138
            C156 145, 148 155, 140 159
            C132 155, 124 145, 128 138
            C132 131, 140 135, 140 143
            Z"
            fill="#E57373"
          />
          {/* Ojo derecho */}
          <path
            d="M220 143
            C220 135, 228 131, 232 138
            C236 145, 228 155, 220 159
            C212 155, 204 145, 208 138
            C212 131, 220 135, 220 143
            Z"
            fill="#E57373"
          />
        </g>
      );
    case "side":
      return (
        <g>
          {/* Ojo izquierdo */}
          <circle cx="140" cy="143" r="16" fill="#fff" />
          <circle cx="147" cy="139" r="7" fill="#222" />
          {/* Ojo derecho */}
          <circle cx="220" cy="143" r="16" fill="#fff" />
          <circle cx="227" cy="139" r="7" fill="#222" />
        </g>
      );
    case "wink":
      return (
        <g>
          {/* Ojo izquierdo cerrado */}
          <path
            d="M134 143 Q140 148 146 143"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Ojo derecho abierto */}
          <circle cx="220" cy="143" r="16" fill="#fff" />
          <circle cx="220" cy="143" r="7" fill="#222" />
        </g>
      );
    case "wink2":
      return (
        <g>
          {/* Ojo izquierdo abierto */}
          <circle cx="140" cy="143" r="16" fill="#fff" />
          <circle cx="140" cy="143" r="7" fill="#222" />
          {/* Ojo derecho cerrado */}
          <path
            d="M214 143 Q220 148 226 143"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      );
    case "squint":
      return (
        <g>
          <defs>
            <clipPath id="squintEyeClip">
              <rect x="124" y="127" width="32" height="16" />
            </clipPath>
            <clipPath id="squintEyeClipR">
              <rect x="204" y="127" width="32" height="16" />
            </clipPath>
          </defs>
          {/* Ojo izquierdo */}
          <g clipPath="url(#squintEyeClip)">
            <circle cx="140" cy="143" r="16" fill="#fff" />
            <circle cx="140" cy="143" r="8" fill="#555" />
          </g>
          {/* Ojo derecho */}
          <g clipPath="url(#squintEyeClipR)">
            <circle cx="220" cy="143" r="16" fill="#fff" />
            <circle cx="220" cy="143" r="8" fill="#555" />
          </g>
        </g>
      );
    case "surprised":
      return (
        <g>
          {/* Ojo izquierdo */}
          <circle cx="140" cy="143" r="16" fill="#fff" />
          <circle cx="140" cy="143" r="8" fill="#555" />
          {/* Ojo derecho */}
          <circle cx="220" cy="143" r="16" fill="#fff" />
          <circle cx="220" cy="143" r="8" fill="#555" />
        </g>
      );
    case "big":
      return (
        <g>
          <circle cx="140" cy="143" r="16" fill="#fff" />
          <circle cx="140" cy="143" r="7" fill="#222" />
          <circle cx="220" cy="143" r="16" fill="#fff" />
          <circle cx="220" cy="143" r="7" fill="#222" />
        </g>
      );
    case "tear":
      return (
        <g>
          <circle cx="140" cy="143" r="16" fill="#fff" />
          <circle cx="140" cy="143" r="7" fill="#222" />
          <circle cx="220" cy="143" r="16" fill="#fff" />
          <circle cx="220" cy="143" r="7" fill="#222" />
          <path
            d="M130 150 Q134 158 140 154"
            stroke="#6fd3fb"
            strokeWidth="4"
            fill="none"
          />
        </g>
      );
    case "feminine":
      return (
        <g>
          {/* OJO IZQUIERDO */}
          {/* Forma de ojo almendrado más elegante */}
          <ellipse
            cx="140"
            cy="143"
            rx="20"
            ry="12"
            fill="#fff"
            stroke="#000"
            strokeWidth="1.5"
            transform="rotate(-5 140 143)"
          />

          {/* Iris y pupila */}
          <circle cx="140" cy="143" r="8" fill="#4A90E2" />
          <circle cx="140" cy="143" r="4" fill="#000" />
          <circle cx="142" cy="141" r="1.5" fill="#fff" opacity="0.8" />

          {/* Pestañas superiores - más naturales */}
          <g stroke="#000" strokeWidth="2" strokeLinecap="round" fill="none">
            <path d="M125 135 C122 130, 128 132, 130 136" />
            <path d="M132 134 C130 129, 135 131, 137 135" />
            <path d="M140 133 C138 128, 142 130, 143 134" />
            <path d="M148 134 C146 129, 151 131, 153 135" />
            <path d="M155 135 C153 130, 158 132, 160 136" />
          </g>

          {/* Pestañas inferiores - más sutiles */}
          <g
            stroke="#000"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          >
            <path d="M130 150 C128 152, 132 151, 133 149" />
            <path d="M140 151 C138 153, 142 152, 143 150" />
            <path d="M150 150 C148 152, 152 151, 153 149" />
          </g>

          {/* Delineado superior más grueso */}
          <path
            d="M120 143 Q140 130 160 143"
            stroke="#000"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />

          {/* OJO DERECHO */}
          {/* Forma de ojo almendrado más elegante */}
          <ellipse
            cx="220"
            cy="143"
            rx="20"
            ry="12"
            fill="#fff"
            stroke="#000"
            strokeWidth="1.5"
            transform="rotate(5 220 143)"
          />

          {/* Iris y pupila */}
          <circle cx="220" cy="143" r="8" fill="#4A90E2" />
          <circle cx="220" cy="143" r="4" fill="#000" />
          <circle cx="222" cy="141" r="1.5" fill="#fff" opacity="0.8" />

          {/* Pestañas superiores - más naturales */}
          <g stroke="#000" strokeWidth="2" strokeLinecap="round" fill="none">
            <path d="M205 135 C202 130, 208 132, 210 136" />
            <path d="M212 134 C210 129, 215 131, 217 135" />
            <path d="M220 133 C218 128, 222 130, 223 134" />
            <path d="M228 134 C226 129, 231 131, 233 135" />
            <path d="M235 135 C233 130, 238 132, 240 136" />
          </g>

          {/* Pestañas inferiores - más sutiles */}
          <g
            stroke="#000"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          >
            <path d="M210 150 C208 152, 212 151, 213 149" />
            <path d="M220 151 C218 153, 222 152, 223 150" />
            <path d="M230 150 C228 152, 232 151, 233 149" />
          </g>

          {/* Delineado superior más grueso */}
          <path
            d="M200 143 Q220 130 240 143"
            stroke="#000"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />

          {/* Cejas más definidas y arqueadas */}
          <g
            stroke="#8B4513"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          >
            <path d="M125 128 Q140 122 155 128" />
            <path d="M205 128 Q220 122 235 128" />
          </g>
        </g>
      );
    default:
      return null;
  }
};

export default Eyes;
