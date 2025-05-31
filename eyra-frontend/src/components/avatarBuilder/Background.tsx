import React from "react";

interface BackgroundProps {
  color: string;
}

const Background: React.FC<BackgroundProps> = ({ color }) => (
  <circle cx="180" cy="180" r="170" fill={color} />
);

export default Background;
