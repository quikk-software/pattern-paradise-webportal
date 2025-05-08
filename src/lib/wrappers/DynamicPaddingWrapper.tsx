'use client';

import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { NavbarComponent } from '@/components/navbar';
import StoreProvider from '@/app/providers/StoreProvider';
import { BottomNavigation } from '@/components/bottom-navigation';
import TokenDataWrapper from '@/lib/wrappers/TokenDataWrapper';
import NotificationPermissionProvider from '@/app/providers/NotificationPermissionProvider';
import AffiliateWrapper from '@/lib/wrappers/AffiliateWrapper';

const noPaddingPages = ['/', '/app/secure/test/chats', '/app/secure/chats', '/app/tester-calls/*'];
const fullHeightPages = ['/swipe'];

const noContainerPages = ['/'];

function patternToRegex(pattern: string): RegExp {
  const regexString = pattern.replace(/[-/\\^$+?.()|[\]{}]/g, '\\$&').replace(/\*/g, '.*');
  return new RegExp(`^${regexString}$`);
}

function getPublicUrl(url: string, publicUrls: string[]) {
  return publicUrls.find((pattern) => patternToRegex(pattern).test(url));
}

export default function DynamicPaddingWrapper({ children }: PropsWithChildren) {
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const shouldRemovePadding = !!getPublicUrl(pathname, noPaddingPages);
  const shouldRemoveContainer = !!getPublicUrl(pathname, noContainerPages);
  const shouldUseFullHeight = !!getPublicUrl(pathname, fullHeightPages);

  const scrollableDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollableDivRef.current) {
        setScrolled(scrollableDivRef.current.scrollTop > 10);
      }
    };

    const scrollableDiv = scrollableDivRef.current;
    if (scrollableDiv) {
      scrollableDiv.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollableDiv) {
        scrollableDiv.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className={`flex flex-col h-dvh`}>
      <NavbarComponent background={'none'} scrolled={scrolled} />
      <div
        ref={scrollableDivRef}
        className={`${shouldRemovePadding ? 'px-0 py-0' : 'px-4 py-8'} flex-1 overflow-auto${shouldRemoveContainer ? '' : ' mx-auto container'}`}
      >
        <div id="main-area" className={`w-full${shouldUseFullHeight ? ' h-full' : ''}`}>
          <StoreProvider>
            <TokenDataWrapper>
              <AffiliateWrapper>
                <NotificationPermissionProvider />
                {children}
              </AffiliateWrapper>
            </TokenDataWrapper>
          </StoreProvider>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
}
