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
          <circle cx="148" cy="176" r="9" fill={color} />
          <circle cx="212" cy="176" r="9" fill={color} />
        </>
      );
    case "necklace":
      return (
        <path
          d="M150 220 Q160 230 170 220"
          stroke={color}
          strokeWidth="3"
          fill="none"
        />
      );
    case "bowtie":
      return (
        <>
          <path
            d="M154 220 L144 230 L154 240"
            fill={color}
          />
          <path
            d="M166 220 L176 230 L166 240"
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
          d="M150 220 Q160 240 170 220 Q160 260 150 220"
          fill={color}
        />
      );
    case "none":
    default:
      return null;
  }
};

export default Accessories;
