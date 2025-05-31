import React from "react";

const FacialHair: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "none":
      return null;
    case "magnum":
      return (
        <g>
          <path fill="#6f2912" d="M170 201c7,-1 10,-4 10,-10 0,6 3,9 10,10 10,1 12,-3 20,-3 7,1 8,2 10,2 1,0 1,-1 1,-2 -6,-16 -26,-17 -31,-16 -6,1 -10,4 -10,9 0,-5 -4,-8 -10,-9 -5,-1 -25,0 -31,16 0,1 0,2 1,2 2,0 3,-1 10,-2 8,0 10,4 20,3z" />
        </g>
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
