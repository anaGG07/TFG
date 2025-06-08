import * as React from 'react';

// Iconos SVG personalizados para las fases del ciclo menstrual - Estilo minimalista
export const PhaseIcons: Record<string, (color: string) => React.ReactElement> = {
  menstrual: (color) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" fill={color} opacity="0.15"/>
      <circle cx="10" cy="10" r="8" stroke={color} strokeWidth="1.5" opacity="0.3"/>
      <circle cx="10" cy="7" r="2" fill={color} opacity="0.8"/>
      <circle cx="7" cy="11" r="1.5" fill={color} opacity="0.6"/>
      <circle cx="13" cy="11" r="1.5" fill={color} opacity="0.6"/>
      <circle cx="10" cy="13" r="1" fill={color} opacity="0.4"/>
    </svg>
  ),
  folicular: (color) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="2" fill={color} opacity="0.3"/>
      <circle cx="10" cy="10" r="4" stroke={color} strokeWidth="1.5" opacity="0.5"/>
      <circle cx="10" cy="10" r="7" stroke={color} strokeWidth="1" opacity="0.3" strokeDasharray="2 3"/>
      <circle cx="10" cy="6" r="1" fill={color} opacity="0.8"/>
      <circle cx="14" cy="10" r="1" fill={color} opacity="0.8"/>
      <circle cx="10" cy="14" r="1" fill={color} opacity="0.8"/>
      <circle cx="6" cy="10" r="1" fill={color} opacity="0.8"/>
    </svg>
  ),
  ovulacion: (color) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" stroke={color} strokeWidth="1.5" opacity="0.2"/>
      <circle cx="10" cy="10" r="5" fill={color} opacity="0.1"/>
      <circle cx="10" cy="10" r="5" stroke={color} strokeWidth="1.5" opacity="0.5"/>
      <circle cx="10" cy="10" r="2.5" fill={color} opacity="0.8"/>
      <circle cx="10" cy="10" r="1" fill="white"/>
    </svg>
  ),
  lutea: (color) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2 C10 2, 18 6, 18 10 C18 14, 14 18, 10 18 C6 18, 2 14, 2 10 C2 6, 10 2, 10 2Z" 
            fill={color} opacity="0.15"/>
      <path d="M10 2 C10 2, 18 6, 18 10 C18 14, 14 18, 10 18 C6 18, 2 14, 2 10 C2 6, 10 2, 10 2Z" 
            stroke={color} strokeWidth="1.5" opacity="0.5" fill="none"/>
      <circle cx="10" cy="10" r="3" fill={color} opacity="0.6"/>
      <circle cx="10" cy="10" r="1.5" fill={color} opacity="0.9"/>
    </svg>
  )
};
