import localFont from 'next/font/local';
import './globals.css';
import { APP_DOMAIN } from '@/lib/constants';
import { CookiesProvider } from 'next-client-cookies/server';
import AuthSessionProvider from '@/app/providers/AuthSessionProvider';
import DynamicPaddingWrapper from '@/lib/wrappers/DynamicPaddingWrapper';
import ComingSoon from '@/components/coming-soon';
import CookieConsentBanner from '@/lib/components/CookieConsentBanner';
import { ServiceWorkerProvider } from '@/app/providers/ServiceWorkerProvider';
import { PushNotificationProvider } from '@/app/providers/PushNotificationProvider';
import { Toaster } from '@/components/ui/sonner';
import { PreviewFlagProvider } from '@/app/providers/PreviewFlagProvider';
import { i18n } from '../../i18n-config';
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';

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

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  const { lang } = await params;

  return (
    <html lang={lang} className="notranslate" translate="no">
      <head>
        <link rel="apple-touch-icon" href="/favicons/apple-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/favicons/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-icon-180x180.png" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Pattern Paradise" />

        <meta name="og:logo" content={`${APP_DOMAIN}/favicons/apple-icon-precomposed.png`} />

        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="shortcut icon" href="/favicon.ico?v=3" />

        <meta name="p:domain_verify" content="e29836b4ecf762bb55e8700dc302db08" />

        <script
          type="text/javascript"
          src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          async
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}>
        <NextIntlClientProvider>
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
              <PreviewFlagProvider>
                <CookieConsentBanner maintenanceMode={maintenanceMode} />
              </PreviewFlagProvider>
            </CookiesProvider>
          </ServiceWorkerProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
