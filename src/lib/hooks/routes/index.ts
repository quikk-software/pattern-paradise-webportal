import type { Page } from './routes.types';
import { BreadcrumbConfig } from './routes.types';
import errorPages from '@/lib/hooks/routes/errorPages';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/constants';

const flattenPages = (pages: Page[]) => {
  const flattenedPages: Page[] = [];
  pages.forEach((p) => {
    flattenedPages.push(p);
    if (p.children) {
      flattenedPages.push(...flattenPages(p.children));
    }
  });
  return flattenedPages;
};

const createBreadcrumbConfig = (
  pages: Page[],
  parent: BreadcrumbConfig[] = [],
): BreadcrumbConfig[][] => {
  const bcConfig: BreadcrumbConfig[][] = [];
  flattenPages(pages).forEach((p) => {
    if (p.children) {
      bcConfig.push(
        ...createBreadcrumbConfig(p.children, [
          { pathname: p.pathname, title: p.title },
          ...parent,
        ]),
      );
    }
    bcConfig.push([{ pathname: p.pathname, title: p.title }, ...parent]);
  });
  return bcConfig;
};

const pages: Page[] = [
  {
    title: APP_NAME,
    pathname: '/',
    description: APP_DESCRIPTION,
  },
  {
    title: 'Pattern Paradise Pro | Pattern Paradise',
    pathname: '/pro',
    description:
      'Unlock powerful features with Pattern Paradise Pro and boost your creative business.',
  },
  {
    title: 'About Us | Pattern Paradise',
    pathname: '/about',
    description:
      'Learn about Pattern Paradise’s mission to empower creators with stunning patterns.',
  },
  {
    title: 'How To | Pattern Paradise',
    pathname: '/how-to',
    description:
      'Discover how to use Pattern Paradise with easy guides for uploading patterns, joining tester calls, and collaborating with the crafting community.',
  },
  {
    title: 'Imprint | Pattern Paradise',
    pathname: '/imprint',
    description: 'View official legal information and company details for Pattern Paradise.',
  },
  {
    title: 'Help Center | Pattern Paradise',
    pathname: '/help',
    description: 'Get help and find support resources for using Pattern Paradise effectively.',
  },
  {
    title: 'Privacy Policy & Terms | Pattern Paradise',
    pathname: '/terms-and-privacy',
    description: 'Review Pattern Paradise’s privacy policies and terms and conditions.',
  },
  {
    title: 'Login | Pattern Paradise',
    pathname: '/auth/login',
    description: 'Access your Pattern Paradise account to manage your profile, orders, and more.',
  },
  {
    title: 'Reset Password | Pattern Paradise',
    pathname: '/auth/reset-password',
    description: 'Reset your password securely for your Pattern Paradise account.',
  },
  {
    title: 'Tester Calls Hub | Pattern Paradise',
    pathname: '/app/tester-calls',
    description: 'Explore active tester calls and testing opportunities on Pattern Paradise.',
  },
  {
    title: 'Mystery Pattern | Pattern Paradise',
    pathname: '/app/mystery',
    description:
      'Shop exclusive mystery patterns and enjoy surprise designs from Pattern Paradise.',
  },
  {
    title: 'Swipe Patterns | Pattern Paradise',
    pathname: '/swipe',
    description:
      'Discover new patterns by swiping — a fun and unique browsing experience at Pattern Paradise.',
  },
  {
    title: 'Browse Patterns | Pattern Paradise',
    pathname: '/browse',
    description:
      'Use advanced filters to find and select the perfect patterns on Pattern Paradise.',
  },

  ...errorPages,
];

export default flattenPages(pages);
export const breadcrumbConfig = createBreadcrumbConfig(pages);
