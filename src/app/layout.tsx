import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { BottomNavigation } from '@/components/bottom-navigation';
import { APP_DESCRIPTION, APP_DOMAIN, APP_NAME, THEME_COLOR } from '@/lib/constants';
import StoreProvider from '@/app/providers/StoreProvider';
import { getAccessTokenUsingRefreshToken, isTokenValid } from '@/lib/auth/auth.utils';
import CookieConsentBanner from '@/lib/components/CookieConsentBanner';
import logger from '@/lib/core/logger';
import { CookiesProvider } from 'next-client-cookies/server';
import { Cookies } from 'next-client-cookies';
import { getCookies } from 'next-client-cookies/server';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  icons: {
    icon: '/favicons/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicons/apple-touch-icon.png',
    other: [{ rel: 'manifest', url: '/favicons/manifest.json' }],
  },
};

async function refreshAccessToken(refreshToken: string, cookieStore: Cookies) {
  try {
    await getAccessTokenUsingRefreshToken(refreshToken, cookieStore);
  } catch (error) {
    logger.error('Error during token refresh:', error);
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await getCookies();
  const accessToken = cookieStore.get('accessToken');
  const refreshToken = cookieStore.get('refreshToken');

  if (!accessToken || !isTokenValid(accessToken)) {
    if (refreshToken && isTokenValid(refreshToken)) {
      await refreshAccessToken(refreshToken, cookieStore);
    }
  }

  return (
    <html lang="en">
      <head>
        <meta name="application-name" content={APP_NAME} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
        <meta name="description" content={APP_DESCRIPTION} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content={THEME_COLOR} />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content={THEME_COLOR} />

        <link rel="apple-touch-icon" href="/favicons/apple-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/favicons/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-icon-180x180.png" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />

        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content={APP_DOMAIN} />
        <meta name="twitter:title" content={APP_NAME} />
        <meta name="twitter:description" content={APP_DESCRIPTION} />
        <meta name="twitter:image" content={`${APP_DOMAIN}/favicons/android-icon-192x192.png`} />
        <meta name="twitter:creator" content="@PatternParadise" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={APP_NAME} />
        <meta property="og:description" content={APP_DESCRIPTION} />
        <meta property="og:site_name" content={APP_NAME} />
        <meta property="og:url" content={APP_DOMAIN} />
        <meta property="og:image" content={`${APP_DOMAIN}/favicons/apple-icon-precomposed.png`} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0, minimum-scale=1.0"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}>
        <CookiesProvider>
          <div className="flex flex-col h-dvh">
            <div className="flex-1 overflow-auto">
              <StoreProvider>{children}</StoreProvider>
            </div>
            <CookieConsentBanner />
            <div className="flex-0">
              <BottomNavigation />
            </div>
          </div>
        </CookiesProvider>
      </body>
    </html>
  );
}
