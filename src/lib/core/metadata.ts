import { Metadata } from 'next';
import pages from '@/lib/hooks/routes';
import { APP_DESCRIPTION, APP_DOMAIN, APP_NAME, APP_TITLE, THEME_COLOR } from '@/lib/constants';

export function generatePageMetadata(pathname: string, language: string): Metadata {
  const page = pages.find((page) => page.pathname === `/${language}${pathname}`);

  const title = page?.title ?? APP_NAME;
  const description = page?.description ?? APP_DESCRIPTION;
  const url = APP_DOMAIN + pathname;

  return {
    title,
    description,
    applicationName: APP_TITLE,
    appleWebApp: {
      title,
      capable: true,
      statusBarStyle: 'black-translucent',
    },
    formatDetection: {
      telephone: false,
    },
    icons: {
      icon: '/favicons/favicon.ico?v=3',
      shortcut: '/favicon.ico?v=3',
      apple: '/icons/ios/512.png',
      other: [
        { rel: 'apple-touch-icon', url: '/favicons/apple-icon-152x152.png', sizes: '152x152' },
        { rel: 'apple-touch-icon', url: '/favicons/apple-icon-180x180.png', sizes: '180x180' },
        { rel: 'manifest', url: '/manifest.webmanifest' },
      ],
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url,
      siteName: title,
      images: [
        {
          url: `${APP_DOMAIN}/favicons/apple-icon-precomposed.png`,
          width: 1200,
          height: 1200,
        },
        {
          url: `${APP_DOMAIN}/banners/pattern-paradise-banner.jpeg`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: APP_NAME,
      description: APP_DESCRIPTION,
      images: [`${APP_DOMAIN}/favicons/android-icon-192x192.png`],
      creator: '@patternparadis3',
    },
    manifest: '/manifest.webmanifest',
    other: {
      'mobile-web-app-capable': 'yes',
      'msapplication-config': '/favicons/browserconfig.xml',
      'msapplication-TileColor': THEME_COLOR,
      'msapplication-tap-highlight': 'no',
    },
  };
}
