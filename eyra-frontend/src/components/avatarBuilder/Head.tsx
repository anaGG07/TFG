import React from 'react';

const skinColors: Record<string, string> = {
  light: '#FCD7B6',
  tan: '#E0A96D',
  dark: '#8D5524',
};

const Head: React.FC<{ skin: string }> = ({ skin }) => (
  <ellipse cx="100" cy="100" rx="60" ry="70" fill={skinColors[skin] || skinColors.light} />
);

export default Head; 