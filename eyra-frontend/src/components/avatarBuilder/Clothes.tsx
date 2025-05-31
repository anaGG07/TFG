import React from "react";

interface ClothesProps {
  type: string;
  color: string;
}

const Clothes: React.FC<ClothesProps> = ({ type, color }) => {
  switch (type) {
    case "vneck":
      return (
        <>
          <rect x="110" y="240" width="100" height="60" rx="25" fill={color} />
          <path
            d="M160 240 L160 260 L140 270 L180 270 Z"
            fill={color}
          />
        </>
      );
    case "sweater":
      return (
        <>
          <rect x="110" y="240" width="100" height="60" rx="25" fill={color} />
          <path
            d="M110 240 Q160 260 210 240"
            stroke={color}
            strokeWidth="4"
            fill="none"
          />
        </>
      );
    case "hoodie":
      return (
        <>
          <rect x="110" y="240" width="100" height="60" rx="25" fill={color} />
          <path
            d="M110 240 Q160 220 210 240"
            fill={color}
          />
        </>
      );
    case "overall":
      return (
        <>
          <rect x="110" y="240" width="100" height="60" rx="25" fill={color} />
          <path
            d="M140 240 L140 220 L180 220 L180 240"
            stroke={color}
            strokeWidth="4"
            fill="none"
          />
        </>
      );
    case "blazer":
      return (
        <>
          <rect x="110" y="240" width="100" height="60" rx="25" fill={color} />
          <path
            d="M110 240 Q160 260 210 240 M140 240 L140 220 L180 220 L180 240"
            stroke={color}
            strokeWidth="4"
            fill="none"
          />
        </>
      );
    default:
      return (
        <rect x="120" y="240" width="80" height="50" rx="20" fill={color} />
      );
  }
};

export default Clothes;
