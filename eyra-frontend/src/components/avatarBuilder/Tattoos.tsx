import React from 'react';

const Tattoos: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'star':
      return <polygon points="120,180 123,188 131,188 125,192 127,200 120,195 113,200 115,192 109,188 117,188" fill="#FFD700" />;
    case 'heart':
      return <path d="M120 185 Q125 180 130 185 Q130 190 120 200 Q110 190 110 185 Q115 180 120 185" fill="#E57373" />;
    case 'none':
    default:
      return null;
  }
};

export default Tattoos; 