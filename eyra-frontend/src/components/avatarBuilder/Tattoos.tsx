import React from "react";

interface TattoosProps {
  type: string;
  color: string;
}

const Tattoos: React.FC<TattoosProps> = ({ type, color }) => {
  switch (type) {
    case "tribal":
      return (
        <path
          d="M140 200 Q160 180 180 200 Q160 220 140 200"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      );
    case "dragon":
      return (
        <path
          d="M140 200 Q160 190 180 200 Q170 210 160 200 Q150 210 140 200"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      );
    case "skull":
      return (
        <path
          d="M150 200 Q160 190 170 200 Q160 210 150 200"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      );
    case "rose":
      return (
        <path
          d="M150 200 Q160 190 170 200 Q160 210 150 200 M160 190 Q160 180 160 170"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      );
    case "cross":
      return (
        <path
          d="M160 190 L160 210 M150 200 L170 200"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      );
    default:
      return null;
  }
};

export default Tattoos;
