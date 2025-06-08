import * as React from 'react';

export const IconCancel = ({ color = '#C62328', size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="14" cy="14" r="12" />
    <line x1="9" y1="9" x2="19" y2="19" />
    <line x1="19" y1="9" x2="9" y2="19" />
  </svg>
);

export const IconSave = ({ color = '#C62328', size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="5" width="18" height="18" rx="3" />
    <path d="M9 13h10" />
    <path d="M14 13v6" />
  </svg>
);

export const IconRandom = ({ color = '#C62328', size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="20" height="20" rx="5" />
    <circle cx="9" cy="9" r="1.5" fill={color} />
    <circle cx="19" cy="9" r="1.5" fill={color} />
    <circle cx="9" cy="19" r="1.5" fill={color} />
    <circle cx="19" cy="19" r="1.5" fill={color} />
    <circle cx="14" cy="14" r="1.5" fill={color} />
  </svg>
); 