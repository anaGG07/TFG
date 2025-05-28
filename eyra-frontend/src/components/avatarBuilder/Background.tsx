import React from 'react';

const Background: React.FC<{ color: string }> = ({ color }) => (
  <rect x="0" y="0" width="240" height="320" fill={color} />
);

export default Background; 