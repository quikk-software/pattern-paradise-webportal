import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const buildQueryString = (obj: any) => {
  return Object.keys(obj)
    .filter((key) => obj[key] !== '' && obj[key] !== undefined && obj[key] !== null)
    .map((key: string) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
};

export function updateSelectedFlags(
  data: any,
  category: string,
  subCategories: { name: string; selected: boolean }[],
) {
  return data.map((item: any) => {
    if (item.name === category) {
      return {
        ...item,
        subcategories: item.subcategories.map((subcategory: any) => ({
          ...subcategory,
          options: subcategory.options.map((option: { name: string; selected: boolean }) => ({
            ...option,
            selected: subCategories.some((subCategory) => subCategory.name === option.name),
          })),
        })),
      };
    }
    return { ...item };
  });
}

export function isApp(window: Window) {
  const userAgent = window.navigator.userAgent;

  const isIOS = /iPhone|iPad|iPod/i.test(userAgent) && !/Mac OS X/i.test(userAgent);

  const isAndroid = /Android/i.test(userAgent);

  const isStandalone =
    navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

  return isIOS || isAndroid || isStandalone;
}

export function getAppType(window: Window) {
  const userAgent = window.navigator.userAgent;

  if (/iPhone|iPad|iPod/i.test(userAgent) && !/Mac OS X/i.test(userAgent)) {
    return 'IOS';
  }

  if (/Android/i.test(userAgent)) {
    return 'ANDROID';
  }

  if (navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
    return 'STANDALONE';
  }

  return undefined;
}
