import { useState, useEffect, useCallback } from 'react';

export function useElementHeight(elementId: string): number {
  const [height, setHeight] = useState(0);

  const measureHeight = useCallback(() => {
    const element = document.getElementById(elementId);
    if (element) {
      setHeight(element.offsetHeight);
    }
  }, [elementId]);

  useEffect(() => {
    measureHeight();

    const element = document.getElementById(elementId);
    if (!element) return;

    const observer = new ResizeObserver(() => {
      measureHeight();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementId, measureHeight]);

  return height;
}
