import React from "react";

interface ClothesProps {
  type: string;
  color: string;
}

const Clothes: React.FC<ClothesProps> = ({ type, color }) => {
  switch (type) {
    case "blazer":
      return (
        <g>
          <path fill={color} d="M304 360l0 -13c0,-45 -34,-83 -79,-87l-1 -1c-2,0 -4,0 -6,0 1,0 1,1 1,1l-1 0 1 0c0,2 0,3 0,5l-3 2c-24,23 -48,23 -72,0l-3 -2c0,-2 0,-4 1,-6 -2,0 -4,0 -6,0l-1 1c-45,4 -79,42 -79,87l0 13 74 0 19 0 62 0 19 0 74 0z" />
        </g>
      );
    case "sweater":
      return (
        <g>
          <path fill={color} d="M284 360l0 -15c0,-44 -34,-81 -98,-85l-15 0 0 11c0,3 -1,6 -3,7l0 0c-5,11 -15,19 -28,19 -12,0 -23,-8 -27,-18l-1 -1c-2,-1 -2,-4 -2,-7l0 -11 -16 0c-64,4 -98,41 -98,85l0 15 248 0z" />
        </g>
      );
    case "vneck":
      return (
        <g>
          <path fill={color} d="M284 360l0 -15c0,-44 -34,-81 -98,-85l-46 47 -46 -47c-64,4 -98,41 -98,85l0 15 248 0z" />
        </g>
      );
    case "overall":
      return (
        <g>
          <path fill="#e0e0e0" d="M284 360l0 -15c0,-44 -34,-80 -97,-85 -2,24 -22,43 -46,43 -25,0 -45,-19 -47,-43l0 0c-64,4 -98,41 -98,85l0 15 248 0z" />
          <path fill={color} d="M240 270c-10,-5 -21,-9 -32,-10l0 57 -96 0 0 -57c-11,2 -22,5 -32,11l0 89 160 0 0 -90z" />
        </g>
      );
    case "hoodie":
      return (
        <g>
          <path fill={color} d="M284 360l0 -15c0,-36 -24,-68 -76,-80 -1,-13 -17,-20 -39,-23l0 22c0,16 -13,29 -30,29l0 0c-16,0 -29,-13 -29,-29l0 -22c-22,3 -38,10 -39,23 -52,13 -75,44 -75,80l0 15 248 0z" />
        </g>
      );
    case "tshirt":
      return (
        <g>
          <path fill={color} d="M284 360l0 -15c0,-44 -34,-81 -98,-85l-15 0 0 11c0,3 -1,6 -3,7l0 0c-5,11 -15,19 -28,19 -12,0 -23,-8 -27,-18l-1 -1c-2,-1 -2,-4 -2,-7l0 -11 -16 0c-64,4 -98,41 -98,85l0 15 248 0z" />
        </g>
      );
    default:
      return null;
  }
};

export default Clothes;
