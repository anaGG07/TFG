import React from "react";

interface HairProps {
  style: string;
  color: string;
}

const Hair: React.FC<HairProps> = ({ style, color }) => {
  switch (style) {
    case "longhair":
      return <ellipse cx="160" cy="160" rx="60" ry="60" fill={color} />;
    case "longhairbob":
      return (
        <path
          d="M100 160 Q160 200 220 160 Q160 180 100 160"
          fill={color}
        />
      );
    case "hairbun":
      return (
        <>
          <circle cx="160" cy="100" r="25" fill={color} />
          <path
            d="M135 100 Q160 80 185 100"
            fill={color}
          />
        </>
      );
    case "longhaircurly":
      return (
        <path
          d="M100 160 Q160 200 220 160 Q160 180 100 160"
          fill={color}
          style={{ filter: "blur(1px)" }}
        />
      );
    case "longhaircurvy":
      return (
        <path
          d="M100 160 Q160 200 220 160 Q160 180 100 160"
          fill={color}
          style={{ filter: "blur(0.5px)" }}
        />
      );
    case "longhairdread":
      return (
        <>
          <path
            d="M100 160 Q160 200 220 160 Q160 180 100 160"
            fill={color}
          />
          <path
            d="M120 160 L120 200 M140 160 L140 200 M160 160 L160 200 M180 160 L180 200 M200 160 L200 200"
            stroke={color}
            strokeWidth="4"
          />
        </>
      );
    case "nottoolong":
      return <ellipse cx="160" cy="130" rx="55" ry="40" fill={color} />;
    case "miawallace":
      return (
        <path
          d="M100 160 Q160 140 220 160 Q160 180 100 160"
          fill={color}
        />
      );
    case "longhairstraight":
    case "longhairstraight2":
      return <ellipse cx="160" cy="160" rx="60" ry="60" fill={color} />;
    case "shorthairdreads":
    case "shorthairdreads2":
      return (
        <>
          <ellipse cx="160" cy="110" rx="55" ry="30" fill={color} />
          <path
            d="M120 110 L120 130 M140 110 L140 130 M160 110 L160 130 M180 110 L180 130 M200 110 L200 130"
            stroke={color}
            strokeWidth="4"
          />
        </>
      );
    case "shorthairfrizzle":
      return (
        <ellipse
          cx="160"
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
          d="M100 110 Q160 90 220 110 Q160 130 100 110"
          fill={color}
          style={{ filter: "blur(0.5px)" }}
        />
      );
    case "shorthaircurly":
      return (
        <ellipse
          cx="160"
          cy="105"
          rx="60"
          ry="35"
          fill={color}
          style={{ filter: "blur(1px)" }}
        />
      );
    case "shorthairflat":
      return <ellipse cx="160" cy="110" rx="55" ry="25" fill={color} />;
    case "shorthairround":
      return <ellipse cx="160" cy="110" rx="55" ry="30" fill={color} />;
    case "shorthairwaved":
      return (
        <path
          d="M100 110 Q160 90 220 110 Q160 130 100 110"
          fill={color}
        />
      );
    case "shorthairsides":
      return (
        <path
          d="M100 110 Q160 100 220 110 Q160 120 100 110"
          fill={color}
        />
      );
    default:
      return <ellipse cx="160" cy="110" rx="55" ry="30" fill={color} />;
  }
};

export default Hair;
