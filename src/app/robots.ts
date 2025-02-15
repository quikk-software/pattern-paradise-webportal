import type { MetadataRoute } from 'next';
import { APP_DOMAIN } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/app/secure/',
    },
    sitemap: `${APP_DOMAIN}/sitemap.xml`,
  };
}
