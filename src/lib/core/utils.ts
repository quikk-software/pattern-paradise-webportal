export const combineArraysById = (array1: any[], array2: any[], identifier: string) => {
  const uniqueItems = new Map<number, any>();

  [array1, array2].flat().forEach((item) => uniqueItems.set(item?.[identifier], item));

  return Array.from(uniqueItems.values());
};

export const isPathnameInPages = (pathname: string, pages: string[]) => {
  return pages.some((page) => {
    const regexPattern = page.replace(/\[.*?\]/g, '[^/]+');
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(pathname);
  });
};

export const checkProStatus = (subscriptionStatus: string) =>
  subscriptionStatus !== 'Inactive' && subscriptionStatus !== '';

export const isIOSMode = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const userAgent = navigator.userAgent || navigator.vendor;

  return userAgent.includes('PWAShell');
};

export const isInStandaloneMode = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const isDisplayStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIosStandalone = 'standalone' in navigator && (navigator as any).standalone;

  const userAgent = navigator.userAgent || navigator.vendor;

  // Detect iOS WebView
  const isIosWebView =
    /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(userAgent) ||
    userAgent.includes('PWAShell');

  // Detect Android WebView
  const isAndroidWebView =
    /\bwv\b/.test(userAgent) || // Classic WebView marker
    /; wv\)/i.test(userAgent) || // Some OEM apps
    /\bVersion\/[\d.]+\b(?!.*Chrome)/i.test(userAgent);

  // Detect some hybrid frameworks or embedded browsers
  const isLikelyHybridApp =
    /; wv\)/i.test(userAgent) || /Crosswalk|Cordova|Capacitor/i.test(userAgent);

  return (
    isDisplayStandalone || isIosStandalone || isIosWebView || isAndroidWebView || isLikelyHybridApp
  );
};
