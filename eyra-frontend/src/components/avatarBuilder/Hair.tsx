import React from "react";

interface HairProps {
  style: string;
  color: string;
  isBack?: boolean;
}

const Hair: React.FC<HairProps> = ({ style, color, isBack = false }) => {
  // Pelo trasero: path completo
  if (isBack) {
    switch (style) {
      case "longhair":
      case "longhairbob":
      case "longhaircurly":
      case "longhaircurvy":
      case "longhairdread":
      case "longhairstraight":
      case "longhairstraight2":
        return (
          <g>
            <path fill={color} d="M94 60c20,-23 60,-22 65,-22 5,0 45,-1 65,22 20,22 38,69 45,102 8,33 4,64 -6,84 -9,19 -17,20 -32,17 -16,-3 -22,-11 -72,-10 -50,-1 -56,7 -72,10 -15,3 -23,2 -32,-17 -10,-20 -14,-51 -6,-84 7,-33 25,-80 45,-102z" />
          </g>
        );
      default:
        return null;
    }
  }

  // Pelo delantero: solo flequillo/frente
  switch (style) {
    case "longhair":
    case "longhairbob":
    case "longhaircurly":
    case "longhaircurvy":
    case "longhairdread":
    case "longhairstraight":
    case "longhairstraight2":
      return (
        <g>
          <path fill={color} d="M130 90 Q180 60 230 90 Q180 120 130 90 Z" />
        </g>
      );
    case "hairbun":
      return (
        <g>
          <path fill={color} d="M204 46c28,11 48,41 48,75 0,5 -1,10 -1,14l-2 0c-3,-40 -33,-64 -69,-64 -36,0 -66,24 -69,64l-2 0c0,-4 -1,-9 -1,-14 0,-34 20,-64 48,-75 -3,-3 -5,-7 -5,-12 0,-12 13,-22 29,-22 16,0 29,10 29,22 0,5 -2,9 -5,12z" />
        </g>
      );
    case "nottoolong":
      return <ellipse cx="180" cy="130" rx="55" ry="40" fill={color} />;
    case "miawallace":
      return (
        <path
          d="M120 160 Q180 140 240 160 Q180 180 120 160"
          fill={color}
        />
      );
    case "shorthairdreads":
    case "shorthairdreads2":
      return (
        <>
          <ellipse cx="180" cy="110" rx="55" ry="30" fill={color} />
          <path
            d="M140 110 L140 130 M160 110 L160 130 M180 110 L180 130 M200 110 L200 130 M220 110 L220 130"
            stroke={color}
            strokeWidth="4"
          />
        </>
      );
    case "shorthairfrizzle":
      return (
        <ellipse
          cx="180"
          cy="105"
          rx="60"
          ry="35"
          fill={color}
          style={{ filter: "blur(1px)" }}
        />
      );
    case "shorthairshaggy":
      return (
        <path
          d="M120 110 Q180 90 240 110 Q180 130 120 110"
          fill={color}
          style={{ filter: "blur(0.5px)" }}
        />
      );
    case "shorthaircurly":
      return (
        <ellipse
          cx="180"
          cy="105"
          rx="60"
          ry="35"
          fill={color}
          style={{ filter: "blur(1px)" }}
        />
      );
    case "shorthairflat":
      return <ellipse cx="180" cy="110" rx="55" ry="25" fill={color} />;
    case "shorthairround":
      return <ellipse cx="180" cy="110" rx="55" ry="30" fill={color} />;
    case "shorthairwaved":
      return (
        <path
          d="M120 110 Q180 90 240 110 Q180 130 120 110"
          fill={color}
        />
      );
    case "shorthairsides":
      return (
        <path
          d="M120 110 Q180 100 240 110 Q180 120 120 110"
          fill={color}
        />
      );
    default:
      return null;
  }
};

export default Hair;
