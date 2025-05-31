import React from "react";

const Eyes: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "default":
      return (
        <g>
          <circle fill="#000000" fillOpacity="0.7" cx="148" cy="173" r="8" />
          <circle fill="#000000" fillOpacity="0.7" cx="212" cy="173" r="8" />
        </g>
      );
    case "dizzy":
      return (
        <g>
          <polygon fill="#000000" fillOpacity="0.7" stroke="#5F4A37" strokeWidth="0.9" points="139,161 146,169 154,161 157,165 150,172 157,180 154,183 146,176 139,183 135,180 143,172 135,165 " />
          <polygon fill="#000000" fillOpacity="0.7" points="206,161 213,169 221,161 224,165 217,172 224,180 221,183 213,176 206,183 202,180 210,172 202,165 " />
        </g>
      );
    case "eyeroll":
      return (
        <>
          <ellipse cx="148" cy="190" rx="7" ry="3" fill="#222" />
          <ellipse cx="212" cy="190" rx="7" ry="3" fill="#222" />
        </>
      );
    case "happy":
      return (
        <>
          <ellipse cx="148" cy="190" rx="8" ry="6" fill="#222" />
          <ellipse cx="212" cy="190" rx="8" ry="6" fill="#222" />
        </>
      );
    case "close":
      return (
        <>
          <path
            d="M143 190 L153 190"
            stroke="#222"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M207 190 L217 190"
            stroke="#222"
            strokeWidth="3"
            fill="none"
          />
        </>
      );
    case "hearts":
      return (
        <>
          <path
            d="M148 190 Q150 185 152 190 Q154 195 152 200 Q150 205 148 200 Q146 195 148 190"
            fill="#E57373"
          />
          <path
            d="M212 190 Q214 185 216 190 Q218 195 216 200 Q214 205 212 200 Q210 195 212 190"
            fill="#E57373"
          />
        </>
      );
    case "side":
      return (
        <>
          <ellipse cx="148" cy="190" rx="7" ry="7" fill="#222" />
          <ellipse cx="212" cy="190" rx="7" ry="7" fill="#222" />
          <path
            d="M148 190 L153 190 M212 190 L217 190"
            stroke="#222"
            strokeWidth="2"
            fill="none"
          />
        </>
      );
    case "wink":
      return (
        <>
          <path
            d="M143 190 L153 190"
            stroke="#222"
            strokeWidth="3"
            fill="none"
          />
          <ellipse cx="212" cy="190" rx="7" ry="7" fill="#222" />
        </>
      );
    case "squint":
      return (
        <>
          <path
            d="M143 190 Q148 195 153 190"
            stroke="#222"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M207 190 Q212 195 217 190"
            stroke="#222"
            strokeWidth="3"
            fill="none"
          />
        </>
      );
    case "surprised":
      return (
        <>
          <circle cx="148" cy="190" r="7" fill="#222" />
          <circle cx="212" cy="190" r="7" fill="#222" />
        </>
      );
    case "winkwacky":
      return (
        <>
          <path
            d="M143 190 L153 190"
            stroke="#222"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M207 190 Q212 195 217 190"
            stroke="#222"
            strokeWidth="3"
            fill="none"
          />
        </>
      );
    case "cry":
      return (
        <>
          <ellipse cx="148" cy="190" rx="7" ry="7" fill="#222" />
          <ellipse cx="212" cy="190" rx="7" ry="7" fill="#222" />
          <path
            d="M148 200 Q148 210 153 210"
            stroke="#222"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M212 200 Q212 210 217 210"
            stroke="#222"
            strokeWidth="2"
            fill="none"
          />
        </>
      );
    default:
      return null;
  }
};

export default Eyes;
