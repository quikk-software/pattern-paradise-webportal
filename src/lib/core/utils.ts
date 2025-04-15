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

export const isInStandaloneMode = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.matchMedia('(display-mode: standalone)').matches;
};
