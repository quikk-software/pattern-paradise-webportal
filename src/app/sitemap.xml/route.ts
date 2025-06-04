import { NextResponse } from 'next/server';
import { APP_DOMAIN } from '@/lib/constants';
import { listProducts } from '@/lib/api/static/product/listProducts';
import { listUsers } from '@/lib/api/static/user/listUsers';
import { getAccessTokenFromKeycloak } from '@/lib/auth/auth.utils';

const SUPPORTED_LOCALES = ['en', 'de'];

export async function GET() {
  const now = new Date().toISOString();

  const accessToken = await getAccessTokenFromKeycloak();

  const products = await listProducts({
    overridePageNumber: 1,
    overridePageSize: 50000,
  });

  const productRoutes = products.map((product) => ({
    path: `/app/products/${product.id}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt).toISOString() : now,
  }));

  let userRoutes: { path: string; lastModified: string }[] = [];
  if (accessToken) {
    const users = await listUsers(
      {
        overridePageNumber: 1,
        overridePageSize: 50000,
      },
      accessToken,
    );

    userRoutes = users.map((user) => ({
      path: `/users/${user.username}`,
      lastModified: user.updatedAt ? new Date(user.updatedAt).toISOString() : now,
    }));
  }

  const staticPaths = [
    '/',
    '/swipe',
    '/browse',
    '/browse?sortBy=mostRelevant&maxPrice=0&craft=Crocheting',
    '/browse?sortBy=mostRelevant&maxPrice=0&craft=Knitting',
    '/about',
    '/pro',
    '/faq',
    '/help',
    '/how-to',
    '/app/products/mystery-patterns/crochet',
    '/terms-and-privacy',
    '/auth/login',
    '/auth/registration',
    '/auth/reset-password',
  ];

  const staticRoutes = staticPaths.map((path) => ({
    path,
    lastModified: now,
  }));

  const allRoutes = [...staticRoutes, ...productRoutes, ...userRoutes];

  const localizedRoutes = allRoutes.flatMap(({ path, lastModified }) =>
    SUPPORTED_LOCALES.map((locale) => ({
      url: `${APP_DOMAIN}/${locale}${path}`,
      lastModified,
    })),
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${localizedRoutes
    .map(
      (route) => `
    <url>
      <loc>${route.url}</loc>
      <lastmod>${route.lastModified}</lastmod>
    </url>`,
    )
    .join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
