import type { Page } from "./routes.types";
import { BreadcrumbConfig } from "./routes.types";
import errorPages from "@/lib/hooks/routes/errorPages";

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
  parent: BreadcrumbConfig[] = []
): BreadcrumbConfig[][] => {
  const bcConfig: BreadcrumbConfig[][] = [];
  flattenPages(pages).forEach((p) => {
    if (p.children) {
      bcConfig.push(
        ...createBreadcrumbConfig(p.children, [
          { pathname: p.pathname, title: p.title },
          ...parent,
        ])
      );
    }
    bcConfig.push([{ pathname: p.pathname, title: p.title }, ...parent]);
  });
  return bcConfig;
};

const pages: Page[] = [
  {
    title: "Start",
    pathname: "/",
    description: "",
  },
  {
    title: "Anmeldung",
    pathname: "/auth/login",
    description: "",
  },
  {
    title: "Benutzerverwaltung",
    pathname: "/auth/user",
    description: "",
  },
  {
    title: "Passwort zurücksetzen",
    pathname: "/auth/reset-password",
    description: "",
  },

  ...errorPages,
];

export default flattenPages(pages);
export const breadcrumbConfig = createBreadcrumbConfig(pages);
