import React from "react";

const Mouth: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "default":
      return (
        <g>
          <path fill="#000000" d="M180 210c10,0 17,-8 17,-18l0 0 -34 0 0 0c0,10 7,18 17,18z" />
        </g>
      );
    case "twinkle":
      return (
        <g>
          <path fill="#000000" fillRule="nonzero" d="M172 193c-1,-2 0,-3 2,-3 1,-1 3,0 3,1 1,3 2,5 5,6 2,2 5,3 8,3 3,0 6,-1 8,-3 3,-1 4,-3 5,-6 0,-1 2,-2 3,-1 2,0 3,1 2,3 -1,3 -4,6 -7,9 -3,2 -7,3 -11,3 -4,0 -8,-1 -11,-3 -3,-3 -6,-6 -7,-9z" />
        </g>
      );
    case "tongue":
      return (
        <g>
          <path fill="#000000" d="M180 213c17,0 31,-10 31,-23l-31 0 -31 0c0,13 14,23 31,23z" />
          <path fill="#FEFEFE" d="M179 189l-19 0 -19 0 0 2c0,3 2,5 4,5l30 0c2,0 4,-2 4,-5l0 -2z" />
          <path fill="#FF4F6D" d="M194 213c0,8 -6,15 -14,15 -8,0 -14,-7 -14,-15l0 -7c0,-4 4,-8 8,-8 3,0 5,1 6,2 1,-1 3,-2 6,-2 4,0 8,4 8,8l0 7z" />
        </g>
      );
    case "smile":
      return (
        <path
          d="M153 193 Q180 213 207 193"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "serious":
      return (
        <path
          d="M153 198 L207 198"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "scream":
      return (
        <ellipse cx="180" cy="198" rx="15" ry="12" fill="#E57373" />
      );
    case "sad":
      return (
        <path
          d="M153 203 Q180 193 207 203"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "grimace":
      return (
        <path
          d="M153 198 Q180 208 207 198 M153 203 L207 203"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "eating":
      return (
        <path
          d="M153 198 Q180 208 207 198 M180 198 L180 208"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "disbelief":
      return (
        <path
          d="M153 198 Q180 208 207 198 M180 198 L180 203 M170 203 L190 203"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "concerned":
      return (
        <path
          d="M153 198 Q180 208 207 198 M180 198 L180 203"
          stroke="#7a2323"
          strokeWidth="3"
          fill="none"
        />
      );
    case "vomit":
      return (
        <>
          <path
            d="M153 198 Q180 208 207 198"
            stroke="#7a2323"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M180 208 Q180 218 190 218"
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
