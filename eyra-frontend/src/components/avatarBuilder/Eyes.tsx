import React from "react";

const Eyes: React.FC<{ type: string; color?: string }> = ({ type, color = "#000000" }) => {
  switch (type) {
    case "default":
      return (
        <g>
          <circle fill={color} fillOpacity="0.7" cx="148" cy="143" r="8" />
          <circle fill={color} fillOpacity="0.7" cx="212" cy="143" r="8" />
        </g>
      );
    case "dizzy":
      return (
        <g>
          <path fill={color} fillOpacity="0.7" d="M139 131l7 8 8 -8 3 4 -7 7 7 8 -3 3 -7 -7 -7 7 -4 -3 8 -7 -8 -7 4 -4zm67 0l7 8 8 -8 3 4 -7 7 7 8 -3 3 -7 -7 -7 7 -4 -3 8 -7 -8 -7 4 -4z" />
        </g>
      );
    case "eyeroll":
      return (
        <>
          <ellipse cx="148" cy="143" rx="7" ry="3" fill={color} />
          <ellipse cx="212" cy="143" rx="7" ry="3" fill={color} />
        </>
      );
    case "happy":
      return (
        <>
          <path d="M140 146 Q148 153 156 146" stroke={color} strokeWidth="4" fill="none" />
          <path d="M204 146 Q212 153 220 146" stroke={color} strokeWidth="4" fill="none" />
        </>
      );
    case "close":
      return (
        <>
          <path d="M140 143 Q148 148 156 143" stroke={color} strokeWidth="4" fill="none" />
          <path d="M204 143 Q212 148 220 143" stroke={color} strokeWidth="4" fill="none" />
        </>
      );
    case "hearts":
      return (
        <>
          <path d="M148 143 Q148 138 153 138 Q158 138 158 143 Q158 148 153 153 Q148 148 148 143" fill="#E57373" />
          <path d="M212 143 Q212 138 217 138 Q222 138 222 143 Q222 148 217 153 Q212 148 212 143" fill="#E57373" />
        </>
      );
    case "side":
      return (
        <>
          <ellipse cx="145" cy="143" rx="7" ry="7" fill={color} />
          <ellipse cx="209" cy="143" rx="7" ry="7" fill={color} />
        </>
      );
    case "wink":
      return (
        <>
          <path d="M140 143 Q148 148 156 143" stroke={color} strokeWidth="4" fill="none" />
          <ellipse cx="212" cy="143" rx="7" ry="7" fill={color} />
        </>
      );
    case "squint":
      return (
        <>
          <path d="M140 143 Q148 148 156 143" stroke={color} strokeWidth="4" fill="none" />
          <path d="M204 143 Q212 148 220 143" stroke={color} strokeWidth="4" fill="none" />
        </>
      );
    case "surprised":
      return (
        <>
          <ellipse cx="148" cy="143" rx="8" ry="8" fill={color} />
          <ellipse cx="212" cy="143" rx="8" ry="8" fill={color} />
        </>
      );
    case "winkwacky":
      return (
        <>
          <circle cx="148" cy="143" r="7" fill={color} />
          <path d="M207 143 Q212 148 217 143" stroke={color} strokeWidth="4" fill="none" />
        </>
      );
    case "cry":
      return (
        <>
          <ellipse cx="148" cy="143" rx="7" ry="7" fill={color} />
          <ellipse cx="212" cy="143" rx="7" ry="7" fill={color} />
          <path d="M140 153 Q144 163 150 163" stroke="#6fd3fb" strokeWidth="4" fill="none" />
        </>
      );
    default:
      return null;
  }
};

export default Eyes;
