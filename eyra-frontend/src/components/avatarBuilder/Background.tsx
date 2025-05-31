import React from "react";

interface BackgroundProps {
  type: string;
  color: string;
}

const Background: React.FC<BackgroundProps> = ({ type, color }) => {
  switch (type) {
    case "circle":
      return (
        <circle
          cx="160"
          cy="160"
          r="150"
          fill={color}
        />
      );
    case "square":
      return (
        <rect
          x="10"
          y="10"
          width="300"
          height="300"
          rx="20"
          fill={color}
        />
      );
    case "gradient":
      return (
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.5 }} />
          </linearGradient>
          <circle
            cx="160"
            cy="160"
            r="150"
            fill="url(#grad)"
          />
        </defs>
      );
    case "pattern":
      return (
        <defs>
          <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="2" fill={color} />
          </pattern>
          <circle
            cx="160"
            cy="160"
            r="150"
            fill="url(#pattern)"
          />
        </defs>
      );
    default:
      return (
        <circle
          cx="160"
          cy="160"
          r="150"
          fill={color}
        />
      );
  }
};

export default Background;
