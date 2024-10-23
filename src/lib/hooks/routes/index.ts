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
    title: 'Login',
    pathname: '/auth/login',
    description: '',
  },
  {
    title: 'Profile',
    pathname: '/auth/user',
    description: '',
  },
  {
    title: 'Reset password',
    pathname: '/auth/reset-password',
    description: '',
  },
  {
    title: 'Sell patterns',
    pathname: '/sell',
    description: '',
  },
  {
    title: 'Submit a pattern',
    pathname: '/sell/submit',
    description: '',
  },
  {
    title: 'Your orders',
    pathname: '/sell/orders',
    description: '',
  },
  {
    title: 'Your testings',
    pathname: '/sell/testings',
    description: '',
  },
  {
    title: 'Test patterns',
    pathname: '/test',
    description: '',
  },
  {
    title: 'Pattern',
    pathname: '/products/[productId]',
    description: '',
  },

  ...errorPages,
];

export default flattenPages(pages);
export const breadcrumbConfig = createBreadcrumbConfig(pages);
