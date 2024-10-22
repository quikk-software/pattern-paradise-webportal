import React, { CSSProperties } from 'react';

type PageBase = {
  // The title of the page, that is also displayed in the meta tag.
  title: string;
  // The description of the page, that is also displayed in the meta tag.
  description: string;
  // Page specific styling for the Page Wrapper
  __dangerousPageSpecificStyling?: CSSProperties;
};

export type Page = PageBase & {
  // The path for current route file that comes after `/pages`.
  pathname: string;
  // Customized check to decide whether user is allowed to access page. If no function is provided, every user is allowed to access this page.
  authenticateUser?: (user: any) => boolean | Promise<boolean>;
  // Sub-pages of this particular page, used for breadcrumbs etc.
  children?: Page[];
};

export type PageProps = PageBase & {
  children: React.ReactNode;
};

export type BreadcrumbConfig = Pick<Page, 'title' | 'pathname'>;
