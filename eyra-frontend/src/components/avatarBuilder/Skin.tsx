import React from 'react';

const Skin: React.FC<{ color: string }> = ({ color }) => (
  <ellipse cx="120" cy="120" rx="60" ry="70" fill={color} />
);

export default Skin; 