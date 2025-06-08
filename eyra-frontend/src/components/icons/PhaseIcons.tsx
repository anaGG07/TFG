import * as React from 'react';

// Iconos SVG personalizados para las fases del ciclo menstrual
export const PhaseIcons: Record<string, (color: string) => React.ReactElement> = {
  menstrual: (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C12 2 8 8 8 13C8 15.2091 9.79086 17 12 17C14.2091 17 16 15.2091 16 13C16 8 12 2 12 2Z" 
            stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 17V22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 19L12 22L16 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="13" r="1.5" fill={color} opacity="0.3"/>
    </svg>
  ),
  folicular: (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/>
      <path d="M12 2V9" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 15V22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M4.22 4.22L8.95 8.95" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M15.05 15.05L19.78 19.78" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M2 12H9" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M15 12H22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M4.22 19.78L8.95 15.05" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M15.05 8.95L19.78 4.22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  ovulacion: (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="2" strokeDasharray="2 2" opacity="0.5"/>
      <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.1"/>
      <circle cx="12" cy="12" r="2" fill={color}/>
      <path d="M12 4L13.5 7L16.5 5.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20 12L17 13.5L18.5 16.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 20L10.5 17L7.5 18.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 12L7 10.5L5.5 7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  lutea: (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3C16.5 3 20 7 20 12C20 14.5 18.5 16.5 16.5 17.5C15 18.5 13 19 11 18.5C7.5 17.5 5 14.5 5 11C5 9 5.5 7.5 6.5 6.5C7 6 7.5 5.5 8 5.5C8.5 5.5 9 6 9 6.5C9 7 8.5 7.5 8 7.5C7.5 7.5 7 8 7 8.5C7 9.5 8 10.5 9 10.5C10.5 10.5 11.5 9 11.5 7.5C11.5 5.5 10 4 8.5 4.5" 
            stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="16" cy="9" r="1" fill={color}/>
      <circle cx="13" cy="15" r="1" fill={color}/>
      <circle cx="9" cy="13" r="0.5" fill={color}/>
    </svg>
  )
};
