import React from "react";

const Eyes: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "default":
      return (
        <g>
          <circle fill="#000000" fillOpacity="0.7" cx="148" cy="143" r="8" />
          <circle fill="#000000" fillOpacity="0.7" cx="212" cy="143" r="8" />
        </g>
      );
    case "dizzy":
      return (
        <g>
          <polygon fill="#000000" fillOpacity="0.7" stroke="#5F4A37" strokeWidth="0.9" points="139,131 146,139 154,131 157,135 150,142 157,150 154,153 146,146 139,153 135,150 143,142 135,135 " />
          <polygon fill="#000000" fillOpacity="0.7" points="206,131 213,139 221,131 224,135 217,142 224,150 221,153 213,146 206,153 202,150 210,142 202,135 " />
        </g>
      );
    case "eyeroll":
      return (
        <>
          <ellipse cx="148" cy="143" rx="7" ry="3" fill="#222" />
          <ellipse cx="212" cy="143" rx="7" ry="3" fill="#222" />
        </>
      );
    case "happy":
      return (
        <>
          <ellipse cx="148" cy="143" rx="8" ry="6" fill="#222" />
          <ellipse cx="212" cy="143" rx="8" ry="6" fill="#222" />
        </>
      );
    case "close":
      return (
        <>
          <path d="M143 143 L153 143" stroke="#222" strokeWidth="3" fill="none" />
          <path d="M207 143 L217 143" stroke="#222" strokeWidth="3" fill="none" />
        </>
      );
    case "hearts":
      return (
        <>
          <path d="M148 143 Q150 138 152 143 Q154 148 152 153 Q150 158 148 153 Q146 148 148 143" fill="#E57373" />
          <path d="M212 143 Q214 138 216 143 Q218 148 216 153 Q214 158 212 153 Q210 148 212 143" fill="#E57373" />
        </>
      );
    case "side":
      return (
        <>
          <ellipse cx="148" cy="143" rx="7" ry="7" fill="#222" />
          <ellipse cx="212" cy="143" rx="7" ry="7" fill="#222" />
          <path d="M148 143 L153 143 M212 143 L217 143" stroke="#222" strokeWidth="2" fill="none" />
        </>
      );
    case "wink":
      return (
        <>
          <path d="M143 143 L153 143" stroke="#222" strokeWidth="3" fill="none" />
          <ellipse cx="212" cy="143" rx="7" ry="7" fill="#222" />
        </>
      );
    case "squint":
      return (
        <>
          <path d="M143 143 Q148 148 153 143" stroke="#222" strokeWidth="3" fill="none" />
          <path d="M207 143 Q212 148 217 143" stroke="#222" strokeWidth="3" fill="none" />
        </>
      );
    case "surprised":
      return (
        <>
          <circle cx="148" cy="143" r="7" fill="#222" />
          <circle cx="212" cy="143" r="7" fill="#222" />
        </>
      );
    case "winkwacky":
      return (
        <>
          <path d="M143 143 L153 143" stroke="#222" strokeWidth="3" fill="none" />
          <path d="M207 143 Q212 148 217 143" stroke="#222" strokeWidth="3" fill="none" />
        </>
      );
    case "cry":
      return (
        <>
          <ellipse cx="148" cy="143" rx="7" ry="7" fill="#222" />
          <ellipse cx="212" cy="143" rx="7" ry="7" fill="#222" />
          <path d="M148 153 Q148 163 153 163" stroke="#222" strokeWidth="2" fill="none" />
          <path d="M212 153 Q212 163 217 163" stroke="#222" strokeWidth="2" fill="none" />
        </>
      );
    default:
      return null;
  }
};

export default Eyes;
