import React from 'react';

const Eyebrows: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'up':
      return <>
        <path d="M85 120 Q95 110 105 120" stroke="#222" strokeWidth="4" fill="none" />
        <path d="M135 120 Q145 110 155 120" stroke="#222" strokeWidth="4" fill="none" />
      </>;
    case 'down':
      return <>
        <path d="M85 115 Q95 125 105 115" stroke="#222" strokeWidth="4" fill="none" />
        <path d="M135 115 Q145 125 155 115" stroke="#222" strokeWidth="4" fill="none" />
      </>;
    case 'angry':
      return <>
        <path d="M85 120 Q95 115 105 125" stroke="#222" strokeWidth="4" fill="none" />
        <path d="M135 125 Q145 115 155 120" stroke="#222" strokeWidth="4" fill="none" />
      </>;
    default:
      return null;
  }
};

export default Eyebrows; 