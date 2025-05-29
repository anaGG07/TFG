import React from 'react';

interface GlassesProps {
  type: string;
  opacity: string;
}

const Glasses: React.FC<GlassesProps> = ({ type, opacity }) => {
  if (type === 'none') return null;
  if (type === 'round') {
    return <>
      <ellipse cx="95" cy="130" rx="16" ry="12" fill="#fff" fillOpacity={Number(opacity)} stroke="#222" strokeWidth="2" />
      <ellipse cx="145" cy="130" rx="16" ry="12" fill="#fff" fillOpacity={Number(opacity)} stroke="#222" strokeWidth="2" />
      <rect x="111" y="130" width="18" height="2" fill="#222" />
    </>;
  }
  if (type === 'square') {
    return <>
      <rect x="80" y="120" width="30" height="20" rx="5" fill="#fff" fillOpacity={Number(opacity)} stroke="#222" strokeWidth="2" />
      <rect x="130" y="120" width="30" height="20" rx="5" fill="#fff" fillOpacity={Number(opacity)} stroke="#222" strokeWidth="2" />
      <rect x="111" y="130" width="18" height="2" fill="#222" />
    </>;
  }
  return null;
};

export default Glasses; 