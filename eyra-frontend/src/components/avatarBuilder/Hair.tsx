import React from "react";

interface HairProps {
  style: string;
  color: string;
  isBack?: boolean;
}

const Hair: React.FC<HairProps> = ({ style, color, isBack = false }) => {
  if (isBack) {
    switch (style) {
      case "longhairbob":
        // Parte trasera del bob largo
        return (
          <g>
            <path fill={color} d="M114 60c20,-23 60,-22 65,-22 5,0 45,-1 65,22 20,22 38,69 45,102 8,33 4,64 -6,84 -9,19 -17,20 -32,17 -16,-3 -22,-11 -72,-10 -50,-1 -56,7 -72,10 -15,3 -23,2 -32,-17 -10,-20 -14,-51 -6,-84 7,-33 25,-80 45,-102z" />
          </g>
        );
      case "longhaircurly":
        // Parte trasera del largo rizado
        return (
          <g>
            <path fill={color} d="M180 269c-23,0 -44,-7 -56,-18 -4,1 -8,1 -12,1 -38,0 -68,-27 -68,-60 0,-18 8,-34 22,-45 -12,-10 -15,-31 -7,-52 9,-20 27,-34 42,-33 2,-13 13,-25 29,-32 19,-8 38,-6 50,3 12,-9 31,-11 50,-3 16,7 27,19 29,32 15,-1 33,13 42,33 8,21 5,42 -7,52 14,11 22,27 22,45 0,33 -30,60 -68,60 -4,0 -8,0 -12,-1 -12,11 -33,18 -56,18z" />
          </g>
        );
      case "longhairdread":
        // Parte trasera del largo con rastas
        return (
          <g>
            <path fill={color} d="M90 80c10,60 40,120 180,120 20,-60 20,-120 -20,-160 -40,-40 -120,-20 -160,40z" />
          </g>
        );
      case "nottoolong":
        // Parte trasera del pelo medio
        return (
          <g>
            <path fill={color} d="M272 146l0 -3 0 0 0 -15c0,-51 -42,-93 -93,-93l0 0c-44,0 -82,32 -90,75 0,0 -1,0 -1,0 -7,0 -13,7 -13,16 0,7 4,15 12,16l0 100c0,4 3,8 8,8l68 0 13 0 58 0c21,0 38,-17 38,-38l0 -66z" />
          </g>
        );
      case "miawallace":
        // Parte trasera del estilo Mia Wallace
        return (
          <g>
            <path fill={color} d="M92 256c25,-4 58,-9 87,-9 29,0 61,5 86,9 45,-50 26,-79 8,-134 -21,-60 -30,-83 -94,-83 -64,0 -74,23 -94,83 -19,55 -37,84 7,134z" />
          </g>
        );
      case "longhaircurvy":
        // Parte trasera del largo ondulado
        return (
          <g>
            <path fill={color} d="M183 34c50,0 67,23 80,68 4,14 13,31 20,43 5,12 0,17 0,25 8,2 23,10 30,27 4,10 -4,31 -15,38 -3,3 0,24 -6,37 -7,14 -13,13 -23,19 -7,4 23,38 4,63 -12,-22 -36,0 -51,-10 -18,-10 -18,-27 -18,-38 0,-11 10,-46 29,-65 -2,-16 18,-47 17,-60l-1 -58c-7,-8 -21,-13 -39,-15l-1 -7 -1 6c-10,-1 -22,-2 -34,-1l-2 -11 -2 11c-6,0 -12,1 -18,2l-1 -7 -1 7c-17,2 -30,6 -38,13 0,27 -1,64 0,68 2,11 19,33 17,63 -1,16 -26,29 -26,38 0,6 0,19 23,21 -6,7 -23,3 -27,1 0,5 1,5 4,10 -10,-3 -15,-11 -16,-15 -6,7 -2,14 -5,24 -22,-10 -25,-31 -26,-36 -2,-33 11,-36 9,-45 -4,-17 -19,-20 -19,-37 0,-19 23,-41 28,-47 5,-6 -1,-20 0,-30 3,-18 18,-35 19,-35 31,-44 27,-67 90,-67z" />
          </g>
        );
      default:
        return null;
    }
  }

  // Pelo delantero: solo flequillo/frente
  switch (style) {
    case "longhairbob":
      // Flequillo/frente bob largo
      return (
        <g>
          <path fill={color} d="M120 90c10,10 40,10 60,0 20,-10 40,-10 60,0 10,10 10,30 0,40 -10,10 -40,10 -60,0 -20,-10 -40,-10 -60,0 -10,10 -10,30 0,40z" />
        </g>
      );
    case "longhaircurly":
      // Flequillo/frente largo rizado
      return (
        <g>
          <path fill={color} d="M120 120c20,-10 40,-10 60,0 20,10 40,10 60,0 10,-10 10,-30 0,-40 -10,-10 -40,-10 -60,0 -20,10 -40,10 -60,0 -10,-10 -10,-30 0,-40z" />
        </g>
      );
    case "longhairdread":
      // Flequillo/frente largo con rastas
      return (
        <g>
          <path fill={color} d="M120 110c20,-10 40,-10 60,0 20,10 40,10 60,0 10,-10 10,-30 0,-40 -10,-10 -40,-10 -60,0 -20,10 -40,10 -60,0 -10,-10 -10,-30 0,-40z" />
        </g>
      );
    case "nottoolong":
      // Flequillo/frente pelo medio
      return (
        <g>
          <path fill={color} d="M140 100c10,10 40,10 60,0 10,-10 10,-30 0,-40 -10,-10 -40,-10 -60,0 -10,10 -10,30 0,40z" />
        </g>
      );
    case "miawallace":
      // Flequillo/frente estilo Mia Wallace
      return (
        <g>
          <path fill={color} d="M140 110c10,10 40,10 60,0 10,-10 10,-30 0,-40 -10,-10 -40,-10 -60,0 -10,10 -10,30 0,40z" />
        </g>
      );
    case "longhaircurvy":
      // Flequillo/frente largo ondulado
      return (
        <g>
          <path fill={color} d="M140 90c10,10 40,10 60,0 10,-10 10,-30 0,-40 -10,-10 -40,-10 -60,0 -10,10 -10,30 0,40z" />
        </g>
      );
    default:
      return null;
  }
};

export default Hair;
