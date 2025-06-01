import React from "react";

const Eyebrows: React.FC<{ type: string; color?: string }> = ({ type, color = "#000000" }) => {
  switch (type) {
    case "default":
      return (
        <g>
          <path d="M120 110 Q135 100 150 110" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M210 110 Q225 100 240 110" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
      );
    case "default2":
      return (
        <g>
          <path d="M125 115 Q140 105 155 115" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M205 115 Q220 105 235 115" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
      );
    case "raised":
      return (
        <g>
          <path d="M120 100 Q150 90 180 100" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M180 100 Q210 90 240 100" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
      );
    case "sad":
      return (
        <g>
          <path d="M120 120 Q135 130 150 120" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M210 120 Q225 130 240 120" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
      );
    case "sad2":
      return (
        <g>
          <path d="M125 125 Q140 135 155 125" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M205 125 Q220 135 235 125" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
      );
    case "unibrow":
      return (
        <path d="M120 120 Q180 110 240 120" stroke={color} strokeWidth="7" strokeLinecap="round" fill="none" />
      );
    case "updown":
      return (
        <g>
          <path d="M120 105 Q135 120 150 110" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M210 120 Q225 105 240 110" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
      );
    case "updown2":
      return (
        <g>
          <path d="M125 110 Q140 130 155 120" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M205 120 Q220 110 235 120" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
      );
    case "angry":
      return (
        <g>
          <path d="M120 115 Q150 100 180 115" stroke={color} strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M180 115 Q210 100 240 115" stroke={color} strokeWidth="7" strokeLinecap="round" fill="none" />
        </g>
      );
    case "angry2":
      return (
        <g>
          <path d="M125 120 Q140 110 155 120" stroke={color} strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M205 120 Q220 110 235 120" stroke={color} strokeWidth="7" strokeLinecap="round" fill="none" />
        </g>
      );
    default:
      return null;
  }
};

export default Eyebrows;
