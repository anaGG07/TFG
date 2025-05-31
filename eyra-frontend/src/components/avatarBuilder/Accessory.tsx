import React from 'react';

interface AccessoryProps {
  type: string;
  color: string;
}

const Accessory: React.FC<AccessoryProps> = ({ type, color }) => {
  switch (type) {
    case 'glasses':
      return <>
        <ellipse cx="75" cy="110" rx="14" ry="8" fill="none" stroke="#222" strokeWidth="2" />
        <ellipse cx="125" cy="110" rx="14" ry="8" fill="none" stroke="#222" strokeWidth="2" />
        <rect x="89" y="110" width="22" height="2" fill="#222" />
      </>;
    case 'hat':
      return <ellipse cx="100" cy="55" rx="50" ry="15" fill="#333" />;
    case 'earring':
      return (
        <>
          <circle cx="100" cy="180" r="5" fill={color} />
          <circle cx="220" cy="180" r="5" fill={color} />
        </>
      );
    case 'necklace':
      return (
        <path
          d="M140 220 Q160 230 180 220"
          stroke={color}
          strokeWidth="3"
          fill="none"
        />
      );
    case 'bowtie':
      return (
        <>
          <path
            d="M150 220 L140 230 L150 240"
            fill={color}
          />
          <path
            d="M170 220 L180 230 L170 240"
            fill={color}
          />
        </>
      );
    case 'tie':
      return (
        <path
          d="M160 220 L160 260 L150 270 L170 270 Z"
          fill={color}
        />
      );
    case 'scarf':
      return (
        <path
          d="M140 220 Q160 240 180 220 Q160 260 140 220"
          fill={color}
        />
      );
    case 'none':
    default:
      return null;
  }
};

export default Accessory; 