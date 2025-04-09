import { useState, useEffect, useCallback } from 'react';

export function useElementHeight(elementId: string): number {
  const [height, setHeight] = useState(0);

  const measureHeight = useCallback(() => {
    if (typeof window !== 'undefined') {
      const element = document.getElementById(elementId);
      if (element) {
        setHeight(element.offsetHeight);
      }
    }
  }, [elementId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      measureHeight();

      const element = document.getElementById(elementId);
      if (!element) {
        return;
      }

      const observer = new ResizeObserver(() => {
        measureHeight();
      });

      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }
  }, [elementId, measureHeight]);

  return height;
}
