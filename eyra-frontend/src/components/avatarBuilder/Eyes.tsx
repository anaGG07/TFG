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
          <path d="M135 143 Q135 137 140 137 Q145 137 145 143 Q145 148 140 153 Q135 148 135 143 Z" fill="#E57373" />
          <path d="M140 137 Q140 133 144 133 Q148 133 148 137 Q148 141 144 145 Q140 141 140 137 Z" fill="#E57373" />
          {/* Ojo derecho */}
          <path d="M215 143 Q215 137 220 137 Q225 137 225 143 Q225 148 220 153 Q215 148 215 143 Z" fill="#E57373" />
          <path d="M220 137 Q220 133 224 133 Q228 133 228 137 Q228 141 224 145 Q220 141 220 137 Z" fill="#E57373" />
        </g>
      );
    case "side":
      return (
        <g>
          <ellipse cx="145" cy="143" rx="10" ry="10" fill={color} />
          <ellipse cx="215" cy="143" rx="10" ry="10" fill={color} />
          <ellipse cx="149" cy="143" rx="4" ry="4" fill="#fff" />
          <ellipse cx="219" cy="143" rx="4" ry="4" fill="#fff" />
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
          <path d="M140 143 Q148 148 156 143" stroke={color} strokeWidth="4" fill="none" />
          <path d="M204 143 Q212 148 220 143" stroke={color} strokeWidth="4" fill="none" />
        </g>
      );
    case "surprised":
      return (
        <g>
          <ellipse cx="148" cy="143" rx="8" ry="8" fill={color} />
          <ellipse cx="212" cy="143" rx="8" ry="8" fill={color} />
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
