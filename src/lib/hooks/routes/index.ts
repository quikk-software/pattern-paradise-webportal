import type { Page } from './routes.types';
import { BreadcrumbConfig } from './routes.types';
import errorPages from '@/lib/hooks/routes/errorPages';
import { APP_DESCRIPTION } from '@/lib/constants';

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
    title: 'Home',
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
    title: 'FAQs | Pattern Paradise',
    pathname: '/faq',
    description:
      'Find answers to the most frequently asked questions about Pattern Paradise’s services.',
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
    title: 'My Profile | Pattern Paradise',
    pathname: '/app/secure/auth/me',
    description:
      'Update your profile, manage your account settings, and view your activities on Pattern Paradise.',
  },
  {
    title: 'Confirmation | Pattern Paradise',
    pathname: '/app/secure/auth/confirm',
    description: 'Your account confirmation at Pattern Paradise was successful. Welcome!',
  },
  {
    title: 'My Orders | Pattern Paradise',
    pathname: '/app/secure/auth/me/orders',
    description: 'View and manage all your orders placed through Pattern Paradise.',
  },
  {
    title: 'Open Incidents | Pattern Paradise',
    pathname: '/app/secure/auth/me/reports',
    description: 'Track and manage any open incidents or support issues on Pattern Paradise.',
  },
  {
    title: 'Order Details | Pattern Paradise',
    pathname: '/app/secure/auth/me/orders/[orderId]',
    description: 'View detailed information about a specific order on Pattern Paradise.',
  },
  {
    title: 'Reset Password | Pattern Paradise',
    pathname: '/auth/reset-password',
    description: 'Reset your password securely for your Pattern Paradise account.',
  },
  {
    title: 'Sell Patterns | Pattern Paradise',
    pathname: '/app/secure/sell',
    description: 'List and manage your patterns for sale on Pattern Paradise.',
  },
  {
    title: 'Submit a Pattern | Pattern Paradise',
    pathname: '/app/secure/sell/submit',
    description: 'Submit a new pattern for review and sale on Pattern Paradise.',
  },
  {
    title: 'Sales Orders | Pattern Paradise',
    pathname: '/app/secure/sell/orders',
    description: 'View and manage sales orders for your patterns on Pattern Paradise.',
  },
  {
    title: 'Tester Calls | Pattern Paradise',
    pathname: '/app/secure/sell/testings',
    description: 'Create and manage tester calls for your pattern designs on Pattern Paradise.',
  },
  {
    title: 'Edit Pattern | Pattern Paradise',
    pathname: '/app/secure/sell/products/[productId]',
    description: 'Edit and update your pattern listings on Pattern Paradise.',
  },
  {
    title: 'User Profile | Pattern Paradise',
    pathname: '/users/[userId]',
    description: 'View the profile of creators and designers on Pattern Paradise.',
  },
  {
    title: 'Tester Calls Hub | Pattern Paradise',
    pathname: '/app/tester-calls',
    description: 'Explore active tester calls and testing opportunities on Pattern Paradise.',
  },
  {
    title: 'My Testing Projects | Pattern Paradise',
    pathname: '/app/secure/test/testings',
    description: 'Manage all your pattern testing projects and participations on Pattern Paradise.',
  },
  {
    title: 'Pattern Details | Pattern Paradise',
    pathname: '/app/products/[productId]',
    description: 'View full details and explore pattern designs available on Pattern Paradise.',
  },

  ...errorPages,
];

export default flattenPages(pages);
export const breadcrumbConfig = createBreadcrumbConfig(pages);
