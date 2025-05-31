import React from "react";

interface BackgroundProps {
  color: string;
}

const Background: React.FC<BackgroundProps> = ({ color }) => (
  <svg width="360" height="360" viewBox="0 0 360 360">
    <circle cx="180" cy="180" r="170" fill={color} />
  </svg>
);

export default Background;
