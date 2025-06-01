import React from "react";

interface ClothesProps {
  type: string;
  color: string;
}

const Clothes: React.FC<ClothesProps> = ({ type, color }) => {
  switch (type) {
    case "vneck":
      return (
        <g>
          <path fill={color} d="M324 360l0 -15c0,-44 -34,-81 -98,-85l-15 0 0 11c0,3 -1,6 -3,7l0 0c-5,11 -15,19 -28,19 -12,0 -23,-8 -27,-18l-1 -1c-2,-1 -2,-4 -2,-7l0 -11 -16 0c-64,4 -98,41 -98,85l0 15 248 0z" />
          <path fill={color} d="M180 260l-15 0 0 15 15 0 0 -15z" />
          <path fill={color} d="M140 260l-15 0 0 15 15 0 0 -15z" />
        </g>
      );
    case "sweater":
      return (
        <g>
          <path fill={color} d="M324 360l0 -15c0,-44 -34,-81 -98,-85l-15 0 0 11c0,3 -1,6 -3,7l0 0c-5,11 -15,19 -28,19 -12,0 -23,-8 -27,-18l-1 -1c-2,-1 -2,-4 -2,-7l0 -11 -16 0c-64,4 -98,41 -98,85l0 15 248 0z" />
          <path fill={color} d="M180 260l-15 0 0 15 15 0 0 -15z" />
          <path fill={color} d="M140 260l-15 0 0 15 15 0 0 -15z" />
        </g>
      );
    case "hoodie":
      return (
        <g>
          <path fill={color} d="M324 360l0 -15c0,-44 -34,-81 -98,-85l-15 0 0 11c0,3 -1,6 -3,7l0 0c-5,11 -15,19 -28,19 -12,0 -23,-8 -27,-18l-1 -1c-2,-1 -2,-4 -2,-7l0 -11 -16 0c-64,4 -98,41 -98,85l0 15 248 0z" />
          <path fill={color} d="M180 260l-15 0 0 15 15 0 0 -15z" />
          <path fill={color} d="M140 260l-15 0 0 15 15 0 0 -15z" />
        </g>
      );
    case "overall":
      return (
        <g>
          <path fill={color} d="M324 360l0 -15c0,-44 -34,-81 -98,-85l-15 0 0 11c0,3 -1,6 -3,7l0 0c-5,11 -15,19 -28,19 -12,0 -23,-8 -27,-18l-1 -1c-2,-1 -2,-4 -2,-7l0 -11 -16 0c-64,4 -98,41 -98,85l0 15 248 0z" />
          <path fill={color} d="M180 260l-15 0 0 15 15 0 0 -15z" />
          <path fill={color} d="M140 260l-15 0 0 15 15 0 0 -15z" />
        </g>
      );
    case "blazer":
      return (
        <g>
          <path fill={color} d="M324 360l0 -15c0,-44 -34,-81 -98,-85l-15 0 0 11c0,3 -1,6 -3,7l0 0c-5,11 -15,19 -28,19 -12,0 -23,-8 -27,-18l-1 -1c-2,-1 -2,-4 -2,-7l0 -11 -16 0c-64,4 -98,41 -98,85l0 15 248 0z" />
          <path fill={color} d="M180 260l-15 0 0 15 15 0 0 -15z" />
          <path fill={color} d="M140 260l-15 0 0 15 15 0 0 -15z" />
        </g>
      );
    case "shirt":
      return (
        <g>
          <path fill={color} d="M324 360l0 -15c0,-44 -34,-81 -98,-85l-15 0 0 11c0,3 -1,6 -3,7l0 0c-5,11 -15,19 -28,19 -12,0 -23,-8 -27,-18l-1 -1c-2,-1 -2,-4 -2,-7l0 -11 -16 0c-64,4 -98,41 -98,85l0 15 248 0z" />
          <path fill={color} d="M180 260l-15 0 0 15 15 0 0 -15z" />
          <path fill={color} d="M140 260l-15 0 0 15 15 0 0 -15z" />
        </g>
      );
    case "jacket":
      return (
        <g>
          <path fill={color} d="M324 360l0 -15c0,-44 -34,-81 -98,-85l-15 0 0 11c0,3 -1,6 -3,7l0 0c-5,11 -15,19 -28,19 -12,0 -23,-8 -27,-18l-1 -1c-2,-1 -2,-4 -2,-7l0 -11 -16 0c-64,4 -98,41 -98,85l0 15 248 0z" />
          <path fill={color} d="M180 260l-15 0 0 15 15 0 0 -15z" />
          <path fill={color} d="M140 260l-15 0 0 15 15 0 0 -15z" />
          <path fill={color} d="M324 360l0 -15c0,-44 -34,-81 -98,-85l-15 0 0 11c0,3 -1,6 -3,7l0 0c-5,11 -15,19 -28,19 -12,0 -23,-8 -27,-18l-1 -1c-2,-1 -2,-4 -2,-7l0 -11 -16 0c-64,4 -98,41 -98,85l0 15 248 0z" />
        </g>
      );
    case "none":
      return null;
    default:
      return null;
  }
};

export default Clothes;
