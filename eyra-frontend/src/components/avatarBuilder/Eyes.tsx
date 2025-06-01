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
          <ellipse cx="148" cy="143" rx="8" ry="6" fill={color} />
          <ellipse cx="212" cy="143" rx="8" ry="6" fill={color} />
        </>
      );
    case "close":
      return (
        <>
          <path d="M143 143 L153 143" stroke={color} strokeWidth="3" fill="none" />
          <path d="M207 143 L217 143" stroke={color} strokeWidth="3" fill="none" />
        </>
      );
    case "hearts":
      return (
        <>
          <path d="M148 143 Q150 138 152 143 Q154 148 152 153 Q150 158 148 153 Q146 148 148 143" fill={color} />
          <path d="M212 143 Q214 138 216 143 Q218 148 216 153 Q214 158 212 153 Q210 148 212 143" fill={color} />
        </>
      );
    case "side":
      return (
        <>
          <ellipse cx="148" cy="143" rx="7" ry="7" fill={color} />
          <ellipse cx="212" cy="143" rx="7" ry="7" fill={color} />
          <path d="M148 143 L153 143 M212 143 L217 143" stroke={color} strokeWidth="2" fill="none" />
        </>
      );
    case "wink":
      return (
        <>
          <path d="M143 143 L153 143" stroke={color} strokeWidth="3" fill="none" />
          <ellipse cx="212" cy="143" rx="7" ry="7" fill={color} />
        </>
      );
    case "squint":
      return (
        <>
          <path d="M143 143 Q148 148 153 143" stroke={color} strokeWidth="3" fill="none" />
          <path d="M207 143 Q212 148 217 143" stroke={color} strokeWidth="3" fill="none" />
        </>
      );
    case "surprised":
      return (
        <>
          <circle cx="148" cy="143" r="7" fill={color} />
          <circle cx="212" cy="143" r="7" fill={color} />
        </>
      );
    case "winkwacky":
      return (
        <>
          <path d="M143 143 L153 143" stroke={color} strokeWidth="3" fill="none" />
          <path d="M207 143 Q212 148 217 143" stroke={color} strokeWidth="3" fill="none" />
        </>
      );
    case "cry":
      return (
        <>
          <ellipse cx="148" cy="143" rx="7" ry="7" fill={color} />
          <ellipse cx="212" cy="143" rx="7" ry="7" fill={color} />
          <path d="M148 153 Q148 163 153 163" stroke={color} strokeWidth="2" fill="none" />
          <path d="M212 153 Q212 163 217 163" stroke={color} strokeWidth="2" fill="none" />
        </>
      );
    default:
      return null;
  }
};

export default Eyes;
