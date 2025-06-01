import React from "react";

const Eyes: React.FC<{ type: string; color?: string }> = ({ type, color = "#000000" }) => {
  switch (type) {
    case "default":
      return (
        <g>
          <circle cx="140" cy="143" r="10" fill={color} />
          <circle cx="220" cy="143" r="10" fill={color} />
        </g>
      );
    case "dizzy":
      return (
        <g>
          <path fill={color} fillOpacity="0.7" d="M139 131l7 8 8 -8 3 4 -7 7 7 8 -3 3 -7 -7 -7 7 -4 -3 8 -7 -8 -7 4 -4zm67 0l7 8 8 -8 3 4 -7 7 7 8 -3 3 -7 -7 -7 7 -4 -3 8 -7 -8 -7 4 -4z" />
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
          <path d="M132 143 Q140 136 148 143" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M212 143 Q220 136 228 143" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
      );
    case "close":
      return (
        <g>
          <path d="M134 143 Q140 148 146 143" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M214 143 Q220 148 226 143" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
      );
    case "hearts":
      return (
        <g>
          {/* Ojo izquierdo */}
          <path d="M140 143
            C140 139, 145 137, 147 140
            C149 143, 145 148, 140 151
            C135 148, 131 143, 133 140
            C135 137, 140 139, 140 143
            Z" fill="#E57373" />
          {/* Ojo derecho */}
          <path d="M220 143
            C220 139, 225 137, 227 140
            C229 143, 225 148, 220 151
            C215 148, 211 143, 213 140
            C215 137, 220 139, 220 143
            Z" fill="#E57373" />
        </g>
      );
    case "side":
      return (
        <g>
          {/* Ojo izquierdo */}
          <ellipse cx="140" cy="143" rx="12" ry="8" fill={color} />
          <ellipse cx="145" cy="139" rx="3" ry="3" fill="#fff" />
          {/* Ojo derecho */}
          <ellipse cx="220" cy="143" rx="12" ry="8" fill={color} />
          <ellipse cx="225" cy="139" rx="3" ry="3" fill="#fff" />
        </g>
      );
    case "wink":
      return (
        <g>
          <path d="M134 143 Q140 148 146 143" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" />
          <ellipse cx="220" cy="143" rx="10" ry="10" fill={color} />
        </g>
      );
    case "wink2":
      return (
        <g>
          <circle cx="140" cy="143" r="10" fill={color} />
          <path d="M214 143 Q220 148 226 143" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" />
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
          <circle cx="140" cy="143" r="16" fill="#fff" stroke="#444" strokeWidth="2" />
          <circle cx="140" cy="143" r="8" fill="#555" />
          {/* Ojo derecho */}
          <circle cx="220" cy="143" r="16" fill="#fff" stroke="#444" strokeWidth="2" />
          <circle cx="220" cy="143" r="8" fill="#555" />
        </g>
      );
    case "winkwacky":
      return (
        <g>
          <circle cx="148" cy="143" r="7" fill={color} />
          <path d="M207 143 Q212 148 217 143" stroke={color} strokeWidth="4" fill="none" />
        </g>
      );
    case "cry":
      return (
        <g>
          <ellipse cx="148" cy="143" rx="7" ry="7" fill={color} />
          <ellipse cx="212" cy="143" rx="7" ry="7" fill={color} />
          <path d="M140 153 Q144 163 150 163" stroke="#6fd3fb" strokeWidth="4" fill="none" />
        </g>
      );
    case "big":
      return (
        <g>
          <ellipse cx="140" cy="143" rx="13" ry="13" fill={color} />
          <ellipse cx="220" cy="143" rx="13" ry="13" fill={color} />
        </g>
      );
    case "tear":
      return (
        <g>
          <circle cx="140" cy="143" r="10" fill={color} />
          <circle cx="220" cy="143" r="10" fill={color} />
          <path d="M130 150 Q134 158 140 154" stroke="#6fd3fb" strokeWidth="4" fill="none" />
        </g>
      );
    default:
      return null;
  }
};

export default Eyes;
