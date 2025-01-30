'use client';

import { PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';
import { NavbarComponent } from '@/components/navbar';
import StoreProvider from '@/app/providers/StoreProvider';
import { BottomNavigation } from '@/components/bottom-navigation';
import TokenDataWrapper from '@/app/wrappers/TokenDataWrapper';

const noPaddingPages = ['/app/secure/test/chats'];

export default function DynamicPaddingWrapper({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const shouldRemovePadding = noPaddingPages.includes(pathname);

  return (
    <div className={`flex flex-col h-dvh`}>
      <div className={`mx-auto container px-4`}>
        <NavbarComponent background={'none'} />
      </div>
      <div
        className={`${shouldRemovePadding ? 'px-0 py-0' : 'px-4 py-8'} flex-1 overflow-auto no-scrollbar mx-auto container`}
      >
        <StoreProvider>
          <TokenDataWrapper>{children}</TokenDataWrapper>
        </StoreProvider>
      </div>
      <BottomNavigation />
    </div>
  );
}
