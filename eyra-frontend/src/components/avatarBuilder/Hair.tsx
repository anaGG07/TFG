import React from 'react';

interface HairProps {
  style: string;
  color: string;
}

const Hair: React.FC<HairProps> = ({ style, color }) => {
  switch (style) {
    case 'short':
      return <ellipse cx="120" cy="70" rx="55" ry="30" fill={color} />;
    case 'curly':
      return <ellipse cx="120" cy="65" rx="60" ry="35" fill={color} style={{ filter: 'blur(1px)' }} />;
    case 'long':
      return <ellipse cx="120" cy="120" rx="60" ry="60" fill={color} />;
    default:
      return null;
  }
};

export default Hair; 