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

export function generateTitle(product: { title?: string; category?: string }): string {
  const normalizeWord = (word: string) =>
    word
      .toLowerCase()
      .replace(/[^a-z]/g, '')
      .replace(/ing$/, '');

  const seen = new Set<string>();
  const resultWords: string[] = [];

  const allWords = `${product.title}${product?.category ? ` ${product.category}` : ''}`
    .split(/\s+/)
    .filter(Boolean);

  for (const word of allWords) {
    const key = normalizeWord(word);
    if (key === 'pattern') continue;

    if (!seen.has(key)) {
      seen.add(key);
      resultWords.push(word);
    }
  }

  return resultWords.length > 0
    ? resultWords
        .map((w, i) => (i === 0 ? w[0].toUpperCase() + w.slice(1) : w))
        .join(' ')
        .toLowerCase()
    : (product?.title?.toLowerCase() ?? '');
}
