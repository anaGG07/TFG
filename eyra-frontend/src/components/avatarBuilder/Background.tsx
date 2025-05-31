import React from "react";

interface BackgroundProps {
  color: string;
}

const Background: React.FC<BackgroundProps> = ({ color }) => {
  return (
    <circle
      cx="160"
      cy="160"
      r="150"
      fill={color}
    />
  );
};

export default Background;
