import { useState, useEffect } from 'react';

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState('xs');

  useEffect(() => {
    const detectScreenSize = () => {
      const width = window.innerWidth;

      if (width >= breakpoints['2xl']) setScreenSize('2xl');
      else if (width >= breakpoints.xl) setScreenSize('xl');
      else if (width >= breakpoints.lg) setScreenSize('lg');
      else if (width >= breakpoints.md) setScreenSize('md');
      else if (width >= breakpoints.sm) setScreenSize('sm');
      else setScreenSize('xs');
    };

    detectScreenSize();

    window.addEventListener('resize', detectScreenSize);

    return () => window.removeEventListener('resize', detectScreenSize);
  }, []);

  return screenSize;
};

export default useScreenSize;
