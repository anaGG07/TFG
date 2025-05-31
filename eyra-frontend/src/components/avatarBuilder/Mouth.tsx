import React from "react";

const Mouth: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "open":
      return <ellipse cx="160" cy="205" rx="14" ry="8" fill="#E57373" />;
    case "sad":
      return (
        <path
          d="M145 210 Q160 200 175 210"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
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
    case "default":
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
