import React from "react";

interface GlassesProps {
  type: string;
  opacity: string;
}

const Glasses: React.FC<GlassesProps> = ({ type, opacity }) => {
  if (type === "none") return null;

  const commonProps = {
    fill: "#fff",
    fillOpacity: Number(opacity),
    stroke: "#222",
    strokeWidth: "2",
  };

  switch (type) {
    case "round":
      return (
        <>
          <ellipse cx="135" cy="170" rx="16" ry="12" {...commonProps} />
          <ellipse cx="185" cy="170" rx="16" ry="12" {...commonProps} />
          <rect x="151" y="170" width="18" height="2" fill="#222" />
        </>
      );
    case "square":
      return (
        <>
          <rect x="120" y="160" width="30" height="20" rx="5" {...commonProps} />
          <rect x="170" y="160" width="30" height="20" rx="5" {...commonProps} />
          <rect x="151" y="170" width="18" height="2" fill="#222" />
        </>
      );
    case "nerd":
      return (
        <>
          <ellipse cx="135" cy="170" rx="16" ry="12" {...commonProps} />
          <ellipse cx="185" cy="170" rx="16" ry="12" {...commonProps} />
          <rect x="151" y="170" width="18" height="2" fill="#222" />
          <path
            d="M120 170 L130 170 M190 170 L200 170"
            stroke="#222"
            strokeWidth="2"
            fill="none"
          />
        </>
      );
    case "old":
      return (
        <>
          <ellipse cx="135" cy="170" rx="16" ry="12" {...commonProps} />
          <ellipse cx="185" cy="170" rx="16" ry="12" {...commonProps} />
          <rect x="151" y="170" width="18" height="2" fill="#222" />
          <path
            d="M120 170 L130 170 M190 170 L200 170"
            stroke="#222"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M120 170 L130 180 M190 170 L200 180"
            stroke="#222"
            strokeWidth="2"
            fill="none"
          />
        </>
      );
    case "harry":
      return (
        <>
          <ellipse cx="135" cy="170" rx="16" ry="12" {...commonProps} />
          <ellipse cx="185" cy="170" rx="16" ry="12" {...commonProps} />
          <rect x="151" y="170" width="18" height="2" fill="#222" />
          <path
            d="M120 170 L130 170 M190 170 L200 170"
            stroke="#222"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M120 170 L130 180 M190 170 L200 180"
            stroke="#222"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M120 170 L130 160 M190 170 L200 160"
            stroke="#222"
            strokeWidth="2"
            fill="none"
          />
        </>
      );
    case "rambo":
      return (
        <>
          <rect x="120" y="160" width="30" height="20" rx="5" {...commonProps} />
          <rect x="170" y="160" width="30" height="20" rx="5" {...commonProps} />
          <rect x="151" y="170" width="18" height="2" fill="#222" />
          <path
            d="M120 160 L130 150 M190 160 L200 150"
            stroke="#222"
            strokeWidth="2"
            fill="none"
          />
        </>
      );
    default:
      return null;
  }
};

export default Glasses;
