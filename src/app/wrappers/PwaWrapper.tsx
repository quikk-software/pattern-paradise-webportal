import React, { useEffect } from 'react';

export default function PwaWrapper() {
  const isPWAInstalled = () => {
    const isIOS = (window.navigator as any)?.standalone === true;
    const isAndroid = window.matchMedia('(display-mode: standalone)').matches;

    return isIOS || isAndroid;
  };

  useEffect(() => {
    if (isPWAInstalled()) {
      const bottomNav = document.getElementById('bottom-nav');

      // For iOS, usually you need extra space for the safe area (around 20-40px)
      const safeAreaPadding = 20;

      // For Android, check if there is a notch and apply padding accordingly
      const androidPadding = window.innerHeight - (window as any)?.visualViewport.height;

      const extraPadding = Math.max(safeAreaPadding, androidPadding);

      if (!!bottomNav) {
        bottomNav.style.paddingBottom = `${extraPadding}px`;
      }
    }
  }, []);

  return <></>;
}
