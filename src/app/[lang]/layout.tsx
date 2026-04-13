import { CookiesProvider } from 'next-client-cookies/server';
import AuthSessionProvider from '@/app/providers/AuthSessionProvider';
import DynamicPaddingWrapper from '@/lib/wrappers/DynamicPaddingWrapper';
import ComingSoon from '@/components/coming-soon';
import CookieConsentBanner from '@/lib/components/CookieConsentBanner';
import { ServiceWorkerProvider } from '@/app/providers/ServiceWorkerProvider';
import { PushNotificationProvider } from '@/app/providers/PushNotificationProvider';
import { Toaster } from '@/components/ui/sonner';
import { PreviewFlagProvider } from '@/app/providers/PreviewFlagProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import React from 'react';
import { BackgroundSystem } from '@/components/background-system';
import { i18n } from '../../../i18n-config';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  setRequestLocale(lang);
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  const messages = await getMessages();

  return (
    <>
      <BackgroundSystem />
      <NextIntlClientProvider messages={messages}>
        <Toaster />
        <ServiceWorkerProvider>
          <CookiesProvider>
            <AuthSessionProvider>
              {maintenanceMode ? (
                <ComingSoon />
              ) : (
                <PushNotificationProvider>
                  <DynamicPaddingWrapper>{children}</DynamicPaddingWrapper>
                </PushNotificationProvider>
              )}
              <PreviewFlagProvider>
                <CookieConsentBanner maintenanceMode={maintenanceMode} />
              </PreviewFlagProvider>
            </AuthSessionProvider>
          </CookiesProvider>
        </ServiceWorkerProvider>
      </NextIntlClientProvider>
    </>
  );
}
