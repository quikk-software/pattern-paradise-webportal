export const APP_NAME = 'Pattern Paradise';
export const APP_DESCRIPTION = 'Find, sell and test patterns from creatives around the world!';
export const APP_DOMAIN = 'https://pattern-paradise.shop';
export const THEME_COLOR = '#ed8332';

export const PRO_MEMBERSHIP_PRICE = '$9.99';

export const SUPPORT_EMAIL = 'help@pattern-paradise.shop';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Professional';
export const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Professional'];
export enum ExperienceLevels {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Professional = 'Professional',
}

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
  subCategories?: string[];
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

export const reportProductReasons = [
  {
    value: 'COPYRIGHT_INFRINGEMENT',
    label: 'Copyright Infringement',
    description:
      'The product violates copyright laws or uses copyrighted material without permission.',
  },
  {
    value: 'TRADEMARK_VIOLATION',
    label: 'Trademark Violation',
    description: 'The product uses trademarked names, logos, or designs without authorization.',
  },
  {
    value: 'INAPPROPRIATE_CONTENT',
    label: 'Inappropriate Content',
    description: 'The product contains offensive, explicit, or inappropriate material.',
  },
  {
    value: 'MISLEADING_OR_FALSE_DESCRIPTION',
    label: 'Misleading or False Description',
    description: "The product's description or details are inaccurate or deliberately misleading.",
  },
  {
    value: 'DUPLICATE_CONTENT',
    label: 'Duplicate Content',
    description:
      'The product is a duplicate or very similar to an existing product on the platform.',
  },
  {
    value: 'BROKEN_OR_INCOMPLETE_FILES',
    label: 'Broken or Incomplete Files',
    description: "The product's files are corrupted, incomplete, or don't work as described.",
  },
  {
    value: 'LOW_QUALITY_OR_ERRORS',
    label: 'Low Quality or Errors',
    description: 'The product is of poor quality or contains significant errors or issues.',
  },
  {
    value: 'UNAPPROVED_FORMATS',
    label: 'Unapproved Formats',
    description: 'The product uses file formats or structures that are not approved or supported.',
  },
  {
    value: 'VIOLATES_AUP',
    label: 'Violates Acceptable Use Policy',
    description: "The product violates the platform's Acceptable Use Policy in some way.",
  },
] as const;

export type ReportProductReason = (typeof reportProductReasons)[number]['value'];

export const reportUserReasons = [
  {
    value: 'FRAUDULENT_ACTIVITY',
    label: 'Fraudulent Activity',
    description: 'The user is engaging in deceptive or fraudulent practices on the platform.',
  },
  {
    value: 'IMPERSONATION',
    label: 'Impersonation',
    description: 'The user is pretending to be someone else or a different entity.',
  },
  {
    value: 'INAPPROPRIATE_BEHAVIOR',
    label: 'Inappropriate Behavior',
    description:
      'The user is exhibiting offensive, abusive, or inappropriate behavior towards others.',
  },
  {
    value: 'UNSOLICITED_PROMOTIONS_SPAM',
    label: 'Unsolicited Promotions or Spam',
    description: 'The user is sending unwanted promotional content or spamming others.',
  },
  {
    value: 'SUSPICIOUS_ACTIVITY',
    label: 'Suspicious Activity',
    description:
      "The user's actions or behavior on the platform seem suspicious or potentially harmful.",
  },
  {
    value: 'SELLING_PROHIBITED_CONTENT',
    label: 'Selling Prohibited Content',
    description:
      'The user is attempting to sell or distribute content that is not allowed on the platform.',
  },
  {
    value: 'MULTIPLE_VIOLATIONS',
    label: 'Multiple Violations',
    description: 'The user has repeatedly violated platform rules or guidelines.',
  },
  {
    value: 'INCOMPLETE_PROFILE_OR_FAKE_INFORMATION',
    label: 'Incomplete Profile or Fake Information',
    description: "The user's profile is incomplete or contains false information.",
  },
  {
    value: 'VIOLATION_OF_AUP',
    label: 'Violation of Acceptable Use Policy',
    description: "The user has violated the platform's Acceptable Use Policy in some way.",
  },
] as const;

export type ReportUserReason = (typeof reportUserReasons)[number]['value'];
