import React from 'react';

const Mouth: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'open':
      return <ellipse cx="120" cy="165" rx="14" ry="8" fill="#E57373" />;
    case 'sad':
      return <path d="M105 170 Q120 160 135 170" stroke="#7a2323" strokeWidth="3" fill="none" />;
    case 'smile':
    default:
      return <path d="M105 160 Q120 180 135 160" stroke="#7a2323" strokeWidth="3" fill="none" />;
  }
};

export default Mouth; 