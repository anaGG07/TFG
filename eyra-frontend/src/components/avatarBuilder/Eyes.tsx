import React from 'react';

const Eyes: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'happy':
      return <>
        <ellipse cx="95" cy="130" rx="8" ry="6" fill="#222" />
        <ellipse cx="145" cy="130" rx="8" ry="6" fill="#222" />
      </>;
    case 'sleepy':
      return <>
        <ellipse cx="95" cy="135" rx="8" ry="3" fill="#222" />
        <ellipse cx="145" cy="135" rx="8" ry="3" fill="#222" />
      </>;
    case 'normal':
    default:
      return <>
        <ellipse cx="95" cy="130" rx="7" ry="7" fill="#222" />
        <ellipse cx="145" cy="130" rx="7" ry="7" fill="#222" />
      </>;
  }
};

export default Eyes; 