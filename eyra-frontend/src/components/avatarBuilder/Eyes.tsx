import React from "react";

const Eyes: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "default":
      return (
        <g>
          <circle fill="#000000" fillOpacity="0.7" cx="144" cy="153" r="8" />
          <circle fill="#000000" fillOpacity="0.7" cx="176" cy="153" r="8" />
        </g>
      );
    case "dizzy":
      return (
        <g>
          <polygon fill="#000000" fillOpacity="0.7" stroke="#5F4A37" strokeWidth="0.9" points="139,141 146,149 154,141 157,145 150,152 157,160 154,163 146,156 139,163 135,160 143,152 135,145 " />
          <polygon fill="#000000" fillOpacity="0.7" points="206,141 213,149 221,141 224,145 217,152 224,160 221,163 213,156 206,163 202,160 210,152 202,145 " />
        </g>
      );
    case "eyeroll":
      return (
        <>
          <ellipse cx="135" cy="170" rx="7" ry="3" fill="#222" />
          <ellipse cx="185" cy="170" rx="7" ry="3" fill="#222" />
        </>
      );
    case "happy":
      return (
        <>
          <ellipse cx="135" cy="170" rx="8" ry="6" fill="#222" />
          <ellipse cx="185" cy="170" rx="8" ry="6" fill="#222" />
        </>
      );
    case "close":
      return (
        <>
          <path
            d="M130 170 L140 170"
            stroke="#222"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M180 170 L190 170"
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
            d="M135 170 Q137 165 139 170 Q141 175 139 180 Q137 185 135 180 Q133 175 135 170"
            fill="#E57373"
          />
          <path
            d="M185 170 Q187 165 189 170 Q191 175 189 180 Q187 185 185 180 Q183 175 185 170"
            fill="#E57373"
          />
        </>
      );
    case "side":
      return (
        <>
          <ellipse cx="135" cy="170" rx="7" ry="7" fill="#222" />
          <ellipse cx="185" cy="170" rx="7" ry="7" fill="#222" />
          <path
            d="M135 170 L140 170 M185 170 L190 170"
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
            d="M130 170 L140 170"
            stroke="#222"
            strokeWidth="3"
            fill="none"
          />
          <ellipse cx="185" cy="170" rx="7" ry="7" fill="#222" />
        </>
      );
    case "squint":
      return (
        <>
          <path
            d="M130 170 Q135 175 140 170"
            stroke="#222"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M180 170 Q185 175 190 170"
            stroke="#222"
            strokeWidth="3"
            fill="none"
          />
        </>
      );
    case "surprised":
      return (
        <>
          <circle cx="135" cy="170" r="7" fill="#222" />
          <circle cx="185" cy="170" r="7" fill="#222" />
        </>
      );
    case "winkwacky":
      return (
        <>
          <path
            d="M130 170 L140 170"
            stroke="#222"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M180 170 Q185 175 190 170"
            stroke="#222"
            strokeWidth="3"
            fill="none"
          />
        </>
      );
    case "cry":
      return (
        <>
          <ellipse cx="135" cy="170" rx="7" ry="7" fill="#222" />
          <ellipse cx="185" cy="170" rx="7" ry="7" fill="#222" />
          <path
            d="M135 180 Q135 190 140 190"
            stroke="#222"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M185 180 Q185 190 190 190"
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
