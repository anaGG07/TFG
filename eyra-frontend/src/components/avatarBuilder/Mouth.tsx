import React from "react";

const Mouth: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "default":
      return (
        <path
          d="M145 205 Q160 215 175 205"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "twinkle":
      return (
        <path
          d="M145 205 Q160 215 175 205 M160 205 L160 210"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "tongue":
      return (
        <>
          <path
            d="M145 205 Q160 215 175 205"
            stroke="#7a2323"
            strokeWidth="3"
            fill="none"
          />
          <ellipse cx="160" cy="215" rx="10" ry="5" fill="#E57373" />
        </>
      );
    case "smile":
      return (
        <path
          d="M145 200 Q160 220 175 200"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "serious":
      return (
        <path
          d="M145 205 L175 205"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "scream":
      return (
        <ellipse cx="160" cy="205" rx="15" ry="12" fill="#E57373" />
      );
    case "sad":
      return (
        <path
          d="M145 210 Q160 200 175 210"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "grimace":
      return (
        <path
          d="M145 205 Q160 215 175 205 M145 210 L175 210"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "eating":
      return (
        <path
          d="M145 205 Q160 215 175 205 M160 205 L160 215"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "disbelief":
      return (
        <path
          d="M145 205 Q160 215 175 205 M160 205 L160 210 M150 210 L170 210"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "concerned":
      return (
        <path
          d="M145 205 Q160 215 175 205 M160 205 L160 210"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "vomit":
      return (
        <>
          <path
            d="M145 205 Q160 215 175 205"
            stroke="#7a2323"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M160 215 Q160 225 170 225"
            stroke="#E57373"
            strokeWidth="3"
            fill="none"
          />
        </>
      );
    default:
      return (
        <path
          d="M145 205 Q160 215 175 205"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
  }
};

export default Mouth;
