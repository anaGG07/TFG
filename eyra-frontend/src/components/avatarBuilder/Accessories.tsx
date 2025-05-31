import React from "react";

interface AccessoriesProps {
  type: string;
  color?: string;
}

const Accessories: React.FC<AccessoriesProps> = ({ type, color = "#FFD700" }) => {
  switch (type) {
    case "earring":
      return (
        <>
          <circle cx="210" cy="170" r="6" fill={color} />
          <circle cx="110" cy="170" r="6" fill={color} />
        </>
      );
    case "necklace":
      return (
        <path
          d="M140 220 Q160 230 180 220"
          stroke={color}
          strokeWidth="3"
          fill="none"
        />
      );
    case "bowtie":
      return (
        <>
          <path
            d="M150 220 L140 230 L150 240"
            fill={color}
          />
          <path
            d="M170 220 L180 230 L170 240"
            fill={color}
          />
        </>
      );
    case "tie":
      return (
        <path
          d="M160 220 L160 260 L150 270 L170 270 Z"
          fill={color}
        />
      );
    case "scarf":
      return (
        <path
          d="M140 220 Q160 240 180 220 Q160 260 140 220"
          fill={color}
        />
      );
    case "none":
    default:
      return null;
  }
};

export default Accessories;
