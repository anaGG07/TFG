import React from "react";

const FacialHair: React.FC<{ type: string; color?: string }> = ({ type, color = "#7a2323" }) => {
  switch (type) {
    case "none":
      return null;
    case "magnum":
      return (
        <g>
          <path fill={color} d="M170 201c7,-1 10,-4 10,-10 0,6 3,9 10,10 10,1 12,-3 20,-3 7,1 8,2 10,2 1,0 1,-1 1,-2 -6,-16 -26,-17 -31,-16 -6,1 -10,4 -10,9 0,-5 -4,-8 -10,-9 -5,-1 -25,0 -31,16 0,1 0,2 1,2 2,0 3,-1 10,-2 8,0 10,4 20,3z" />
        </g>
      );
    case "fancy":
      return (
        <path
          d="M140 215 Q180 220 220 215 Q180 225 140 215 M160 215 L160 225"
          stroke={color}
          strokeWidth="3"
          fill="none"
        />
      );
    case "magestic":
      return (
        <path
          d="M140 215 Q180 220 220 215 Q180 225 140 215 M150 215 L150 225 M170 215 L170 225"
          stroke={color}
          strokeWidth="3"
          fill="none"
        />
      );
    case "light":
      return (
        <path
          d="M140 215 Q180 220 220 215"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      );
    default:
      return null;
  }
};

export default FacialHair;
