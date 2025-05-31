import React from "react";

const Mouth: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "default":
      return (
        <g>
          <path fill="#000000" d="M180 217c10,0 17,-8 17,-18l0 0 -34 0 0 0c0,10 7,18 17,18z" />
        </g>
      );
    case "twinkle":
      return (
        <g>
          <path fill="#000000" fillRule="nonzero" d="M152 200c-1,-2 0,-3 2,-3 1,-1 3,0 3,1 1,3 2,5 5,6 2,2 5,3 8,3 3,0 6,-1 8,-3 3,-1 4,-3 5,-6 0,-1 2,-2 3,-1 2,0 3,1 2,3 -1,3 -4,6 -7,9 -3,2 -7,3 -11,3 -4,0 -8,-1 -11,-3 -3,-3 -6,-6 -7,-9z" />
        </g>
      );
    case "tongue":
      return (
        <g>
          <path fill="#000000" d="M160 220c17,0 31,-10 31,-23l-62 0c0,13 14,23 31,23z" />
          <path fill="#FEFEFE" d="M179 196l-38 0 0 2c0,3 2,5 4,5l30 0c2,0 4,-2 4,-5l0 -2z" />
          <path fill="#FF4F6D" d="M174 220c0,8 -6,15 -14,15 -8,0 -14,-7 -14,-15l0 -7c0,-4 4,-8 8,-8 3,0 5,1 6,2 1,-1 3,-2 6,-2 4,0 8,4 8,8l0 7z" />
        </g>
      );
    case "smile":
      return (
        <path
          d="M145 200 Q160 220 175 200"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "serious":
      return (
        <path
          d="M145 205 L175 205"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "scream":
      return (
        <ellipse cx="160" cy="205" rx="15" ry="12" fill="#E57373" />
      );
    case "sad":
      return (
        <path
          d="M145 210 Q160 200 175 210"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "grimace":
      return (
        <path
          d="M145 205 Q160 215 175 205 M145 210 L175 210"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "eating":
      return (
        <path
          d="M145 205 Q160 215 175 205 M160 205 L160 215"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "disbelief":
      return (
        <path
          d="M145 205 Q160 215 175 205 M160 205 L160 210 M150 210 L170 210"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "concerned":
      return (
        <path
          d="M145 205 Q160 215 175 205 M160 205 L160 210"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "vomit":
      return (
        <>
          <path
            d="M145 205 Q160 215 175 205"
            stroke="#7a2323"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M160 215 Q160 225 170 225"
            stroke="#E57373"
            strokeWidth="3"
            fill="none"
          />
        </>
      );
    default:
      return null;
  }
};

export default Mouth;
