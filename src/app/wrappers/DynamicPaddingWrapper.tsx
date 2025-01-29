'use client';

import { PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';
import { NavbarComponent } from '@/components/navbar';
import StoreProvider from '@/app/providers/StoreProvider';
import CookieConsentBanner from '@/lib/components/CookieConsentBanner';
import { BottomNavigation } from '@/components/bottom-navigation';

const noPaddingPages = ['/app/secure/test/chats'];

export default function DynamicPaddingWrapper({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const shouldRemovePadding = noPaddingPages.includes(pathname);

  return (
    <div
      className={`flex flex-col h-dvh mx-auto container ${shouldRemovePadding ? 'px-0' : 'px-4'}`}
    >
      <div className={shouldRemovePadding ? 'px-4' : 'px-0'}>
        <NavbarComponent background={'none'} />
      </div>
      <div className={`${shouldRemovePadding ? 'py-0' : 'py-8'} flex-1 overflow-auto no-scrollbar`}>
        <StoreProvider>{children}</StoreProvider>
      </div>
      <CookieConsentBanner />
      <BottomNavigation />
    </div>
  );
}
