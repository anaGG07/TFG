import React from "react";

const FacialHair: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "none":
      return null;
    case "magnum":
      return (
        <path
          d="M140 215 Q160 220 180 215 Q160 225 140 215"
          stroke="#7a2323"
          strokeWidth="4"
          fill="none"
        />
      );
    case "fancy":
      return (
        <path
          d="M140 215 Q160 220 180 215 Q160 225 140 215 M160 215 L160 225"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "magestic":
      return (
        <path
          d="M140 215 Q160 220 180 215 Q160 225 140 215 M150 215 L150 225 M170 215 L170 225"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "light":
      return (
        <path
          d="M140 215 Q160 220 180 215"
          stroke="#7a2323"
          strokeWidth="2"
          fill="none"
        />
      );
    default:
      return null;
  }
};

export default FacialHair;
