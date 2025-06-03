import { useState, useEffect, useCallback } from 'react';

export type ViewportMode = 'mobile' | 'tablet' | 'desktop';

export interface ViewportInfo {
  mode: ViewportMode;
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
} as const;

export const useViewport = () => {
  const [viewport, setViewport] = useState<ViewportInfo>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const height = typeof window !== 'undefined' ? window.innerHeight : 768;
    
    const getMode = (w: number): ViewportMode => {
      if (w < BREAKPOINTS.mobile) return 'mobile';
      if (w < BREAKPOINTS.tablet) return 'tablet';
      return 'desktop';
    };

    const mode = getMode(width);
    
    return {
      mode,
      width,
      height,
      isMobile: mode === 'mobile',
      isTablet: mode === 'tablet',
      isDesktop: mode === 'desktop',
    };
  });

  const updateViewport = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const mode = width < BREAKPOINTS.mobile ? 'mobile' : 
                 width < BREAKPOINTS.tablet ? 'tablet' : 'desktop';
    
    setViewport({
      mode,
      width,
      height,
      isMobile: mode === 'mobile',
      isTablet: mode === 'tablet',
      isDesktop: mode === 'desktop',
    });
  }, []);

  useEffect(() => {
    updateViewport();
    
    let timeoutId: number;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(updateViewport, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [updateViewport]);

  const isBreakpoint = useCallback((breakpoint: keyof typeof BREAKPOINTS) => {
    return viewport.width >= BREAKPOINTS[breakpoint];
  }, [viewport.width]);

  return {
    ...viewport,
    breakpoints: BREAKPOINTS,
    isBreakpoint,
  };
};
