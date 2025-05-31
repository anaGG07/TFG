import React from "react";

const Eyes: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "default":
      return (
        <g>
          <circle fill="#000000" fillOpacity="0.7" cx="148" cy="155" r="8" />
          <circle fill="#000000" fillOpacity="0.7" cx="212" cy="155" r="8" />
        </g>
      );
    case "dizzy":
      return (
        <g>
          <polygon fill="#000000" fillOpacity="0.7" stroke="#5F4A37" strokeWidth="0.9" points="139,143 146,151 154,143 157,147 150,154 157,162 154,165 146,158 139,165 135,162 143,154 135,147 " />
          <polygon fill="#000000" fillOpacity="0.7" points="206,143 213,151 221,143 224,147 217,154 224,162 221,165 213,158 206,165 202,162 210,154 202,147 " />
        </g>
      );
    case "eyeroll":
      return (
        <>
          <ellipse cx="148" cy="172" rx="7" ry="3" fill="#222" />
          <ellipse cx="212" cy="172" rx="7" ry="3" fill="#222" />
        </>
      );
    case "happy":
      return (
        <>
          <ellipse cx="148" cy="172" rx="8" ry="6" fill="#222" />
          <ellipse cx="212" cy="172" rx="8" ry="6" fill="#222" />
        </>
      );
    case "close":
      return (
        <>
          <path
            d="M143 172 L153 172"
            stroke="#222"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M207 172 L217 172"
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
            d="M148 172 Q150 167 152 172 Q154 177 152 182 Q150 187 148 182 Q146 177 148 172"
            fill="#E57373"
          />
          <path
            d="M212 172 Q214 167 216 172 Q218 177 216 182 Q214 187 212 182 Q210 177 212 172"
            fill="#E57373"
          />
        </>
      );
    case "side":
      return (
        <>
          <ellipse cx="148" cy="172" rx="7" ry="7" fill="#222" />
          <ellipse cx="212" cy="172" rx="7" ry="7" fill="#222" />
          <path
            d="M148 172 L153 172 M212 172 L217 172"
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
            d="M143 172 L153 172"
            stroke="#222"
            strokeWidth="3"
            fill="none"
          />
          <ellipse cx="212" cy="172" rx="7" ry="7" fill="#222" />
        </>
      );
    case "squint":
      return (
        <>
          <path
            d="M143 172 Q148 177 153 172"
            stroke="#222"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M207 172 Q212 177 217 172"
            stroke="#222"
            strokeWidth="3"
            fill="none"
          />
        </>
      );
    case "surprised":
      return (
        <>
          <circle cx="148" cy="172" r="7" fill="#222" />
          <circle cx="212" cy="172" r="7" fill="#222" />
        </>
      );
    case "winkwacky":
      return (
        <>
          <path
            d="M143 172 L153 172"
            stroke="#222"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M207 172 Q212 177 217 172"
            stroke="#222"
            strokeWidth="3"
            fill="none"
          />
        </>
      );
    case "cry":
      return (
        <>
          <ellipse cx="148" cy="172" rx="7" ry="7" fill="#222" />
          <ellipse cx="212" cy="172" rx="7" ry="7" fill="#222" />
          <path
            d="M148 182 Q148 192 153 192"
            stroke="#222"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M212 182 Q212 192 217 192"
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
