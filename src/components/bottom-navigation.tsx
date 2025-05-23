'use client';

import { useEffect, useState } from 'react';
import { Store, Tag, CircleUser } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import PatternParadiseIcon from '@/lib/icons/PatternParadiseIcon';
import { isInStandaloneMode } from '@/lib/core/utils';
import { usePreview } from '@/app/providers/PreviewFlagProvider';

const menuItems = [
  { id: 'shop', label: 'Shop', icon: Store, href: '/' },
  { id: 'sell', label: 'Sell', icon: Tag, href: '/app/secure/sell' },
  { id: 'test', label: 'Test', icon: PatternParadiseIcon, href: '/app/tester-calls' },
  { id: 'me', label: 'Me', icon: CircleUser, href: '/app/secure/auth/me' },
];

export function BottomNavigation() {
  const [activeItem, setActiveItem] = useState('shop');
  const [isStandalone, setIsStandalone] = useState(false);

  const pathname = usePathname();

  const { isPreview } = usePreview();

  useEffect(() => {
    if (pathname === '/') {
      setActiveItem('shop');
      return;
    }
    const element = menuItems
      .filter((menuItem) => menuItem.id !== 'shop')
      .find((menuItem) => menuItem.href.startsWith(pathname) || pathname.startsWith(menuItem.href));
    setActiveItem(element?.id ?? 'shop');
  }, [pathname]);

  useEffect(() => {
    setIsStandalone(isInStandaloneMode());
  }, []);

  const { push } = useRouter();

  if (isPreview) {
    return null;
  }

  return (
    <div className={`bg-white ${isStandalone ? 'pb-4' : 'pb-0'}`} id="bottom-navigation">
      <div className="z-50 w-full h-16 bg-background border-t border-border">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cn(
                'px-5 hover:bg-muted/50 group transition-colors inline-flex flex-col items-center justify-center',
                activeItem === item.id && 'text-primary',
              )}
              onClick={() => {
                setActiveItem(item.id);
                push(item.href);
              }}
            >
              <item.icon
                className={cn(
                  'w-6 h-6 mb-1 transition-transform group-hover:scale-110',
                  activeItem === item.id && 'animate-bounce',
                )}
              />
              <span className="text-xs leading-none">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
