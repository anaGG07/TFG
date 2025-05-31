import React from "react";

interface SkinProps {
  color: string;
}

const Skin: React.FC<SkinProps> = ({ color }) => (
  <g id="skin">
    {/* Cuerpo y cabeza centrados en x=180 */}
    <path
      id="body"
      fill={color}
      d="M304 360l0 -15c0,-47 -39,-85 -86,-85l-8 0 0 -22c22,-10 37,-32 39,-57 7,-1 13,-7 13,-15l0 -15c0,-8 -6,-14 -13,-15l0 -8c0,-38 -31,-69 -69,-69l0 0c-38,0 -69,31 -69,69l0 8c-7,1 -13,7 -13,15l0 15c0,8 6,14 13,15 2,25 17,47 39,57l0 22 -8 0c-47,0 -86,38 -86,85l0 15 248 0z"
    />
    {/* Sombra del cuello */}
    <path
      id="neck"
      fill="#000000"
      fillOpacity="0.2"
      d="M180 256c-11,0 -21,-2 -30,-6l0 -12c9,5 19,7 30,7l0 0c11,0 21,-2 30,-7l0 12c-9,4 -19,6 -30,6z"
    />
    {/* Sombra de la nariz */}
    <path
      id="nose"
      fill="#000000"
      fillOpacity="0.2"
      d="M180 181c9,0 16,-4 16,-9l-32 0c0,5 7,9 16,9z"
    />
    {/* Sombra de la mejilla izquierda */}
    <path
      id="cheek-left"
      fill="#000000"
      fillOpacity="0.1"
      d="M140 190c-5,0 -10,-2 -13,-5 -3,-3 -5,-7 -5,-11 0,-4 2,-8 5,-11 3,-3 8,-5 13,-5 5,0 10,2 13,5 3,3 5,7 5,11 0,4 -2,8 -5,11 -3,3 -8,5 -13,5z"
    />
    {/* Sombra de la mejilla derecha */}
    <path
      id="cheek-right"
      fill="#000000"
      fillOpacity="0.1"
      d="M220 190c-5,0 -10,-2 -13,-5 -3,-3 -5,-7 -5,-11 0,-4 2,-8 5,-11 3,-3 8,-5 13,-5 5,0 10,2 13,5 3,3 5,7 5,11 0,4 -2,8 -5,11 -3,3 -8,5 -13,5z"
    />
  </g>
);

export default Skin;
