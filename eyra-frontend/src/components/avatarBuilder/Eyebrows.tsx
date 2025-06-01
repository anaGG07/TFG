import React from "react";

const Eyebrows: React.FC<{ type: string; color?: string }> = ({ type, color = "#000000" }) => {
  switch (type) {
    case "default":
      return (
        <g>
          <path fill={color} fillOpacity="0.7" fillRule="nonzero" d="M148 115c-1,1 -3,1 -4,0 -1,-1 -1,-2 0,-3 5,-6 10,-9 16,-11 6,-2 13,-2 20,0 2,0 3,2 2,3 0,2 -1,3 -3,2 -6,-1 -12,-2 -17,0 -5,1 -10,4 -14,9z" />
          <path fill={color} fillOpacity="0.7" fillRule="nonzero" d="M212 115c1,1 2,1 3,0 2,-1 2,-2 1,-3 -5,-6 -11,-9 -17,-11 -6,-2 -13,-2 -20,0 -1,0 -2,2 -2,3 1,2 2,3 3,2 7,-1 13,-2 18,0 5,1 10,4 14,9z" />
        </g>
      );
    case "default2":
      return (
        <g>
          <path fill={color} fillOpacity="0.7" fillRule="nonzero" d="M144 115c-1,1 -3,1 -4,0 -1,-1 -1,-2 0,-3 5,-6 10,-9 16,-11 6,-2 13,-2 20,0 2,0 3,2 2,3 0,2 -1,3 -3,2 -6,-1 -12,-2 -17,0 -5,1 -10,4 -14,9z" />
          <path fill={color} fillOpacity="0.7" fillRule="nonzero" d="M216 115c1,1 2,1 3,0 2,-1 2,-2 1,-3 -5,-6 -11,-9 -17,-11 -6,-2 -13,-2 -20,0 -1,0 -2,2 -2,3 1,2 2,3 3,2 7,-1 13,-2 18,0 5,1 10,4 14,9z" />
        </g>
      );
    case "raised":
      return (
        <g>
          <path d="M144 110 Q180 100 216 110" stroke={color} strokeWidth="4" fill="none" />
        </g>
      );
    case "sad":
      return (
        <g>
          <path d="M144 120 Q180 110 216 120" stroke={color} strokeWidth="4" fill="none" />
        </g>
      );
    case "sad2":
      return (
        <g>
          <path d="M144 120 Q180 130 216 120" stroke={color} strokeWidth="4" fill="none" />
        </g>
      );
    case "unibrow":
      return (
        <path d="M145 120 Q180 115 215 120" stroke={color} strokeWidth="4" fill="none" />
      );
    case "updown":
      return (
        <g>
          <path d="M144 110 Q180 120 216 110" stroke={color} strokeWidth="4" fill="none" />
        </g>
      );
    case "updown2":
      return (
        <g>
          <path d="M144 110 Q180 130 216 110" stroke={color} strokeWidth="4" fill="none" />
        </g>
      );
    case "angry":
      return (
        <g>
          <path d="M144 115 Q180 105 216 115" stroke={color} strokeWidth="4" fill="none" />
        </g>
      );
    case "angry2":
      return (
        <g>
          <path d="M144 115 Q180 125 216 115" stroke={color} strokeWidth="4" fill="none" />
        </g>
      );
    default:
      return null;
  }
};

export default Eyebrows;
