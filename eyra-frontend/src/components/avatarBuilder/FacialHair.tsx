import React from "react";

const FacialHair: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "mustache":
      return <ellipse cx="160" cy="215" rx="18" ry="4" fill="#7a2323" />;
    case "beard":
      return <ellipse cx="160" cy="235" rx="28" ry="16" fill="#7a2323" />;
    case "none":
    default:
      return null;
  }
};

export default FacialHair;
