export const APP_NAME = 'Pattern Paradise';
export const APP_DESCRIPTION = 'Find, sell and test patterns from creatives around the world!';
export const APP_DOMAIN = 'https://pattern-paradise.shop';
export const THEME_COLOR = '#ed8332';

export const PRO_MEMBERSHIP_PRICE = '$9.99';

export const SUPPORT_EMAIL = 'help@pattern-paradise.shop';

export const CATEGORIES = ['Crocheting', 'Knitting'];

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
export const PASSWORD_REGEX_MESSAGE =
  'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character';

export type ProductFilterObject = {
  q?: string;
  status?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  pageNumber?: number;
  pageSize?: number;
};

export type TesterApplicationFilterObject = {
  direction: 'asc' | 'desc';
  sortKey: 'updatedAt' | 'assignedAt';
  filter: string[];
  status?: string[];
};
