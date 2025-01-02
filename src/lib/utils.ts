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
