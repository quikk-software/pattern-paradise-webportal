import type { Page } from './routes.types';
import { BreadcrumbConfig } from './routes.types';
import errorPages from '@/lib/hooks/routes/errorPages';

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
    title: 'Start',
    pathname: '/',
    description: '',
  },
  {
    title: 'Pattern Paradise Pro',
    pathname: '/pro',
    description: '',
  },
  {
    title: 'About Pattern Paradise',
    pathname: '/about',
    description: '',
  },
  {
    title: 'Frequently asked questions on Pattern Paradise',
    pathname: '/faq',
    description: '',
  },
  {
    title: 'Imprint',
    pathname: '/imprint',
    description: '',
  },
  {
    title: 'Help',
    pathname: '/help',
    description: '',
  },
  {
    title: 'Privacy Policy, Terms and Conditions',
    pathname: '/terms-and-privacy',
    description: '',
  },
  {
    title: 'Login',
    pathname: '/auth/login',
    description: '',
  },
  {
    title: 'My profile',
    pathname: '/app/secure/auth/me',
    description: '',
  },
  {
    title: 'Confirmation',
    pathname: '/app/secure/auth/confirm',
    description: '',
  },
  {
    title: 'My orders',
    pathname: '/app/secure/auth/me/orders',
    description: '',
  },
  {
    title: 'Open incidents',
    pathname: '/app/secure/auth/me/reports',
    description: '',
  },
  {
    title: 'My order',
    pathname: '/app/secure/auth/me/orders/[orderId]',
    description: '',
  },
  {
    title: 'Reset password',
    pathname: '/auth/reset-password',
    description: '',
  },
  {
    title: 'Sell patterns',
    pathname: '/app/secure/sell',
    description: '',
  },
  {
    title: 'Submit a pattern',
    pathname: '/app/secure/sell/submit',
    description: '',
  },
  {
    title: 'My orders',
    pathname: '/app/secure/sell/orders',
    description: '',
  },
  {
    title: 'My tester calls',
    pathname: '/app/secure/sell/testings',
    description: '',
  },
  {
    title: 'Update your product',
    pathname: '/app/secure/sell/products/[productId]',
    description: '',
  },
  {
    title: "Seller's account",
    pathname: '/users/[userId]',
    description: '',
  },
  {
    title: 'Test patterns',
    pathname: '/app/secure/test',
    description: '',
  },
  {
    title: 'My testings',
    pathname: '/app/secure/test/testings',
    description: '',
  },
  {
    title: 'Pattern',
    pathname: '/app/products/[productId]',
    description: '',
  },

  ...errorPages,
];

export default flattenPages(pages);
export const breadcrumbConfig = createBreadcrumbConfig(pages);
