import React from 'react';

const Accessories: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'earring':
      return <circle cx="170" cy="170" r="6" fill="#FFD700" />;
    case 'necklace':
      return <ellipse cx="120" cy="210" rx="30" ry="8" fill="#FFD700" />;
    case 'none':
    default:
      return null;
  }
};

export default Accessories; 