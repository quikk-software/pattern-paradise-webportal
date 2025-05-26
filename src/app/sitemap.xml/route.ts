import { NextResponse } from 'next/server';
import { APP_DOMAIN } from '@/lib/constants';
import { listProducts } from '@/lib/api/static/product/listProducts';
import { listUsers } from '@/lib/api/static/user/listUsers';
import { getAccessTokenFromKeycloak } from '@/lib/auth/auth.utils';

export async function GET() {
  const staticRoutes = [
    { url: APP_DOMAIN, lastModified: new Date().toISOString() },
    { url: `${APP_DOMAIN}/about`, lastModified: new Date().toISOString() },
    { url: `${APP_DOMAIN}/pro`, lastModified: new Date().toISOString() },
    { url: `${APP_DOMAIN}/faq`, lastModified: new Date().toISOString() },
    { url: `${APP_DOMAIN}/help`, lastModified: new Date().toISOString() },
    { url: `${APP_DOMAIN}/how-to`, lastModified: new Date().toISOString() },
    {
      url: `${APP_DOMAIN}/app/products/mystery-patterns/crochet`,
      lastModified: new Date().toISOString(),
    },
    { url: `${APP_DOMAIN}/terms-and-privacy`, lastModified: new Date().toISOString() },
    { url: `${APP_DOMAIN}/auth/login`, lastModified: new Date().toISOString() },
    { url: `${APP_DOMAIN}/auth/registration`, lastModified: new Date().toISOString() },
    { url: `${APP_DOMAIN}/auth/reset-password`, lastModified: new Date().toISOString() },
  ];

  const accessToken = await getAccessTokenFromKeycloak();

  // Fetch products
  const products = await listProducts({
    overridePageNumber: 1,
    overridePageSize: 50000, // max limit for Google
  });

  const dynamicProductRoutes = products.map((product) => ({
    url: `${APP_DOMAIN}/app/products/${product.id}`,
    lastModified: product.updatedAt
      ? new Date(product.updatedAt).toISOString()
      : new Date().toISOString(),
  }));

  let dynamicUsersRoutes: {
    url: string;
    lastModified: string;
  }[] = [];
  if (accessToken) {
    // Fetch users
    const users = await listUsers(
      {
        overridePageNumber: 1,
        overridePageSize: 50000, // max limit for Google
      },
      accessToken,
    );

    dynamicUsersRoutes = users.map((user) => ({
      url: `${APP_DOMAIN}/users/${user.username}`,
      lastModified: user.updatedAt
        ? new Date(user.updatedAt).toISOString()
        : new Date().toISOString(),
    }));
  }

  const allRoutes = [...staticRoutes, ...dynamicProductRoutes, ...dynamicUsersRoutes];

  // Generate XML format
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allRoutes
      .map(
        (route) => `
      <url>
        <loc>${route.url}</loc>
        <lastmod>${route.lastModified}</lastmod>
      </url>
    `,
      )
      .join('')}
  </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
