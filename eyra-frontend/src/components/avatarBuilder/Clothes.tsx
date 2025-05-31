import React from "react";

interface ClothesProps {
  type: string;
  color: string;
}

const Clothes: React.FC<ClothesProps> = ({ type, color }) => {
  switch (type) {
    case "hoodie":
      return (
        <rect x="110" y="240" width="100" height="60" rx="25" fill={color} />
      );
    case "dress":
      return (
        <ellipse
          cx="160"
          cy="290"
          rx="50"
          ry="60"
          fill={color}
          stroke="#7a2323"
          strokeWidth="3"
        />
      );
    case "tshirt":
    default:
      return (
        <rect x="120" y="240" width="80" height="50" rx="20" fill={color} />
      );
  }
};

export default Clothes;
