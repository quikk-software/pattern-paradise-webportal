import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { APP_DESCRIPTION, APP_DOMAIN, APP_NAME, THEME_COLOR } from '@/lib/constants';
import { CookiesProvider } from 'next-client-cookies/server';
import AuthSessionProvider from '@/app/providers/AuthSessionProvider';
import DynamicPaddingWrapper from '@/app/wrappers/DynamicPaddingWrapper';
import ComingSoon from '@/components/coming-soon';
import CookieConsentBanner from '@/lib/components/CookieConsentBanner';
import { ServiceWorkerProvider } from '@/app/providers/ServiceWorkerProvider';
import { PushNotificationProvider } from '@/app/providers/PushNotificationProvider';
import { Toaster } from '@/components/ui/sonner';

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
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/favicons/favicon.ico?v=2',
    shortcut: '/favicon.ico?v=2',
    apple: '/icons/ios/512.png',
    other: [
      { rel: 'apple-touch-icon', url: '/favicons/apple-icon-152x152.png', sizes: '152x152' },
      { rel: 'apple-touch-icon', url: '/favicons/apple-icon-180x180.png', sizes: '180x180' },
      { rel: 'manifest', url: '/manifest.webmanifest' },
    ],
  },
  openGraph: {
    type: 'website',
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: APP_DOMAIN,
    siteName: APP_NAME,
    images: [
      {
        url: `${APP_DOMAIN}/favicons/apple-icon-precomposed.png`,
        width: 1200,
        height: 1200,
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/favicons/apple-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/favicons/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-icon-180x180.png" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Pattern Paradise" />

        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}>
        <Toaster />
        <ServiceWorkerProvider>
          <CookiesProvider>
            {maintenanceMode ? (
              <ComingSoon />
            ) : (
              <AuthSessionProvider>
                <PushNotificationProvider>
                  <DynamicPaddingWrapper>{children}</DynamicPaddingWrapper>
                </PushNotificationProvider>
              </AuthSessionProvider>
            )}
            <CookieConsentBanner maintenanceMode={maintenanceMode} />
          </CookiesProvider>
        </ServiceWorkerProvider>
      </body>
    </html>
  );
}
