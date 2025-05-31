import React from "react";

interface GlassesProps {
  type: string;
  opacity: string;
}

const Glasses: React.FC<GlassesProps> = ({ type, opacity }) => {
  if (type === "none") return null;

  switch (type) {
    case "rambo":
      return (
        <g transform="translate(0,-12)">
          <path fill="#2B2A29" fillRule="nonzero" d="M106 151c-1,0 -1,-1 -1,-2 0,-1 0,-1 1,-1l4 0c1,-6 3,-11 7,-15 4,-4 11,-6 21,-6 8,0 16,1 22,3l40 0c6,-2 14,-3 22,-3 10,0 17,2 21,6 4,4 6,9 7,15l4 0c1,0 1,0 1,1 0,1 0,2 -1,2l-4 0c0,7 -3,14 -8,19 -4,5 -10,8 -19,8 -8,0 -17,-5 -23,-12 -5,-4 -9,-10 -11,-15 0,0 0,0 0,0 -1,0 -1,0 -1,-1 -1,-3 -2,-5 -3,-7 -2,-1 -3,-2 -5,-2 -2,0 -3,1 -5,2 -1,2 -2,4 -3,7 0,1 0,1 -1,1 0,0 0,0 0,0 -2,5 -6,11 -11,15 -6,7 -15,12 -23,12 -9,0 -15,-3 -19,-8 -5,-5 -8,-12 -8,-19l-4 0zm61 -19c4,3 6,6 6,10 0,0 0,0 0,0 0,0 0,0 0,-1 2,-2 4,-3 7,-3 3,0 5,1 7,3 0,1 0,1 0,1 0,0 0,0 0,0 0,-4 2,-7 6,-10l-26 0zm55 -2c-9,0 -18,1 -24,3 -5,2 -8,5 -8,9 0,7 5,15 11,22 7,6 15,11 22,11 8,0 13,-3 17,-7 5,-4 7,-11 7,-18 0,-6 -2,-11 -6,-15 -4,-3 -10,-5 -19,-5zm-60 3c-6,-2 -15,-3 -24,-3 -9,0 -15,2 -19,5 -4,4 -6,9 -6,15 0,7 2,14 7,18 4,4 9,7 17,7 7,0 15,-5 22,-11 6,-7 11,-15 11,-22 0,-4 -3,-7 -8,-9z" />
          <path className="glass" fillOpacity={opacity} fill="#5B5B5B" d="M222 130c-9,0 -18,1 -24,3 -5,2 -8,5 -8,9 0,7 5,15 11,22 7,6 15,11 22,11 8,0 13,-3 17,-7 5,-4 7,-11 7,-18 0,-6 -2,-11 -6,-15 -4,-3 -10,-5 -19,-5zm-60 3c-6,-2 -15,-3 -24,-3 -9,0 -15,2 -19,5 -4,4 -6,9 -6,15 0,7 2,14 7,18 4,4 9,7 17,7 7,0 15,-5 22,-11 6,-7 11,-15 11,-22 0,-4 -3,-7 -8,-9z" />
        </g>
      );
    case "round":
      return (
        <g transform="translate(0,-12)">
          <ellipse cx="148" cy="155" rx="22" ry="18" fill="none" stroke="#222" strokeWidth="3" />
          <ellipse cx="212" cy="155" rx="22" ry="18" fill="none" stroke="#222" strokeWidth="3" />
          <rect x="170" y="150" width="20" height="6" fill="#222" />
        </g>
      );
    case "square":
      return (
        <g transform="translate(0,-12)">
          <rect x="126" y="137" width="44" height="36" rx="8" fill="none" stroke="#222" strokeWidth="3" />
          <rect x="190" y="137" width="44" height="36" rx="8" fill="none" stroke="#222" strokeWidth="3" />
          <rect x="170" y="150" width="20" height="6" fill="#222" />
        </g>
      );
    default:
      return null;
  }
};

export default Glasses;
