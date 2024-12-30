export const APP_NAME = 'Pattern Paradise';
export const APP_DESCRIPTION = 'Find, sell and test patterns from creatives around the world!';
export const APP_DOMAIN = 'https://pattern-paradise.shop';
export const THEME_COLOR = '#ed8332';

export const PRO_MEMBERSHIP_PRICE = '$9.99';

export const SUPPORT_EMAIL = 'help@pattern-paradise.shop';

export const CATEGORIES = [
  {
    name: 'Crocheting',
    subcategories: [
      {
        name: 'Project Type',
        options: [
          { name: 'Clothing', selected: false },
          { name: 'Accessories', selected: false },
          { name: 'Home Decor', selected: false },
          { name: 'Toys/Amigurumi', selected: false },
          { name: 'Seasonal/Holiday Items', selected: false },
        ],
      },
      {
        name: 'Yarn Weight',
        options: [
          { name: 'Lace', selected: false },
          { name: 'Fingering', selected: false },
          { name: 'Sport', selected: false },
          { name: 'DK (Double Knitting)', selected: false },
          { name: 'Worsted', selected: false },
          { name: 'Bulky', selected: false },
          { name: 'Super Bulky', selected: false },
        ],
      },
      {
        name: 'Recipient',
        options: [
          { name: 'Women', selected: false },
          { name: 'Men', selected: false },
          { name: 'Children', selected: false },
          { name: 'Babies', selected: false },
          { name: 'Pets', selected: false },
        ],
      },
      {
        name: 'Techniques',
        options: [
          { name: 'Tunisian Crochet', selected: false },
          { name: 'Filet Crochet', selected: false },
          { name: 'Overlay Crochet', selected: false },
          { name: 'Mosaic Crochet', selected: false },
          { name: 'Granny Squares', selected: false },
        ],
      },
      {
        name: 'Pattern Type',
        options: [
          { name: 'Shawls', selected: false },
          { name: 'Scarves', selected: false },
          { name: 'Hats', selected: false },
          { name: 'Bags', selected: false },
          { name: 'Blankets', selected: false },
        ],
      },
      {
        name: 'Special Features',
        options: [
          { name: 'Seamless Patterns', selected: false },
          { name: 'Quick Projects', selected: false },
          { name: 'Scrap Yarn Projects', selected: false },
        ],
      },
    ],
  },
  {
    name: 'Knitting',
    subcategories: [
      {
        name: 'Project Type',
        options: [
          { name: 'Clothing', selected: false },
          { name: 'Accessories', selected: false },
          { name: 'Home Decor', selected: false },
          { name: 'Toys/Amigurumi', selected: false },
          { name: 'Seasonal/Holiday Items', selected: false },
        ],
      },
      {
        name: 'Yarn Weight',
        options: [
          { name: 'Lace', selected: false },
          { name: 'Fingering', selected: false },
          { name: 'Sport', selected: false },
          { name: 'DK (Double Knitting)', selected: false },
          { name: 'Worsted', selected: false },
          { name: 'Bulky', selected: false },
          { name: 'Super Bulky', selected: false },
        ],
      },
      {
        name: 'Recipient',
        options: [
          { name: 'Women', selected: false },
          { name: 'Men', selected: false },
          { name: 'Children', selected: false },
          { name: 'Babies', selected: false },
          { name: 'Pets', selected: false },
        ],
      },
      {
        name: 'Techniques',
        options: [
          { name: 'Lace Knitting', selected: false },
          { name: 'Fair Isle/Colorwork', selected: false },
          { name: 'Cables', selected: false },
          { name: 'Brioche', selected: false },
          { name: 'Double Knitting', selected: false },
        ],
      },
      {
        name: 'Pattern Type',
        options: [
          { name: 'Sweaters', selected: false },
          { name: 'Cardigans', selected: false },
          { name: 'Socks', selected: false },
          { name: 'Mittens/Gloves', selected: false },
          { name: 'Cowls', selected: false },
          { name: 'Lace Knitting', selected: false },
        ],
      },
      {
        name: 'Special Features',
        options: [
          { name: 'Top-Down Construction', selected: false },
          { name: 'Knit-in-the-Round', selected: false },
          { name: 'One-Skein Projects', selected: false },
        ],
      },
    ],
  },
];

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
export const PASSWORD_REGEX_MESSAGE =
  'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character';

export type ProductFilterObject = {
  q?: string;
  status?: string;
  categories?: string[];
  hashtags?: string[];
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

export const HASHTAG_LIMIT = 10;
export const IMAGE_LIMIT = 6;
