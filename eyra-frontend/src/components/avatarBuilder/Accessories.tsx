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
          <circle cx="148" cy="143" r="8" fill={color} stroke="#222" strokeWidth="2" />
          <circle cx="212" cy="143" r="8" fill={color} stroke="#222" strokeWidth="2" />
        </>
      );
    case "necklace":
      return (
        <path
          d="M150 220 Q180 230 210 220"
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
            stroke="#222"
            strokeWidth="2"
          />
          <path
            d="M206 220 L216 230 L206 240"
            fill={color}
            stroke="#222"
            strokeWidth="2"
          />
        </>
      );
    case "tie":
      return (
        <path
          d="M160 220 L160 260 L150 270 L170 270 Z"
          fill={color}
          stroke="#222"
          strokeWidth="2"
        />
      );
    case "scarf":
      return (
        <path
          d="M150 220 Q180 240 210 220 Q180 260 150 220"
          fill={color}
          stroke="#222"
          strokeWidth="2"
        />
      );
    case "glasses":
      return (
        <>
          <ellipse cx="148" cy="143" rx="22" ry="18" fill="none" stroke={color} strokeWidth="5" />
          <ellipse cx="212" cy="143" rx="22" ry="18" fill="none" stroke={color} strokeWidth="5" />
          <rect x="170" y="138" width="20" height="6" fill={color} />
        </>
      );
    case "sunglasses":
      return (
        <>
          <rect x="126" y="125" width="44" height="36" rx="8" fill="none" stroke={color} strokeWidth="5" />
          <rect x="190" y="125" width="44" height="36" rx="8" fill="none" stroke={color} strokeWidth="5" />
          <rect x="170" y="138" width="20" height="6" fill={color} />
        </>
      );
    case "hat":
      return (
        <path
          d="M150 100 Q180 80 210 100 Q180 120 150 100"
          fill={color}
          stroke="#222"
          strokeWidth="2"
        />
      );
    case "none":
    default:
      return null;
  }
};

export default Accessories;
