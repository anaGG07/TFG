import * as React from 'react';

// Iconos SVG para emociones
export const MoodIcons: Record<string, (color: string) => React.ReactElement> = {
  feliz: (color) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13" />
      <path d="M11 20c1.5 2 7.5 2 9 0" />
      <circle cx="12" cy="14" r="1.2" fill={color} />
      <circle cx="20" cy="14" r="1.2" fill={color} />
    </svg>
  ),
  cansada: (color) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13" />
      <path d="M11 22c2-2 8-2 10 0" />
      <path d="M12 14l2 2m0-2l-2 2" />
      <path d="M20 14l2 2m0-2l-2 2" />
    </svg>
  ),
  irritable: (color) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13" />
      <path d="M11 22c2-2 8-2 10 0" />
      <path d="M12 14c0-1 2-1 2 0" />
      <path d="M20 14c0-1 2-1 2 0" />
    </svg>
  ),
  triste: (color) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13" />
      <path d="M11 22c1.5-2 7.5-2 9 0" />
      <path d="M12 14c0-1 2-1 2 0" />
      <path d="M20 14c0-1 2-1 2 0" />
    </svg>
  ),
  motivada: (color) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13" />
      <path d="M10 20c2-4 10-4 12 0" />
      <path d="M16 12v6" />
      <path d="M16 12l-2 2" />
      <path d="M16 12l2 2" />
    </svg>
  ),
  tranquila: (color) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13" />
      <path d="M11 20c2 2 8 2 10 0" />
      <path d="M12 14c0-1.2 2-1.2 2 0" />
      <path d="M20 14c0-1.2 2-1.2 2 0" />
    </svg>
  ),
  sensible: (color) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13" />
      <path d="M11 22c1.5-2 7.5-2 9 0" />
      <circle cx="12" cy="14" r="1.2" fill={color} />
      <circle cx="20" cy="14" r="1.2" fill={color} />
      <path d="M21.5 16.5c0 1 .7 1.5 1.2 2" stroke={color} strokeWidth="1.2" />
    </svg>
  ),
};

// Iconos SVG para síntomas
export const SymptomIcons: Record<string, (color: string) => React.ReactElement> = {
  'Dolor abdominal': (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="12" rx="8" ry="6" />
      <path d="M8 12c1-2 7-2 8 0" />
    </svg>
  ),
  'Fatiga': (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="10" width="16" height="8" rx="4" />
      <path d="M8 14h8" />
    </svg>
  ),
  'Dolor de cabeza': (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2 2" />
    </svg>
  ),
  'Hinchazón': (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="14" rx="7" ry="4" />
      <ellipse cx="12" cy="10" rx="4" ry="2" />
    </svg>
  ),
  'Náuseas': (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M8 16c2-2 6-2 8 0" />
      <path d="M10 10h.01" />
      <path d="M14 10h.01" />
    </svg>
  ),
  'Sensibilidad en senos': (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="8" cy="14" rx="3" ry="2" />
      <ellipse cx="16" cy="14" rx="3" ry="2" />
      <path d="M8 14v2" />
      <path d="M16 14v2" />
    </svg>
  ),
  'Cambios de humor': (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M8 16c1.5-2 6.5-2 8 0" />
      <path d="M10 10h.01" />
      <path d="M14 10h.01" />
    </svg>
  ),
};

// Iconos SVG para rituales
export const RitualIcons: Record<string, (color: string) => React.ReactElement> = {
  moon: (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  ),
  sun: (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  ),
  star: (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  heart: (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}; 