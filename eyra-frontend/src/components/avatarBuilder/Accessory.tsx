import React from 'react';

const Accessory: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'glasses':
      return <>
        <ellipse cx="75" cy="110" rx="14" ry="8" fill="none" stroke="#222" strokeWidth="2" />
        <ellipse cx="125" cy="110" rx="14" ry="8" fill="none" stroke="#222" strokeWidth="2" />
        <rect x="89" y="110" width="22" height="2" fill="#222" />
      </>;
    case 'hat':
      return <ellipse cx="100" cy="55" rx="50" ry="15" fill="#333" />;
    case 'none':
    default:
      return null;
  }
};

export default Accessory; 